// CaféPass Type Definitions

export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'customer' | 'cafe_owner' | 'staff';
  avatar?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  totalPoints: number;
  totalVisits: number;
  totalSpent: number;
  favoriteCafes: string[];
  joinedAt: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Cafe {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  logo?: string;
  coverImage?: string;
  workingHours: string;
  loyaltyRate: number; // points per 1000 UZS
  isActive: boolean;
  createdAt: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  cafeId: string;
  name: string;
  address: string;
  isActive: boolean;
}

export interface Staff {
  id: string;
  cafeId: string;
  branchId: string;
  userId: string;
  name: string;
  role: 'owner' | 'manager' | 'cashier';
  isActive: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  cafeId: string;
  branchId: string;
  amount: number;
  pointsEarned: number;
  items: OrderItem[];
  createdAt: string;
  staffId?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  cafeId: string;
  branchId?: string;
  type: 'earn' | 'redeem' | 'bonus' | 'expire' | 'adjust';
  points: number;
  description: string;
  orderId?: string;
  rewardId?: string;
  createdAt: string;
  performedBy?: string;
}

export interface Reward {
  id: string;
  cafeId: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_item' | 'gift';
  value?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Promotion {
  id: string;
  cafeId: string;
  title: string;
  description: string;
  type: 'double_points' | 'discount' | 'free_item' | 'special';
  multiplier?: number;
  discountPercent?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface GiftCard {
  id: string;
  cafeId: string;
  code: string;
  balance: number;
  originalAmount: number;
  purchasedBy?: string;
  redeemedBy?: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface QRSession {
  id: string;
  customerId: string;
  token: string;
  expiresAt: string;
  usedAt?: string;
  cafeId?: string;
}

export interface AnalyticsData {
  todayVisits: number;
  todayRevenue: number;
  totalCustomers: number;
  totalOrders: number;
  weeklyData: { day: string; visits: number; revenue: number }[];
  topCustomers: { name: string; visits: number; spent: number }[];
  popularItems: { name: string; count: number }[];
}

export type Page = 
  | 'landing'
  | 'login'
  | 'register'
  | 'customer-home'
  | 'customer-qr'
  | 'customer-profile'
  | 'customer-cafes'
  | 'customer-cafe-detail'
  | 'customer-rewards'
  | 'customer-history'
  | 'cafe-dashboard'
  | 'cafe-customers'
  | 'cafe-orders'
  | 'cafe-analytics'
  | 'cafe-rewards'
  | 'cafe-promotions'
  | 'cafe-scan'
  | 'cafe-settings';
