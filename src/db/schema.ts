import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
  phone: text('phone'),
  email: text('email'),
  vehicleId: text('vehicle_id'),
  licenseNumber: text('license_number'),
  status: text('status').default('Active').notNull(),
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
