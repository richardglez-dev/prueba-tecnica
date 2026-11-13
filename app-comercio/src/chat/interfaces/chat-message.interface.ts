
export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
}

export interface TextMessage {
  id: string;
  sender: 'cliente' | 'comercio';
  type: 'text';
  text: string;
  createdAt: number;
}

export interface ProductOfferMessage {
  id: string;
  sender: 'comercio';
  type: 'product_offer';
  status: 'pending' | 'accepted' | 'rejected';
  product: Product;
  createdAt: number;
}

export type ChatMessage = TextMessage | ProductOfferMessage;
