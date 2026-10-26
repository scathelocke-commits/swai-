"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import base from "@/data/demo.json";
import type { Course, DemoBundle, Scenario, Student } from "@/lib/types";

const initial = base as DemoBundle;
const STUDENT_KEY = "graduation-demo.student.v1";
const COURSES_KEY = "graduation-demo.courses.v1";

type Connection = "checking" | "connected" | "offline";
interface DemoContextValue {
  data: DemoBundle;
  student: Student;
  courses: Course[];
  scenario: Scenario;
  scenarioId: Scenario["id"];
  connection: Connection;
  setScenarioId: (value: Scenario["id"]) => void;
  saveStudent: (value: Student) => void;
  saveCourses: (value: Course[]) => void;
  resetDemo: () => void;
  toast: string | null;
  notify: (text: string) => void;
  dismissToast: () => void;
}
const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DemoBundle>(initial);
  const [student, setStudent] = useState<Student>(initial.student);
  const [courses, setCourses] = useState<Course[]>(initial.courses);
  const [scenarioId, setScenarioId] = useState<Scenario["id"]>("partial");
  const [connection, setConnection] = useState<Connection>("checking");
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const notify = useCallback((message: string) => setToast(message), []);
  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    try {
      const storedStudent = window.localStorage.getItem(STUDENT_KEY);
      const storedCourses = window.localStorage.getItem(COURSES_KEY);
      if (storedStudent) {
        const parsed: unknown = JSON.parse(storedStudent);
        if (parsed && typeof parsed === "object" && "entryYear" in parsed && "major" in parsed && "track" in parsed) {
          setStudent({ ...initial.student, ...(parsed as Student) });
        }
      }
      if (storedCourses) {
        const parsed: unknown = JSON.parse(storedCourses);
        if (Array.isArray(parsed) && parsed.every((c) => c && typeof c === "object" && typeof c.id === "string" && typeof c.name === "string" && Number.isFinite(c.credits))) {
          setCourses(parsed as Course[]);
        }
      }
    } catch { /* Invalid browser storage is ignored; packaged demo remains available. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
      window.localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
    } catch { /* Private/incognito storage may be disabled. The UI still works in memory. */ }
  }, [student, courses, hydrated]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_DEMO_API_URL?.trim().replace(/\/$/, "");
    if (!apiUrl) { setConnection("offline"); return; }
    const controller = new AbortController();
    fetch(`${apiUrl}/api/demo`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("API unavailable");
        const body: { demo?: boolean; data?: DemoBundle } = await response.json();
        if (body.demo !== true || !body.data?.meta?.demo || !body.data?.scenarios?.length) throw new Error("Unexpected API data");
        setData(body.data);
        setConnection("connected");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setConnection("offline");
      });
    return () => controller.abort();
  }, []);

  const scenario = useMemo(() => data.scenarios.find((s) => s.id === scenarioId) ?? data.scenarios[0], [data, scenarioId]);
  const resetDemo = useCallback(() => {
    setStudent(initial.student);
    setCourses(initial.courses);
    setScenarioId("partial");
    try { window.localStorage.removeItem(STUDENT_KEY); window.localStorage.removeItem(COURSES_KEY); } catch { /* no-op */ }
    notify("데모 입력값이 초기화되었습니다.");
  }, [notify]);

  const value = useMemo(() => ({ data, student, courses, scenario, scenarioId, connection, setScenarioId, saveStudent: setStudent, saveCourses: setCourses, resetDemo, toast, notify, dismissToast }),
    [data, student, courses, scenario, scenarioId, connection, resetDemo, toast, notify, dismissToast]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("DemoProvider is required");
  return ctx;
}
