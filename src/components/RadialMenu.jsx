import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Compass, X } from 'lucide-react';
import { COLORS } from '../theme.js';

const RADIUS = 132; // distance of each page bubble from the center button
const ITEM = 54; // bubble diameter
const LONG_PRESS_MS = 240;

// Arc positions: fan the items across the top semicircle, left → right.
function arcPositions(n) {
  return Array.from({ length: n }, (_, i) => {
    const frac = n > 1 ? i / (n - 1) : 0.5;
    const angle = Math.PI - frac * Math.PI; // PI (left) → 0 (right)
    return { x: Math.cos(angle) * RADIUS, y: -Math.sin(angle) * RADIUS };
  });
}

function buzz(ms) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* not supported */
  }
}

export default function RadialMenu({ items, current, onSelect }) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const positions = arcPositions(items.length);

  const itemRefs = useRef([]);
  const timerRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const activeIdxRef = useRef(-1); // mirrors activeIdx for stale-free reads on pointerup

  const setActive = useCallback((idx) => {
    activeIdxRef.current = idx;
    setActiveIdx(idx);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setDragging(false);
    draggingRef.current = false;
    setActive(-1);
  }, [setActive]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Find the bubble nearest the pointer (for slide-to-select).
  const updateActive = useCallback(
    (clientX, clientY) => {
      let best = -1;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(clientX - cx, clientY - cy);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      // Within the cancel zone (near the center button) → no selection.
      setActive(bestDist < 70 ? best : -1);
    },
    [setActive],
  );

  const onPointerDown = (e) => {
    e.preventDefault();
    movedRef.current = false;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    clearTimer();
    timerRef.current = setTimeout(() => {
      // Long press → open in drag mode.
      draggingRef.current = true;
      setOpen(true);
      setDragging(true);
      buzz(15);
    }, LONG_PRESS_MS);
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    movedRef.current = true;
    updateActive(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    clearTimer();
    if (draggingRef.current) {
      // Long-press drag released: select the highlighted page, if any.
      const idx = activeIdxRef.current;
      if (idx >= 0) {
        const picked = items[idx];
        if (picked && picked.id !== current) buzz(10);
        onSelect(picked.id);
      }
      close();
    } else {
      // Short tap → toggle a sticky, tappable menu.
      setOpen((o) => {
        const next = !o;
        if (next) buzz(8);
        return next;
      });
    }
  };

  // Keep the highlight in sync with the latest pointer position during a drag.
  useEffect(() => {
    if (!dragging) return;
    const move = (e) => updateActive(e.clientX, e.clientY);
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [dragging, updateActive]);

  // Close sticky menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const activeLabel = activeIdx >= 0 ? items[activeIdx].label : null;

  return (
    <>
      {/* Backdrop — dims and catches taps to close (sticky mode) */}
      <div
        onClick={close}
        className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{
          backgroundColor: 'rgba(28,26,23,0.45)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open && !dragging ? 'auto' : 'none',
        }}
        aria-hidden={!open}
      />

      {/* Anchor at bottom-center */}
      <div
        className="fixed z-50"
        style={{
          left: '50%',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 22px)',
          width: 64,
          height: 64,
          transform: 'translateX(-50%)',
        }}
      >
        {/* Floating label of the currently targeted page */}
        <div
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            bottom: RADIUS + 64,
            backgroundColor: COLORS.ink,
            color: COLORS.card,
            opacity: open ? 1 : 0,
            transform: `translateX(-50%) scale(${open ? 1 : 0.8})`,
            transition: 'opacity 180ms, transform 180ms',
            pointerEvents: 'none',
          }}
        >
          {activeLabel || (dragging ? 'Slide to a page' : 'Pick a page')}
        </div>

        {/* Page bubbles */}
        {items.map((item, i) => {
          const Icon = item.icon;
          const p = positions[i];
          const isActive = activeIdx === i;
          const isCurrent = item.id === current;
          return (
            <button
              key={item.id}
              ref={(el) => (itemRefs.current[i] = el)}
              onClick={() => {
                // Tap-to-select in sticky mode.
                onSelect(item.id);
                close();
              }}
              className="absolute flex flex-col items-center justify-center rounded-full border shadow-lg"
              style={{
                left: '50%',
                top: '50%',
                width: ITEM,
                height: ITEM,
                marginLeft: -ITEM / 2,
                marginTop: -ITEM / 2,
                backgroundColor: isActive ? COLORS.gold : isCurrent ? COLORS.ink : COLORS.card,
                borderColor: isActive ? COLORS.gold : COLORS.border,
                color: isActive ? COLORS.ink : isCurrent ? COLORS.card : COLORS.inkSoft,
                transform: open
                  ? `translate(${p.x}px, ${p.y}px) scale(${isActive ? 1.18 : 1})`
                  : 'translate(0px, 0px) scale(0.2)',
                opacity: open ? 1 : 0,
                transition:
                  'transform 280ms cubic-bezier(.2,.8,.2,1.2), opacity 200ms, background-color 140ms, color 140ms',
                transitionDelay: open ? `${i * 24}ms` : '0ms',
                pointerEvents: open && !dragging ? 'auto' : 'none',
                touchAction: 'none',
              }}
            >
              <Icon size={20} />
              <span className="mt-0.5 text-[9px] font-semibold leading-none">{item.short}</span>
            </button>
          );
        })}

        {/* Center button */}
        <button
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            clearTimer();
            close();
          }}
          onContextMenu={(e) => e.preventDefault()}
          aria-label={open ? 'Close navigation' : 'Open navigation (long-press and slide)'}
          className="absolute inset-0 flex items-center justify-center rounded-full shadow-xl"
          style={{
            backgroundColor: open ? COLORS.red : COLORS.ink,
            color: COLORS.card,
            touchAction: 'none',
            transition: 'background-color 160ms, transform 160ms',
            transform: open ? 'scale(0.92)' : 'scale(1)',
            border: `2px solid ${COLORS.gold}`,
          }}
        >
          <span
            style={{
              transition: 'transform 220ms cubic-bezier(.2,.8,.2,1.2)',
              transform: open ? 'rotate(135deg)' : 'rotate(0deg)',
            }}
          >
            {open ? <X size={24} /> : <Compass size={24} />}
          </span>
        </button>
      </div>
    </>
  );
}
