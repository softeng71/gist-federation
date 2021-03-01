const { SQLDataSource } = require("datasource-sql");

const MINUTE = 60;

class MyDatabase extends SQLDataSource {
    getFavorites() {
        return this.knex
            .select("gist-id")
            .from("favorites");
    }

    isFavorite(gistId) {
        return this.knex
            .select("gist-id")
            .from("favorites")
            .where({ "gist-id": gistId });
    }

    addFavorite(gistId) {
        return this.knex("favorites")
            .insert({ "gist-id": gistId })
    }

    removeFavorite(gistId) {
        return this.knex("favorites")
            .where({ "gist-id": gistId })
            .delete()
    }
}

module.exports = MyDatabase;
