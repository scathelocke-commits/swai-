"use client";
import Link from "next/link";
import { useDemo } from "@/context/demo-context";
import { Icon, Panel, Pill, RequirementProgress, SectionTitle, DemoNotice } from "@/components/ui";
import { percent } from "@/lib/helpers";

function Ring({ achieved, total }: { achieved: number; total: number }) {
  const value = percent(achieved, total);
  return <div className="relative grid h-[116px] w-[116px] shrink-0 place-items-center rounded-full sm:h-[142px] sm:w-[142px]" style={{ background: `conic-gradient(#FFFFFF ${value}%, rgba(255,255,255,0.23) ${value}% 100%)` }} aria-label={`진행률 ${value}%`} role="img">
    <div className="absolute inset-[11px] flex flex-col items-center justify-center rounded-full bg-[#7B6DD0]"><span className="text-[29px] font-extrabold tracking-tight text-white sm:text-[36px]">{value}<span className="text-sm">%</span></span><span className="-mt-1 text-[10px] font-medium text-[#E9E5FF]">이수 진행률</span></div>
  </div>;
}
const features = [
  { href: "/requirements", icon: "clipboard-list", title: "졸업요건", subtitle: "영역별 조건 조회", color: "#6D5FC3", bg: "#EFEDFF" },
  { href: "/courses", icon: "book-open", title: "수강내역", subtitle: "수업 등록·관리", color: "#4673C6", bg: "#EAF1FF" },
  { href: "/analysis", icon: "chart-no-axes-column", title: "졸업분석", subtitle: "가상 판정 보기", color: "#2697AC", bg: "#E7F7FB" },
  { href: "/roadmap", icon: "map", title: "수강 로드맵", subtitle: "학기별 계획 확인", color: "#C48B37", bg: "#FFF5E6" }
];

export default function HomeScreen() {
  const { student, data, scenario } = useDemo();
  const req = data.requirements;
  const remaining = scenario.missingCredits;
  return <div className="space-y-6 md:space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Pill>INTERACTIVE DEMO</Pill><span className="text-[12px] text-muted">교육용 가상 학생 프로필</span></div><Link className="inline-flex items-center gap-1.5 text-[12px] font-bold text-purple" href="/profile"><Icon name="settings-2" size={15} /> 학적정보 설정</Link></div>
    <section className="relative overflow-hidden rounded-[25px] bg-gradient-to-[115deg] from-[#6658BF] via-[#7B6BCF] to-[#9B88EA] px-6 py-7 text-white shadow-[0_16px_36px_rgba(92,78,185,0.19)] sm:px-9 sm:py-9">
      <div className="pointer-events-none absolute -right-12 -top-24 h-[270px] w-[270px] rounded-full border-[45px] border-white/[0.055]" />
      <div className="relative flex items-center justify-between gap-4"><div className="min-w-0"><div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold"><Icon name="sparkles" size={13} />나의 졸업 준비 리포트</div><h2 className="text-[23px] font-extrabold tracking-[-0.05em] sm:text-[29px]">{student.name}님의<br/>졸업 여정</h2><p className="mt-2 text-[12px] leading-relaxed text-[#EBE6FF] sm:text-[13px]">{student.major} · {student.entryYear}학번<br />{student.track} · {student.grade}학년 {student.semester}학기</p>
      <div className="mt-6 flex items-baseline gap-2"><span className="text-[38px] font-extrabold leading-none tracking-[-0.07em] sm:text-[44px]">{scenario.earned}</span><span className="text-[14px] text-[#E7E0FF]">/ {req.total} 학점</span></div><p className="mt-1 text-[11px] text-[#E7E0FF]">가상 시나리오 이수학점</p></div><Ring achieved={scenario.earned} total={req.total}/></div>
    </section>
    <DemoNotice>위 이수학점과 아래 부족요건은 <strong>선택된 데모 시나리오</strong>의 고정 값이다. 설정·수강내역 입력에 따라 다시 계산되지 않는다.</DemoNotice>
    <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <Panel><SectionTitle title="영역별 이수 현황" subtitle="가상 학점 현황 미리보기" action="자세히 보기" href="/requirements"/><div className="space-y-[22px] pt-1">{req.sections.map(s => <RequirementProgress key={s.id} label={s.label} earned={scenario.credits[s.id]} required={s.credits} color={s.color}/>)}</div></Panel>
      <Panel className="relative overflow-hidden"><div className="mb-4 flex items-start justify-between"><div><p className="text-[12px] font-bold text-[#68728B]">예시 부족 학점</p><div className="mt-1 flex items-end gap-1"><span className="text-[39px] font-extrabold leading-none tracking-tight text-ink">{remaining}</span><span className="pb-1 text-[14px] font-semibold text-muted">학점</span></div></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF1E5] text-[#E59244]"><Icon name={remaining === 0 ? "check-circle" : "trending"} size={23}/></span></div>
        <p className="min-h-[46px] text-[12px] leading-relaxed text-muted">{remaining > 0 ? "영역별 부족 학점을 확인하고 데모 로드맵을 살펴보세요." : scenario.unmetMandatory.length ? "학점은 충족했지만 지정 필수과목을 확인해야 합니다." : "현재 시나리오에서는 모든 가상 요건을 충족했습니다."}</p>
        <Link href="/analysis" className="mt-4 flex min-h-[44px] items-center justify-between rounded-[12px] bg-[#F3F1FE] px-4 text-[13px] font-bold text-[#6454B8] hover:bg-[#EBE7FD]">자세한 분석 결과 확인<Icon name="arrow" size={17}/></Link>
      </Panel>
    </div>
    <section><SectionTitle title="무엇을 도와드릴까요?" subtitle="필요한 기능을 선택해 체험해 보세요"/><div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{features.map(feature => <Link key={feature.href} href={feature.href} className="group flex min-h-[150px] flex-col rounded-card border border-[#EEF0F6] bg-white p-[17px] shadow-card transition hover:-translate-y-1 hover:border-[#D4CFFA] hover:shadow-float sm:min-h-[162px] sm:p-5"><span className="mb-auto grid h-11 w-11 place-items-center rounded-[14px]" style={{ color: feature.color, background: feature.bg }}><Icon name={feature.icon} size={22}/></span><div className="mt-4 flex items-center justify-between gap-2"><h3 className="text-[14px] font-extrabold text-ink">{feature.title}</h3><Icon name="right" size={17} className="text-[#A4AFC5] transition group-hover:translate-x-0.5" /></div><p className="mt-1 text-[11px] text-muted">{feature.subtitle}</p></Link>)}</div></section>
    <div className="flex items-start gap-3 rounded-[18px] border border-[#E8EAF4] bg-white px-4 py-4"><span className="mt-0.5 text-purple"><Icon name="shield" size={20}/></span><div><p className="text-[13px] font-bold">안전한 시연을 위한 데모 환경</p><p className="mt-1 text-[12px] leading-relaxed text-muted">로그인이나 대학 포털 인증이 없으며 실명·학번 등 실제 개인정보를 입력할 필요가 없다. 이 사이트의 모든 판정은 교육용 예시다.</p></div></div>
  </div>;
}
