const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://roseandivyadmin:fES1OxkH8pT5qHGI@ac-cebjuec-shard-00-00.xndsxld.mongodb.net:27017,ac-cebjuec-shard-00-01.xndsxld.mongodb.net:27017,ac-cebjuec-shard-00-02.xndsxld.mongodb.net:27017/roseivy?ssl=true&replicaSet=atlas-cebjuec-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // DO NOT EXIT PROCESS IN SERVERLESS
  }
};

module.exports = connectDB;
