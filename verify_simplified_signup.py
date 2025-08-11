import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        # Get the absolute path to the logo file
        base_path = os.path.abspath(os.path.dirname(__file__))
        logo_path = os.path.join(base_path, '..', '..', 'logo.png')

        # Sign up a new user with the simplified form
        await page.goto('http://localhost:8000/portal.html')
        await page.wait_for_selector('#signup-form', state='visible')
        
        import time
        email = f'testuser.simplified.{int(time.time())}@example.com'
        
        await page.fill('#signup-name', 'Simple User')
        await page.fill('#signup-email', email)
        await page.fill('#signup-password', 'password123')
        await page.fill('#signup-age', '30')
        await page.fill('#signup-program', 'Data Science')
        
        # Set the file for upload
        await page.set_input_files('#signup-profile-picture', logo_path)

        await page.check('#signup-terms')
        await page.click('form#signup-form button[type="submit"]')
        await page.wait_for_timeout(10000) # Wait for signup and upload to process

        # Go to profile page
        await page.goto('http://localhost:8000/profile.html')

        # I need to update the profile page to display the new fields.
        # I will add elements for age, program of interest, and the profile picture.
        # For now, I will just check the name.
        await expect(page.locator('#user-name')).to_have_text('Simple User')
        
        # I will need to update app.js to populate the profile picture.
        # For now, I will just take a screenshot.
        
        screenshot_path = os.path.join(base_path, 'verification.png')
        await page.screenshot(path=screenshot_path)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
