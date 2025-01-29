import { applyOp, calc, func, vm } from "./logic.js";
export { ref } from "./logic.js";

export const and = (...vms) => applyOp(vms, (a, b) => a && b, true);
export const or = (...vms) => applyOp(vms, (a, b) => a || b, false);
export const not = (v) => applyOp([v], (a, b) => a || !b, false);

export const iff = (...args) => {
  const split = (args.length / 2) | 0;
  const conds = args.slice(0, split);
  const outcomes = args.slice(split);
  if (conds.length === 1) return vm([outcomes[1], outcomes[0]], [conds[0]]);
  return vm(
    [iff(...conds.slice(1), ...outcomes.slice(1)), outcomes[0]],
    [conds[0]]
  );
};

const gtFunc = func("gt", (a, b) => a > b, "bool");
export const gt = (a, b) => calc(gtFunc, a, b);

const sumFunc = func(
  "sum",
  (...args) => args.reduce((a, b) => a + b, 0),
  "num",
  (...args) => {
    const newArgs = [];
    let currentSum = 0;
    args.forEach((arg) => {
      if (typeof arg === "number") {
        currentSum += arg;
      } else {
        newArgs.push(arg);
      }
    });
    if (newArgs.length === 0) return { result: currentSum };
    return { reducedArgs: [currentSum, ...newArgs] };
  }
);
export const sum = (...args) => calc(sumFunc, ...args);
