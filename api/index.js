const mongoose = require('mongoose');

// Ensure DB connected before loading app (which triggers connectDB at module load)
let appPromise;

const getApp = async () => {
  if (!appPromise) {
    appPromise = (async () => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 10000
        });
      }
      return require('../server/server.js');
    })();
  }
  return appPromise;
};

module.exports = async (req, res) => {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Server initialization failed', error: err.message });
  }
};
