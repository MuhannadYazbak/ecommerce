export interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  photo: string;
  quantity: number;
}

export interface UpdateItem {
  id: number;
  shipped: number;
}