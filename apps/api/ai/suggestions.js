export function suggest(items = []) {
  const freq = {};
  items.forEach(i => {
    if (!i.title) return;
    i.title.split(/\W+/).forEach(word => {
      const w = word.toLowerCase();
      if (w) freq[w] = (freq[w] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .slice(0,5)
    .map(([w]) => w);
}
