const express = require('express')
const app = express()
const port = 8000

const productRoutes = require('./routes/product-routes')

app.use(express.json()) // before routes
app.use('/api',productRoutes)


app.listen(port, () => {
    console.log(`Example app listening on port : http://localhost:${port}`)
})