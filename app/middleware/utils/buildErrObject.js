/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
const buildErrObject = (code = '', message = '', info) => {
  return {
    code,
    message, ...info
  }
}

module.exports = { buildErrObject }
