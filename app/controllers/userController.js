const mongoose = require('mongoose');

const User = mongoose.model('User');
const Tweet = mongoose.model('Tweet');

module.exports = {
  async me(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      const tweetCount = await Tweet.find({ user: user.id }).count();

      return res.status(200).json({
        user,
        tweetCount,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      });
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    try {
      const { userId } = req;

      const {
        name, username, password, confirmPassword,
      } = req.body;

      if (password && password !== confirmPassword) {
        return res.status(400).json({ error: 'Password does not match' });
      }

      const user = await User.findByIdAndUpdate(userId, { name, username }, { new: true });

      if (password) {
        user.password = password;
        await user.save();
      }

      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },
};
