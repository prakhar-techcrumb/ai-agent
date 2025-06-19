/**
 * Data source management service for creating and attaching data sources to agents
 */

/**
 * Get available embedding models from Letta
 * @param {Object} client - Letta client instance
 * @returns {Promise<Array>} Array of available embedding models
 */
async function getEmbeddingConfig(client) {
    try {
        // const embeddingConfigs = await client.models.list();
        return process.env.LETTA_EMBEDDING_MODEL;
    } catch (error) {
        throw new Error(`Failed to get embedding models: ${error.message}`);
    }
}

/**
 * Create a data source
 * @param {Object} client - Letta client instance
 * @param {String} name - Name of the data source
 * @returns {Promise<Object>} Created data source object
 */
async function createDataSource(client, name) {
    try {

        const embeddingConfig = await getEmbeddingConfig(client);
        const source = await client.sources.create({
            name: name,
            embedding: embeddingConfig
        });
        console.log(`Data source created with ID: ${source.id}`);
        return source;
    } catch (error) {
        throw new Error(`Failed to create data source: ${error.message}`);
    }
}

/**
 * Upload a file to a data source
 * @param {Object} client - Letta client instance
 * @param {String} dataSourceId - ID of the data source
 * @param {Stream} fileStream - File stream to upload
 * @returns {Promise<Object>} Job object
 */
async function uploadToDataSource(client, dataSourceId, fileStream) {
    try {
        const job = await client.sources.files.upload({
            source_id: dataSourceId,
            file: fileStream,
        });
        
        console.log(`File upload job created with ID: ${job.id}`);
        return job;
    } catch (error) {
        throw new Error(`Failed to upload file to data source: ${error.message}`);
    }
}

/**
 * Check status of a job
 * @param {Object} client - Letta client instance
 * @param {String} jobId - ID of the job
 * @returns {Promise<Object>} Job status object
 */
async function checkJobStatus(client, jobId) {
    try {
        const job = await client.jobs.retrieve(jobId);
        return job;
    } catch (error) {
        throw new Error(`Failed to check job status: ${error.message}`);
    }
}

/**
 * List all data sources
 * @param {Object} client - Letta client instance
 * @returns {Promise<Array>} List of data sources
 */
async function listDataSources(client) {
    try {
        const sources = await client.sources.list();
        return sources;
    } catch (error) {
        throw new Error(`Failed to list data sources: ${error.message}`);
    }
}

/**
 * List files in a data source
 * @param {Object} client - Letta client instance
 * @param {String} dataSourceId - ID of the data source
 * @returns {Promise<Array>} List of files in the data source
 */
async function listDataSourceFiles(client, dataSourceId) {
    try {
        const files = await client.sources.files.list({
            source_id: dataSourceId
        });
        return files;
    } catch (error) {
        throw new Error(`Failed to list data source files: ${error.message}`);
    }
}

/**
 * List passages in a data source
 * @param {Object} client - Letta client instance
 * @param {String} dataSourceId - ID of the data source
 * @returns {Promise<Array>} List of passages in the data source
 */
async function listDataSourcePassages(client, dataSourceId) {
    try {
        const passages = await client.sources.passages.list({
            source_id: dataSourceId
        });
        return passages;
    } catch (error) {
        throw new Error(`Failed to list data source passages: ${error.message}`);
    }
}

/**
 * Attach a data source to an agent
 * @param {Object} client - Letta client instance
 * @param {string} agentId - Agent ID
 * @param {string} dataSourceId - Data source ID
 * @returns {Promise<void>}
 */
async function attachDataSourceToAgent(client, agentId, dataSourceId) {
    try {
        await client.agents.sources.attach(agentId, dataSourceId);
        console.log(`Data source ${dataSourceId} attached to agent ${agentId}`);
    } catch (error) {
        throw new Error(`Failed to attach data source to agent: ${error.message}`);
    }
}

/**
 * Detach a data source from an agent
 * @param {Object} client - Letta client instance
 * @param {string} agentId - Agent ID
 * @param {string} dataSourceId - Data source ID
 * @returns {Promise<void>}
 */
async function detachDataSourceFromAgent(client, agentId, dataSourceId) {
    try {
        await client.agents.sources.detach(agentId, dataSourceId);
        console.log(`Data source ${dataSourceId} detached from agent ${agentId}`);
    } catch (error) {
        throw new Error(`Failed to detach data source from agent: ${error.message}`);
    }
}

module.exports = {
    getEmbeddingConfig,
    createDataSource,
    uploadToDataSource,
    checkJobStatus,
    listDataSources,
    listDataSourceFiles,
    listDataSourcePassages,
    attachDataSourceToAgent,
    detachDataSourceFromAgent
};
