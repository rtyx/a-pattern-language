// Seed links between patterns, as [from, to] pattern numbers, where "from" is the larger-scale
// pattern and "to" is a smaller pattern that helps complete it.
//
// UNVERIFIED: this is only a starting set, written from memory. The book has several
// links per pattern (roughly 1,000+ in total). Check and extend it against your copy.
export const LINKS: [number, number][] = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  [8, 9], [8, 12], [12, 14], [14, 15], [14, 37], [16, 20], [16, 34], [30, 31], [31, 32],
  [32, 33], [36, 37], [37, 38], [38, 39],
  [95, 96], [95, 98], [95, 99], [95, 100], [98, 100], [98, 101], [100, 119],
  [105, 106], [106, 107], [107, 108], [107, 159], [108, 109],
  [110, 112], [110, 130], [112, 127], [127, 130], [127, 131], [127, 136], [127, 137],
  [129, 139], [129, 142], [129, 147], [159, 180], [180, 179], [180, 202],
  [163, 164], [164, 165], [165, 166], [168, 169], [168, 170],
  [205, 206], [206, 207], [206, 208], [208, 209], [208, 210], [209, 211], [211, 212],
  [212, 213], [214, 215], [216, 217], [221, 222], [221, 223], [221, 224],
];
