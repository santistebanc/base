import { applyArgs } from "./utils.js";
import { normalizeVms, makeVm, vmap } from "./vm.js";

const valKey = Symbol("val");
const funcKey = Symbol("func");
const pathKey = Symbol("path");
const runKey = Symbol("run");

const getType = (x) => {
  if (x == null) return null;
  if (x[varKey] !== undefined) return "var";
  if (x[pathKey] !== undefined) return "ref";
  if (x[vmap] !== undefined) return "vm";
  if (x[valKey] !== undefined) return "val";
  if (x[funcKey] !== undefined) return "calc";
  if (x[runKey] !== undefined) return "func";
  if (typeof x === "object") return "obj";
  return "prim";
};

const isBasicType = (x) => ["prim", "ref", null].includes(getType(x));

export const ref = (path) => {
  return { [pathKey]: path };
};

const reduceVmDoables = (vals, conds) => {
  const newConds = [...conds.map((c) => [c])];
  const newVals = [...vals.map((v) => [v])];
  conds.forEach((c, i) => {
    if (typeof c === "boolean") {
      newConds[i] = [];
      vals.forEach((_, k) => !((k / 2 ** i) | 0) === c && (newVals[k] = []));
    }
  });
  return { reducedConds: newConds.flat(), reducedVals: newVals.flat() };
};

export const vm = (vals, conds) => {
  const newVms = [];
  let hasVar = false;
  const { reducedConds, reducedVals } = reduceVmDoables(vals, conds);
  if (reducedVals.length === 1) return reducedVals[0];
  const newVals = reducedVals.map((v) => {
    if (getType(v) === "vm") {
      hasVar = true;
      newVms.push(v);
      return Var(newVms.length);
    }
    if (
      (getType(v) === "calc" && v[funcKey].returnType === "bool") ||
      (getType(v) === "ref" && reducedConds.includes(v))
    ) {
      hasVar = true;
      newVms.push(makeVm([false, true], [v]));
      return Var(newVms.length);
    }
    if (isBasicType(v) || getType(v) === "calc" || getType(v) === "var")
      return v;
    throw "type not supported";
  });
  if (!hasVar) return makeVm(reducedVals, reducedConds);
  return mergeVms(makeVm(newVals, reducedConds), ...newVms);
};

const varKey = Symbol("var");
const Var = (i) => ({ [varKey]: i });
const mergeVms = (...vms) =>
  applyOp(vms, (a, b, i) => (a?.[varKey] === i ? b : a), Var(0));

export const func = (label, run, returnType, reduceArgs) => {
  return { label, [runKey]: run, returnType, reduceArgs };
};

const val = (x) => {
  return { [valKey]: x };
};

export const calc = (func, ...args) => {
  if (getType(func) !== "func") throw "passed func is not supported";
  const { reducedArgs, result } = func.reduceArgs?.(...args) ?? {
    reducedArgs: args,
  };
  if (result !== undefined) return result;
  let hasVm = false;
  const allVms = reducedArgs.map((arg) => {
    if (getType(arg) === "vm") {
      hasVm = true;
      return arg;
    }
    if (isBasicType(arg) || getType(arg) === "calc") return makeVm([arg], []);
    throw "type not supported";
  });
  if (!hasVm) return { [funcKey]: func, args: reducedArgs };
  const { groups, allConds } = normalizeVms(...allVms);
  return vm(
    applyArgs(groups, (...reducedArgs) => calc(func, ...reducedArgs)),
    allConds
  );
};

export const applyOp = (vms, fn, def) => {
  const { groups, allConds } = normalizeVms(...vms);
  const results = [];
  for (let i = 0; i < 2 ** allConds.length; i++) {
    results[i] = groups.map((g) => g[i % g.length]).reduce(fn, def);
  }
  return vm(results, allConds);
};
