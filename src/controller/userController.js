require('dotenv').config()
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function registerUser(req, res) {
    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword) {
        return res.status(422).json({ msg: 'All fields are required' })
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ msg:'Passwords do not match' })
    }
    const userExist = await User.findOne({ email: email })
    if (userExist) {
        return res.status(422).json({ msg:'User already exists' })
    }
    const salt = await bycrypt.genSalt(12)
    const hashedPassword = await bycrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: hashedPassword
    })

    try {
        await user.save()
        res.status(201).json({ msg: 'User registered successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.find({}, '-password')
        res.status(200).json({ users: users })
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

async function getUser(req, res) {
    const userId = req.params.id
    try {
        const user = await User.findById(userId, '-password')
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        res.status(200).json({ user: user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

async function updateUser(req, res) {
    const userId = req.params.id
    const { name, email, password } = req.body
    try{
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({msg: 'User not found'})
        }
        if(name){
            user.name = name
        }
        if(email){
            user.email = email
        }
        if(password){
            const salt = await bycrypt.genSalt(12)
            user.password = await bycrypt.hash(password, salt)
        }
        await user.save()
        res.status(200).json({msg: 'User updated successfully'})

    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

async function deleteUser(req, res) {
    const userId = req.params.id
    try {
        const user = await User.findByIdAndUpdate(userId, { deletedAt: new Date() }, { new: true })
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        res.status(200).json({ msg: 'User marked as deleted successfully' })
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' })
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(422).json({ msg: 'All fields are required' })
    }

    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(404).json({ msg: 'User does not exist' })
        }
        if (user.deletedAt) {
            return res.status(403).json({ msg: 'Account has been deleted' })
        }

        const isMatch = await bycrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(422).json({ msg: 'Invalid credentials' })
        }

        const secret = process.env.SECRET_KEY
        const token = jwt.sign(
            { 
                id: user._id,
            },
            secret
        )

        res.status(200).json({ msg: 'User logged in successfully', token: token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}


function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ msg: 'Access denied' })
    }
    try {
        const secret = process.env.SECRET_KEY
        const verified = jwt.verify(token, secret)
        req.user = verified
        next()
    } catch (err) {
        res.status(403).json({ msg: 'Invalid token' })
    }
}

module.exports = {
    registerUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
    checkToken
}
