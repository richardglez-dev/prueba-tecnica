export interface Order {

  id: string;
  chatId: string;
  messageId: string;
  product: {
    id: string;
    name: string;
    price: number;
    currency: string;
    imageUrl?: string;
  };
  status: 'created';
  createdAt: number;

}