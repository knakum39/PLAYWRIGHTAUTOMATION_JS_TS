const {test, expect} = require('@playwright/test');
const { log } = require('node:console');
const { text } = require('node:stream/consumers');

//Syntax in JS
/* test('First Playwright test',async function()
{

}); */

//Fixtures => global variable that are available across your project
test('Browser Context Playwright test',async ({browser})=>
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

    //console.log(await page.locator("[style*='block']").inputValue());
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

test('UI Controls',async ({page})=>
{

      await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
          const userName = await page.locator("#username");
          const signIN =  await page.locator("#signInBtn");

          //Blinking text
          const documentLink = page.locator("[href*='documents-request']");

          //2nd blinking text
          const getshortlistLink = page.locator("[href*='techsmarthire']");

          //Static drop-down
          const dropdown = await page.locator("select.form-control");
          await dropdown.selectOption("Consultant");
    // To see result add the following line...
    //Once we put assertion we don't need to add page.pause()
           //await page.pause();

           //Radio button
           const radiobtn = await page.locator(".radiotextsty").last();
           await radiobtn.click();
           await expect(page.locator(".radiotextsty").last()).toBeChecked();
           //console.log(page.locator(".radiotextsty").last().isChecked());
           await page.locator("#okayBtn").click();

           await page.locator('#terms').click();
           await expect(page.locator('#terms')).toBeChecked();
           await page.locator('#terms').uncheck();
            expect(await page.locator('#terms').isChecked()).toBeFalsy();

            await expect(documentLink).toHaveAttribute("class","blinkingText");
});

test.only('Child Windows handle',async ({browser})=>
{
     const context = await browser.newContext();
     const page = await context.newPage();
     await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
     //Blinking text
     const documentLink = page.locator("[href*='documents-request']");
     const userName = await page.locator("#username");

    //This block make sure that both condition mentioned in the block are fulfilled 
    //then only perform next step execution
    //When want to make multiple steps to execute parellay in synchronous mannner?: use Promise.all block 
    const [newPage] = await Promise.all(
        [
    context.waitForEvent('page'),//listen for any new page
    documentLink.click()// new page is opened

        ])// new page is opened

    const newtext = await newPage.locator(".red").textContent();
    const arrayText = newtext.split("@");
    const domain = arrayText[1].split(" ")[0];
    //console.log(domain);

    await page.locator("#username").fill(domain);
    console.log(await page.locator("#username").inputValue());
      await page.pause();

      //.textContent() method return text only when the texts of elements are attached to the DOM.

      //.inputValue() method used to grab the runtime entered text..
});