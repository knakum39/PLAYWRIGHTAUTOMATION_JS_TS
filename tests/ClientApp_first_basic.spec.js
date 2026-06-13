const {test,expect, browser} = require('@playwright/test');
//import {test,expect} from "@playwright/test"; TS

test('E2E add to card flow', async ({browser,})=>{

   const uemail = "anshika@gmail.com";
   const productName = "ZARA COAT 3";   

   const context = await browser.newContext();
   const page = await context.newPage();
    const products = page.locator('.card-body');

   await page.goto("https://rahulshettyacademy.com/client");

   await page.locator("#userEmail").fill(uemail);
   await page.locator("#userPassword").fill("Iamking@000");
   await page.locator('#login').click();
   //await page.locator('[name="login"]').click();

   await page.waitForLoadState("networkidle")
   //or
   await page.locator(".card-body b").first().waitFor();

   const title = await products.allTextContents();
   //JS is case sensitive language so use the camelcasing only...
   console.log(title);
   const count = await products.count();

   //await page.waitForTimeout(4000);

  for(let i=0; i < count; i++)
   {
      if(await products.nth(i).locator('b').textContent() == productName)
         {
//Write logic to add to cart
            await products.nth(i).locator("text=Add To Cart").click();
            break;
      }
   }
await page.waitForTimeout(3000);

});