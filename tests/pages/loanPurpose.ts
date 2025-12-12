import { Page, expect } from '@playwright/test';
import { nextButton } from '../shared/controls';

export class LoanPurposePage {
constructor(private page: Page) {}
async assertLoaded() {
    await expect(this.page).toHaveURL(/Loan\/Purpose/i);
    await expect(this.page.getByRole('main').getByRole('heading', { name: /Tell us more about what you\'re looking for./i})).toBeVisible();

}
async noRefinance(){
   await (this.page.getByRole('radio',{name: 'No', exact: true})).click();
    
}
async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
}   







}
