// MongoDB initialization script for development
db = db.getSiblingDB('tailorapp');

// Create a simple test collection to ensure database is initialized
db.testCollection.insertOne({
  message: "TailorApp database initialized successfully",
  timestamp: new Date()
});

console.log('TailorApp database initialized for development');