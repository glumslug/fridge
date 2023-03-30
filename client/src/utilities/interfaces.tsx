import { Unit } from "convert-units";

export interface productSearchItem {
  product: number;
  name: string;
  bin: string;
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
  items: item[];
  cart: cart_item[];
  myRecipes: recipe[];
  savedRecipes: recipe[];
}

export interface basketData {
  items: basketItem[];
}

export interface basketItem {
  product: number;
  amount: number;
  unit: Unit;
}

export interface items {
  freezer: item[];
  fridge: item[];
  pantry: item[];
  closet: item[];
}

export interface item {
  id: number;
  name: string;
  bin: string;
  quantity: number;
  product: number;
  unit: Unit;
}

export interface item_generic {
  id: number;
  name: string;
  bin: string;
  quantity: number;
  product: number;
  unit: Unit;
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
  unit: Unit;
}

export interface recipe {
  id: number;
  title: string;
  cuisine: string;
  author_id: number | null;
  author_name: string | null;
  source: string | null;
}

export interface ingredient {
  ingredient_id: number;
  product_id: number;
  name: string;
  amount: number;
  unit: number;
  unit_short: Unit;
  unit_singular: string;
  unit_plural: string;
}

export interface cuisines {
  id: number;
  name: string;
}

export interface units {
  id: number;
  short: Unit;
  singular: string;
  plural: string;
}

export interface sources {
  id: number;
  name: string;
}
