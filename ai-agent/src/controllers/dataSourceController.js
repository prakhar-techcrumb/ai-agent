/**
 * Data source controller for handling data source-related HTTP requests
 */
const dataSourceService = require('../services/dataSourceService');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * Create a new data source
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createDataSource(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required for data source' });
    }

    const dataSource = await dataSourceService.createDataSource(
      req.app.locals.lettaClient,
      name
    );

    return res.json({
      dataSourceId: dataSource.id,
      name: dataSource.name,
      embedding: dataSource.embeddingConfig,
    });
  } catch (error) {
    console.error('Error creating data source:', error);
    return res.status(500).json({ error: `Failed to create data source: ${error.message}` });
  }
}

/**
 * Upload a file to a data source
 * @param {Object} req - Express request object with file
 * @param {Object} res - Express response object
 */
async function uploadToDataSource(req, res) {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'File upload error' });
    }

    try {
      const { dataSourceId } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!dataSourceId) {
        return res.status(400).json({ error: 'Data Source ID is required' });
      }

      // Read the uploaded file
      const fileStream = fs.createReadStream(req.file.path);

      // Upload file to data source
      const uploadJob = await dataSourceService.uploadToDataSource(
        req.app.locals.lettaClient,
        dataSourceId,
        fileStream,
        req.file.originalname
      );

      // Delete the temporary file
      fs.unlink(req.file.path, () => { });

      return res.json({
        jobId: uploadJob.id,
        status: uploadJob.status,
        message: 'File upload job started'
      });
    } catch (error) {
      console.error('Error uploading to data source:', error);
      // Delete the temporary file in case of error
      if (req.file) {
        fs.unlink(req.file.path, () => { });
      }
      return res.status(500).json({ error: `Failed to upload to data source: ${error.message}` });
    }
  });
}

/**
 * List all data sources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listDataSources(req, res) {
  try {
    const sources = await dataSourceService.listDataSources(
      req.app.locals.lettaClient
    );
    return res.json({ sources });
  } catch (error) {
    console.error('Error listing data sources:', error);
    return res.status(500).json({ error: `Failed to list data sources: ${error.message}` });
  }
}

/**
 * List files in a specific data source
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listDataSourceFiles(req, res) {
  try {
    const { dataSourceId } = req.params;

    if (!dataSourceId) {
      return res.status(400).json({ error: 'Data Source ID is required' });
    }

    const files = await dataSourceService.listDataSourceFiles(
      req.app.locals.lettaClient,
      dataSourceId
    );

    return res.json({ dataSourceId, files });
  } catch (error) {
    console.error('Error listing data source files:', error);
    return res.status(500).json({ error: `Failed to list data source files: ${error.message}` });
  }
}

/**
 * List passages in a specific data source
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listDataSourcePassages(req, res) {
  try {
    const { dataSourceId } = req.params;

    if (!dataSourceId) {
      return res.status(400).json({ error: 'Data Source ID is required' });
    }

    const passages = await dataSourceService.listDataSourcePassages(
      req.app.locals.lettaClient,
      dataSourceId
    );

    return res.json({ dataSourceId, passages });
  } catch (error) {
    console.error('Error listing data source passages:', error);
    return res.status(500).json({ error: `Failed to list data source passages: ${error.message}` });
  }
}

/**
 * Attach a data source to an agent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function attachDataSourceToAgent(req, res) {
  try {
    const { agentId, dataSourceId } = req.body;

    if (!dataSourceId) {
      return res.status(400).json({ error: 'Data Source ID is required' });
    }

    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    await dataSourceService.attachDataSourceToAgent(
      req.app.locals.lettaClient,
      agentId,
      dataSourceId
    );

    return res.json({
      success: true,
      message: `Data Source ${dataSourceId} attached to agent ${agentId}`
    });
  } catch (error) {
    console.error('Error attaching data source to agent:', error);
    return res.status(500).json({ error: `Failed to attach data source to agent: ${error.message}` });
  }
}

/**
 * Detach a data source from an agent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function detachDataSourceFromAgent(req, res) {
  try {
    const { agentId, dataSourceId } = req.body;

    if (!dataSourceId) {
      return res.status(400).json({ error: 'Data Source ID is required' });
    }

    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    await dataSourceService.detachDataSourceFromAgent(
      req.app.locals.lettaClient,
      agentId,
      dataSourceId
    );

    return res.json({
      success: true,
      message: `Data Source ${dataSourceId} detached from agent ${agentId}`
    });
  } catch (error) {
    console.error('Error detaching data source from agent:', error);
    return res.status(500).json({ error: `Failed to detach data source from agent: ${error.message}` });
  }
}

module.exports = {
  createDataSource,
  uploadToDataSource,
  listDataSources,
  listDataSourceFiles,
  listDataSourcePassages,
  attachDataSourceToAgent,
  detachDataSourceFromAgent
};

