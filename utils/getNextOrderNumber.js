import { Counter } from "../models/counter.model.js";

let localSeqCache = [];

export async function getNextOrderNumber() {
  if (localSeqCache.length === 0) {
    const counter = await Counter.findOneAndUpdate(
      { name: "order" },
      { $inc: { seq: 10 } },
      { new: true, upsert: true }
    );
    const start = counter.seq - 9;
    const end = counter.seq;
    localSeqCache = Array.from({ length: 10 }, (_, i) => start + i);
  }
  return localSeqCache.shift();
}
