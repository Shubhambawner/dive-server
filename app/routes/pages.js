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
router.get('/ragister', (req, res) => {
  res.render('ragister')
})

/*
 * Setup routes for index
 */
router.get('/admin', (req, res) => {
  console.log(req.user);
  if(req.user?.role=='admin'){
    res.render('admin')
  }else{
    res.redirect('/pages/login')
  }
})


module.exports = router
