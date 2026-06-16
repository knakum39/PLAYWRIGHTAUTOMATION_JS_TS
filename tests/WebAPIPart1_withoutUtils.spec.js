// ======================================================
// Import Playwright modules
// ======================================================

const { test, expect, request } = require("@playwright/test");


// ======================================================
// Global variables
// These values will be populated in beforeAll()
// and reused across tests.
// ======================================================

let token;
let orderID;


// ======================================================
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

test("Verify Login API", async () => {
  expect(token).toBeTruthy();
});


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

test.beforeAll(async () => {

  // Create API request context
  const apiContext = await request.newContext();

  // ======================================================
  // LOGIN API CALL
  // ======================================================

  const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: loginPayLoad
    }
  );

  // Verify login request succeeded
  expect(loginResponse.ok()).toBeTruthy();

  // Convert API response into JSON object
  const loginResponseJson = await loginResponse.json();

  // Extract token from login response
  token = loginResponseJson.token;

  // Print token in console
  console.log(token);


  // ======================================================
  // CREATE ORDER API CALL
  // ======================================================

  const orderResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
      data : orderPayLoad,
      headers : {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    }
  );

  // Convert order response into JSON object
  const orderResponseJson = await orderResponse.json();

  // Extract first order ID from orders array
  orderID = orderResponseJson.orders[0];

  // Print order ID in console
  console.log(orderID);

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

  //const orderID = createOrder();

  page.addInitScript(value =>
  {
    window.localStorage.setItem('token', value);
  },
  token ); // token is the actual value you want


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
    if(orderID.includes(rowOrderId))
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

  expect(orderID.includes(orderIdDetails)).toBeTruthy();


  // ======================================================
  // Static wait (mainly for observation/debugging)
  // ======================================================

  await page.waitForTimeout(3000);

});