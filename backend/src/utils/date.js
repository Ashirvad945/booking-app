function toUTCDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  }
  module.exports = { toUTCDate };
  