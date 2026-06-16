const {test,expect, browser} = require('@playwright/test');
//import {test,expect} from "@playwright/test"; TS

test('E2E add to card flow', async ({browser,})=>{

   //const uemail = "anshika@gmail.com";
   const uemail = "vani39@yopmail.com";
   const uPassword = "Login12*"
   const productName = "ZARA COAT 3";   

   const context = await browser.newContext();
   const page = await context.newPage();
    const products = page.locator('.card-body');

   await page.goto("https://rahulshettyacademy.com/client");

   await page.getByPlaceholder("email@example.com").fill(uemail);
   await page.getByPlaceholder("enter your passsword").fill(uPassword);
   await page.getByRole('button', {name : "Login"}).click();

   await page.waitForLoadState("networkidle")
   //or
   await page.locator(".card-body b").first().waitFor();

   await page.locator(".card-body ").filter({hasText:"ZARA COAT 3"})
   .getByRole("button",{name:"Add to Cart"}).click(); 

   await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click(); 

//for isVisible() no autowait mechnism by playwrigth-check official document
//so we need to use waitFor() method
await page.locator("div li").first().waitFor();

//identify locator based on only text => page.locator("text=elelemt text")
//identify locator based on text using has-text(Psudo class)
//Syntx: page.locator("tagname:has-text('Locator text')")

await expect(page.getByText("ZARA COAT 3")).toBeVisible();
await page.getByRole("button", {name: 'Checkout'}).click();

//CVV field
await page.locator(".field.small").nth(1).locator("input").fill("123");
//or await page.getByText('CVV Code').locator('..').locator('input').fill('123');
await page.getByText('Name on Card').locator('..').locator('input').fill('KN Shika');

//Select country drop-down (autosuggestive drop-down options)
await page.getByPlaceholder("Select Country").pressSequentially("ind");

await page.getByRole("button",{name: "India"}).nth(1).click();

await page.getByText("PLACE ORDER").click();

await expect(page.getByText(" Thankyou for the order.")).toBeVisible();

//Parent class child class
const orderID = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
console.log(orderID);

//await page.locator("[routerlink*='/myorders']").first().click();
//or tagname[attribute='value']
await page.locator("button[routerlink*='myorders']").click();
await page.locator("tbody").waitFor();
const rows = await page.locator("tbody tr");
const orderCount = await rows.count();

for(let i = 0; i < orderCount; ++i)
{
   const rowOrderId = await rows.nth(i).locator("th").textContent();

   if(orderID.includes(rowOrderId))
   {
      await Promise.all([
         page.waitForLoadState('networkidle'),
         rows.nth(i).locator("button").first().click()
      ]);

      break;
   }
}
   await page.locator(".col-text").waitFor();
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderID.includes(orderIdDetails)).toBeTruthy();

await page.waitForTimeout(3000);
});