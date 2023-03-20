const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
const getConnectionsFromDB = (id = '') => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .populate('connections', 'email name _id')
      .select('email name _id')
      .exec(async (err, user) => {
        try {
          await itemNotFound(err, user, 'NOT_FOUND')
          resolve(user)
        } catch (error) {
          reject(error)
        }
      })
  })
}

module.exports = { getConnectionsFromDB }
