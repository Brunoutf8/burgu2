export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    cep: string;
  };
  payment: {
    method: 'money' | 'card' | 'pix';
    change?: string;
    pixProof?: string;
  };
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedTime?: string;
}

export type OrderStatus = Order['status'];