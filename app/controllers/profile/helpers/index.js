const { changePasswordInDB } = require('./changePasswordInDB')
const { findUser } = require('./findUser')
const { getProfileFromDB } = require('./getProfileFromDB')
const { getConnectionsFromDB } = require('./getConnectionsFromDB')
const { getUnseenMessagesFromDB } = require('./getUnseenMessagesFromDB')
const { updateProfileInDB } = require('./updateProfileInDB')
const { getUserIdByEmail } = require('./getUserIdByEmail')

module.exports = {
  changePasswordInDB,
  findUser,
  getProfileFromDB,
  updateProfileInDB,
  getConnectionsFromDB,
  getUserIdByEmail,
  getUnseenMessagesFromDB
}
