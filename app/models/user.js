const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
});

// findByIdAndUpdate does not trigger these hooks

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  },

  generateToken() {
    return jwt.sign({ id: this.id }, authConfig.secret, {
      expiresIn: 86400,
    });
  },
};

mongoose.model('User', UserSchema);
