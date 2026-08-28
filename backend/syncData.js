require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./User');
const Lead = require('./Lead');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const runSync = async () => {
  try {
    console.log("Connecting to database for multi-tenant alignment...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");

    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log("Purged disconnected historical data.");

    const companyTenantId = new mongoose.Types.ObjectId();
    const adminOwnerId = new mongoose.Types.ObjectId();

    const newAdmin = await User.create({
      _id: adminOwnerId,
      name: "Sanap Prasad",
      email: "test@saas.com",
      password: "password123", 
      tenantId: companyTenantId,
      role: "Admin",
      isActive: true
    });
    console.log("Created synchronized Admin Profile.");

    // Fixed dealStage text values to match your schema's title-cased list format
    const matchingLeads = [
      { 
        companyName: "Acme Corporate Systems", 
        contactPerson: "John Doe", 
        dealStage: "Proposal", 
        dealValue: 12500,
        tenantId: companyTenantId,
        ownerId: adminOwnerId
      },
      { 
        companyName: "Globex Logistics Inc", 
        contactPerson: "Alice Smith", 
        dealStage: "Contacted", 
        dealValue: 24900,
        tenantId: companyTenantId,
        ownerId: adminOwnerId
      },
      { 
        companyName: "Initech Software Corp", 
        contactPerson: "Peter Gibbons", 
        dealStage: "Proposal", 
        dealValue: 8500,
        tenantId: companyTenantId,
        ownerId: adminOwnerId
      }
    ];

    await Lead.insertMany(matchingLeads);
    console.log("Injected leads into the matching company workspace partition!");
    console.log("Full-stack data sync completed successfully! 🚀");
    process.exit(0);
  } catch (error) {
    console.error("Sync crashed with error:", error);
    process.exit(1);
  }
};

runSync();
