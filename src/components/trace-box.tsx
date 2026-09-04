"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { scoreTrace } from "@/lib/tracing";

const SIZE = 260;
const PEN = 9;

/** The stack a browser is likely to have a Han glyph in, in the order to try. */
const CJK = '"Noto Sans SC","Noto Sans JP","PingFang SC","Hiragino Sans","Microsoft YaHei","Malgun Gothic",sans-serif';

/**
 * A box to write one character in.
 *
 * The character is printed faintly underneath and the learner writes over it.
 * Two off-screen canvases are kept alongside the visible one — the printed
 * character on its own, and the learner's ink on its own — because the mark is
 * a comparison of those two and neither can be recovered from the composite
 * the learner sees.
 */
export function TraceBox({
  character,
  hint,
  clearLabel,
  submitLabel,
  emptyLabel,
  disabled,
  onMark,
}: {
  character: string;
  hint: string;
  clearLabel: string;
  submitLabel: string;
  emptyLabel: string;
  disabled: boolean;
  onMark: (result: { score: number; accuracy: number; coverage: number }) => void;
}) {
  const view = useRef<HTMLCanvasElement | null>(null);
  const glyph = useRef<HTMLCanvasElement | null>(null);
  const ink = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [touched, setTouched] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const compose = useCallback(() => {
    const canvas = view.current;
    if (!canvas || !glyph.current || !ink.current) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, SIZE, SIZE);

    // Guides, the way a squared exercise book is ruled.
    context.strokeStyle = "rgba(255,255,255,0.07)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(SIZE / 2, 0);
    context.lineTo(SIZE / 2, SIZE);
    context.moveTo(0, SIZE / 2);
    context.lineTo(SIZE, SIZE / 2);
    context.stroke();

    context.globalAlpha = 0.16;
    context.drawImage(glyph.current, 0, 0);
    context.globalAlpha = 1;
    context.drawImage(ink.current, 0, 0);
  }, []);

  useEffect(() => {
    const off = document.createElement("canvas");
    off.width = SIZE;
    off.height = SIZE;
    const context = off.getContext("2d");
    if (context) {
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `${Math.round(SIZE * 0.82)}px ${CJK}`;
      context.fillText(character, SIZE / 2, SIZE / 2 + SIZE * 0.03);
    }
    glyph.current = off;

    const layer = document.createElement("canvas");
    layer.width = SIZE;
    layer.height = SIZE;
    ink.current = layer;

    setTouched(false);
    setNote(null);
    compose();
  }, [character, compose]);

  function at(event: React.PointerEvent<HTMLCanvasElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - box.left) / box.width) * SIZE,
      y: ((event.clientY - box.top) / box.height) * SIZE,
    };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const context = ink.current?.getContext("2d");
    if (!context) return;
    const point = at(event);
    context.strokeStyle = "#e8f5ee";
    context.lineWidth = PEN;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(point.x, point.y);
    drawing.current = true;
    setTouched(true);
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || disabled) return;
    const context = ink.current?.getContext("2d");
    if (!context) return;
    const point = at(event);
    context.lineTo(point.x, point.y);
    context.stroke();
    compose();
  }

  function end() {
    drawing.current = false;
  }

  function clear() {
    const context = ink.current?.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, SIZE, SIZE);
    setTouched(false);
    setNote(null);
    compose();
  }

  /** Alpha above a quarter counts as marked; anti-aliased edges do not. */
  function mask(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    const out = new Uint8Array(SIZE * SIZE);
    if (!context) return out;
    const pixels = context.getImageData(0, 0, SIZE, SIZE).data;
    for (let i = 0; i < out.length; i += 1) {
      if (pixels[i * 4 + 3] > 64) out[i] = 1;
    }
    return out;
  }

  function submit() {
    if (!glyph.current || !ink.current) return;
    if (!touched) {
      setNote(emptyLabel);
      return;
    }
    onMark(scoreTrace(mask(glyph.current), mask(ink.current), SIZE, SIZE));
  }

  return (
    <div className="mt-3">
      <p className="text-[12.5px] text-muted">{hint}</p>
      <canvas
        ref={view}
        width={SIZE}
        height={SIZE}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="mt-2 touch-none rounded-lg border border-line bg-white/[0.02]"
        style={{ width: SIZE, height: SIZE, maxWidth: "100%" }}
      />
      {note && <p className="mt-2 text-[12.5px] text-red-300/80">{note}</p>}
      <div className="mt-2.5 flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          className="btn btn-primary px-4 py-2.5 text-[13px] disabled:opacity-40"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className="text-[12.5px] text-muted hover:text-paper"
        >
          {clearLabel}
        </button>
      </div>
    </div>
  );
}
