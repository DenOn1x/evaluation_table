const FavoriteModel = require('../models/favoriteModel');

async function addFavorite(req, res) {
    try {
        const {name, header, table} = req.body;

        if (!name || !header || !table) {
            return res.status(400).json({error: 'Invalid data format'});
        }

        await FavoriteModel.create({name, header, table});

        res.status(200).json({message: 'Favorite added successfully'});
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

async function getFavorites(req, res) {
    try {
        const favorites = await FavoriteModel.findAll();
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = {addFavorite, getFavorites};
