require('dotenv').config()
const express = require('express')
const {configDotenv} = require("dotenv");
const sequelize = require('./db')
const cors = require('cors')

const PORT = process.env.PORT || 8000


const dataRoutes = require('./routes/dataRoutes');
const favoritesRoutes = require('./routes/favoriteRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express()
app.use(cors())
app.use(express.json())
app.use('/data', dataRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/projects', projectRoutes);

const handleServer = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
handleServer()




