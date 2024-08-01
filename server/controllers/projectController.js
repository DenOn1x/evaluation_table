const ProjectModel = require('../models/projectModel');

async function addProject(req, res) {
    try {
        const {projectName, hourlyRate, totalTime, totalPrice} = req.body;

        if (!projectName || !hourlyRate || !totalTime || !totalPrice) {
            return res.status(400).json({error: 'Invalid data format'});
        }

        const newProject = await ProjectModel.create({
            projectName,
            hourlyRate,
            totalTime,
            totalPrice
        });

        res.status(201).json({message: 'Project added successfully', project: newProject});
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

async function getProjects(req, res) {
    try {
        const projects = await ProjectModel.findAll();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = {addProject, getProjects};
