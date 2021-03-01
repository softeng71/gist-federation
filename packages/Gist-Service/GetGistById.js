const reduceFiles = require("./ReduceFiles");

const getGistById = async (gistId, context) => {
    const apiResponse = await context.dataSources.gistAPI.getGistById(gistId);
    return ({...apiResponse, files: reduceFiles(apiResponse.files)});
}

module.exports = getGistById;
