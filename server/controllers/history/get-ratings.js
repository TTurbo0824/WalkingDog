const { ratings, histories } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    // JUST FOR TESTING PURPOSES
    // console.log(req.headers.authorization);
    // const accessTokenData = { id: req.headers.authorization };
    
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: 'You\'re not logged in' });
    } else {
      let allHistories = await histories.findAll({
        include: [{
          model: ratings,
          attributes: ['historyIndex']
        }],
        where: {
          userId: accessTokenData.id
        },
        attributes: ['historyId', 'dogwalkerId']
      });

      allHistories = Sequelize.getValues(allHistories);
      allHistories = allHistories.filter((el) => el.ratings.length > 0);

      allHistories = allHistories.map((el) => {
        el.index = el.ratings[0].historyIndex;
        delete el.ratings;
        return el;
      });

      if (allHistories.length === 0) {
        res.status(404).json({ message: 'No given reviews are found' });
      }

      res.status(200).json({ data: allHistories, message: 'ok' });
    }
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};