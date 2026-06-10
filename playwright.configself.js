// @ts-check

// @ts-ignore
import { defineConfig, devices } from '@playwright/test';



/**
 * @see https://playwright.dev/docs/test-configuration
 */
//This is a js object that hold key-value pair

export default defineConfig({
  // config is the variable that hold all information required to run test
  testDir: './tests',
  timeout: 40 * 1000, // 40,000ms i.e. 40 sec timeout for components
  expect: {
    timeout: 40 * 1000, //timeout for assertion
  },

  reporter: 'html',
  use: {
    browserName: 'firefox',
    // browserName: 'webkit'
    // browserName: 'chromium'
    headless: false,
  },
});
