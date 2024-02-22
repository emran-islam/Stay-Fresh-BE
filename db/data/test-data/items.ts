const items: {
  item_name: string;
  item_price: number;
  purchase_date: string;
  expiry_date: string;
  home_id: number;
  item_status?: string;
}[] = [
  {
    item_name: "Milk",
    item_price: 155,
    purchase_date: "Tue Feb 20 2024 19:33:50 GMT+0100",
    expiry_date: "Tue Feb 27 2024 19:33:50 GMT+0100",
    home_id: 1,
    item_status: "ACTIVE",
  },

  {
    item_name: "Cornflakes",
    item_price: 400,
    purchase_date: "Tue Feb 20 2024 19:33:50 GMT+0100",
    expiry_date: "Sat Mar 30 2024 19:33:50 GMT+0100",
    home_id: 1,
    item_status: "ACTIVE",
  },
  {
    item_name: "Bread",
    item_price: 195,
    purchase_date: "Tue Feb 20 2024 19:33:50 GMT+0100",
    expiry_date: "Thur Feb 29 2024 19:33:50 GMT+0100",
    home_id: 1,
    item_status: "ACTIVE",
  },
  {
    item_name: "Eggs",
    item_price: 95,
    purchase_date: "Tue Feb 20 2024 19:33:50 GMT+0100",
    expiry_date: "Tue Mar 5 2024 19:33:50 GMT+0100",
    home_id: 1,
    item_status: "ACTIVE",
  },
  {
    item_name: "Carrots",
    item_price: 45,
    purchase_date: "Sun Feb 18 2024 19:33:50 GMT+0100",
    expiry_date: "Tue Mar 19 2024 19:33:50 GMT+0100",
    home_id: 2,
    item_status: "ACTIVE",
  },
  {
    item_name: "Potatoes",
    item_price: 110,
    purchase_date: "Sun Feb 18 2024 19:33:50 GMT+0100",
    expiry_date: "Tue Mar 19 2024 19:33:50 GMT+0100",
    home_id: 2,
    item_status: "ACTIVE",
  },
  {
    item_name: "Bread",
    item_price: 110,
    purchase_date: "Sun Feb 18 2024 19:33:50 GMT+0100",
    expiry_date: "Tue Mar 19 2024 19:33:50 GMT+0100",
    home_id: 2,
    item_status: "USED",
  },
];

export default items;
