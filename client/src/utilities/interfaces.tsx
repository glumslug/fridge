export interface item {
  id: number;
  name: string;
  bin: string;
  quantity: number;
}

export interface Users {
  id: number;
  name: string;
}

export interface userData {
  name: string;
  id: number;
  items: [
    {
      id: number;
      name: string;
      bin: string;
      quantity: number;
    }
  ];
}

export interface foodByGroup {
  foodgroup: string;
  quantity: number;
  foods: string[];
}
