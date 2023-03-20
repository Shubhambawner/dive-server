const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { updateProfileInDB, getUserIdByEmail } = require('./helpers')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const addConnection = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    req = matchedData(req)
    console.log(req);
    const connectionEmail = req.connectionEmail
    let connectionId;
    try {
      connectionId = await getUserIdByEmail(connectionEmail)
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
      return;
    }
    res.status(200).json(await Promise.all([
      updateProfileInDB({ $addToSet: { connections: connectionId } }, id),
      updateProfileInDB({ $addToSet: { connections: id } }, connectionId)
    ]))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { addConnection }
