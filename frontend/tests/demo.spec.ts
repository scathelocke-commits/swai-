import { test, expect } from "@playwright/test";

test("six screens render and navigation works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "홈 대시보드" })).toBeVisible();
  for (const [route, title] of [
    ["/profile", "학적정보 설정"], ["/requirements", "개인별 졸업요건"],
    ["/courses", "수강내역 관리"], ["/analysis", "졸업요건 분석"],
    ["/roadmap", "학기별 수강 로드맵"]
  ]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: title }).first()).toBeVisible();
  }
});

test("profile selection persists in localStorage after reload", async ({ page }) => {
  await page.goto("/profile");
  await page.locator("#field-major").selectOption("화학과");
  await page.getByRole("button", { name: "학적정보 저장" }).click();
  await page.reload();
  await expect(page.locator("#field-major")).toHaveValue("화학과");
});

test("course add, edit, filter and deletion", async ({ page }) => {
  await page.goto("/courses");
  await page.getByRole("button", { name: "교과목 추가" }).click();
  await page.locator("#course-code").fill("DEMO-TEST9");
  await page.locator("#course-name").fill("임시 테스트 강좌");
  await page.locator("#course-term").fill("2027-1");
  await page.getByRole("button", { name: "목록에 추가" }).click();
  await expect(page.getByRole("heading", { name: "임시 테스트 강좌" })).toBeVisible();
  await page.getByPlaceholder("과목명 또는 코드 검색").fill("임시 테스트");
  await page.getByRole("button", { name: "임시 테스트 강좌 수정" }).click();
  await page.locator("#course-name").fill("수정한 테스트 강좌");
  await page.getByRole("button", { name: "변경사항 저장" }).click();
  await page.getByPlaceholder("과목명 또는 코드 검색").fill("수정한 테스트");
  await expect(page.getByRole("heading", { name: "수정한 테스트 강좌" })).toBeVisible();
  await page.getByRole("button", { name: "수정한 테스트 강좌 삭제" }).click();
  await page.getByRole("button", { name: "삭제", exact: true }).click();
  await expect(page.getByText("일치하는 교과목이 없습니다")).toBeVisible();
});

test("three demo scenarios switch and roadmap accordions work", async ({ page }) => {
  await page.goto("/analysis");
  await expect(page.getByText("졸업까지 14학점 남았어요")).toBeVisible();
  await page.getByRole("button", { name: /SCENARIO 2/ }).click();
  await expect(page.getByText("학점은 충족했지만 확인이 필요해요")).toBeVisible();
  await page.getByRole("button", { name: /SCENARIO 3/ }).click();
  await expect(page.getByText("예시 졸업요건을 모두 충족했어요")).toBeVisible();
  await page.goto("/roadmap");
  await page.getByRole("button", { name: /2027학년도 2학기/ }).first().click();
  await expect(page.getByText("추가 경험을 위한 선택 예시")).toBeVisible();
});
