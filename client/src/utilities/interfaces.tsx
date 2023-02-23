export interface item {
  id: number;
  name: string;
  bin: string;
  quantity: number;
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
  items: item[];
}

export interface foodByGroup {
  foodgroup: string;
  quantity: number;
  foods: string[];
}
