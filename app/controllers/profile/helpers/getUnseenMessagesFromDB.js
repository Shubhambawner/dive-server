const Chat = require('../../../models/chat')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
const getUnseenMessagesFromDB = (userId = '') => {
  // todo complete this: high priority
  return new Promise((resolve,reject)=>{
    resolve([])
  })
}

module.exports = { getUnseenMessagesFromDB }
