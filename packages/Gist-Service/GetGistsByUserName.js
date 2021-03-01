const reduceFiles = require("./ReduceFiles");

const getGistByUserName = async (userName, context) => {
    const apiResponse = await context.dataSources.gistAPI.getGistsByUserName(userName);
    return apiResponse.map(gist => ({...gist, files: reduceFiles(gist.files)}));
}

module.exports = getGistByUserName;
