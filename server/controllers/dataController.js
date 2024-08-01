const TableDataModel = require('../models/TableDataModel');
const SeparateWorksModel = require('../models/SeparateWorksModel');
const CategoryModel = require('../models/CategoryModel');

async function getData(req, res) {
    try {
        const categories = await CategoryModel.findAll();

        const headerLabels = [];
        categories.forEach(category => {
            headerLabels.push("Время", "Цена");
        });

        const header = {
            categories: categories.map(category => ({
                name: category.name,
                isColumnVisible: category.isColumnVisible
            })),
            labels: headerLabels
        };

        const table = [];

        const createEmptyRowWithCategory = (categoryName) => {
            const row = [categoryName];
            categories.forEach(category => {
                row.push("");
                row.push("");
            });
            return row;
        };

        // Получение данных о таблице
        const tableData = await TableDataModel.findAll({
            include: CategoryModel,
        });

        table.push(createEmptyRowWithCategory("Итого"));

        tableData.forEach(data => {
            const categoryId = data.Category ? data.Category.id : null;
            const categoryName = data.Category ? data.name : '';

            let row = table.find(row => row[0] === categoryName);

            if (!row) {
                row = createEmptyRowWithCategory(categoryName);
                table.push(row);
            }

            const categoryIndex = categories.findIndex(category => category.id === categoryId);

            if (categoryIndex !== -1) {
                row[categoryIndex * 2 + 1] = data.hours ? data.hours.toString() : "";
                row[categoryIndex * 2 + 2] = data.price ? data.price.toString() : "";
            }
        });

        // Получение данных о "Отдельные виды работ"
        const separateWorksData = await SeparateWorksModel.findAll({
            include: CategoryModel,
        });

        table.push(["Отдельные виды работ"]);

        separateWorksData.forEach(data => {
            const categoryId = data.Category ? data.Category.id : null;
            const categoryName = data.Category ? data.name : '';

            let row = table.find(row => row[0] === categoryName);

            if (!row) {
                row = createEmptyRowWithCategory(categoryName);
                table.push(row);
            }

            const categoryIndex = categories.findIndex(category => category.id === categoryId);

            if (categoryIndex !== -1) {
                row[categoryIndex * 2 + 1] = data.hours ? data.hours.toString() : "";
                row[categoryIndex * 2 + 2] = data.price ? data.price.toString() : "";
            }
        });

        const responseData = {
            header: header,
            table: table
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = {getData};
