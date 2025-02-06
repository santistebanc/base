import { vmKey } from "./types.js";
import { groupIntoPairs, repeatArray, rotateArray } from "./utils.js";

export const makeVm = (vals, conds = []) => {
  return { [vmKey]: vals, conds };
};

export const normalizeVms = (...vms) => {
  const allConds = [];
  const groups = vms.map((v) => {
    const indices = completeIndices(v.conds, allConds);
    const vals = completeVals(v[vmKey], allConds);
    return recur(vals, indices, 0);
  });
  return { allConds, groups };
};

const completeIndices = (conds, allConds) => {
  const indices = conds.map((c) => {
    const idx = allConds.indexOf(c);
    return idx === -1 ? allConds.push(c) - 1 : idx;
  });
  const missing = allConds.reduce(
    (m, _, i) => (indices.includes(i) ? m : [...m, i]),
    []
  );
  return [...indices, ...missing];
};

const completeVals = (vals, allConds) => {
  return repeatArray(vals, 2 ** allConds.length / vals.length);
};

const recur = (vals, indices, idx) => {
  if (indices.length === 0) return vals;
  const amount = (indices.length - indices.indexOf(idx)) % indices.length;
  if (amount === 0) return vals;
  const shifted = shiftVals(vals, amount);
  const newIndices = rotateArray(indices, amount);
  return recur(groupIntoPairs(shifted), newIndices.slice(1), idx + 1).flat();
};

const shiftVals = (vals, amount) => {
  const res = [];
  for (let i = 0; i < vals.length; i++) {
    const groups = 2 ** amount;
    const groupSize = vals.length / groups;
    const cur = (i / groups) | 0;
    const add = groupSize * (i % groups);
    res.push(vals[cur + add]);
  }
  return res;
};
