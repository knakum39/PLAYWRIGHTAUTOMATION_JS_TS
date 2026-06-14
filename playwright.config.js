// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */

const config = ({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000, // 40,000ms i.e. 40 sec timeout for components
  //timeout for assertion
  expect: 
  {
    timeout: 5000, //timeout for assertion
  },

  reporter: 'html',
  
  use: 
  {
  browserName: 'chromium',
  //browserName: 'firefox',
  // browserName: 'webkit'
  headless : false,
  screenshot : 'on',
  //trace: 'on'
  trace : 'retain-on-failure' //This command will generate trace only if while failure
  },

});
//export config variable for all modules of this current project..
module.exports = config

