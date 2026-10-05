"use client";

import { useState } from "react";
import type { PlotPoint } from "@/types/movie";

interface MovieTimelineProps {
  duration: number;
  plotPoints: PlotPoint[];
}

export default function MovieTimeline({ duration, plotPoints }: MovieTimelineProps) {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const selected = plotPoints.find((point) => point.id === selectedPoint);

  return (
    <div>
      <div className="overflow-x-auto pb-3">
        <div className="min-w-[36rem] px-3 pt-5">
          <div className="mb-3 flex justify-between text-xs text-[#999]">
            <span>0 分钟</span>
            <span>{duration} 分钟</span>
          </div>

          <div className="relative h-1 bg-[#dddddd]">
            {plotPoints.map((point) => {
              const position = duration > 0
                ? Math.min(100, Math.max(0, (point.timestamp / duration) * 100))
                : 0;
              const isSelected = selectedPoint === point.id;

              return (
                <button
                  key={point.id}
                  onClick={() => setSelectedPoint(isSelected ? null : point.id)}
                  className={`focus-ring absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white transition-colors ${
                    isSelected
                      ? "bg-[#f39800]"
                      : "bg-[#00a65a] hover:bg-[#f39800]"
                  }`}
                  style={{ left: `${position}%` }}
                  aria-label={`${point.title}，${point.timestamp} 分钟`}
                  aria-pressed={isSelected}
                >
                  <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[11px] text-[#999]">
                    {point.timestamp}′
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selected ? (
        <div className="subtle-box mt-6 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-[#999]">{selected.timestamp} 分钟</p>
              <h3 className="mt-1 font-medium text-[#007722]">{selected.title}</h3>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="focus-ring rounded-sm px-2 py-0.5 text-sm text-[#999] hover:bg-[#e9e9e9] hover:text-[#555]"
              aria-label="关闭剧情节点"
            >
              ×
            </button>
          </div>
          <p className="mt-3 text-sm leading-7 text-[#555]">{selected.description}</p>
        </div>
      ) : (
        <p className="mt-6 text-xs text-[#999]">选择时间节点查看对应剧情。</p>
      )}
    </div>
  );
}
