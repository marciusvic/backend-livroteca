require('dotenv').config()
const app = require('./app')
const mongoose = require('mongoose')

const port = 3000

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS


mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.3ovkuwv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    })
    .catch((err) => console.log(err))

