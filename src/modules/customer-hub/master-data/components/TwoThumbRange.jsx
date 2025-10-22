import React, { useMemo } from "react";
import { Range, getTrackBackground } from "react-range";

const TwoThumbRange = ({
  min = 1,
  max = 200,
  step = 1,
  rtl = false,
  values = [10, 30],
  onChange,
}) => {
  // % helpers
  const pct = (v) => ((v - min) / (max - min)) * 100;
  const leftPct = useMemo(() => pct(values[0]), [values, min, max]);
  const rightPct = useMemo(() => pct(values[1]), [values, min, max]);
  // midpoint for the combined label; clamp so it won’t clip at edges
  const midPct = useMemo(() => {
    const m = (leftPct + rightPct) / 2;
    return Math.max(6, Math.min(94, m));
  }, [leftPct, rightPct]);

  return (
    <div className="w-full">
      <div className="relative">
        {/* Combined label above the track */}
        <div
          className="absolute -top-8 -translate-x-1/2 pointer-events-none"
          style={{ left: `${midPct}%` }}
        >
          <div className="px-2 h-6 rounded text-white bg-[rgb(132,90,223)] text-[12px] leading-6 text-center font-semibold shadow-sm">
            {values[0]}–{values[1]}
          </div>
        </div>

        <Range
          values={values}
          step={step}
          min={min}
          max={max}
          rtl={rtl}
          onChange={(v) => onChange?.(v)}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              className="h-9 flex w-full"
            >
              <div
                ref={props.ref}
                className="h-[5px] w-full rounded bg-slate-200 dark:bg-white/10 self-center"
                style={{
                  background: getTrackBackground({
                    values,
                    colors: ["#cbd5e1", "rgb(132, 90, 223)", "#cbd5e1"],
                    min,
                    max,
                    rtl,
                  }),
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, isDragged }) => (
            <div
              {...props}
              style={{ ...props.style, top: "16px" }}
              className="h-5 w-5 rounded bg-white border border-[rgb(132,90,223)] shadow-[0_2px_6px_rgba(170,170,170,0.3)] flex items-center justify-center"
            >
              <div
                className={`h-4 w-[5px] ${
                  isDragged ? "bg-[rgb(132,90,223)]" : "bg-slate-300"
                }`}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default TwoThumbRange;
