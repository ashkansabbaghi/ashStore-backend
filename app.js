const express = require('express')
const app = express()
require('dotenv').config() //.env

const PORT = process.env.PORT || 8080;

const productRoutes = require('./src/routes/product-routes')
const MongoDB = require('./src/db/connections/mongodb')

app.use(express.json()) // before routes
app.use('/api', productRoutes)

MongoDB.connections
    .then(
        app.listen(PORT, () => {
            console.log(`port : ${process.env.URL}${PORT}`)
        }))
    .catch((e) => console.log(e))