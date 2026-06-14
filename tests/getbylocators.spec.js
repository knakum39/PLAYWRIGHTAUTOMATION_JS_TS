import {test,expect} from "playwright/test";

test('Playwright special locators', async ({page})=> {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("Kina342Swami");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link",{name : "Shop"}).click();
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();

    //Debugging -> codegen tool(use below command)
    //npx playwright test getbylocators.spec.js --headed --debug
    //await page.pause();

    //Codegen is one of the keyword to launch playwright inspector in record and playback mode.
    //Everything happens with the Playwright inspector.
    //npx playwright codegen URL of your website.
    



});