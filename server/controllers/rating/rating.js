const { ratings } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: 'You\'re not logged in' });
    } else {
      const { id, historyIndex, rating } = req.body;

      const userRating = await ratings.findAll({
        where: {
          historyId: id
        }
      });
      console.log(userRating);

      if (userRating.length > 0) {
        return res.status(409).json({ message: 'Already gave the rating' });
      } else {
        await ratings.create({
          historyId: id,
          historyIndex: historyIndex,
          rating: rating
        });

        return res.status(200).json({ message: 'ok' });
      }
    }
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
