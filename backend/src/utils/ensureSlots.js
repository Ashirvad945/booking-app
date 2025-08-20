const Slot = require("../models/Slot");
const { toUTCDate } = require("./date");

async function ensureSlots(fromStr, toStr) {
  const from = toUTCDate(fromStr);
  const to = toUTCDate(toStr);

  const ops = [];
  for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    for (let h = 9; h < 17; h++) {
      for (let m = 0; m < 60; m += 30) {
        const startAt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, m));
        const endAt = new Date(startAt.getTime() + 30 * 60 * 1000);
        ops.push({
          updateOne: {
            filter: { startAt, endAt },
            update: { $setOnInsert: { startAt, endAt } },
            upsert: true
          }
        });
      }
    }
  }
  if (ops.length) await Slot.bulkWrite(ops);
}

module.exports = ensureSlots;
