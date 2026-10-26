"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useDemo } from "@/context/demo-context";
import { DemoNotice, Icon, Panel, Pill, SectionTitle } from "@/components/ui";
import type { Student } from "@/lib/types";

const options = {
  entryYear: ["2021", "2022", "2023", "2024", "2025", "2026"],
  major: ["물리학과", "수학과", "화학과", "컴퓨터공학과", "경영학과"],
  track: ["단일전공", "복수전공", "부전공", "미설정"],
  grade: ["1", "2", "3", "4", "5"],
  semester: ["1", "2"]
};
export default function ProfileScreen() {
  const { student, saveStudent, notify, resetDemo, connection } = useDemo();
  const [draft, setDraft] = useState<Student>(student);
  useEffect(() => setDraft(student), [student]);
  const changed = Object.keys(options).some(k => draft[k as keyof Student] !== student[k as keyof Student]);
  function save(e: FormEvent<HTMLFormElement>) { e.preventDefault(); saveStudent(draft); notify("학적정보가 브라우저에 저장되었습니다."); }
  const fields: { id: keyof typeof options; title: string; desc?: string }[] = [
    { id: "entryYear", title: "입학연도" }, { id: "major", title: "소속 학과" }, { id: "track", title: "다전공 유형" },
    { id: "grade", title: "현재 학년" }, { id: "semester", title: "현재 학기" }
  ];
  return <div className="space-y-6">
    <DemoNotice>학적정보는 입력·수정·저장할 수 있으나, <strong>졸업요건이나 판정 결과는 변경되지 않는다.</strong> 실제 개인정보 대신 가상의 선택지만 이용한다.</DemoNotice>
    <div className="grid gap-5 xl:grid-cols-[1.5fr_0.7fr]">
      <Panel><SectionTitle title="기본 학적정보" subtitle="입력값은 현재 브라우저의 localStorage에만 보관됩니다"/>
        <form onSubmit={save} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="student-name" className="form-label">사용자 이름 (데모)</label><input id="student-name" className="form-control bg-[#F9FAFC]" value={draft.name} readOnly/><p className="mt-1.5 text-[11px] text-muted">실제 신원정보는 입력받지 않습니다.</p></div>
          <div><label htmlFor="student-label" className="form-label">학번 표기 (자동)</label><input id="student-label" className="form-control bg-[#F9FAFC]" value={`${draft.entryYear}학번`} readOnly/></div></div>
          <div className="grid gap-4 sm:grid-cols-2">{fields.map(field => <div key={field.id}><label className="form-label" htmlFor={`field-${field.id}`}>{field.title}</label><select id={`field-${field.id}`} value={draft[field.id]} onChange={e => setDraft(s => ({ ...s, [field.id]: e.target.value, ...(field.id === "entryYear" ? { studentIdLabel: `${e.target.value}학번` } : {}) }))} className="form-control"><option value="" disabled>선택해주세요</option>{options[field.id].map(v => <option key={v} value={v}>{field.id === "grade" ? `${v}학년` : field.id === "semester" ? `${v}학기` : field.id === "entryYear" ? `${v}학년도` : v}</option>)}</select></div>)}</div>
          <div className="flex flex-wrap items-center gap-3 border-t border-[#F0F1F6] pt-5"><button type="submit" className="btn-primary"><Icon name="check" size={17}/>학적정보 저장</button><Link href="/" className="btn-secondary"><Icon name="left" size={17}/>홈으로 돌아가기</Link>{changed && <span className="text-xs font-semibold text-orange-600">저장하지 않은 변경사항</span>}</div>
        </form>
      </Panel>
      <div className="space-y-5"><Panel><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-lavender text-purple"><Icon name="graduation" size={24}/></span><div><p className="text-sm font-bold">데모 학생 프로필</p><p className="mt-1 text-[11px] text-muted">가상 인물 · 신원확인 없음</p></div></div><div className="mt-5 space-y-3 border-t border-[#F1F2F7] pt-4 text-[12px]">{[["입학연도", `${student.entryYear}학년도`], ["학과", student.major], ["전공유형", student.track], ["재학정보", `${student.grade}학년 ${student.semester}학기`]].map(([key, value]) => <div key={key} className="flex justify-between gap-3"><span className="text-muted">{key}</span><strong className="text-right text-[#34415C]">{value}</strong></div>)}</div><div className="mt-5"><Pill>{connection === "connected" ? "FastAPI 데모 연결됨" : "내장 JSON 데모 모드"}</Pill></div></Panel>
      <Panel><h3 className="text-[14px] font-bold">데모 입력값 초기화</h3><p className="mt-2 text-[12px] leading-relaxed text-muted">저장한 학적정보와 수강내역을 모두 최초 예시값으로 되돌립니다.</p><button type="button" className="btn-secondary mt-4 w-full" onClick={() => { resetDemo(); }}><Icon name="reset" size={16}/>예시 데이터로 초기화</button></Panel></div>
    </div>
  </div>;
}
