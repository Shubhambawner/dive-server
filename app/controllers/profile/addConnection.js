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
      //? no way to find out was it added to set, or already existed in there, as api returns modified document...
      updateProfileInDB({ $addToSet: { connections: connectionId } }, id, true).then(response => {
        return response.connections.indexOf(connectionId) >= 0 ? { code: 304, message: 'YOU_ALREADY_ADDED' } : response
      }),
      updateProfileInDB({ $addToSet: { connections: id } }, connectionId, true).then(response => {
        return response.connections.indexOf(id) >= 0 ? { code: 304, message: 'YOU_WERE_ALREADY_ADDED' } : response
      })
    ]))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { addConnection }
