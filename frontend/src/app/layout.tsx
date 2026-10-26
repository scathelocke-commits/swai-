import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/context/demo-context";
import { AppShell } from "@/components/shell";
export const metadata: Metadata = {
  title: "그라드패스 | 졸업요건 관리 데모",
  description: "실제 대학 학사규정과 무관한 교육용 졸업요건 관리 인터랙티브 목업",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><DemoProvider><AppShell>{children}</AppShell></DemoProvider></body></html>;
}
