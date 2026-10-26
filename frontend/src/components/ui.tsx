"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Atom, BookOpen, ChartNoAxesColumn, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, GraduationCap, House, Layers3, LibraryBig, Map, Settings2, ShieldCheck, Sparkles, TriangleAlert, CircleHelp, FileText, RotateCcw, Plus, Pencil, Trash2, Search, X, CalendarDays, Info, Bookmark, TrendingUp, ListChecks, SlidersHorizontal, ExternalLink, type LucideProps } from "lucide-react";
import { categoryColors, palette, percent } from "@/lib/helpers";
import type { Category } from "@/lib/types";

const icons = { house: House, "clipboard-list": ClipboardList, "book-open": BookOpen, "chart-no-axes-column": ChartNoAxesColumn, map: Map, "settings-2": Settings2,
  atom: Atom, library: LibraryBig, layers: Layers3, graduation: GraduationCap, sparkles: Sparkles, shield: ShieldCheck, check: Check, "check-circle": CheckCircle2,
  down: ChevronDown, left: ChevronLeft, right: ChevronRight, alert: TriangleAlert, info: Info, help: CircleHelp, file: FileText, reset: RotateCcw,
  plus: Plus, pencil: Pencil, trash: Trash2, search: Search, x: X, calendar: CalendarDays, bookmark: Bookmark, trending: TrendingUp, list: ListChecks,
  filter: SlidersHorizontal, external: ExternalLink, arrow: ArrowRight } as const;
export type IconName = keyof typeof icons;
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = icons[name as IconName] ?? CircleHelp;
  return <Component size={20} strokeWidth={1.9} {...props} />;
}
export function DemoNotice({ children, compact = false, warning = false }: { children: React.ReactNode; compact?: boolean; warning?: boolean }) {
  return <div className={`flex items-start gap-2.5 rounded-2xl border px-3.5 py-3 text-[12px] leading-[1.65] ${warning ? "border-orange-100 bg-orange-50 text-orange-800" : "border-violet-100 bg-[#F7F5FF] text-[#695F96]"} ${compact ? "md:text-[12px]" : "md:px-4 md:py-3.5 md:text-[13px]"}`}>
    <Icon name="info" className="mt-0.5 shrink-0" size={16} /> <span>{children}</span>
  </div>;
}
export function SectionTitle({ title, subtitle, action, href }: { title: string; subtitle?: string; action?: string; href?: string }) {
  return <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-[17px] font-extrabold tracking-tight text-ink md:text-[19px]">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted md:text-[13px]">{subtitle}</p>}</div>
    {href && action && <Link className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-purple hover:underline" href={href}>{action}<Icon name="right" size={15} /></Link>}
  </div>;
}
export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <div className={`rounded-card border border-[#EEF0F6] bg-white p-[18px] shadow-card md:p-6 ${className}`}>{children}</div>; }
export function Pill({ children, color = "violet" }: { children: React.ReactNode; color?: "violet" | "green" | "amber" | "gray" }) {
  const classes = { violet: "bg-lavender text-[#6352B9]", green: "bg-[#E8F8EF] text-[#19834E]", amber: "bg-orange-50 text-[#C27320]", gray: "bg-[#F0F2F7] text-[#687386]" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${classes[color]}`}>{children}</span>;
}
export function CategoryPill({ category }: { category: Category }) {
  const colors = categoryColors[category]; return <span className="inline-flex rounded-lg px-2.5 py-1 text-[11px] font-bold" style={{ background: colors.background, color: colors.color }}>{category}</span>;
}
export function ProgressBar({ earned, required, color = "#7165C6", height = 8 }: { earned: number; required: number; color?: string; height?: number }) {
  return <div className="w-full overflow-hidden rounded-full bg-[#ECEEF6]" style={{ height }} role="progressbar" aria-valuemin={0} aria-valuemax={required} aria-valuenow={Math.min(required, earned)}>
    <div className="h-full rounded-full transition-all duration-500" style={{ background: color, width: `${percent(earned, required)}%` }} />
  </div>;
}
export function RequirementProgress({ label, earned, required, color, className = "" }: { label: string; earned: number; required: number; color: string; className?: string }) {
  const theme = palette[color] ?? palette.violet;
  return <div className={className}>
    <div className="mb-2 flex items-center justify-between gap-2"><span className="text-[13px] font-semibold text-[#394159]">{label}</span><span className="text-[12px] font-bold tabular-nums text-[#4A5572]">{earned} <span className="font-normal text-[#A1A8B9]">/ {required}학점</span></span></div>
    <ProgressBar earned={earned} required={required} color={theme.bar} height={7} />
  </div>;
}
export function PrimaryLink({ href, children, secondary = false, className = "" }: { href: string; children: React.ReactNode; secondary?: boolean; className?: string }) {
  return <Link href={href} className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[13px] px-5 text-[13px] font-bold transition hover:-translate-y-0.5 ${secondary ? "border border-[#E2E5F0] bg-white text-navy hover:border-purple" : "bg-navy text-white hover:bg-[#263C72]"} ${className}`}>{children} <Icon name="arrow" size={16} /></Link>;
}
export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="py-12 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-lavender text-purple"><Icon name="search" /></div><p className="font-bold text-ink">{title}</p><p className="mt-1 text-xs text-muted">{detail}</p></div>;
}
