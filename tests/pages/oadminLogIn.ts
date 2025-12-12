import { Page, expect } from '@playwright/test';


export class OadminLogin {
  constructor(private page: Page) {}


async assertLoaded(){
await this.page.waitForURL(/oadmin/i)
await expect(this.page).toHaveURL(/oadmin/i)

}

async enterLogInCredentials(){
  await this.page.getByLabel(/login id/i) .fill(process.env.LOGIN_ID!)
  await this.page.getByLabel(/password/i).fill(process.env.PASSWORD!)

}

async clickLogIn() {
    await (this.page.getByRole('button', {name: /log in/i})).click();
}












}