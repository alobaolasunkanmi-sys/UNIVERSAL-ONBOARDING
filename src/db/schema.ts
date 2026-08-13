import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Portal Accounts Table (Admin, Staff, Driver, User)
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  nin: text('nin'), // National Identification Number
  email: text('email'),
  role: text('role').notNull().default('user'), // 'admin' | 'staff' | 'driver' | 'user'
  businessId: text('business_id'),
  canLogin: boolean('can_login').default(true).notNull(),
  mustChangePassword: boolean('must_change_password').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Business Onboarding Applications Table
export const businessOnboardings = pgTable('business_onboardings', {
  id: text('id').primaryKey(),
  adminId: text('admin_id').notNull(),
  businessName: text('business_name').notNull(),
  businessType: text('business_type').notNull(), // 'logistics', 'school', 'retail', 'corporate'
  cacNumber: text('cac_number'),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  status: text('status').notNull().default('Pending'), // 'Pending', 'Approved', 'Rejected'
  createdAt: timestamp('created_at').defaultNow(),
});

// Users table matching Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('driver'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Drivers table
export const drivers = pgTable('drivers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique(),
  password: text('password'),
  phone: text('phone'),
  email: text('email'),
  nin: text('nin'),
  vehicleId: text('vehicle_id'),
  licenseNumber: text('license_number'),
  status: text('status').default('Active').notNull(),
  canLogin: boolean('can_login').default(true).notNull(),
  mustChangePassword: boolean('must_change_password').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Vehicles table
export const vehicles = pgTable('vehicles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  plateNumber: text('plate_number').notNull(),
  driverId: text('driver_id'),
  status: text('status').default('Active').notNull(),
  weeklyHirePurchaseRate: integer('weekly_hire_purchase_rate').default(0).notNull(),
  hirePurchaseTotal: integer('hire_purchase_total').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Payments table
export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  driverId: text('driver_id').notNull(),
  amount: integer('amount').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  status: text('status').default('Pending').notNull(),
  receiptUrl: text('receipt_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const driversRelations = relations(drivers, ({ many }) => ({
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  driver: one(drivers, {
    fields: [payments.driverId],
    references: [drivers.id],
  }),
}));
