const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

console.log(db);
const connectDB = async () => {
  try {
    console.log('MongoDB Connecting...');
    await mongoose.connect(db, {
      useNewUrlParser: true
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.log('Error: ' + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
