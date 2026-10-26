"use client";
import { useState } from "react";
import { useDemo } from "@/context/demo-context";
import { DemoNotice, Icon, Panel, Pill, ProgressBar, SectionTitle } from "@/components/ui";
import { palette, percent } from "@/lib/helpers";

export default function RequirementsScreen() {
  const { data, scenario, student } = useDemo();
  const [expanded, setExpanded] = useState(true);
  const { requirements } = data;
  return <div className="space-y-6">
    <DemoNotice>이 페이지의 학점 기준은 <strong>실제 단국대학교 졸업규정이 아닌 가상 예시</strong>다. 학과·입학연도·다전공 정보 변경에 따라 자동 적용되지 않는다.</DemoNotice>
    <Panel className="bg-gradient-to-br from-[#F7F4FF] to-white"><div className="flex flex-wrap items-center justify-between gap-4"><div><Pill>DEMO REQUIREMENTS</Pill><h2 className="mt-4 text-[17px] font-extrabold">가상의 {student.major} 졸업요건</h2><p className="mt-1 text-[12px] text-muted">{student.entryYear}학번 · {student.track} (표시용 선택 정보)</p></div><div className="rounded-[17px] bg-white px-6 py-4 text-center shadow-sm"><p className="text-xs text-muted">예시 총 졸업학점</p><p className="mt-1 text-[32px] font-extrabold text-[#6758C1]">{requirements.total}<span className="ml-1 text-[13px] text-muted">학점</span></p></div></div>
      <div className="mt-6 flex items-center justify-between gap-3 text-[12px]"><span className="font-bold">시나리오 이수 현황</span><span className="font-semibold text-purple">{scenario.earned} / {requirements.total}학점</span></div><div className="mt-2"><ProgressBar earned={scenario.earned} required={requirements.total} height={9}/></div></Panel>
    <SectionTitle title="영역별 이수 기준" subtitle="4개 영역의 예시 학점 기준"/>
    <div className="grid gap-4 sm:grid-cols-2">{requirements.sections.map(s => {
      const earned = scenario.credits[s.id]; const theme = palette[s.color] ?? palette.violet; const missing = Math.max(0, s.credits - earned);
      return <Panel key={s.id}><div className="mb-5 flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-[15px]" style={{ background: theme.bg, color: theme.text }}><Icon name={s.icon} size={23}/></span><Pill color={missing === 0 ? "green" : "amber"}>{missing === 0 ? "기준 충족" : `${missing}학점 부족`}</Pill></div><h3 className="text-[16px] font-extrabold">{s.label}</h3><p className="mt-1 text-[12px] text-muted">{s.description}</p><div className="mb-3 mt-6 flex items-end justify-between"><div><span className="text-[26px] font-extrabold tabular-nums">{earned}</span><span className="ml-1 text-[12px] text-muted">/ {s.credits}학점</span></div><span className="text-xs font-bold" style={{ color: theme.text }}>{percent(earned, s.credits)}%</span></div><ProgressBar earned={earned} required={s.credits} color={theme.bar}/></Panel>;
    })}</div>
    <Panel><button type="button" onClick={() => setExpanded(e => !e)} aria-expanded={expanded} className="flex w-full min-h-[44px] items-center justify-between gap-3 text-left"><div><h3 className="text-[16px] font-extrabold">지정 필수과목 예시</h3><p className="mt-1 text-[12px] text-muted">학점 외에 확인할 수 있는 조건의 표현 예시</p></div><Icon name="down" className={`shrink-0 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}/></button>
      {expanded && <div className="mt-4 divide-y divide-[#EFF1F6] border-t border-[#EFF1F6]">{requirements.mandatoryCourses.map(c => {
        const missing = scenario.unmetMandatory.includes(c.name);
        return <div key={c.code} className="flex items-center justify-between gap-3 py-3.5"><div className="flex items-center gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${missing ? "bg-orange-50 text-[#D88332]" : "bg-green-50 text-green-600"}`}><Icon name={missing ? "alert" : "check"} size={18}/></span><div><p className="text-[13px] font-bold">{c.name}</p><p className="mt-0.5 text-[11px] text-muted">{c.code} · {c.credits}학점</p></div></div><Pill color={missing ? "amber" : "green"}>{missing ? "미이수 예시" : "이수 예시"}</Pill></div>;
      })}</div>}</Panel>
    <DemoNotice>지정 필수과목 상태도 고정 시나리오 기반이다. 특정 영역의 학점을 채운 경우라도 필수 지정 과목이 남는 예시가 가능하며, 해당 규칙을 실제로 계산하지는 않는다.</DemoNotice>
  </div>;
}
