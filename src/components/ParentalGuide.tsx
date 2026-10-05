"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type {
  GuideCategory,
  GuideCategoryKey,
  ParentalGuide as ParentalGuideType,
} from "@/types/parentalGuide";

interface CategoryConfig {
  key: GuideCategoryKey;
  label: string;
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  { key: "sex_nudity", label: "性与裸露" },
  { key: "violence_gore", label: "暴力与血腥" },
  { key: "profanity", label: "粗口" },
  { key: "alcohol_drugs_smoking", label: "酒精、毒品与吸烟" },
  { key: "frightening_intense", label: "惊吓与紧张" },
];

const SEVERITY_CONFIG: Record<
  string,
  { label: string; color: string; width: string }
> = {
  None: { label: "无", color: "#999999", width: "0%" },
  Mild: { label: "轻微", color: "#42a66b", width: "33%" },
  Moderate: { label: "中等", color: "#f39800", width: "66%" },
  Severe: { label: "严重", color: "#d85b53", width: "100%" },
};

export default function ParentalGuide({ guide }: { guide: ParentalGuideType }) {
  const [expandedCategory, setExpandedCategory] =
    useState<GuideCategoryKey | null>(null);

  return (
    <div className="space-y-5">
      {guide.content_rating && (
        <div className="inline-flex items-center border border-[#f0d7aa] bg-[#fff8e9] px-3 py-1 text-xs text-[#9b6813]">
          内容分级 · {guide.content_rating_zh}
        </div>
      )}

      <div className="overflow-hidden border border-[#e5e5e5]">
        {CATEGORY_CONFIGS.map((config) => {
          const category = guide[config.key] as GuideCategory;
          if (!category) return null;

          const severity = SEVERITY_CONFIG[category.severity] || SEVERITY_CONFIG.None;
          const isExpanded = expandedCategory === config.key;
          const hasItems = category.items && category.items.length > 0;

          return (
            <div key={config.key} className="border-b border-[#e5e5e5] last:border-b-0">
              <button
                onClick={() => hasItems && setExpandedCategory(isExpanded ? null : config.key)}
                disabled={!hasItems}
                aria-expanded={hasItems ? isExpanded : undefined}
                className="flex w-full items-center gap-4 bg-white px-4 py-3 text-left enabled:hover:bg-[#f7f7f7]"
              >
                <span className="min-w-0 flex-1 text-sm text-[#555]">
                  {config.label}
                </span>

                <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-[#e5e5e5] sm:block">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: severity.width, backgroundColor: severity.color }}
                  />
                </span>

                <span
                  className="min-w-12 rounded-full border px-2.5 py-1 text-center text-xs font-semibold"
                  style={{ color: severity.color, borderColor: `${severity.color}55` }}
                >
                  {severity.label}
                </span>

                {hasItems && (
                  <span className="text-xs text-[#999]" aria-hidden="true">
                    {isExpanded ? "−" : "+"}
                  </span>
                )}
              </button>

              {isExpanded && hasItems && (
                <div className="border-t border-[#e5e5e5] bg-[#f7f7f7] px-5 py-4">
                  <ul className="space-y-2 pl-5 text-sm leading-7 text-[#555]">
                    {category.items_zh.map((item, index) => (
                      <li key={index} className="list-disc marker:text-[#00a65a]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <a
        href={guide.url}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-sm no-underline"
      >
        查看 IMDb 完整家长指南
        <ExternalLink size={14} />
      </a>
    </div>
  );
}
