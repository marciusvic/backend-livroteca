const express = require('express')
const router = express.Router()
const userController = require('./controller/userController')
const bookController = require('./controller/bookContoller')

router.get('/', (req, res) => res.status(200).send('router is working as well'))
//User routes
router.post('/auth/register', userController.registerUser)
router.get('/users', userController.getUsers)
router.get('/user/:id', userController.getUser)
router.put('/user/:id', userController.checkToken, userController.updateUser)
router.delete('/user/:id', userController.checkToken, userController.deleteUser)
router.post('/auth/login', userController.loginUser)

//Book routes
router.post('/book', userController.checkToken, bookController.createBook)
router.get('/books', bookController.getBooks)
router.get('/book/:id', bookController.getBook)
router.put('/book/:id', userController.checkToken, bookController.updateBook)
router.delete('/book/:id', userController.checkToken, bookController.deleteBook)

module.exports = router
