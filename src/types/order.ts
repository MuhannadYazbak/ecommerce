export interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  items_json: string;
  created_at: string; // or Date if you parse it
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
};