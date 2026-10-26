"use client";
import { useMemo, useState, type FormEvent } from "react";
import { useDemo } from "@/context/demo-context";
import { CategoryPill, DemoNotice, EmptyState, Icon, Panel, Pill } from "@/components/ui";
import type { Category, Course, CourseStatus } from "@/lib/types";

const categories: Category[] = ["전공필수", "전공선택", "교양", "일반선택"];
const statuses: CourseStatus[] = ["이수완료", "수강중", "수강예정"];
const blankForm = { code: "", name: "", credits: "3", category: "전공선택" as Category, term: "2026-2", status: "수강예정" as CourseStatus };
type CourseForm = typeof blankForm;

function CourseEditor({ editing, onClose, onSave, existing, catalog }: { editing?: Course; onClose: () => void; onSave: (value: Course) => void; existing: Course[]; catalog: { code: string; name: string; credits: number; category: Category }[] }) {
  const [form, setForm] = useState<CourseForm>(() => editing ? { code: editing.code, name: editing.name, credits: String(editing.credits), category: editing.category, term: editing.term, status: editing.status } : blankForm);
  const [error, setError] = useState("");
  function update<K extends keyof CourseForm>(key: K, value: CourseForm[K]) { setForm(current => ({ ...current, [key]: value })); setError(""); }
  function addFromCatalog(code: string) {
    const course = catalog.find(c => c.code === code);
    if (course) setForm(current => ({ ...current, code: course.code, name: course.name, credits: String(course.credits), category: course.category }));
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const credits = Number(form.credits);
    const code = form.code.trim().toUpperCase();
    const name = form.name.trim();
    if (!code || !name) { setError("과목명과 교과목 코드를 모두 입력해야 합니다."); return; }
    if (!Number.isInteger(credits) || credits < 1 || credits > 6) { setError("학점은 1~6의 정수로 입력해야 합니다."); return; }
    if (!/^20\d{2}-[12]$/.test(form.term)) { setError("수강학기는 YYYY-1 또는 YYYY-2 형식이어야 합니다."); return; }
    if (existing.some(c => c.id !== editing?.id && c.code.toUpperCase() === code && c.term === form.term)) { setError("같은 수강학기에 이미 등록된 교과목 코드입니다."); return; }
    onSave({ id: editing?.id ?? `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, code, name, credits, category: form.category, term: form.term, status: form.status });
  }
  return <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#111C37]/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" role="presentation" onMouseDown={e => { if (e.currentTarget === e.target) onClose(); }}>
    <div role="dialog" aria-modal="true" aria-labelledby="edit-title" className="max-h-[93dvh] w-full max-w-[530px] overflow-y-auto rounded-t-[25px] bg-white p-6 shadow-float sm:rounded-[24px] sm:p-7">
      <div className="mb-6 flex items-start justify-between"><div><Pill>LOCAL DEMO INPUT</Pill><h2 id="edit-title" className="mt-2 text-[20px] font-extrabold">{editing ? "교과목 수정" : "교과목 추가"}</h2><p className="mt-1 text-[12px] text-muted">입력 내용은 판정 계산에 사용되지 않습니다.</p></div><button type="button" aria-label="창 닫기" className="rounded-xl p-2 text-muted hover:bg-[#F2F3F8]" onClick={onClose}><Icon name="x"/></button></div>
      <form onSubmit={submit} className="space-y-4">
        {!editing && <div><label htmlFor="catalog" className="form-label">샘플 교과목 빠른 입력 (선택)</label><select id="catalog" defaultValue="" onChange={e => addFromCatalog(e.target.value)} className="form-control"><option value="">직접 입력 또는 예시 선택</option>{catalog.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}</select></div>}
        <div className="grid gap-4 sm:grid-cols-2"><div><label className="form-label" htmlFor="course-code">교과목 코드 *</label><input required maxLength={28} id="course-code" className="form-control" value={form.code} onChange={e => update("code", e.target.value)} placeholder="DEMO-P201" /></div><div><label className="form-label" htmlFor="course-name">교과목명 *</label><input required maxLength={60} id="course-name" className="form-control" value={form.name} onChange={e => update("name", e.target.value)} placeholder="예시 과목명"/></div></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="form-label" htmlFor="course-credits">학점 *</label><input id="course-credits" className="form-control" type="number" min={1} max={6} step={1} required value={form.credits} onChange={e => update("credits", e.target.value)} /></div><div><label className="form-label" htmlFor="course-category">이수구분</label><select id="course-category" className="form-control" value={form.category} onChange={e => update("category", e.target.value as Category)}>{categories.map(c => <option key={c}>{c}</option>)}</select></div></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="form-label" htmlFor="course-term">수강학기 *</label><input id="course-term" required pattern="20[0-9]{2}-[12]" title="예: 2026-2" className="form-control" value={form.term} onChange={e => update("term", e.target.value)} placeholder="2026-2" /></div><div><label className="form-label" htmlFor="course-status">이수상태</label><select id="course-status" value={form.status} onChange={e => update("status", e.target.value as CourseStatus)} className="form-control">{statuses.map(s => <option key={s}>{s}</option>)}</select></div></div>
        {error && <p role="alert" className="rounded-xl bg-orange-50 px-3 py-2 text-[12px] font-semibold text-orange-700">{error}</p>}
        <div className="flex gap-3 pt-3"><button type="button" className="btn-secondary flex-1" onClick={onClose}>취소</button><button type="submit" className="btn-primary flex-[1.7]"><Icon name="check" size={17}/>{editing ? "변경사항 저장" : "목록에 추가"}</button></div>
      </form>
    </div>
  </div>;
}

export default function CoursesScreen() {
  const { courses, saveCourses, data, notify } = useDemo();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [editing, setEditing] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const completedCourses = courses.filter(c => c.status === "이수완료");
  const completedCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0);
  const shown = useMemo(() => courses.filter(c => (filter === "전체" || c.category === filter) && `${c.name} ${c.code}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())).sort((a, b) => b.term.localeCompare(a.term)), [courses, search, filter]);
  function save(course: Course) {
    saveCourses(editing ? courses.map(c => c.id === course.id ? course : c) : [course, ...courses]);
    setDialogOpen(false); setEditing(null); notify(editing ? "교과목이 수정되었습니다." : "새 교과목을 추가했습니다.");
  }
  function remove() { if (!deleteTarget) return; saveCourses(courses.filter(c => c.id !== deleteTarget.id)); setDeleteTarget(null); notify("교과목이 목록에서 삭제되었습니다."); }
  return <div className="space-y-6">
    <DemoNotice>이 목록은 <strong>CRUD 기능 시연용 일부 교과목</strong>이다. 아래 목록 합계는 표시된 과목에 한정되며, 홈·분석 화면의 고정 이수학점과 연동되지 않는다.</DemoNotice>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><Panel className="!p-4 sm:!p-5"><p className="text-[11px] font-semibold text-muted">등록된 과목</p><p className="mt-1 text-[25px] font-extrabold">{courses.length}<span className="ml-1 text-[12px] font-medium text-muted">개</span></p></Panel><Panel className="!p-4 sm:!p-5"><p className="text-[11px] font-semibold text-muted">이수완료 과목</p><p className="mt-1 text-[25px] font-extrabold">{completedCourses.length}<span className="ml-1 text-[12px] font-medium text-muted">개</span></p></Panel><Panel className="col-span-2 !p-4 sm:col-span-1 sm:!p-5"><p className="text-[11px] font-semibold text-muted">등록 목록 내 이수완료 학점</p><p className="mt-1 text-[25px] font-extrabold">{completedCredits}<span className="ml-1 text-[12px] font-medium text-muted">학점</span></p></Panel></div>
    <Panel><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-[17px] font-extrabold">나의 수강내역</h2><p className="mt-1 text-[12px] text-muted">검색·필터 및 추가·수정·삭제를 체험해 보세요</p></div><button type="button" className="btn-primary" onClick={() => { setEditing(null); setDialogOpen(true); }}><Icon name="plus" size={17}/>교과목 추가</button></div>
      <div className="flex flex-col gap-3 border-b border-[#EFF0F5] pb-5 sm:flex-row"><label className="relative min-w-0 flex-1"><span className="sr-only">과목명 또는 코드 검색</span><Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A3ACBD]"/><input className="form-control pl-10" value={search} onChange={e => setSearch(e.target.value)} placeholder="과목명 또는 코드 검색" /></label><label className="relative sm:w-[155px]"><span className="sr-only">이수구분 필터</span><select value={filter} onChange={e => setFilter(e.target.value)} className="form-control"><option>전체</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label></div>
      <div className="mt-1 divide-y divide-[#F0F1F5]">{shown.length ? shown.map(c => <div key={c.id} className="flex items-center gap-3 py-4 sm:gap-4"><span className="hidden h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[#F4F2FE] text-purple sm:grid"><Icon name="book-open" size={20}/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-[13px] font-extrabold sm:text-[14px]">{c.name}</h3><CategoryPill category={c.category}/></div><p className="mt-1.5 truncate text-[11px] text-muted">{c.code} · {c.term.replace("-", "학년도 ")}학기 · {c.credits}학점</p><p className={`mt-1 text-[11px] font-semibold ${c.status === "이수완료" ? "text-[#28935C]" : c.status === "수강중" ? "text-[#A57936]" : "text-muted"}`}>● {c.status}</p></div><div className="flex shrink-0 gap-1"><button type="button" aria-label={`${c.name} 수정`} title="수정" onClick={() => { setEditing(c); setDialogOpen(true); }} className="rounded-xl p-2.5 text-[#67758E] hover:bg-lavender hover:text-purple"><Icon name="pencil" size={17}/></button><button type="button" aria-label={`${c.name} 삭제`} title="삭제" onClick={() => setDeleteTarget(c)} className="rounded-xl p-2.5 text-[#8993A6] hover:bg-orange-50 hover:text-orange-600"><Icon name="trash" size={17}/></button></div></div>) : <EmptyState title="일치하는 교과목이 없습니다" detail="검색어 또는 이수구분 필터를 변경해 보세요"/>}</div>
    </Panel>
    {dialogOpen && <CourseEditor key={editing?.id ?? "new"} editing={editing ?? undefined} existing={courses} catalog={data.catalog} onClose={() => { setDialogOpen(false); setEditing(null); }} onSave={save} />}
    {deleteTarget && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#111C37]/55 p-5" role="presentation" onMouseDown={e => { if (e.currentTarget === e.target) setDeleteTarget(null); }}><div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-body" className="w-full max-w-sm rounded-[23px] bg-white p-6 shadow-float"><div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Icon name="trash" size={23}/></div><h2 id="delete-title" className="text-[18px] font-extrabold">교과목을 삭제할까요?</h2><p id="delete-body" className="mt-2 text-[13px] leading-relaxed text-muted"><strong>{deleteTarget.name}</strong> 과목을 목록에서 삭제합니다. 이 작업은 가상 판정 결과에 영향을 주지 않습니다.</p><div className="mt-6 flex gap-3"><button type="button" onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">취소</button><button type="button" onClick={remove} className="min-h-[44px] flex-1 rounded-xl bg-[#D85735] px-4 text-[13px] font-bold text-white hover:bg-[#C34424]">삭제</button></div></div></div>}
  </div>;
}
