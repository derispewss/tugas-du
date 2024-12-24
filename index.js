const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const routesPath = path.join(__dirname, 'routes')
const routeFiles = fs.readdirSync(routesPath)

routeFiles.forEach(file => {
    if (file.endsWith('.js')) {
        const routeName = file.replace('.js', '')
        app.use('/api', require(`./routes/${routeName}`))
    }
})

app.listen(4000, () => {
    console.log('Documentation is running on http://localhost:4000/docs')
    console.log('Server is running on port http://localhost:4000')
})