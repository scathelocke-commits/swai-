import type { Category } from "@/lib/types";

export const navItems = [
  { href: "/", label: "홈", icon: "house" },
  { href: "/requirements", label: "졸업요건", icon: "clipboard-list" },
  { href: "/courses", label: "수강내역", icon: "book-open" },
  { href: "/analysis", label: "졸업분석", icon: "chart-no-axes-column" },
  { href: "/roadmap", label: "로드맵", icon: "map" },
] as const;

export const pageDescriptions: Record<string, { title: string; description: string }> = {
  "/": { title: "홈 대시보드", description: "나의 졸업 준비 현황을 확인해요" },
  "/profile": { title: "학적정보 설정", description: "기본 정보를 입력하고 저장해요" },
  "/requirements": { title: "개인별 졸업요건", description: "가상의 졸업규정을 영역별로 살펴봐요" },
  "/courses": { title: "수강내역 관리", description: "예시 교과목을 추가하고 관리해요" },
  "/analysis": { title: "졸업요건 분석", description: "세 가지 가상 판정 시나리오를 체험해요" },
  "/roadmap": { title: "학기별 수강 로드맵", description: "예시 학기별 학습계획을 살펴봐요" },
};

export const palette: Record<string, { bar: string; bg: string; text: string }> = {
  violet: { bar: "#7968D6", bg: "#F1EEFF", text: "#6C59C6" },
  indigo: { bar: "#5870D5", bg: "#EDF1FF", text: "#4F65BF" },
  sky: { bar: "#39A4CA", bg: "#E8F8FE", text: "#1681A8" },
  amber: { bar: "#F0A44D", bg: "#FFF4E6", text: "#CB8130" },
};
export const categoryColors: Record<Category, { background: string; color: string }> = {
  "전공필수": { background: "#F0EDFF", color: "#6B5AC5" },
  "전공선택": { background: "#EDF1FF", color: "#536AC8" },
  "교양": { background: "#E8F8FE", color: "#1580A7" },
  "일반선택": { background: "#FFF2E2", color: "#C1812E" },
};
export const percent = (earned: number, required: number) => Math.min(100, Math.max(0, Math.round((earned / Math.max(required, 1)) * 100)));
