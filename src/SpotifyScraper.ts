import axios, { AxiosRequestConfig } from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();

export class SpotifyScraper {
  private baseUrl: string = "https://www.spotify.com";
  private accountUrl: string = "https://www.spotify.com/account/overview/";
  private orderHistoryUrl: string = "https://www.spotify.com/account/order-history/";
  private loginCookie: string | undefined = process.env.login_cookie;

  private axiosConfig: AxiosRequestConfig = {
    headers: {
      Cookie: `sp_dc=${this.loginCookie}`,
    },
    withCredentials: true,
  };

  /**
   * Fetch and process Spotify account and order history data.
   * @returns {Promise<void>}
   */
  public async getSpotifyData(): Promise<void> {
    try {
      if (!this.loginCookie) {
        throw new Error("Login cookie not found.");
      }
      const responseAccount = await this.fetchData(this.accountUrl);
      this.getGeneralData(responseAccount);

      const responseOrderHistory = await this.fetchData(this.orderHistoryUrl);
      await this.getInvoicesData(responseOrderHistory, true);
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
    }
  }

  /**
   * Extracts and logs general account data from the provided HTML string.
   * @param {string} html - The HTML string to extract data from.
   * @throws {Error} If plan name or price elements are not found.
   * @returns {void}
   */
  private getGeneralData(html: string): void {
    const $ = cheerio.load(html);
    const planName = $('span[data-testid="account-widget-plan-name"]').text();
    const planPrice = $(".recurring-price").text();
    if (!planName || !planPrice) {
      throw new Error("Plan name or price elements not found.");
    }
    console.log(`Current Plan: ${planName} - with a price of: ${planPrice}\n`);
  }

  /**
   * Extracts and logs invoice data from the provided HTML string.
   * @param {string} html - The HTML string to extract data from.
   * @returns {Promise<void>}
   */

  private async getInvoicesData(html: string, firstTimeCall: boolean = false): Promise<void> {
    if (firstTimeCall) {
      console.log("Order History:\n");
      console.log(`              InvoiceId              |Status|           Date           |       Description      |   Amount  `);
    }
    const $ = cheerio.load(html);
    const invoicesScript = $("script#__NEXT_DATA__").text();
    const invoices: ISpotifyInvoice = JSON.parse(invoicesScript);
    const invoicesData = invoices.props.pageProps.invoices;
    if (!invoicesData || !invoicesData.length) {
      console.log("No invoices found.");
      return;
    }
    invoicesData.forEach((invoice) => {
      console.log(
        `${invoice.invoiceId} | ${invoice.status} | ${invoice.createdAt} | ${invoice.description} | ${
          invoice.totalAmount.value + invoice.totalAmount.currencyCode
        }`
      );
    });

    if (invoices.props.pageProps.nextPage) {
      const nextPage = await this.fetchData(this.baseUrl + invoices.props.pageProps.nextPage);
      await this.getInvoicesData(nextPage);
    }
  }

  /**
   * Fetches data from the provided URL.
   * @param {string} url - The URL to fetch data from.
   * @returns {Promise<string>} The response data.
   */
  private async fetchData(url: string): Promise<string> {
    const response = await axios.get<string>(url, this.axiosConfig);
    return response.data;
  }
}
