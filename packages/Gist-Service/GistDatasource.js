const { RESTDataSource } = require("apollo-datasource-rest");

class GistDatasource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://api.github.com";
        this.headers = { Accept: "application/vnd.github.v3+json" };
    }

    async getGistsByUserName(userName) {
        const path = `${this.baseURL}/users/${userName}/gists`;
        return this.get(path, null, {
            headers: this.headers
        });
    }

    async getGistById(gistId) {
        const path = `${this.baseURL}/gists/${gistId}`;
        return this.get(path, null, {
            headers: this.headers
        });
    }
};

module.exports = GistDatasource;
