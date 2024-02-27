const TableDataModel = require('../models/TableDataModel');
const SeparateWorksModel = require('../models/SeparateWorksModel');

async function saveData(req, res) {
    try {
        const {tableData, separateWorksData} = req.body;

        if (!tableData || !separateWorksData) {
            return res.status(400).json({error: 'No data in the request body'});
        }

        await Promise.all(tableData.map(async (data) => {
            await TableDataModel.create({
                name: data.name,
                hours: data.hours || null,
                price: data.price || null,
                categoryId: data.categoryId || null
            });
        }));

        await Promise.all(separateWorksData.map(async (data) => {
            await SeparateWorksModel.create({
                name: data.name,
                hours: data.hours || null,
                price: data.price || null,
                categoryId: data.categoryId || null
            });
        }));

        res.status(200).json({message: 'Success'});
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({error: 'Server error'});
    }
}

module.exports = {saveData};
