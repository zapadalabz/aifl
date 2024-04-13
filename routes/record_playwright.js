const e = require('express');
const express = require('express');
const playwright = require('playwright');

const recordPlaywrightRoutes = express.Router();

const browsers = {};
const pages = {};


recordPlaywrightRoutes.post('/playwright/login', async (req, res) => {
  const { username, password } = req.body;

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://branksome.managebac.com/login');

    // Fill the form and submit
    await page.fill('#session_login', username);
    await page.fill('#session_password', password);
    await page.click('input[value="Sign in"]');

    // Wait for navigation to complete
    await page.waitForNavigation();

    browsers[username] = browser;
    pages[username] = page;

    await page.goto('https://branksome.managebac.com/teacher/classes/');

    const courses = await page.$('#classes');
    const titles = await courses.$$('.title');
    for (let title of titles) {
        const link = await title.$('a');
        const href = await link.getAttribute('href');
        const text = await link.innerText();
        console.log(text, href);
      }

    res.json({ status: 'Logged in' });
  } catch (error) {
    console.error(error);
    res.json({ status: 'Failed to log in', error: error.message });
    await browser.close();
  } finally {
    // Ensure the browser gets closed even if an error occurs
    await browser.close();
  }
});

recordPlaywrightRoutes.get('/playwright/getClasses/:email', async (req, res) => {    
    const browser = browsers[req.params.email];
    const page = pages[req.params.email];
    
    try {
        await page.goto('https://branksome.managebac.com/teacher/classes/');
    
        // Wait for navigation to complete
        await page.waitForNavigation();
    
        // Get the class names
        const classElements = await page.$$('.class-name');
        const classes = await Promise.all(classElements.map(async (element) => {
            return await element.innerText();
        }));
    } catch (error) {
        console.error(error);
        res.json({ status: 'Failed to get classes', error: error.message });
    } finally {
        // Ensure the browser gets closed even if an error occurs
        await browser.close();
    }
});

module.exports = recordPlaywrightRoutes;