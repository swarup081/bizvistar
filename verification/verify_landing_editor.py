from playwright.sync_api import sync_playwright
import time

def verify_landing_editor():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        print("Navigating to Landing Page...")
        page.goto("http://localhost:3000")

        # Wait for iframe to load
        print("Waiting for iframe...")
        page.wait_for_selector("iframe[title='Website Preview']")

        # Scroll to editor
        iframe_element = page.locator("iframe[title='Website Preview']")
        iframe_element.scroll_into_view_if_needed()

        time.sleep(2) # Wait for simulation to potentially start

        print("Taking screenshot of Landing Editor...")
        page.screenshot(path="verification/landing_editor_full.png")

        # Verify Cursor Visibility
        # The cursor is a portal to body, so it should be visible in the full screenshot.

        # Verify Aurora Page directly with isLanding=true
        print("Navigating to Aurora Template with isLanding=true...")
        page.goto("http://localhost:3000/templates/aurora?isLanding=true")
        page.wait_for_load_state("networkidle")

        print("Taking screenshot of Aurora Template (Hero Only)...")
        page.screenshot(path="verification/aurora_landing_mode.png")

        # Verify "Features" section is NOT present
        if page.locator("text=Features").count() > 0:
            print("WARNING: Features section might still be present!")
        else:
            print("SUCCESS: Features section is hidden.")

        # Verify Navbar tooltip
        print("Hovering over Home link...")
        home_link = page.get_by_text("Home", exact=True).first
        home_link.hover()
        time.sleep(0.5)
        page.screenshot(path="verification/aurora_tooltip.png")

        browser.close()

if __name__ == "__main__":
    verify_landing_editor()
