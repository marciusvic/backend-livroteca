const express = require('express')
const router = express.Router()
const userController = require('./controller/userController')

router.get('/', (req, res) => res.status(200).send('router is working as well'))

router.post('/auth/register', userController.registerUser)
router.get('/users', userController.getUsers)
router.get('/user/:id', userController.getUser)
router.put('/user/:id', userController.checkToken, userController.updateUser)
router.delete('/user/:id', userController.checkToken, userController.deleteUser)
router.post('/auth/login', userController.loginUser)

module.exports = router
