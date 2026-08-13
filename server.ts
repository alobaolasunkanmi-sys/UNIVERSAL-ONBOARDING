import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { drivers, vehicles, payments, users, accounts, businessOnboardings } from "./src/db/schema.ts";
import { eq, or, and } from "drizzle-orm";

async function seedInitialDataIfEmpty() {
  try {
    const existingAccounts = await db.select().from(accounts);
    if (existingAccounts.length === 0) {
      console.log("Seeding default system Admin & Accounts into Cloud SQL...");
      
      // Default Super Admin Account
      await db.insert(accounts).values({
        id: 'ACC-ADMIN-001',
        username: 'admin',
        password: 'adminpassword123', // Demo hash/password
        name: 'Suntracomm Super Admin',
        phone: '+234 800 111 2222',
        nin: '12345678901',
        email: 'admin@suntracomm.com',
        role: 'admin',
        canLogin: true,
        mustChangePassword: false,
      });

      // Default Staff Account
      await db.insert(accounts).values({
        id: 'ACC-STAFF-001',
        username: 'staff',
        password: 'staffpassword123',
        name: 'Fleet Operations Manager',
        phone: '+234 800 333 4444',
        nin: '98765432109',
        email: 'staff@suntracomm.com',
        role: 'staff',
        canLogin: true,
        mustChangePassword: false,
      });

      // Default Onboarding Application
      await db.insert(businessOnboardings).values({
        id: 'BIZ-001',
        adminId: 'ACC-ADMIN-001',
        businessName: 'Suntracomm Logistics Ltd',
        businessType: 'logistics',
        cacNumber: 'RC-1892041',
        address: 'Plot 12 Commercial Avenue, Ikeja, Lagos State',
        phone: '+234 800 111 2222',
        email: 'admin@suntracomm.com',
        status: 'Approved',
      });
    }

    const existingDrivers = await db.select().from(drivers);
    if (existingDrivers.length === 0) {
      console.log("Seeding initial drivers into Cloud SQL...");
      
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
          username: 'ibrahim',
          password: 'driverpassword123',
          phone: '+234 803 123 4567',
          email: 'ibrahim@suntracomm.com',
          nin: '23456789012',
          vehicleId: 'VEH-001',
          licenseNumber: 'LAG-90821-A',
          status: 'Active',
          canLogin: true,
          mustChangePassword: false,
        },
        {
          id: 'DRV-002',
          name: 'Chinedu Okafor',
          username: 'chinedu',
          password: 'driverpassword123',
          phone: '+234 802 987 6543',
          email: 'chinedu@suntracomm.com',
          nin: '34567890123',
          vehicleId: 'VEH-002',
          licenseNumber: 'LAG-55412-B',
          status: 'Active',
          canLogin: true,
          mustChangePassword: true,
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

  // ==========================================
  // AUTHENTICATION & PORTAL ACCESS ENDPOINTS
  // ==========================================

  // Admin Self Sign-Up
  app.post("/api/auth/signup-admin", async (req, res) => {
    try {
      const { name, phone, nin, username, email, password, businessName, businessType } = req.body;

      if (!name || !phone || !nin || !username || !password) {
        return res.status(400).json({ error: "Missing required fields: Name, Phone, NIN, Username, and Password are required." });
      }

      // Check if username already exists in accounts or drivers
      const existingAcc = await db.select().from(accounts).where(eq(accounts.username, username.trim().toLowerCase()));
      if (existingAcc.length > 0) {
        return res.status(400).json({ error: "Username already taken. Please choose a different username." });
      }

      const accId = `ACC-ADM-${Date.now().toString().slice(-6)}`;
      const [newAdmin] = await db.insert(accounts).values({
        id: accId,
        username: username.trim().toLowerCase(),
        password: password,
        name: name.trim(),
        phone: phone.trim(),
        nin: nin.trim(),
        email: email ? email.trim() : `${username}@business.com`,
        role: 'admin',
        canLogin: true,
        mustChangePassword: false,
      }).returning();

      // Create initial onboarding record if business name provided
      let onboardingRecord = null;
      if (businessName) {
        const bizId = `BIZ-${Date.now().toString().slice(-6)}`;
        [onboardingRecord] = await db.insert(businessOnboardings).values({
          id: bizId,
          adminId: accId,
          businessName: businessName.trim(),
          businessType: businessType || 'logistics',
          phone: phone.trim(),
          email: email ? email.trim() : '',
          status: 'Pending',
        }).returning();
      }

      res.json({
        message: "Admin registration successful!",
        user: {
          id: newAdmin.id,
          username: newAdmin.username,
          name: newAdmin.name,
          phone: newAdmin.phone,
          nin: newAdmin.nin,
          email: newAdmin.email,
          role: 'admin',
        },
        businessOnboarding: onboardingRecord,
      });
    } catch (error: any) {
      console.error("Error during Admin sign-up:", error);
      res.status(500).json({ error: "Failed to complete Admin registration." });
    }
  });

  // Login (Admin, Driver, Staff, User)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { usernameOrEmail, password, role } = req.body;

      if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: "Please enter your username and password." });
      }

      const term = usernameOrEmail.trim().toLowerCase();

      // Check in drivers table first if role is driver, or if driver exists with this username
      if (role === 'driver') {
        const matchingDrivers = await db.select().from(drivers).where(
          or(
            eq(drivers.username, term),
            eq(drivers.email, term),
            eq(drivers.id, term)
          )
        );

        if (matchingDrivers.length > 0) {
          const d = matchingDrivers[0];
          if (!d.canLogin) {
            return res.status(403).json({ error: "Driver login access has been disabled by Admin. Please contact your manager." });
          }

          // Check password match (or if password is not set yet, allow setup)
          if (d.password && d.password !== password) {
            return res.status(401).json({ error: "Incorrect driver password." });
          }

          return res.json({
            user: {
              id: d.id,
              username: d.username || d.id,
              name: d.name,
              phone: d.phone,
              nin: d.nin,
              email: d.email,
              role: 'driver',
              vehicleId: d.vehicleId,
              mustChangePassword: d.mustChangePassword || !d.password,
            }
          });
        }
      }

      // Check accounts table (Admin, Staff, User)
      const matchingAccounts = await db.select().from(accounts).where(
        or(
          eq(accounts.username, term),
          eq(accounts.email, term)
        )
      );

      if (matchingAccounts.length > 0) {
        const acc = matchingAccounts[0];
        if (!acc.canLogin) {
          return res.status(403).json({ error: "Account access has been suspended." });
        }
        if (acc.password !== password) {
          return res.status(401).json({ error: "Invalid password." });
        }

        // Fetch associated business onboarding status
        const bizRecords = await db.select().from(businessOnboardings).where(eq(businessOnboardings.adminId, acc.id));

        return res.json({
          user: {
            id: acc.id,
            username: acc.username,
            name: acc.name,
            phone: acc.phone,
            nin: acc.nin,
            email: acc.email,
            role: acc.role,
            mustChangePassword: acc.mustChangePassword,
          },
          businessOnboarding: bizRecords.length > 0 ? bizRecords[0] : null,
        });
      }

      // Fallback check driver table without role filter
      const fallbackDrivers = await db.select().from(drivers).where(
        or(
          eq(drivers.username, term),
          eq(drivers.email, term)
        )
      );

      if (fallbackDrivers.length > 0) {
        const d = fallbackDrivers[0];
        if (!d.canLogin) {
          return res.status(403).json({ error: "Driver login disabled by Admin." });
        }
        if (d.password && d.password !== password) {
          return res.status(401).json({ error: "Incorrect password." });
        }
        return res.json({
          user: {
            id: d.id,
            username: d.username || d.id,
            name: d.name,
            phone: d.phone,
            nin: d.nin,
            email: d.email,
            role: 'driver',
            vehicleId: d.vehicleId,
            mustChangePassword: d.mustChangePassword || !d.password,
          }
        });
      }

      return res.status(404).json({ error: "Account not found. Please check your username or register." });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to log in." });
    }
  });

  // Change Password for Driver, Admin, Staff, or User
  app.post("/api/auth/change-password", async (req, res) => {
    try {
      const { userId, role, currentPassword, newPassword } = req.body;

      if (!userId || !newPassword) {
        return res.status(400).json({ error: "User ID and new password are required." });
      }

      if (role === 'driver') {
        const [updatedDriver] = await db.update(drivers)
          .set({ password: newPassword, mustChangePassword: false })
          .where(eq(drivers.id, userId))
          .returning();

        return res.json({ message: "Driver password updated successfully!", driver: updatedDriver });
      } else {
        const [updatedAccount] = await db.update(accounts)
          .set({ password: newPassword, mustChangePassword: false })
          .where(eq(accounts.id, userId))
          .returning();

        return res.json({ message: "Password updated successfully!", account: updatedAccount });
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Failed to update password." });
    }
  });

  // Driver First-Time Login / Set Password by Username
  app.post("/api/auth/driver-setup-password", async (req, res) => {
    try {
      const { username, newPassword } = req.body;

      if (!username || !newPassword) {
        return res.status(400).json({ error: "Username and new password are required." });
      }

      const term = username.trim().toLowerCase();
      const match = await db.select().from(drivers).where(eq(drivers.username, term));

      if (match.length === 0) {
        return res.status(404).json({ error: `Driver account with username '${username}' was not found. Please verify with your Admin.` });
      }

      const driver = match[0];
      if (!driver.canLogin) {
        return res.status(403).json({ error: "Login access for this driver is currently disabled by Admin." });
      }

      const [updated] = await db.update(drivers)
        .set({ password: newPassword, mustChangePassword: false })
        .where(eq(drivers.id, driver.id))
        .returning();

      res.json({
        message: "Driver password setup complete!",
        user: {
          id: updated.id,
          username: updated.username,
          name: updated.name,
          role: 'driver',
          vehicleId: updated.vehicleId,
          mustChangePassword: false,
        }
      });
    } catch (error: any) {
      console.error("Error setting driver password:", error);
      res.status(500).json({ error: "Failed to set driver password." });
    }
  });

  // ==========================================
  // BUSINESS ONBOARDING APPLICATIONS
  // ==========================================

  // Apply for Business Onboarding
  app.post("/api/onboarding/apply", async (req, res) => {
    try {
      const { adminId, businessName, businessType, cacNumber, address, phone, email } = req.body;

      if (!adminId || !businessName || !businessType) {
        return res.status(400).json({ error: "Admin ID, Business Name, and Business Type are required." });
      }

      const existing = await db.select().from(businessOnboardings).where(eq(businessOnboardings.adminId, adminId));
      let record;

      if (existing.length > 0) {
        [record] = await db.update(businessOnboardings)
          .set({
            businessName,
            businessType,
            cacNumber,
            address,
            phone,
            email,
            status: 'Pending',
          })
          .where(eq(businessOnboardings.id, existing[0].id))
          .returning();
      } else {
        const bizId = `BIZ-${Date.now().toString().slice(-6)}`;
        [record] = await db.insert(businessOnboardings).values({
          id: bizId,
          adminId,
          businessName,
          businessType,
          cacNumber,
          address,
          phone,
          email,
          status: 'Pending',
        }).returning();
      }

      res.json({ message: "Business onboarding application submitted successfully!", businessOnboarding: record });
    } catch (error: any) {
      console.error("Error applying for business onboarding:", error);
      res.status(500).json({ error: "Failed to submit business onboarding application." });
    }
  });

  // Get Admin's Business Onboarding Record
  app.get("/api/onboarding/my-business/:adminId", async (req, res) => {
    try {
      const { adminId } = req.params;
      const records = await db.select().from(businessOnboardings).where(eq(businessOnboardings.adminId, adminId));
      res.json(records.length > 0 ? records[0] : null);
    } catch (error: any) {
      console.error("Failed to fetch onboarding status:", error);
      res.status(500).json({ error: "Failed to fetch onboarding status." });
    }
  });

  // Approve / Reject Onboarding Application (Super Admin)
  app.patch("/api/onboarding/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [updated] = await db.update(businessOnboardings)
        .set({ status })
        .where(eq(businessOnboardings.id, id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error updating onboarding status:", error);
      res.status(500).json({ error: "Failed to update onboarding status." });
    }
  });

  // ==========================================
  // LOGISTICS & FLEET MANAGEMENT API
  // ==========================================

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

  // Add / Onboard Driver by Admin
  app.post("/api/drivers", async (req, res) => {
    try {
      const { name, username, password, phone, email, nin, vehicleId, licenseNumber, status, canLogin } = req.body;
      const allDrivers = await db.select().from(drivers);
      const newId = `DRV-00${allDrivers.length + 1}`;

      // Generate clean username if not provided
      const finalUsername = username ? username.trim().toLowerCase() : `driver${allDrivers.length + 1}`;

      const [newDriver] = await db.insert(drivers).values({
        id: newId,
        name: name.trim(),
        username: finalUsername,
        password: password || 'driverpassword123',
        phone: phone ? phone.trim() : '',
        email: email ? email.trim() : '',
        nin: nin ? nin.trim() : '',
        vehicleId: vehicleId || null,
        licenseNumber: licenseNumber || '',
        status: status || 'Active',
        canLogin: canLogin !== undefined ? canLogin : true,
        mustChangePassword: true,
      }).returning();

      if (vehicleId) {
        await db.update(vehicles).set({ driverId: newId, status: 'Active' }).where(eq(vehicles.id, vehicleId));
      }

      res.json(newDriver);
    } catch (error: any) {
      console.error("Failed to add driver:", error);
      res.status(500).json({ error: error.message || "Failed to onboard driver" });
    }
  });

  // Enable/Disable Driver Login Access & Update Credentials
  app.patch("/api/drivers/:id/login-access", async (req, res) => {
    try {
      const { id } = req.params;
      const { canLogin, username, password } = req.body;

      const updates: any = {};
      if (canLogin !== undefined) updates.canLogin = Boolean(canLogin);
      if (username) updates.username = username.trim().toLowerCase();
      if (password) {
        updates.password = password;
        updates.mustChangePassword = false;
      }

      const [updated] = await db.update(drivers).set(updates).where(eq(drivers.id, id)).returning();
      res.json(updated);
    } catch (error: any) {
      console.error("Failed to update driver login access:", error);
      res.status(500).json({ error: "Failed to update driver login access" });
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
