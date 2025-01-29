const r = iff(a, { m: 1, n: iff(b, 5, { u: 100 }) }, { f: 0, m: sum(c, 42) });

const rr = {
  _: [rr],
  m: { _: [{ F: sum, ARGS: [{ r: "c" }, 42] }, 1] },
  n: { _: [null, rr.n, null, 5], u: { _: [null, 100, null, null] } },
  f: { _: [0, null] },
};

map([a, b, 3], (it) => mult(it, 2));

const m = { _: [m], 0: [mult(a, 2)], 1: [mult(b, 2)], 2: [6], length: [3] };

map(a, (it) => mult(it, 2));

const m2 = {
  _: [m2],
  [PROP]: [mult(get(a, PROP), 2)],
  length: [get(a, "length")],
};

{
  _: [a];
}

// [a,b,c] => [3,5,6,7]

const app = {
  val: [5, props, c, props],
  refs: { a: { returnType: "bool" }, b: { returnType: "num" }, c: {} },
  conds: [a, gt(3, b)],
  props: {},
};

const n = gt(ctx.b, 2);

getRefs(n)
getErrors(n)
getVals(n)

getEntries(n)

const nn = {
  [val]: {
    [vmap]: [
      { [error]: "b is not num", expectedType: "num" },
      { [fn]: gt, args: [{ [ctx]: "b" }, 2] },
    ],
    conds: [{ [fn]: isNum, args: [ctx.b] }],
  },
  [refs]: [{ [ctx]: "b" }],
  [errors]: [],
};


{b: ctx.b, a: this.b}

ctx({b: 10})(iff(gt(ctx.b, 5),'yes', 'no'))

extend(nn).setProp("b", 5);


const h = iff(ctx.b, 1, 0);

const hh = {
  [val]: { [vmap]: [0, 1], conds: [{ [ctx]: "b" }] },
  b: { rt: "bool" },
};

const f = { one: iff(ctx.a, gt(ctx.b, 2), iff(ctx.b, 1, 0)), two: 5 };

const ff = {
  [val]: SELF,
  a: { rt: "bool" },
  b: { [vmap]: [{ rt: "bool" }, { rt: "num" }], conds: [{ [ctx]: "a" }] },
  one: {
    [vmap]: [
      0,
      { [fn]: gt, args: [{ [ctx]: "b" }, 2] },
      1,
      { [fn]: gt, args: [{ [ctx]: "b" }, 2] },
    ],
    conds: [{ [ctx]: "a" }, { [ctx]: "b" }],
  },
  two: 5,
};
