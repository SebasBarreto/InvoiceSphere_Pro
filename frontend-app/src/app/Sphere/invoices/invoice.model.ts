export interface Invoice {
    invoiceCode: string; 
    total: number;
    date: string;
    products: Array<{ 
      name: string;
      quantity: number;
      product: {
        price: number;
      };
    }>;
  }
  