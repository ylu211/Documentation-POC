const express = require('express')
const bodyParser = require('body-parser')
const productRoutes = require('./routes/product.route')

const app = express()
app.use(bodyParser.json())

app.use('/products', productRoutes)

require('./swagger')(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`))
