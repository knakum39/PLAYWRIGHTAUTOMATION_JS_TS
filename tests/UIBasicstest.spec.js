const {test, expect} = require('@playwright/test');
const { log } = require('node:console');

//Syntax in JS
/* test('First Playwright test',async function()
{

}); */

//Fixtures => global variable that are available across your project
test.only('Browser Context Playwright test',async ({browser})=>
{
    //chrome - plugins /cookies
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const pagetitle = await page.title();
    console.log(pagetitle);

    const userName = await page.locator("#username");
    await userName.fill("rahulshettyacademy");

    const password = await page.locator("[type='password']");
    await password.fill("Learning@830$3mK2");

    const signIN =  await page.locator("#signInBtn");
    await signIN.click();

    //console.log(await page.locator("[style*='block']").textContent());
    //await expect(page.locator("[style*='block']")).toContainText('Incorrect');

   const cardText = await page.locator(".card-body a").nth(0).textContent();
   //const cardText = await page.locator(".card-body a").first().textContent();
   //const cardText = await page.locator(".card-body a").last().textContent();
    console.log(cardText);

});

test('Page Playwright test',async ({page})=>
{
    await page.goto("https://google.com");
    //get title - assertion
const pagetitle = await page.title();
console.log(pagetitle);
await expect(page).toHaveTitle("Google");


});