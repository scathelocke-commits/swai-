export type Category = "전공필수" | "전공선택" | "교양" | "일반선택";
export type CourseStatus = "이수완료" | "수강중" | "수강예정";
export interface Student {
  name: string;
  studentIdLabel: string;
  entryYear: string;
  major: string;
  track: string;
  grade: string;
  semester: string;
}
export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  category: Category;
  term: string;
  status: CourseStatus;
}
export interface CatalogCourse { code: string; name: string; credits: number; category: Category }
export interface RequirementSection {
  id: "majorRequired" | "majorElective" | "general" | "other";
  label: string;
  credits: number;
  description: string;
  icon: string;
  color: string;
}
export interface Requirements {
  total: number;
  sections: RequirementSection[];
  mandatoryCourses: { code: string; name: string; credits: number }[];
  otherNotice: string[];
}
export interface Scenario {
  id: "partial" | "course" | "complete";
  name: string;
  shortName: string;
  title: string;
  subtitle: string;
  status: string;
  earned: number;
  missingCredits: number;
  unmetMandatory: string[];
  credits: Record<RequirementSection["id"], number>;
}
export interface RoadmapCourse extends CatalogCourse { reason: string; optional: boolean }
export interface SemesterPlan {
  id: string;
  title: string;
  subtitle: string;
  courses: RoadmapCourse[];
}
export interface DemoBundle {
  meta: { demo: boolean; institutionDisclaimer: string; analysisDisclaimer: string; roadmapDisclaimer: string };
  student: Student;
  requirements: Requirements;
  courses: Course[];
  catalog: CatalogCourse[];
  scenarios: Scenario[];
  roadmaps: Record<Scenario["id"], SemesterPlan[]>;
}
