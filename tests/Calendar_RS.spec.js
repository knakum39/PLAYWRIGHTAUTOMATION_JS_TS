const {test,expect} = require("playwright/test");

test("Calendar validations", async ({page})=>
{
const monthNumber = "6";
const date = "15";
const year = "2027";
const expectedList = [monthNumber, date, year];

await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

await page.locator(".react-date-picker__inputGroup").click();
await page.locator(".react-calendar__navigation__label").click();
await page.locator(".react-calendar__navigation__label").click();

//Select Year
await page.getByText(year).click();

//Select Month
await page
  .locator(".react-calendar__year-view__months__month")
  .nth(Number(monthNumber) - 1)
  .click();

// Select day
await page.locator(`//abbr[text()='${date}']`).click();
//await page.locator("//abbr[text()='" + date + "']").click();
//await page.locator("//abbr[text()='15']").click();

//Assertion on selected Date
const inputs = await page.locator(".react-date-picker__inputGroup__input");

for(let i=0; i<expectedList.length; i++)
{
    const value = await inputs.nth(i).inputValue();
    expect(value).toEqual(expectedList[i]);
    console.log(`Actual: ${value}, Expected: ${expectedList[i]}`);
}

await page.waitForTimeout(3000);
})