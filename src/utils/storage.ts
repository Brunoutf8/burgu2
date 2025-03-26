import { Order, OrderStatus } from '../types/order';

const ORDERS_KEY = 'burgerhouse_orders';

export const generateOrderId = (): string => {
  const prefix = 'ORD';
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${randomPart}`;
};

export const calculateEstimatedTime = (): string => {
  const now = new Date();
  // Add 45 minutes for preparation
  now.setMinutes(now.getMinutes() + 45);
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
};

export const getOrderById = (id: string): Order | undefined => {
  const orders = getOrders();
  return orders.find(order => order.id === id);
};

export const updateOrderStatus = (id: string, status: OrderStatus): void => {
  const orders = getOrders();
  const updatedOrders = orders.map(order => 
    order.id === id ? { ...order, status } : order
  );
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
};

export const isStoreOpen = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 18 && hour < 23;
};