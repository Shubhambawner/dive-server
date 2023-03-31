const Chat = require('../../models/chat')
const { getItems } = require('../../middleware/db')
const { isIDGood, handleError } = require('../../middleware/utils')

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
    if (req.query.lastMessageId && req.query.lastMessageId!='undefined') {
      console.log('msss', req.query.lastMessageId);
      const lastMessageId = await isIDGood(req.query.lastMessageId)
      query['_id'] = {$lt:lastMessageId}
    }
    res.status(200).json(await getItems(req, Chat, query))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getChat }
