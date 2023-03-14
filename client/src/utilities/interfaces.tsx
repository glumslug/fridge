export interface productSearchItem {
  product: number;
  name: string;
  bin: string;
}

export interface recipeSearchItem {
  id: number;
  name: string;
  author: string | null;
  alias: string | null;
  cuisine: string;
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
  myRecipes: recipe[];
  savedRecipes: recipe[];
}

export interface basketData {
  items: basketItem[];
}

export interface basketItem {
  product: number;
  amount: number;
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
}

export interface item_generic {
  id: number;
  name: string;
  bin: string;
  quantity: number;
  product: number;
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

export interface recipe {
  id: number;
  title: string;
  cuisine: string;
  author_id: number;
  author_name: string | null;
  author_alias: string | null;
  recipe_id?: number;
}
