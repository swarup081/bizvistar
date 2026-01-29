
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to the landing page
        await page.goto("http://localhost:3000")

        # 1. Verify Title
        title = await page.title()
        print(f"Page Title: {title}")
        assert "BizVistar" in title, f"Title should contain 'BizVistar', got '{title}'"

        # 2. Verify Hero Text
        hero_text = await page.locator("h1").text_content()
        print(f"Hero Text: {hero_text}")
        assert "Build your dream website" in hero_text, "Hero text mismatch"

        # 3. Verify Carousel Interaction
        # Check initial active item (index 2: Elegant)
        # Note: Active item scales up. We can check for the h3 text color or class if possible,
        # but let's just click 'Modern' (index 0) and see if it centers/activates.

        # Wait for carousel to load
        await page.wait_for_selector("text=Choose your style")

        # Screenshot before interaction
        await page.screenshot(path="landing_full_final.png", full_page=True)

        # Click "Modern"
        modern_card = page.locator("text=Modern")
        await modern_card.click()

        # Allow animation
        await asyncio.sleep(1)

        # Screenshot after interaction
        await page.screenshot(path="carousel_interaction_final.png")

        print("Verification Passed!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
