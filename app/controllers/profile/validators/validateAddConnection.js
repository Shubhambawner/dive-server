const { validateResult } = require('../../../middleware/utils')
const validator = require('validator')
const mongoose = require('mongoose')
const { check } = require('express-validator')

/**
 * Validates add connection request
 */
const validateAddConnection = [
  check('connectionEmail')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateAddConnection }
