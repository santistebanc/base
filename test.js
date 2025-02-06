const SELF = Symbol("self");
const val = Symbol("val");

const it = {
  a: "one",
  b: "ok",
  [val]: [null, SELF],
};

const ot = {
  a: "two",
  c: false,
  [val]: [null, null, null, SELF],
};

const p = new Proxy(
  { f: 100 },
  {
    get: (_, prop) => {
      console.log(prop);
      return 7;
    },
  }
);

// const pri = { ...it, ...ot, ...p };
// console.log(pri);

console.log(Object.entries(it));