const mongoose = require('mongoose');

const Tweet = mongoose.model('Tweet');

module.exports = {
  async toggle(req, res, next) {
    try {
      const tweet = await Tweet.findById(req.params.id);

      if (!tweet) {
        return res.status(404).json({ error: 'Tweet Not Found' });
      }

      const liked = tweet.likes.indexOf(req.userId);

      if (liked === -1) {
        tweet.likes.push(req.userId);
      } else {
        tweet.likes.splice(liked);
      }
      await tweet.save();

      return res.status(200).json(tweet);
    } catch (error) {
      return next(error);
    }
  },
};
