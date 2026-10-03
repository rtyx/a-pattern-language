import { useMemo, useState } from 'react';
import { Graph } from './Graph';
import { PATTERNS, PATTERN_LINKS, SCALE_COLORS, SCALE_LABELS } from './data/patterns';
import type { Scale } from './data/patterns';

const ALL_SCALES: Scale[] = ['towns', 'buildings', 'construction'];

export function App() {
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState<Set<Scale>>(new Set(ALL_SCALES));

  const pattern = selected === null ? null : PATTERNS[selected - 1];
  const { larger, smaller } = useMemo(() => {
    if (selected === null) return { larger: [], smaller: [] };
    return {
      larger: PATTERN_LINKS.filter((l) => l.to === selected).map((l) => PATTERNS[l.from - 1]),
      smaller: PATTERN_LINKS.filter((l) => l.from === selected).map((l) => PATTERNS[l.to - 1]),
    };
  }, [selected]);

  const toggle = (s: Scale) =>
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });

  return (
    <div className="app">
      <header>
        <h1>A Pattern Language</h1>
        <input
          type="search"
          placeholder="Search by name or number…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="filters">
          {ALL_SCALES.map((s) => (
            <label key={s}>
              <input type="checkbox" checked={visible.has(s)} onChange={() => toggle(s)} />
              <span className="dot" style={{ background: SCALE_COLORS[s] }} />
              {SCALE_LABELS[s]}
            </label>
          ))}
        </div>
      </header>
      <main>
        <Graph selected={selected} onSelect={setSelected} visibleScales={visible} query={query} />
        <aside>
          {pattern ? (
            <>
              <p className="meta" style={{ color: SCALE_COLORS[pattern.scale] }}>
                {SCALE_LABELS[pattern.scale]}
              </p>
              <h2>
                {pattern.id}. {pattern.name}
              </h2>
              <PatternList title="Part of larger patterns" items={larger} onSelect={setSelected} />
              <PatternList title="Completed by smaller patterns" items={smaller} onSelect={setSelected} />
            </>
          ) : (
            <p className="hint">
              Click a pattern to see how it connects. Drag to pan, scroll to zoom. Links shown are a
              partial seed set and still need to be completed from the book.
            </p>
          )}
        </aside>
      </main>
    </div>
  );
}

function PatternList({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: { id: number; name: string }[];
  onSelect: (id: number) => void;
}) {
  if (items.length === 0) return null;
  return (
    <>
      <h3>{title}</h3>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <button onClick={() => onSelect(p.id)}>
              {p.id}. {p.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
