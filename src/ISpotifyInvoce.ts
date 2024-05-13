interface ISpotifyInvoice {
  props: {
    pageProps: {
      invoices: {
        invoiceId: string;
        invoiceNumber: string;
        status: string;
        createdAt: string;
        refundedAt: string | null;
        description: string;
        customer: string;
        totalAmount: {
          value: string;
          currencyCode: string;
        };
      }[];
      nextPage: string | null;
    };
  };
}
