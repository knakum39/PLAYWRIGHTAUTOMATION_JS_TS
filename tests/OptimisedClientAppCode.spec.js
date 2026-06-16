const { test, expect } = require('@playwright/test');

test('E2E Order Placement Flow', async ({ browser }) => {

    // ==========================
    // Test Data
    // ==========================
    const email = "anshika@gmail.com";
    const productName = "ZARA COAT 3";

    // ==========================
    // Browser Setup
    // ==========================
    const context = await browser.newContext();
    const page = await context.newPage();

    // ==========================
    // Login
    // ==========================
    await page.goto("https://rahulshettyacademy.com/client");

    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("#login").click();

    // Wait until products are loaded
    await page.locator(".card-body b").first().waitFor();

    // ==========================
    // Find Product & Add to Cart
    // ==========================
    const products = page.locator(".card-body");
    const productCount = await products.count();

    for (let i = 0; i < productCount; i++) {

        const currentProduct =
            await products.nth(i).locator("b").textContent();

        if (currentProduct?.trim() === productName) {

            await products
                .nth(i)
                .locator("text= Add To Cart")
                .click();

            break;
        }
    }

    // Wait for success toast message
    await page.locator("#toast-container").waitFor();

    // Wait until loading spinner disappears
    await page.locator(".ng-animating").first()
        .waitFor({ state: "hidden" });

    // ==========================
    // Navigate to Cart
    // ==========================
    await page.locator("[routerlink*='cart']").click();

    await page.locator("div li").first().waitFor();

    // Verify product exists in cart
    await expect(
        page.locator(`h3:has-text("${productName}")`)
    ).toBeVisible();

    // ==========================
    // Checkout
    // ==========================
    await page.locator("button:has-text('Checkout')").click();

    // CVV
    await page.locator(".field.small")
        .nth(1)
        .locator("input")
        .fill("123");

    // Name on Card
    await page
        .getByText("Name on Card")
        .locator("..")
        .locator("input")
        .fill("KN Shika");

    // ==========================
    // Select Country
    // ==========================
    await page
        .locator("[placeholder*='Country']")
        .pressSequentially("ind", { delay: 150 });

    const dropdown = page.locator(".ta-results");

    await dropdown.waitFor();

    const options = dropdown.locator("button");
    const optionCount = await options.count();

    for (let i = 0; i < optionCount; i++) {

        const optionText =
            await options.nth(i).textContent();

        if (optionText?.trim() === "India") {

            await options.nth(i).click();
            break;
        }
    }

    // ==========================
    // Verify Email & Submit Order
    // ==========================
    await expect(
        page.locator(".user__name [type='text']").first()
    ).toHaveText(email);

    await page.locator(".action__submit").click();

    // ==========================
    // Order Confirmation
    // ==========================
    await expect(
        page.locator(".hero-primary")
    ).toHaveText(" Thankyou for the order. ");

    const orderId =
        await page.locator(".em-spacer-1 .ng-star-inserted")
            .textContent();

    console.log(`Generated Order ID: ${orderId}`);

    // ==========================
    // Navigate to Orders Page
    // ==========================
    await page.locator(
        "button[routerlink*='myorders']"
    ).click();

    await page.locator("tbody").waitFor();

    // ==========================
    // Find Matching Order
    // ==========================
    const rows = page.locator("tbody tr");
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {

        const rowOrderId =
            await rows.nth(i).locator("th").textContent();

        if (orderId?.includes(rowOrderId)) {

            await Promise.all([
                page.waitForLoadState("networkidle"),
                rows.nth(i).locator("button").first().click()
            ]);

            break;
        }
    }

    // ==========================
    // Verify Order Details Page
    // ==========================
    const orderDetailsId =
        await page.locator(".col-text").textContent();

    expect(
        orderId?.includes(orderDetailsId)
    ).toBeTruthy();
});