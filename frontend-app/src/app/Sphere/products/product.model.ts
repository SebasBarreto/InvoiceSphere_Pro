export interface Product {
    _id?: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    stock: number;
    price: number;
    showFullDescription?: boolean;
  }
  