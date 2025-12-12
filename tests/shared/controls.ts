// tests/shared/controls.ts
import { Page } from "@playwright/test";

export function nextButton(page: Page) {
  return page
    .getByRole("main")
    .getByRole("button", {
      name: /^(Next|Get Started|Submit Application|Log in)$/i,
    });
  //.or(page.locator('#wf-nxt-btn'))
}
