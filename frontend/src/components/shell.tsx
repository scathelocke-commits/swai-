"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/context/demo-context";
import { navItems, pageDescriptions } from "@/lib/helpers";
import { Icon } from "@/components/ui";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const page = pageDescriptions[path] ?? pageDescriptions["/"];
  const { student, connection, toast, dismissToast } = useDemo();
  return <div className="min-h-screen bg-canvas text-ink lg:flex">
    <aside className="hidden w-[256px] shrink-0 flex-col bg-navy px-5 py-8 text-white lg:flex lg:sticky lg:top-0 lg:h-screen">
      <Link href="/" className="flex items-center gap-3 px-3"><span className="grid h-11 w-11 place-items-center rounded-[15px] bg-white/15"><Icon name="graduation" size={24}/></span><span><span className="block text-[17px] font-extrabold leading-tight tracking-tight">그라드패스</span><span className="mt-0.5 block text-[10px] font-semibold tracking-[0.15em] text-[#ADBDE3]">GRADPATH DEMO</span></span></Link>
      <div className="mb-4 mt-11 px-3 text-[10px] font-bold tracking-[0.18em] text-[#91A4D0]">WORKSPACE</div>
      <nav aria-label="주요 메뉴" className="flex flex-col gap-1.5">{navItems.map(item => <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-[12px] px-3.5 py-3 text-sm font-semibold transition ${path === item.href ? "bg-white/16 text-white" : "text-[#B8C8EB] hover:bg-white/10 hover:text-white"}`}><Icon name={item.icon} size={19} />{item.label}</Link>)}
      <Link href="/profile" className={`mt-1 flex items-center gap-3 rounded-[12px] px-3.5 py-3 text-sm font-semibold transition ${path === "/profile" ? "bg-white/16 text-white" : "text-[#B8C8EB] hover:bg-white/10 hover:text-white"}`}><Icon name="settings-2" size={19}/>학적정보 설정</Link></nav>
      <div className="mt-auto rounded-[18px] border border-white/15 bg-white/5 px-4 py-4"><div className="mb-2 flex items-center gap-2 text-xs font-bold"><Icon name="shield" size={16}/>시연용 웹사이트</div><p className="text-[11px] leading-relaxed text-[#B8C8EB]">실제 학사시스템과 연결되지 않은 교육용 인터랙티브 목업입니다.</p></div>
    </aside>

    <div className="min-w-0 flex-1">
      <header className="relative overflow-hidden bg-navy text-white lg:bg-white lg:text-ink lg:border-b lg:border-[#ECEEF4]">
        <div className="pointer-events-none absolute -right-12 -top-24 h-60 w-60 rounded-full bg-white/[0.035] lg:hidden" />
        <div className="mx-auto flex min-h-[116px] max-w-[1140px] items-center justify-between gap-4 px-5 pb-6 pt-7 sm:px-8 lg:min-h-[104px] lg:px-10 lg:py-5">
          <div className="min-w-0"><div className="mb-2 flex items-center gap-2 lg:hidden"><span className="grid h-7 w-7 place-items-center rounded-[9px] bg-white/15"><Icon name="graduation" size={18} /></span><span className="text-[12px] font-extrabold tracking-wide">그라드패스</span><span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wider">DEMO</span></div><h1 className="truncate text-[23px] font-extrabold tracking-[-0.05em] lg:text-[25px]">{page.title}</h1><p className="mt-1 text-[12px] text-[#C9D5F3] lg:text-muted lg:text-[13px]">{page.description}</p></div>
          <Link href="/profile" aria-label="학적정보 설정으로 이동" className="flex shrink-0 items-center gap-3 rounded-full bg-white/10 px-2 py-2 transition hover:bg-white/20 lg:bg-[#F5F6FC] lg:hover:bg-[#EBEEFA] lg:pr-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#A499EF] to-[#6A5CC2] text-[13px] font-bold text-white">홍</span><span className="hidden text-left lg:block"><span className="block text-xs font-bold">{student.name}</span><span className="block text-[10px] text-muted">데모 사용자</span></span></Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-[1140px] px-4 pb-32 pt-6 sm:px-8 md:pt-8 lg:px-10 lg:pb-16">{children}</main>
      <nav aria-label="하단 주요 메뉴" className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch justify-around border-t border-[#ECEDF4] bg-white/95 px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-8px_26px_rgba(35,46,86,0.045)] backdrop-blur-md lg:hidden">
        {navItems.map(item => <Link key={item.href} href={item.href} className={`flex min-h-[54px] min-w-0 flex-1 flex-col items-center justify-center gap-[4px] rounded-xl px-0.5 text-[10px] font-semibold transition ${path === item.href ? "text-[#6E5DC8]" : "text-[#8B93A7]"}`} aria-current={path === item.href ? "page" : undefined}><span className={path === item.href ? "rounded-xl bg-lavender px-3 py-1" : "px-3 py-1"}><Icon name={item.icon} size={20}/></span><span>{item.label}</span></Link>)}
      </nav>
      <div className="fixed bottom-[90px] right-4 z-30 hidden items-center gap-2 rounded-full border border-[#E7EAF4] bg-white px-3 py-2 text-[11px] text-muted shadow-card sm:flex lg:bottom-5"><span className={`h-2 w-2 rounded-full ${connection === "connected" ? "bg-green-500" : connection === "checking" ? "bg-amber-400" : "bg-[#A4ACC0]"}`}/>{connection === "connected" ? "데모 API 연결됨" : connection === "checking" ? "API 확인 중" : "내장 데모 데이터 사용"}</div>
      {toast && <div role="status" className="fixed bottom-[98px] left-1/2 z-50 flex w-[min(92vw,380px)] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-[#233761] px-4 py-3 text-[13px] font-semibold text-white shadow-float lg:bottom-7"><div className="flex items-center gap-2"><Icon name="check-circle" size={17}/>{toast}</div><button type="button" onClick={dismissToast} aria-label="알림 닫기" className="rounded-lg p-1 hover:bg-white/10"><Icon name="x" size={16}/></button></div>}
    </div>
  </div>;
}
