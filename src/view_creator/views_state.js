import { signal } from "@preact/signals";

const mockViews = [
    { 
      id: 1, 
      name: 'Customer Orders', 
      description: 'Shows all customer orders with details',
      sqlCode: 'SELECT o.order_id, c.customer_name, o.order_date, o.total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nWHERE o.status = "active"',
      fields: ['order_id', 'customer_name', 'order_date', 'total_amount']
    },
    { 
      id: 2, 
      name: 'Product Inventory', 
      description: 'Current inventory levels',
      sqlCode: 'SELECT p.product_id, p.name, p.category, i.quantity, i.last_updated\nFROM products p\nJOIN inventory i ON p.product_id = i.product_id',
      fields: ['product_id', 'name', 'category', 'quantity', 'last_updated']
    },
    { 
      id: 3, 
      name: 'Monthly Sales', 
      description: 'Aggregated sales by month',
      sqlCode: 'SELECT DATE_FORMAT(order_date, "%Y-%m") as month, SUM(total_amount) as total_sales\nFROM orders\nGROUP BY DATE_FORMAT(order_date, "%Y-%m")\nORDER BY month DESC',
      fields: ['month', 'total_sales']
    },
  ];

const views = signal([]);
const originalViews = signal({});

export {views, originalViews, mockViews};