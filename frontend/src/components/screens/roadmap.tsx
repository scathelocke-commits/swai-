"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDemo } from "@/context/demo-context";
import { CategoryPill, DemoNotice, Icon, Panel, Pill, SectionTitle } from "@/components/ui";

export default function RoadmapScreen() {
  const { data, scenario, scenarioId, setScenarioId } = useDemo();
  const semesters = data.roadmaps[scenarioId];
  const [expanded, setExpanded] = useState<string[]>(["2027-1"]);
  const [activeSemester, setActiveSemester] = useState("2027-1");
  useEffect(() => { setExpanded(["2027-1"]); setActiveSemester("2027-1"); }, [scenarioId]);
  const requiredCredits = useMemo(() => semesters.flatMap(s => s.courses).filter(c => !c.optional).reduce((sum, c) => sum + c.credits, 0), [semesters]);
  const allCredits = useMemo(() => semesters.flatMap(s => s.courses).reduce((sum, c) => sum + c.credits, 0), [semesters]);
  function toggle(id: string) { setActiveSemester(id); setExpanded(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id]); }
  return <div className="space-y-6">
    <DemoNotice warning><strong>실제 수강신청에 사용할 수 없다.</strong> 모든 강좌명·학기·추천 사유는 사전 작성된 가상 데이터이며 실제 개설 여부와 선수과목을 확인하지 않는다.</DemoNotice>
    <Panel className="bg-gradient-to-br from-[#F1EEFF] via-white to-white"><div className="flex flex-wrap items-start justify-between gap-4"><div><Pill>DEMO ROADMAP</Pill><h2 className="mt-3 text-[20px] font-extrabold tracking-tight">나만의 학기별 학습 로드맵</h2><p className="mt-1 text-[12px] leading-relaxed text-muted">선택한 가상 분석 결과에 따라 준비된 고정 로드맵을 표시한다.</p></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#7767C9]"><Icon name="map" size={26}/></span></div>
      <div className="mt-5 flex flex-wrap gap-2">{data.scenarios.map(s => <button type="button" key={s.id} onClick={() => setScenarioId(s.id)} aria-pressed={s.id === scenarioId} className={`min-h-[38px] rounded-full px-3.5 text-[12px] font-bold transition ${s.id === scenarioId ? "bg-navy text-white" : "border border-[#E4E4EF] bg-white text-[#6A7387] hover:border-purple"}`}>{s.shortName} · {s.name}</button>)}</div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#EDEAF9] pt-5"><div><p className="text-[11px] text-muted">예시 부족 학점</p><p className="mt-1 text-[24px] font-extrabold">{scenario.missingCredits}<span className="ml-1 text-[11px] text-muted">학점</span></p></div><div><p className="text-[11px] text-muted">보완 계획 학점</p><p className="mt-1 text-[24px] font-extrabold">{requiredCredits}<span className="ml-1 text-[11px] text-muted">학점</span></p></div><div><p className="text-[11px] text-muted">예시 계획 학기</p><p className="mt-1 text-[24px] font-extrabold">{semesters.length}<span className="ml-1 text-[11px] text-muted">개</span></p></div></div>
      {scenarioId === "course" && <p className="mt-4 text-[11px] leading-relaxed text-[#807195]">시나리오 2는 부족 학점이 0이지만 별도 지정 필수과목을 이수해야 하는 예시다. 계획 학점은 학점 부족량과 다를 수 있다.</p>}
      {scenarioId === "complete" && <p className="mt-4 text-[11px] leading-relaxed text-[#807195]">시나리오 3은 부족요건이 없으므로 계획에 포함된 과목은 모두 선택사항이다.</p>}
    </Panel>
    <section><SectionTitle title="학기별 학습 타임라인" subtitle="학기를 클릭해 계획을 펼치거나 접을 수 있어요"/><div className="mb-5 grid grid-cols-3 gap-2">{semesters.map((s, i) => <button type="button" key={s.id} onClick={() => { setActiveSemester(s.id); setExpanded(x => x.includes(s.id) ? x : [...x, s.id]); document.getElementById(`roadmap-${s.id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }} aria-pressed={activeSemester === s.id} className={`relative flex min-h-[73px] flex-col items-center justify-center rounded-[15px] border px-2 text-center transition ${activeSemester === s.id ? "border-[#7768CC] bg-lavender text-[#6556BA]" : "border-[#E7E9F2] bg-white text-[#7F899B] hover:border-[#B5ADE7]"}`}><span className="text-[10px] font-extrabold">STEP {String(i + 1).padStart(2, "0")}</span><span className="mt-1 text-[11px] font-bold sm:text-[12px]">{s.title.replace("학년도 ", " ")}</span></button>)}</div>
      <div className="space-y-4">{semesters.map((s, i) => {
        const opened = expanded.includes(s.id);
        const sum = s.courses.reduce((value, c) => value + c.credits, 0);
        return <div key={s.id} id={`roadmap-${s.id}`} className="relative pl-[24px] before:absolute before:bottom-[-18px] before:left-[8px] before:top-[22px] before:w-[2px] before:bg-[#E5E1F6] last:before:hidden"><span className={`absolute left-0 top-7 z-[1] h-[18px] w-[18px] rounded-full border-[5px] border-canvas ${opened ? "bg-purple" : "bg-[#C5BFDE]"}`} />
          <Panel className="!p-0"><button type="button" onClick={() => toggle(s.id)} aria-expanded={opened} className="flex w-full min-h-[88px] items-center justify-between gap-3 px-4 py-4 text-left sm:px-6"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-[15px] font-extrabold">{s.title}</h3>{i === 0 && <Pill>START</Pill>}</div><p className="mt-1.5 text-[12px] text-muted">{s.subtitle}</p><p className="mt-2 text-[11px] font-bold text-[#7564C5]">{s.courses.length}과목 · {sum}학점 {s.courses.every(c => c.optional) ? "(전체 선택)" : "(계획 전체)"}</p></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F5F5FA] text-muted"><Icon name="down" size={19} className={opened ? "rotate-180 transition" : "transition"}/></span></button>
            {opened && <div className="space-y-3 border-t border-[#F0F1F6] p-4 sm:p-6">{s.courses.map(c => <div key={c.code} className="rounded-[15px] border border-[#EBEDF5] bg-[#FCFCFF] p-4"><div className="flex flex-wrap items-center gap-2"><CategoryPill category={c.category}/>{c.optional && <Pill color="gray">선택 예시</Pill>}</div><div className="mt-3 flex justify-between gap-3"><div className="min-w-0"><h4 className="text-[14px] font-extrabold">{c.name}</h4><p className="mt-1 text-[11px] text-muted">{c.code}</p></div><p className="shrink-0 text-[15px] font-extrabold text-purple">{c.credits}<span className="ml-1 text-[11px] font-medium text-muted">학점</span></p></div><p className="mt-3 flex items-start gap-2 rounded-xl bg-[#F4F2FE] px-3 py-2.5 text-[11px] leading-relaxed text-[#6356A1]"><Icon name="sparkles" size={15} className="mt-0.5 shrink-0" />{c.reason}</p></div>)}</div>}
          </Panel></div>;
      })}</div>
    </section>
    <div className="rounded-[18px] border border-[#E6EAF3] bg-white p-5"><div className="flex items-start gap-3"><Icon name="info" size={21} className="mt-0.5 shrink-0 text-purple"/><div><h3 className="text-[13px] font-extrabold">로드맵은 시연용 설계 예시입니다</h3><p className="mt-2 text-[12px] leading-relaxed text-muted">학기별 과목은 실제 개설정보를 기반으로 하지 않는다. 보완 계획 학점에는 선택과목을 포함하지 않으며, 전체 표시 과목은 {allCredits}학점이다. 실제 수강신청 전에는 공식 대학 학사안내를 확인해야 한다.</p><Link href="/analysis" className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-bold text-purple hover:underline"><Icon name="left" size={16}/>분석 결과로 돌아가기</Link></div></div></div>
  </div>;
}
