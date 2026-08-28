require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('./Lead'); 

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const seedDatabase = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");

    // 1. Automatically extract the exact allowed enum array values from your Lead schema configuration
    const allowedStages = Lead.schema.path('dealStage').enumValues;
    console.log("Your schema's exact required dealStage enum values are:", allowedStages);
    
    if (!allowedStages || allowedStages.length === 0) {
      throw new Error("No enum values found on dealStage path.");
    }

    // 2. Pick safe target variables based directly on what your model demands
    const firstStage = allowedStages[0];
    const secondStage = allowedStages[1] || allowedStages[0];

    const mockTenantId = new mongoose.Types.ObjectId();
    const mockOwnerId = new mongoose.Types.ObjectId();

    const mockLeads = [
      { 
        companyName: "Acme Corp", 
        contactPerson: "John Doe", 
        dealStage: firstStage, 
        dealValue: 12000,
        tenantId: mockTenantId,
        ownerId: mockOwnerId
      },
      { 
        companyName: "Globex Inc", 
        contactPerson: "Alice Smith", 
        dealStage: secondStage, 
        dealValue: 24500,
        tenantId: mockTenantId,
        ownerId: mockOwnerId
      }
    ];

    console.log("Clearing existing leads...");
    await Lead.deleteMany({});
    
    console.log("Inserting valid multi-tenant B2B data...");
    await Lead.insertMany(mockLeads);
    
    console.log("Database seeded successfully! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
