from playwright.sync_api import sync_playwright
import time

def verify_frostify_footer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Checking Frostify Footer Updates...")
        try:
            page.goto("http://localhost:3000/editor/frostify", timeout=60000)
            page.wait_for_load_state("networkidle")

            # Check for Sidebar Footer section
            if page.is_visible("button:has-text('Footer')"):
                 print("SUCCESS: Sidebar has Footer section.")
                 page.click("button:has-text('Footer')")

                 # Check for new inputs
                 if page.is_visible("label:has-text('Mon-Fri')"):
                     print("SUCCESS: Mon-Fri input visible.")
                 else:
                     print("FAILURE: Mon-Fri input NOT visible.")

                 if page.is_visible("label:has-text('IG URL')"):
                     print("SUCCESS: IG URL input visible.")
                 else:
                     print("FAILURE: IG URL input NOT visible.")

            else:
                 print("FAILURE: Sidebar Footer section NOT found.")

            page.screenshot(path="frostify_footer_check.png")
            print("Screenshot saved to frostify_footer_check.png")

        except Exception as e:
            print(f"Error checking Frostify Footer: {e}")
            page.screenshot(path="frostify_footer_error.png")

        browser.close()

if __name__ == "__main__":
    verify_frostify_footer()
