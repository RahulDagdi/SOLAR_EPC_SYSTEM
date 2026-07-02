const mongoose = require('mongoose');

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI_LOCAL;

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
