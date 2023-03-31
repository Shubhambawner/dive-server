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
  getChat,
} = require('../controllers/chat')


/*
 * Chat routes
 */

/*
 * Get Chat route
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['user','admin']),
  trimRequest.all,
  getChat
)

module.exports = router
