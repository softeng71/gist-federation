const { ApolloServer, gql} = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const DBDataSource = require("./DBDataSource");

const isFavorite = async (gistId, context) => {
    const resp = await context.dataSources.dbAPI.isFavorite(gistId);
    return resp.length > 0;
}

const typeDefs = gql`
    extend type Gist @key(fields: "id") {
        id: ID! @external
        favorite: Boolean
    }
    
    type Favorites {
        gists: [Gist]
    }

    extend type Query {
        getFavoriteGists: Favorites
    }
    
    extend type Mutation {
        makeFavorite(gistId: ID!): Boolean
        removeFromFavorites(gistId: ID!): Boolean
    }
`;

const resolvers = {
    Query: {
        getFavoriteGists: async (parent, _, context) => {
            const resp = await context.dataSources.dbAPI.getFavorites();
            const finalResponse =  resp.map(ent=> ({ id: ent["gist-id"].trim(), favorite: true }));
            return finalResponse;
        }
    },
    Mutation: {
        makeFavorite: async (parent, { gistId }, context) => {
            console.log(gistId);
            const resp = await context.dataSources.dbAPI.addFavorite(gistId);
            if (resp) {
                return true;
            }
        },
        removeFromFavorites: async (parent, { gistId }, context) => {
            console.log(gistId);
            const resp = await context.dataSources.dbAPI.removeFavorite(gistId);
            if (resp) {
                return true;
            }
        }
    },
    Gist: {
        favorite(gist, _, context) {
            return isFavorite(gist.id, context);
        }
    },
    Favorites: {
        gists: favorites => {
            return favorites.map(async fav => await({ __typename: "Gist", id: fav.id }));
        }
    }
};

const knexConfig = {
    client: "pg",
    connection: {
        host: "localhost",
        database: "postgres"
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    dataSources: () => {
        return {
            dbAPI: new DBDataSource(knexConfig)
        }
    }
});

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4200 }).then(({ url }) => {
    console.log(`🚀 Gist Service Server ready at ${url}`);
});
