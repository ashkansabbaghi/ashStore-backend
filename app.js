const express = require('express')
const app = express()
const mongoose = require('mongoose')

//variable
const port = 8000

const productRoutes = require('./routes/product-routes')

app.use(express.json()) // before routes
app.use('/api', productRoutes)

mongoose.connect("mongodb://127.0.0.1:27017/ashstore")
    .then(
        app.listen(port, () => {
            console.log(`port : http://localhost:${port}`)
        }))
    .catch((e) => console.log(e))