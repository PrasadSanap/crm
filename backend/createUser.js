require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./User');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({}); // Purge old trial accounts
    
    // Inject corporate user passing every validation hook in auth.js
    await User.create({
      name: "Sanap Prasad",
      email: "test@saas.com",
      password: "password123", 
      tenantId: new mongoose.Types.ObjectId(),
      role: "Admin",
      isActive: true // <-- Essential to pass line 37 of your auth.js file
    });

    console.log("Admin corporate profile generated! 🎉 User: test@saas.com | Pass: password123");
    process.exit(0);
  } catch (error) {
    console.error("Error generating user:", error);
    process.exit(1);
  }
};
run();
