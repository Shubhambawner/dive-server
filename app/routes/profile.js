const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const {
  getProfile,
  updateProfile,
  changePassword,
  addConnection,
  getConnections
} = require('../controllers/profile')

const {
  validateUpdateProfile,
  validateChangePassword,
  validateAddConnection
} = require('../controllers/profile/validators')

/*
 * Profile routes
 */

/*
 * Get profile route
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['visitor','user', 'admin']),
  trimRequest.all,
  getProfile
)

/*
 * Update profile route
 */
router.patch(
  '/',
  requireAuth,
  roleAuthorization(['visitor','user', 'admin']),
  trimRequest.all,
  validateUpdateProfile,
  updateProfile
)

/*
 * Add connection route
 */
router.post(
  '/connection',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateAddConnection,
  addConnection
)

/*
 * Add connection route
 */
router.get(
  '/connections',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getConnections
)

/*
 * Change password route
 */
router.post(
  '/changePassword',
  requireAuth,
  roleAuthorization(['visitor','user', 'admin']),
  trimRequest.all,
  validateChangePassword,
  changePassword
)

module.exports = router
