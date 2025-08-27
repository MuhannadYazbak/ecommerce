export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  photo: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  items_json: OrderItem[];
  created_at: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  address_id: number | null;
}
