const { getConnectionsFromDB } = require('./helpers')
const { isIDGood, handleError } = require('../../middleware/utils')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getConnections = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    res.status(200).json(await getConnectionsFromDB(id))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getConnections }
