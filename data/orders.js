export const ORDERS = [
  {
    id: 'o1',
    restaurantName: 'Sabor Carioca',
    date: '18/06/2026',
    status: 'Entregue',
    items: [
      { name: 'X-Burger', quantity: 2 },
      { name: 'Refrigerante Lata', quantity: 2 },
    ],
    total: 49.8,
  },
  {
    id: 'o2',
    restaurantName: 'Pasta & Cia',
    date: '20/06/2026',
    status: 'Em preparo',
    items: [{ name: 'Brownie', quantity: 1 }],
    total: 10.5,
  },
  {
    id: 'o3',
    restaurantName: 'Sushi Centro',
    date: '21/06/2026',
    status: 'Saiu para entrega',
    items: [
      { name: 'Suco Natural', quantity: 1 },
      { name: 'Pudim', quantity: 1 },
    ],
    total: 17.5,
  },
];