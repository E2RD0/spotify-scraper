import json
import os

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from requests.cookies import RequestsCookieJar

load_dotenv()


class SpotifyScraper:

    def __init__(self):
        self.base_url = "https://www.spotify.com"
        self.account_url = "https://www.spotify.com/account/overview/"
        self.order_history_url = "https://www.spotify.com/account/order-history/"
        self.login_cookie = os.getenv("login_cookie")
        self.cookies = RequestsCookieJar()
        self.cookies.set("sp_dc", self.login_cookie)

    def get_spotify_data(self):
        if not self.login_cookie:
            raise ValueError("Login cookie not found.")

        try:
            response_account = self.fetch_data(self.account_url)
            self.get_general_data(response_account)

            response_order_history = self.fetch_data(self.order_history_url)
            self.get_invoices_data(response_order_history,
                                   first_time_call=True)
        except Exception as e:
            print(f"Error fetching Spotify data: {e}")

    def get_general_data(self, html):
        soup = BeautifulSoup(html, "html.parser")
        plan_name_element = soup.select_one(
            'span[data-testid="account-widget-plan-name"]')
        plan_price_element = soup.select_one(".recurring-price")
        if not plan_name_element or not plan_price_element:
            raise ValueError("Plan name or price elements not found.")
        plan_price = plan_price_element.text
        plan_name = plan_name_element.text

        print(f"Current Plan: {plan_name} - with a price of: {plan_price}\n")

    def get_invoices_data(self, html, first_time_call=False):
        if first_time_call:
            print("Order History:\n")
            print("              InvoiceId              |Status|           Date           |       Description      |   Amount  ")
            
        soup = BeautifulSoup(html, "html.parser")
        invoices_script = soup.select_one("script#__NEXT_DATA__")
        if (not invoices_script) or (not invoices_script.string):
            raise (ValueError("Invoices data in script tag not found"))
        invoices_script = invoices_script.string
        invoices_data = json.loads(
            invoices_script)["props"]["pageProps"]["invoices"]

        if not invoices_data:
            print("No invoices found.")
            return

        for invoice in invoices_data:
            print(
                f"{invoice['invoiceId']} | {invoice['status']} | {invoice['createdAt']} | {invoice['description']} | {invoice['totalAmount']['value']}{invoice['totalAmount']['currencyCode']}"
            )

        next_page = json.loads(invoices_script)["props"]["pageProps"].get(
            "nextPage")
        if next_page:
            next_page_html = self.fetch_data(self.base_url + next_page)
            self.get_invoices_data(next_page_html)

    def fetch_data(self, url):
        response = requests.get(url, cookies=self.cookies)
        response.raise_for_status()
        return response.text


def main():
    scraper = SpotifyScraper()
    scraper.get_spotify_data()

main()
