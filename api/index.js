const connectDB = require('../server/config/db');
const app = require('../server/server.js');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
