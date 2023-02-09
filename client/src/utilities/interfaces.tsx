export interface item {
  id: number;
  name: string;
  quantity: number;
}

export interface Users {
  id: number;
  name: string;
}

export interface userData {
  user: string;
  items: [
    {
      id: number;
      name: string;
      quantity: number;
    }
  ];
}

export interface foodByGroup {
  foodgroup: string;
  foods: string[];
}
