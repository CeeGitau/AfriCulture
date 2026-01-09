const User = require('../models/User'); 
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

const Register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const Auth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // fetch full user and exclude password

        if (!user) return res.status(401).json({ message: "Unauthorized" });

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found"});

    // Generate token 
    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hr
    await user.save();

    // In production, send email instead
    res.json({ message: "Reset token generated", token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const ResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token "});

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

const UpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      username,
      currentPassword,
      newPassword,
      confirmNewPassword,   // expect this from the client
      confirmPassword       // allow this too, just in case the client uses a different key
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update username (optional)
    if (typeof username === "string" && username.trim()) {
      user.username = username.trim();
    }

    // Update profile picture (optional)
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Password change (if any password field is present, require all)
    const confirm = confirmNewPassword ?? confirmPassword;
    const wantsPasswordChange = Boolean(currentPassword || newPassword || confirm);

    if (wantsPasswordChange) {
      // Require all three fields
      if (!currentPassword || !newPassword || !confirm) {
        return res.status(400).json({
          message: "To change password, provide current password, new password, and confirm new password"
        });
      }

      // Confirm match
      if (newPassword !== confirm) {
        return res.status(400).json({ message: "Confirm password does not match new password" });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({ message: "New password must differ from current password" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Set new password
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
    Register,
    Login,
    Auth,
    ForgotPassword,
    ResetPassword,
    UpdateProfile
};
