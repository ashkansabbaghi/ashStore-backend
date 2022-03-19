const express = require('express')
const app = express()

//variable
const port = 8000

const productRoutes = require('./src/routes/product-routes')
const Connections = require('./src/db/connections/mongodb')

app.use(express.json()) // before routes
app.use('/api', productRoutes)

Connections.connections
    .then(
        app.listen(port, () => {
            console.log(`port : http://localhost:${port}`)
        }))
    .catch((e) => console.log(e))