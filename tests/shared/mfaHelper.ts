// tests/helpers/mfaHelper.ts
import { Page, Locator } from "@playwright/test";

export type MfaMode = "loan" | "membership";

export type MfaElements = {
  dialog: Locator;
  passcodeInput: Locator;
  submitButton: Locator;
};

export function getMfaElements(page: Page, mode: MfaMode): MfaElements {
  if (mode === "loan") {
    const dialog = page.getByRole("dialog", {
      name: /Verify your Phone Number/i,
    });

    const passcodeInput = dialog.getByLabel(/Enter Passcode/i);
    const submitButton = dialog.getByRole("button", {
      name: /Submit Passcode/i,
    });

    return { dialog, passcodeInput, submitButton };
  }

  // mode === 'membership'
  const dialog = page.locator("#mfa-modal");
  const passcodeInput = page.locator("#multifactor-passcode-text");
  const submitButton = dialog.getByRole("button", {
    name: /Submit Passcode/i,
  });

  return { dialog, passcodeInput, submitButton };
}
