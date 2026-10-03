import { useEffect, useMemo, useRef, useState } from 'react';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceY } from 'd3-force';
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';
import { PATTERNS, PATTERN_LINKS, SCALE_COLORS } from './data/patterns';
import type { Pattern, Scale } from './data/patterns';

type GNode = Pattern & SimulationNodeDatum;
type GLink = SimulationLinkDatum<GNode>;

interface Props {
  selected: number | null;
  onSelect: (id: number | null) => void;
  visibleScales: Set<Scale>;
  query: string;
}

const WIDTH = 1200;
const HEIGHT = 800;
const SCALE_Y: Record<Scale, number> = { towns: 200, buildings: 400, construction: 600 };

export function Graph({ selected, onSelect, visibleScales, query }: Props) {
  const [, setTick] = useState(0);
  const nodes = useRef<GNode[]>(PATTERNS.map((p) => ({ ...p })));
  const links = useRef<GLink[]>(PATTERN_LINKS.map((l) => ({ source: l.from, target: l.to })));
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const sim = forceSimulation<GNode>(nodes.current)
      .force('link', forceLink<GNode, GLink>(links.current).id((d) => d.id).distance(30).strength(0.4))
      .force('charge', forceManyBody().strength(-25))
      .force('collide', forceCollide(7))
      .force('y', forceY<GNode>((d) => SCALE_Y[d.scale]).strength(0.12))
      .force('center', forceCenter(WIDTH / 2, HEIGHT / 2).strength(0.02))
      .on('tick', () => setTick((t) => t + 1));
    return () => {
      sim.stop();
    };
  }, []);

  const neighbors = useMemo(() => {
    const set = new Set<number>();
    if (selected === null) return set;
    for (const l of PATTERN_LINKS) {
      if (l.from === selected) set.add(l.to);
      if (l.to === selected) set.add(l.from);
    }
    return set;
  }, [selected]);

  const q = query.trim().toLowerCase();
  const matches = (n: Pattern) =>
    !q || n.name.toLowerCase().includes(q) || String(n.id) === q;

  const onWheel = (e: React.WheelEvent) => {
    const k = Math.min(4, Math.max(0.4, view.k * (e.deltaY < 0 ? 1.1 : 0.9)));
    setView((v) => ({ ...v, k }));
  };

  return (
    <svg
      ref={svgRef}
      className="graph"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      onWheel={onWheel}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        const dy = e.clientY - drag.current.y;
        drag.current = { x: e.clientX, y: e.clientY };
        setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onClick={(e) => {
        if (e.target === svgRef.current) onSelect(null);
      }}
    >
      <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
        {links.current.map((l, i) => {
          const s = l.source as GNode;
          const t = l.target as GNode;
          if (s.x === undefined || t.x === undefined) return null;
          if (!visibleScales.has(s.scale) || !visibleScales.has(t.scale)) return null;
          const active = selected !== null && (s.id === selected || t.id === selected);
          return (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              className={active ? 'edge active' : 'edge'}
            />
          );
        })}
        {nodes.current.map((n) => {
          if (n.x === undefined || !visibleScales.has(n.scale)) return null;
          const isSel = n.id === selected;
          const dim = (selected !== null && !isSel && !neighbors.has(n.id)) || !matches(n);
          return (
            <g
              key={n.id}
              transform={`translate(${n.x} ${n.y})`}
              className={dim ? 'node dim' : 'node'}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(n.id);
              }}
            >
              <circle r={isSel ? 8 : 5} fill={SCALE_COLORS[n.scale]} className={isSel ? 'sel' : ''} />
              <title>{`${n.id}. ${n.name}`}</title>
              {(isSel || neighbors.has(n.id)) && (
                <text y={-10} textAnchor="middle">
                  {n.name}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
