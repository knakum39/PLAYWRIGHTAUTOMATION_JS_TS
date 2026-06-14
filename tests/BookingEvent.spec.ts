import { test, expect, Page } from "@playwright/test"
//this statement imports 3 things from the Playwright library
//Page is a TypeScript type. A Page represents a browser tab.

//const {test, expect} = require ('@playwright/test')

test("Booking Event", async ({ page }) => {
  await login(page);
});

    const BASE_URL = "https://eventhub.rahulshettyacademy.com";

    // Create your own credentials
    const USER_EMAIL = "krishna39@yopmail.com";
    const USER_PASSWORD = "Login12*";

async function login(page: Page) {
  //page: Page means "The variable page must be a Playwright Page object."
    await page.goto(`${BASE_URL}/login`); 
    //`${BASE_URL}/login` means => 'BASE_URL + "/login"'
    await page.getByPlaceholder("you@email.com").fill(USER_EMAIL);
    await page.getByLabel(/Password/i).fill(USER_PASSWORD);
    await page.locator("#login-btn").click();

  await expect(
    page.locator('span.inline-flex').first()
  ).toBeVisible();
}

/* test()
  |
  |
  ---> login(page)
          |
          |--> goto login page
          |--> enter email
          |--> enter password
          |--> click login
          |
          <--- return
  |
  ---> continue test */
