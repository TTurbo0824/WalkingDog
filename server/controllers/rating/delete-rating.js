const { ratings } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: 'You\'re not logged in' });
    } else {
      const { historyId } = req.body;
      console.log(req.body);
      const userRating = await ratings.findAll({
        where: {
          historyId: historyId
        }
      });

      if (userRating.length === 0) {
        return res.status(409).json({ message: 'Rating is already deleted' });
      } else {
        await ratings.destroy({
          where: {
            historyId: historyId
          }
        });
        return res.status(200).json({ message: 'ok' });
      }
    }
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
