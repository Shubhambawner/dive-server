const Chat = require('../../models/chat')
const { getItems } = require('../../middleware/db')
const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { getLatestChatFromDB, getLatestChatBeforeFromDB } = require('./helpers')

/**
 * get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getChat = async (req, res) => {
  try {

    const userId = await isIDGood(req.query.user)
    const query = {
      $or: [
        { senderId: userId, receiverId: req.user._id },
        { senderId: req.user._id, receiverId: userId },
      ]
    }
    res.status(200).json(await getItems(req, Chat, query))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getChat }
