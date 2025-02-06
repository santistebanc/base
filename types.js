import { isObject } from "./utils.js";

export const valKey = Symbol("val");
export const vmKey = Symbol("vals");
export const varKey = Symbol("var");
export const funcKey = Symbol("func");
export const pathKey = Symbol("path");
export const runKey = Symbol("run");
export const updatesKey = Symbol("updates");
export const effectKey = Symbol("effect");

export const SELF = Symbol("self");

export const getType = (x) => {
  if (x == null) return null;
  if (Object.hasOwn(x, varKey)) return "var";
  if (Object.hasOwn(x, pathKey)) return "ref";
  if (Object.hasOwn(x, vmKey)) return "vm";
  if (Object.hasOwn(x, funcKey)) return "calc";
  if (Object.hasOwn(x, runKey)) return "func";
  if (Object.hasOwn(x, updatesKey)) return "set";
  if (Object.hasOwn(x, effectKey)) return "effect";
  if (isObject(x)) return "obj";
  return "prim";
};

export const isIrreductibleType = (x) =>
  ["prim", "ref", "calc", "set", "effect", "var", null].includes(getType(x));
