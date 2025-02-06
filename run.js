import {
  effectKey,
  funcKey,
  getType,
  pathKey,
  runKey,
  SELF,
  updatesKey,
  valKey,
  vmKey,
} from "./types.js";
import { mapEntries, mapReflectEntries } from "./utils.js";

const nextTrace = (trace, key) => {
  if (getType(trace.obj[key]) === "obj") {
    if (!Object.hasOwn(trace.state, key)) trace.state[key] = {};
    return {
      obj: trace.obj[key],
      key,
      state: trace.state[key],
      parent: trace,
    };
  }
  return trace;
};

const getCurrentVal = (_trace, _key) => {
  if (_key === undefined) return getVal(_trace.obj, _trace);
  const { trace, key, error } = goToPath(_trace, [_key]);
  if (error) return undefined;
  if (Object.hasOwn(trace.state, key))
    return getType(trace.state[key]) === "obj"
      ? {
          ...getVal(trace.obj[key], nextTrace(trace, key)),
          ...trace.state[key],
        }
      : trace.state[key];
  return getVal(trace.obj[key], nextTrace(trace, key));
};

const goToPath = (trace, path) => {
  const key = path[0];
  if (path.length <= 1) return { trace, key };
  return getType(trace.obj[key]) === "obj"
    ? goToPath(nextTrace(trace, path[0]), path.slice(1))
    : { error: path };
};

const findPath = (trace, path) => {
  const p = goToPath(trace, path);
  if (!p.error) return p;
  return trace.parent ? findPath(trace.parent, path) : { error: path };
};

const getRefVal = (_trace, _path) => {
  const { trace, key, error } = findPath(_trace, _path);
  if (error) return undefined;
  if (Object.hasOwn(trace.state, key)) return trace.state[key];
  return getVal(trace.obj[key], nextTrace(trace, key));
};

const getVal = (x, trace) => {
  if (getType(x) === "ref") {
    return getRefVal(trace, x[pathKey]);
  }
  if (getType(x) === "calc") {
    return getVal(
      x[funcKey][runKey](...x.args.map((arg) => getVal(arg, trace))),
      trace
    );
  }
  if (getType(x) === "vm") {
    const idx = x.conds.reduce((n, c, i) => n + !!getVal(c, trace) * 2 ** i, 0);
    return getVal(x[vmKey][idx], trace);
  }
  if (getType(x) === "set") {
    return (...args) => {
      x[updatesKey].forEach(([k, v]) => {
        if (getType(k) !== "ref")
          throw "only references allowed as target of set";
        const newVal = getVal(v, trace);
        const { trace: pathTrace, key, error } = findPath(trace, k[pathKey]);
        if (error) return;
        pathTrace.state[key] = newVal;
        return true;
      });
    };
  }
  if (getType(x) === "effect") {
    const effectRun = () => {
      return x[funcKey][effectKey](...x.args.map((arg) => getVal(arg, trace)));
    };
    return effectRun;
  }
  if (getType(x) === "obj") {
    const val = getVal(x[valKey], trace);
    return val === SELF || val === undefined
      ? Object.fromEntries(
          mapReflectEntries(x, ({ key }) => [key, getCurrentVal(trace, key)])
        )
      : getVal(val, trace);
  }
  return x;
};

const liveApp = (trace, key) => {
  const obj = (...args) => {
    const val = getCurrentVal(trace, key);
    return getType(trace.obj[key]) === "set" ? val(...args) : val;
  };
  mapEntries(trace.obj, ({ key, val }) => key !== "length" && (obj[key] = val));
  return new Proxy(obj, {
    get: (_, prop) => liveApp(nextTrace(trace, prop), prop),
    apply: (r, _, args) => r(...args),
  });
};

export const run = (app) => {
  const trace = {
    obj: getType(app) === "obj" ? app : {},
    key: "root",
    parent: null,
    state: {},
  };
  return liveApp(trace);
};
