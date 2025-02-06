import { inspect } from "util";
import { ref, gt, sum, iff, set, effect, run } from "./api.js";

const a = ref("a");
const b = ref("b");
const c = ref("c");
const d = ref("d");

const log = (...args) => effect(() => console.log(...args));

const increase = (what, amount = 1) => set([what, sum(what, amount)]);

const main = {
  gauges: { one: 1, two: 2 },
  increase: increase(ref.gauges.one, 1),
  ...iff(gt(ref.gauges.two, ref.gauges.one), { give: "you" }, { up: "never" }),
  sum: sum(ref.gauges.one, ref.gauges.two),
  onSurpass: iff(gt(ref.gauges.one, ref.gauges.two), log("surpassed")),
};

// const main = {
//   one: { two: { three: 3 } },
//   s: sum(ref.one.two.three, 10),
// };

// const main = iff(gt(10, 2), { f: "yeah" }, [
//   "a",
//   ...iff(gt(1, 2), ["b", "c", "d", "e"], [1, 2]),
// ]);

const app = run(main);

// app.increase();
// app.increase();
// console.log(app.gauges());

console.log(inspect(app(), { depth: null, colors: true }));
