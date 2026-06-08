const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d'
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token, // Also send token in body for convenience if needed (e.g. non-browser clients)
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Default admin user generation if config allows (or first user is admin)
    const count = await User.countDocuments({});
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Send Welcome Email in background
    sendWelcomeEmail(user).catch(err => console.error('Failed to send welcome email:', err));

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please enter your email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with that email' });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to field
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (1 hour)
    const resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    // Direct Mongoose updates to avoid triggering full document validation or pre-saves unexpectedly
    await User.updateOne(
      { _id: user._id },
      { $set: { resetPasswordToken, resetPasswordExpire } }
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({ success: true, message: 'Email sent with instructions' });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.params.token;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide both password fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Hash input token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find user by reset token and expiration check
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      // Create properties on schema dynamically if they are missing
      // (Let's make sure they are supported on the schema. Wait, let's add them to User schema or just allow them since mongoose supports schema less sometimes, but wait, it's safer if they are in the model!)
      // Yes, we will check if the user exists. If not, it means the token is invalid or expired.
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    next(err);
  }
};
