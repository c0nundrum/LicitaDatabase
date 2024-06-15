import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        # Intercept network requests and responses
        async def handle_response(response):
            if response.url.startswith('https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/public/v1/compras?'):
                if 'application/json' in response.headers.get('content-type', ''):
                    json_data = await response.json()
                    print(json_data)

        page.on('response', handle_response)

        # Navigate to the website
        await page.goto('https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-web/public/compras')

        # Click the "Pesquisar" button
        await page.click('#pn_id_2_content > div > div:nth-child(2) > div.col.m-2.align-self-center > div > button')  # Update the selector if necessary

        # Wait for some time to ensure the request completes
        await page.wait_for_timeout(5000)

        # Close browser
        await browser.close()

# Run the async function
asyncio.run(main())


