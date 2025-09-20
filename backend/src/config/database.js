import mongoose from 'mongoose';
import config from './index.js';

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      // Set mongoose options
      const options = {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
      };

      // Connect to MongoDB
      this.connection = await mongoose.connect(config.MONGODB_URI, options);
      
      console.log(`✅ MongoDB connected: ${this.connection.connection.host}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', this.close.bind(this));
      process.on('SIGTERM', this.close.bind(this));

    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      
      if (config.isProduction()) {
        process.exit(1);
      } else {
        console.warn('⚠️ Running without database in development mode');
      }
    }
  }

  async close() {
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed gracefully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error.message);
      process.exit(1);
    }
  }

  getConnection() {
    return this.connection;
  }
}

export default new Database();