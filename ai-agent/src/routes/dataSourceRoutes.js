/**
 * Data source routes for data source operations
 */
const express = require('express');
const dataSourceController = require('../controllers/dataSourceController');

const router = express.Router();

// Route to create a new data source
router.post('/create', dataSourceController.createDataSource);

// Route to upload a file to a data source
router.post('/upload', dataSourceController.uploadToDataSource);

// Route to list data sources
router.get('/list', dataSourceController.listDataSources);

// Route to list files in a data source
router.get('/:dataSourceId/files', dataSourceController.listDataSourceFiles);

// Route to list passages in a data source
router.get('/:dataSourceId/passages', dataSourceController.listDataSourcePassages);

// Route to attach a data source to an agent
router.post('/attach', dataSourceController.attachDataSourceToAgent);

// Route to detach a data source from an agent
router.post('/detach', dataSourceController.detachDataSourceFromAgent);

module.exports = router;
