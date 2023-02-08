export interface Items {
  id: number;
  name: string;
  owner: number;
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
      name: string;
      quantity: number;
    }
  ];
}
