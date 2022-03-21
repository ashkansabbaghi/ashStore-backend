const express = require('express')
const app = express()
require('dotenv').config() //file .env

const PORT = process.env.PORT || 8080;

// import routes
const productRoutes = require('./src/routes/product-routes')
const authRoutes = require('./src/routes/auth-routes')

const MongoDB = require('./src/db/connections/mongodb')

app.use(express.json()) // before routes
app.use('/api', productRoutes, authRoutes)

MongoDB.connections
    .then(
        app.listen(PORT, () => {
            console.log(`port : ${process.env.URL}${PORT}`)
        }))
    .catch((e) => console.log(e))