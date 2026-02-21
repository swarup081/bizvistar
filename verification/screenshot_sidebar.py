import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        # Navigate to editor
        # Ensure we use a valid route
        try:
            page.goto("http://localhost:3000/editor/frostify?site_id=123", timeout=60000)

            # Wait for Settings button
            page.wait_for_selector("text=Settings", timeout=20000)
            page.click("text=Settings")
            time.sleep(2)

            # Take screenshot of the sidebar
            # The sidebar container usually has a border-l
            page.screenshot(path="sidebar.png")
            print("Sidebar screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="error.png")

        browser.close()

if __name__ == "__main__":
    run()
