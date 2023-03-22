const User = require('../../../models/user')
const { isIDGood, handleError } = require('../../../middleware/utils')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds id by email
 * @param {string} id - user id
 */
const getUserIdByEmail = (email) => {
  console.log(email);
  return new Promise((resolve, reject) => {
    User.findOne({email:email, role:'user'}).exec(async (err, user) => {
      console.log(err, user);
      try {
        await itemNotFound(err, user, 'USER_EMAIL_DOES_NOT_EXIST')
        const id = await isIDGood(user._id)
        resolve(id)

      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { getUserIdByEmail }
