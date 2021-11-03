const { reviews } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    // JUST FOR TESTING PURPOSES
    // console.log(req.headers.authorization);
    const accessTokenData = { id: req.headers.authorization };
    // const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: 'You\'re not logged in' });
    } else {
      const { historyId, review } = req.body;
        const userReview = await reviews.findAll({
          where: {
            historyId: historyId
          }
        });

        if (userReview.length > 0) {
          return res.status(409).json({ message: 'already wrote the review' });
        } else {
          await reviews.create({
            historyId: historyId,
            review: review
          });
  
          return res.status(200).json({ message: 'ok' });
        }
    }
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
