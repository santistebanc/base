import { inspect } from "util";
import { and, not, ref, gt, sum, iff } from "./api.js";

const a = ref("a");
const b = ref("b");
const c = ref("c");
const d = ref("d");

// const app = iff(a, b, {m: iff(b, 'yes', 'no'), n: 100}, 20, 30);

const app = sum(iff(a, iff(b, 1, 2), 3), 10);

console.log(inspect(app, { depth: null, colors: true }));
