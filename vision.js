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





on(
  gt(a, 5),
  effect(() => {
    console.log("is more");
    return () => {
      console.log("is less");
    };
  })
);

when(
  changed(a),
  effect((val) => console.log("a: ", val), a)
);

const main = ctx({ a: 5 })({
  increase: set(ctx.a, sum(ctx.a, 1)),
  area: mult(ctx.a, ctx.b),
});

const App = run(main, { b: 10 });

const mainRes = {
  [init]: { a: 5 },
  [state]: { a: 5 },
  [val]: self,
  increase: {
    [update]: {
      a: {
        [Symbol(func)]: {
          label: "sum",
        },
        args: [{ [Symbol(path)]: "a" }, 1],
      },
    },
  },
  area: {
    [Symbol(func)]: {
      label: "mult",
    },
    args: [{ [Symbol(path)]: "a" }, { [Symbol(path)]: "b" }],
  },
};

const second = {
  a: 5,
  increase: set(obj.a, sum(obj.a, 1)),
  area: mult(obj.a, ctx.b),
};

const secondRes = {
  [val]: self,
  a: { [val]: 5, [current]: 5 },
  increase: {
    [update]: {
      "obj.a": {
        [Symbol(func)]: {
          label: "sum",
        },
        args: [{ [Symbol(path)]: "obj.a" }, 1],
      },
    },
  },
  area: {
    [Symbol(func)]: {
      label: "mult",
    },
    args: [{ [Symbol(path)]: "obj.a" }, { [Symbol(path)]: "ctx.b" }],
  },
};

run(
  second,
  when(
    changed(obj.a),
    effect((val) => console.log("a: ", val), obj.a)
  )
);

withListener(
  when(
    changed(obj.a),
    effect((val) => console.log("a: ", val), obj.a)
  )
)(second);

const third = {
  a: { one: 1, two: 2 },
  increase: set(ctx.a.one, sum(ctx.a.one, 1)),
  area: mult(ctx.a.one, ctx.a.two),
  logA: when(
    changed(ctx.a.one),
    effect((val) => console.log("a: ", val), ctx.a.one)
  ),
};

component(
  {  a: { one: 1, two: 2 }, },
  iff(
    changed(ref.a.one),
    effect((val) => console.log("a: ", val), ref.a.one)
  ),
  iff(
    gt(ref.a.one, 5),
    effect(() => {
      console.log("is more");
      return () => {
        console.log("is less");
      };
    })
  ),
  {
      increase: set(ref.a.one, sum(ref.a.one, 1)),
      area: mult(ref.a.one, ref.a.two),
    }
);

const fourth = {
  [val]: self,
  [effects]: {'ref.a.one': [{[effect]: (val) => console.log("a: ", val), args: [ref.a.one]}, vm([{[effect]: () => {
      console.log("is more");
      return () => {
        console.log("is less");
      };
    }, args: []}],[gt(ref.a.one, 5)])]},
  a: { [val]: self, one: { [val]: 1, [current]: 1 }, two: 2 },
  [Symbol('anonym')]: vm([{[effect]: (val) => console.log("a: ", val), args: [ref.a.one]}],[changed(ref.a.one)]),
  [Symbol('anonym')]: vm([{[effect]: () => {
      console.log("is more");
      return () => {
        console.log("is less");
      };
    }, args: []}],[gt(ref.a.one, 5)]),
  increase: {
    [update]: {
      "ref.a.one": {
        [Symbol(func)]: {
          label: "sum",
        },
        args: [{ [Symbol(path)]: "ref.a.one" }, 1],
      },
    },
  },
  area: {
    [Symbol(func)]: {
      label: "mult",
    },
    args: [{ [Symbol(path)]: "ref.a.one" }, 2],
  },
};

component(
{one: iff(cond, {a: 1, b: 2}, {a: 10, c: 7}), two: 2},
iff(cond, {one: {a: 7}}, {one: {a: 100}, two: 200}),
)

const r = {one: {a:[1,10], b: [2,null], c: 7}, two: 2}

const r2 = {one: {a:[7,100], b: null}, two: [null, 200]}

const rr = {one: {a:[7,100], b: null}, two: [2, 200]}



const final =  {
  a: { one: 1, two: 2 },
  increase: set(ctx.a.one, sum(ctx.a.one, 1)),
  area: mult(ctx.a.one, ctx.a.two),
  logA: iff(
    changed(ctx.a.one),
    effect((val) => console.log("a: ", val), ctx.a.one)
  ),
};




const r = {
  [val]: vm([SELF, SELF, 6, SELF], [cond1, cond2]),
  a: vm([1, 7, null, null], [cond1, cond2]),
  b: vm([2, { z: 99 }, null, 9], [cond1, cond2]),
  c: vm(
    [
      null,
      12,
      null,
      {
        [val]: vm([2, SELF], [cond3]),
        z: vm([null, 99], [cond3]),
      },
    ],
    [cond1, cond2]
  ),
};

const r2 = {
  [val]: vm([SELF, SELF, 6, SELF], [cond1, cond2]),
  a: vm([1, 7, null, null], [cond1, cond2]),
  b: {
    [val]: vm([2, SELF, null, 9], [cond1, cond2]),
    z: vm([null, 99, null, null], [cond1, cond2]),
  },
  c: {
    [val]: vm([null, 12, null, 2, null, 12, null, SELF], [cond1, cond2, cond3]),
    z: vm(
      [null, null, null, null, null, null, null, 99],
      [cond1, cond2, cond3]
    ),
  },
};

const textbox = (text) => ({
  text,
  editText: action((args) => set(ref.text, args.newText)),
  domRender: {
    tag: "input",
    attrs: { type: "text", value: ref.text },
    listeners: { onchange: ref.editText },
  },
});
