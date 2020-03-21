const mongoose = require("mongoose");
const sendMail = require("../services/mailer");

const User = mongoose.model("User");

module.exports = {
  async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      if (!(await user.compareHash(password))) {
        return res.status(400).json({ error: "Invalid password" });
      }

      return res.status(200).json({
        user,
        token: user.generateToken()
      });
    } catch (error) {
      return next(error);
    }
  },
  async signup(req, res, next) {
    try {
      const { email, username } = req.body;

      if (await User.findOne({ $or: [{ email }, { username }] })) {
        return res.status(400).json({
          error: "User already exists"
        });
      }

      const user = await User.create(req.body);

      await sendMail({
        from: `${user.name} <${user.email}>`,
        to: "03d20499fc1543488f2e@mailspons.com",
        subject: `Welcome to my Rest API ${user.username}`,
        template: "auth/register",
        context: {
          name: user.name,
          username: user.username
        }
      });

      return res.status(200).json({
        user,
        token: user.generateToken()
      });
    } catch (error) {
      return next(error);
    }
  }
};
