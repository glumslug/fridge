export interface item {
  id: number;
  name: string;
  bin: string;
  quantity: number;
  product: number;
}

export interface item_generic {
  id: number;
  name: string;
  bin: string;
  quantity: number;
  product: number;
}

export interface searchItem {
  id: number;
  name: string;
  bin: string;
  aisle: string;
  product: number;
}

export interface user {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface userData {
  name: string;
  id: number;
  token: string;
  items: items;
  cart: shoppingList;
}

export interface basketData {
  items: basketItem[];
}

export interface basketItem {
  product: number;
  amount: number;
}
export interface foodByGroup {
  foodgroup: string;
  quantity: number;
  foods: string[];
}

export interface items {
  freezer: item[];
  fridge: item[];
  pantry: item[];
  closet: item[];
}

export interface shoppingList {
  freezer: cart_item[];
  fridge: cart_item[];
  pantry: cart_item[];
  closet: cart_item[];
}

export interface cart_item {
  bin: string;
  name: string;
  product: number;
  quantity: number;
}
