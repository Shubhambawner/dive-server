const express = require('express')
const router = express.Router()


/*
 * Setup routes for index
 */
router.get('/', (req, res) => {
  res.render('index')
})

/*
 * Setup routes for index
 */
router.get('/login', (req, res) => {
  res.render('login')
})
router.get('/register', (req, res) => {
  res.render('register')
})

/*
 * Setup routes for index
 */
router.get('/admin', (req, res) => {
    res.render('admin')
})
router.get('/profile', (req, res) => {
    res.render('profile')
})


module.exports = router
