const { changePasswordInDB } = require('./changePasswordInDB')
const { findUser } = require('./findUser')
const { getProfileFromDB } = require('./getProfileFromDB')
const { getConnectionsFromDB } = require('./getConnectionsFromDB')
const { updateProfileInDB } = require('./updateProfileInDB')
const { getUserIdByEmail } = require('./getUserIdByEmail')

module.exports = {
  changePasswordInDB,
  findUser,
  getProfileFromDB,
  updateProfileInDB,
  getConnectionsFromDB,
  getUserIdByEmail
}
