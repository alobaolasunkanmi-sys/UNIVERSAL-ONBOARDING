import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { drivers, vehicles, payments, users } from "./src/db/schema.ts";
import { eq } from "drizzle-orm";

async function seedInitialDataIfEmpty() {
  try {
    const existingDrivers = await db.select().from(drivers);
    if (existingDrivers.length === 0) {
      console.log("Seeding initial logistics data into Cloud SQL...");
      
      await db.insert(vehicles).values([
        {
          id: 'VEH-001',
          name: 'Howo Dump Truck 30T',
          type: 'Heavy Truck',
          plateNumber: 'KJA-458-XY',
          driverId: 'DRV-001',
          status: 'Active',
          weeklyHirePurchaseRate: 150000,
          hirePurchaseTotal: 25000000,
        },
        {
          id: 'VEH-002',
          name: 'Shacman Tipper 20T',
          type: 'Tipper',
          plateNumber: 'LSD-892-AB',
          driverId: 'DRV-002',
          status: 'Active',
          weeklyHirePurchaseRate: 120000,
          hirePurchaseTotal: 18000000,
        },
        {
          id: 'VEH-003',
          name: 'Foton Cargo Van',
          type: 'Van',
          plateNumber: 'GGE-112-ZZ',
          driverId: null,
          status: 'Unassigned',
          weeklyHirePurchaseRate: 80000,
          hirePurchaseTotal: 12000000,
        }
      ]);

      await db.insert(drivers).values([
        {
          id: 'DRV-001',
          name: 'Ibrahim Babangida',
          phone: '+234 803 123 4567',
          email: 'ibrahim@suntracomm.com',
          vehicleId: 'VEH-001',
          licenseNumber: 'LAG-90821-A',
          status: 'Active',
        },
        {
          id: 'DRV-002',
          name: 'Chinedu Okafor',
          phone: '+234 802 987 6543',
          email: 'chinedu@suntracomm.com',
          vehicleId: 'VEH-002',
          licenseNumber: 'LAG-55412-B',
          status: 'Active',
        }
      ]);

      await db.insert(payments).values([
        {
          id: 'PAY-001',
          driverId: 'DRV-001',
          amount: 25000,
          date: new Date(),
          status: 'Pending',
          receiptUrl: '',
        }
      ]);
      console.log("Initial logistics data seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Seed initial data lazily on server boot
  await seedInitialDataIfEmpty();

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: "Cloud SQL PostgreSQL" });
  });

  // Get all logistics data
  app.get("/api/logistics", async (req, res) => {
    try {
      const allDrivers = await db.select().from(drivers);
      const allVehicles = await db.select().from(vehicles);
      const allPayments = await db.select().from(payments);

      res.json({
        drivers: allDrivers,
        vehicles: allVehicles,
        payments: allPayments,
      });
    } catch (error: any) {
      console.error("Failed to fetch logistics data:", error);
      res.status(500).json({ error: "Failed to fetch logistics data from Cloud SQL" });
    }
  });

  // Add Driver
  app.post("/api/drivers", async (req, res) => {
    try {
      const { name, phone, email, vehicleId, licenseNumber, status } = req.body;
      const allDrivers = await db.select().from(drivers);
      const newId = `DRV-00${allDrivers.length + 1}`;

      const [newDriver] = await db.insert(drivers).values({
        id: newId,
        name,
        phone,
        email,
        vehicleId,
        licenseNumber,
        status: status || 'Active',
      }).returning();

      if (vehicleId) {
        await db.update(vehicles).set({ driverId: newId, status: 'Active' }).where(eq(vehicles.id, vehicleId));
      }

      res.json(newDriver);
    } catch (error: any) {
      console.error("Failed to add driver:", error);
      res.status(500).json({ error: "Failed to create driver" });
    }
  });

  // Add Vehicle
  app.post("/api/vehicles", async (req, res) => {
    try {
      const { name, type, plateNumber, weeklyHirePurchaseRate, hirePurchaseTotal } = req.body;
      const allVehicles = await db.select().from(vehicles);
      const newId = `VEH-00${allVehicles.length + 1}`;

      const [newVehicle] = await db.insert(vehicles).values({
        id: newId,
        name,
        type,
        plateNumber,
        status: 'Unassigned',
        weeklyHirePurchaseRate: Number(weeklyHirePurchaseRate) || 0,
        hirePurchaseTotal: Number(hirePurchaseTotal) || 0,
      }).returning();

      res.json(newVehicle);
    } catch (error: any) {
      console.error("Failed to add vehicle:", error);
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  });

  // Add Payment
  app.post("/api/payments", async (req, res) => {
    try {
      const { driverId, amount, receiptUrl } = req.body;
      const allPayments = await db.select().from(payments);
      const newId = `PAY-00${allPayments.length + 1}`;

      const [newPayment] = await db.insert(payments).values({
        id: newId,
        driverId,
        amount: Number(amount),
        date: new Date(),
        status: 'Pending',
        receiptUrl: receiptUrl || '',
      }).returning();

      res.json(newPayment);
    } catch (error: any) {
      console.error("Failed to submit payment:", error);
      res.status(500).json({ error: "Failed to submit payment" });
    }
  });

  // Confirm Payment
  app.patch("/api/payments/:id/confirm", async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(payments).set({ status: 'Confirmed' }).where(eq(payments.id, id)).returning();
      res.json(updated);
    } catch (error: any) {
      console.error("Failed to confirm payment:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // Reject Payment
  app.patch("/api/payments/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(payments).set({ status: 'Rejected' }).where(eq(payments.id, id)).returning();
      res.json(updated);
    } catch (error: any) {
      console.error("Failed to reject payment:", error);
      res.status(500).json({ error: "Failed to reject payment" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
