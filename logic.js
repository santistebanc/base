import {
  effectKey,
  funcKey,
  getType,
  isIrreductibleType,
  pathKey,
  runKey,
  SELF,
  updatesKey,
  valKey,
  varKey,
} from "./types.js";
import { applyArgs, isObject, mapEntries, mapReflectEntries } from "./utils.js";
import { normalizeVms, makeVm } from "./vm.js";
export { run } from "./run.js";

const refProxy = (path = []) => {
  const obj = (...args) => {
    if (args.length === 0) throw "no ref passed";
    return {
      [pathKey]: [
        ...path,
        args.flat(Infinity).flatMap((arg) => arg.split(".")),
      ],
    };
  };
  obj[pathKey] = path;
  return new Proxy(obj, {
    get: (r, prop) => {
      if (prop === pathKey) return r[pathKey];
      return refProxy([...path, prop]);
    },
    apply: (r, _, args) => r(...args),
  });
};

export const ref = refProxy();

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

const vmParse = (vals, conds) => {
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
    if (isIrreductibleType(v)) return v;
    throw "type not supported";
  });
  if (!hasVar) return makeVm(reducedVals, reducedConds);
  return mergeVms(makeVm(newVals, reducedConds), ...newVms);
};

const Var = (i) => ({ [varKey]: i });
const mergeVms = (...vms) =>
  applyOp(
    vms,
    (a, b, i) => (isObject(a) && Object.hasOwn(a, varKey) && a[varKey] === i ? b : a),
    Var(0)
  );

export const vm = (vals, conds) => {
  const res = {
    [Symbol.iterator]: function* () {
      const max = Object.keys(this).reduce(
        (m, k) => (!isNaN(k) && k > m ? k : m));
      let i = 0;
      while (i <= max) yield this[i++];
    },
  };
  const usedKeys = new Set();
  if (vals.every((v) => getType(v) !== "obj")) return vmParse(vals, conds);
  vals.forEach((v) => {
    const parsedV = getType(v) === "obj" ? v : { [valKey]: v };
    mapReflectEntries(parsedV, ({ key }) => {
      if (usedKeys.has(key)) return;
      res[key] = vm(
        vals.map((v) =>
          getType(v) === "obj"
            ? key === valKey && !Object.hasOwn(v, valKey)
              ? SELF
              : v[key]
            : key === valKey
            ? v
            : undefined
        ),
        conds
      );
      usedKeys.add(key);
    });
  });
  return res;
};

export const func = (label, run, returnType, reduceArgs) => {
  return { label, [runKey]: run, returnType, reduceArgs };
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
    if (isIrreductibleType(arg)) return makeVm([arg], []);
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

export const set = (...updates) => {
  return { [updatesKey]: updates };
};

export const effect = (fn, args) => {
  return { [effectKey]: fn, args };
};
