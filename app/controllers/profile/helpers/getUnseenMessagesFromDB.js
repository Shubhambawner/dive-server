const Chat = require('../../../models/chat')
const { itemNotFound, isIDGood } = require('../../../middleware/utils')
const { getItems } = require('../../../middleware/db')

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
const getUnseenMessagesFromDB = async (userId = '') => {
  // todo complete this: high priority
  try {
    const query = {
      receiverId: userId,
      status: 'unseen'
    }
    let data = await getItems({query:{page:1,limit:100}}, Chat, query)
    return data.docs || []
  } catch (error) {
    console.error(error);
    return []
  }

}

module.exports = { getUnseenMessagesFromDB }
