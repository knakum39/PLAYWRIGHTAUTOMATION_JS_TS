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
   //or - We are waiting for the cards (at lesast one) to load
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
//Locator syntax(chaining locators)=> locator.nth(i).locator("text=element text")
            await products.nth(i).locator("text= Add To Cart").click();
            break;
      }
   }

   //The below 2 lines are added by Krishna
await page.locator("#toast-container").waitFor();
await page.locator(".ng-animating").waitFor({ state: "hidden" });

await page.locator("[routerlink*='cart']").click();

//for isVisible() no autowait mechnism by playwrigth-check official document
//so we need to use waitFor() method
await page.locator("div li").first().waitFor();

//identify locator based on only text => page.locator("text=elelemt text")
//identify locator based on text using has-text(Psyduo class)
//Syntx: page.locator("tagname:has-text('Locator text')")

const bool = await page.locator("h3:has-text('Zara Coat 3')").isVisible();
expect(bool).toBeTruthy();

await page.locator("button:has-text('Checkout')").click();
//CVV field
await page.locator(".field.small").nth(1).locator("input").fill("123");
//or await page.getByText('CVV Code').locator('..').locator('input').fill('123');
await page.getByText('Name on Card').locator('..').locator('input').fill('KN Shika');

//Select country drop-down (autosuggestive drop-down options)
//fill() method will enter all texts in once
//pressSequentially() method will enter text character by character
//Note:
/* await page.locator("[placeholder*='Country']").pressSequentially("ind");
This step may occasionally fail if the application server is slow due to heavy traffic. In such cases, you can introduce a delay and rewrite the step as:

await page.locator("[placeholder*='Country']").pressSequentially("ind", { delay: 150 });
Here, a delay of 150 milliseconds is introduced between each key press.
That means it enters  i → (delay 150 ms) → enters n → (delay 150 ms) → enters d

By doing this, you give the application enough time to respond with the relevant options. */

await page.locator("[placeholder*='Country']").pressSequentially("ind",{delay: 150});
const dropDown = await page.locator(".ta-results");
await dropDown.waitFor();
const optionCount = await dropDown.locator("button").count();
for(let i=0; i< optionCount; ++i)
   {
   const text = await dropDown.locator("button").nth(i).textContent();
   //if(text === "India")
   if(text.trim() == "India"){
      await dropDown.locator("button").nth(i).click();
      break;
   }
}

//Locate child element through parent =>  parent class [attribute='value'](of Child)
await expect (page.locator(".user__name [type='text']").first()).toHaveText(uemail);
await page.locator(".action__submit").click();
await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
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