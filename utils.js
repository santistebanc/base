export const makeArray = (size, func) => {
  return Array.apply(null, Array(size)).map((_, i) => func(i));
};

export const at = (arr, idx) => arr.at(idx % arr.length);

export const rotateArray = (arr, amount) => {
  const na = [];
  arr.forEach((it, i) => {
    const idx =
      i + amount >= 0
        ? (i + amount) % arr.length
        : (arr.length + ((i + amount) % arr.length)) % arr.length;
    na[idx] = it;
  });
  return na;
};

export const groupIntoPairs = (arr) => {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push([arr[i], arr[i + 1]]);
  }
  return pairs;
};

export const repeatArray = (arr, times) => {
  return [...Array(times)].reduce((res) => [...res, ...arr], []);
};

export const applyArgs = (groups, fn) => {
  const max = Math.max(...groups.map((g) => g.length));
  return [...Array(max)].map((_, i) => fn(...groups.map((g) => g[i % g.length])));
};
