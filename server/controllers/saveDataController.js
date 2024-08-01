const TableDataModel = require('../models/TableDataModel');
const SeparateWorksModel = require('../models/SeparateWorksModel');

async function saveData(req, res) {
    try {
        const {tableData, separateWorksData} = req.body;

        console.log('Request body:', req.body);

        if (!Array.isArray(tableData) || !Array.isArray(separateWorksData)) {
            console.error('Invalid data format');
            return res.status(400).json({error: 'Invalid data format'});
        }

        const tableDataCountBefore = await TableDataModel.count();
        const separateWorksDataCountBefore = await SeparateWorksModel.count();
        console.log('TableData count before deletion:', tableDataCountBefore);
        console.log('SeparateWorksData count before deletion:', separateWorksDataCountBefore);

        await TableDataModel.destroy({where: {}});
        await SeparateWorksModel.destroy({where: {}});

        const tableDataCountAfter = await TableDataModel.count();
        const separateWorksDataCountAfter = await SeparateWorksModel.count();
        console.log('TableData count after deletion:', tableDataCountAfter);
        console.log('SeparateWorksData count after deletion:', separateWorksDataCountAfter);

        if (tableDataCountAfter > 0 || separateWorksDataCountAfter > 0) {
            console.error('Failed to delete existing records');
            return res.status(500).json({error: 'Failed to delete existing records'});
        }

        for (const data of tableData) {
            console.log('Saving tableData:', data);
            await TableDataModel.create({
                name: data.name || '',
                hours: data.hours ?? null,
                price: data.price ?? null,
                categoryId: data.categoryId ?? null
            });
        }

        for (const data of separateWorksData) {
            console.log('Saving separateWorksData:', data);
            await SeparateWorksModel.create({
                name: data.name || '',
                hours: data.hours ?? null,
                price: data.price ?? null,
                categoryId: data.categoryId ?? null
            });
        }

        const tableDataCountFinal = await TableDataModel.count();
        const separateWorksDataCountFinal = await SeparateWorksModel.count();
        console.log('TableData count after insertion:', tableDataCountFinal);
        console.log('SeparateWorksData count after insertion:', separateWorksDataCountFinal);

        res.status(200).json({message: 'Success'});
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({error: 'Server error'});
    }
}

module.exports = {saveData};
