// ======================================================
// Import Playwright modules
// ======================================================

const { test, expect, request } = require("@playwright/test");

const {APIUtils} = require('./utils/APIUtils'); //import APIUtils class to eligible to access it's all details

// ======================================================
// Global variables
// These values will be populated in beforeAll()
// and reused across tests.
// ======================================================
let token;
let orderID;

//* * // ======================================================
// Login API Request Payload
// Used for authentication API call.
// ======================================================

const loginPayLoad = {
  userEmail: "vani39@yopmail.com",
  userPassword: "Login12*"
};

// ======================================================
// Create Order API Request Payload
// Used for order creation API call.
// ======================================================

const orderPayLoad = {
    orders:[{
            country: "Cuba",
            productOrderedId: "6960eac0c941646b7a8b3e68"
    }]
}; 

// ======================================================
// Test 1
// Verify Login API generated a valid token.
// Token is created in beforeAll().
// ======================================================

/* test("Verify Login API", async () => {
  expect(token).toBeTruthy();
});
 */

// ======================================================
// beforeAll Hook
//
// Runs once before all tests.
//
// Flow:
// 1. Login via API
// 2. Extract authentication token
// 3. Create order via API
// 4. Extract order ID
//
// This avoids creating orders through UI every time.
// ======================================================
let response;
test.beforeAll(async () => {

  // Create API request context - This is created in the actual test.
  const apiContext = await request.newContext();
 // We are passing this as constructor parameter of APIUtils.
  const apiUtils = new APIUtils(apiContext,loginPayLoad);// Object of APIUtils class
  response = await apiUtils.createOrder(orderPayLoad);

}); // closes beforeAll

// ======================================================
// Test 2
// Verify order created via API is visible in UI.
//
// Flow:
// 1. Inject token into Local Storage
// 2. Open application
// 3. Navigate to Orders page
// 4. Search for created order
// 5. Open order details
// 6. Validate order ID
// ======================================================

test('Place the order', async ({page}) =>
{
  // ======================================================
  // Inject authentication token into browser localStorage
  // before page loads.
  //
  // This bypasses UI login completely.
  // ======================================================



  page.addInitScript(value =>
  {
    window.localStorage.setItem('token', value);
  },
  response.token ); // token is the actual value you want


  // ======================================================
  // Launch application
  // ======================================================

  await page.goto("https://rahulshettyacademy.com/client");


  // ======================================================
  // Navigate to My Orders page
  // ======================================================

  await page.locator("button[routerlink*='myorders']").click();


  // ======================================================
  // Wait for orders table to load
  // ======================================================

  await page.locator("tbody").waitFor();


  // Get all order rows from table
  const rows = await page.locator("tbody tr");


  // Count total rows
  const orderCount = await rows.count();


  // ======================================================
  // Loop through all orders
  // Find the order created through API
  // ======================================================

  for(let i = 0; i < orderCount; ++i)
  {
    // Read Order ID from current row
    const rowOrderId =
      await rows.nth(i).locator("th").textContent();

    // Compare UI Order ID with API Order ID
    if(response.orderID.includes(rowOrderId))
    {
      // ==================================================
      // Open matching order details page
      //
      // Promise.all ensures click and page/network wait
      // happen simultaneously.
      // ==================================================

      await Promise.all([
        page.waitForLoadState('networkidle'),
        rows.nth(i).locator("button").first().click()
      ]);

      break;
    }
  }


  // ======================================================
  // Wait for Order Details page to load
  // ======================================================

  await page.locator(".col-text").waitFor();


  // Read Order ID displayed in details page
  const orderIdDetails =
    await page.locator(".col-text").textContent();


  // ======================================================
  // Pause execution for debugging
  // Opens Playwright Inspector
  // ======================================================

  await page.pause();


  // ======================================================
  // Validate Order ID from Details page
  // matches Order ID created through API
  // ======================================================

  expect(response.orderID.includes(orderIdDetails)).toBeTruthy();


  // ======================================================
  // Static wait (mainly for observation/debugging)
  // ======================================================

  await page.waitForTimeout(3000);

});