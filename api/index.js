const mongoose = require('mongoose');
const app = require('../server/server.js');

module.exports = async (req, res) => {
  // Ensure DB is connected before handling any request
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
      });
    } catch (err) {
      console.error('DB connection error in serverless:', err.message);
    }
  }
  return app(req, res);
};
