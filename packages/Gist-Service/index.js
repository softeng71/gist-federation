const { ApolloServer, gql} = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const GistDatasource = require("./GistDatasource");
const getGistByUserName = require("./GetGistsByUserName");
const getGistById = require("./GetGistById");

const typeDefs = gql`
    type Gist @key(fields: "id") {
        url: String
        forks_url: String
        commits_url: String
        id: ID!
        node_id: String
        git_pull_url: String
        git_push_url: String
        html_url: String
        files: [File]
        public: Boolean
        created_at: String
        updated_at: String
        description: String
        comments: Int
        user: String
        comments_url: String
        owner: Owner
        truncated: Boolean
    }
    
    type File {
        filename: String
        type: String
        language: String
        raw_url: String
        size: Int
    }

    type Owner {
        login: String
        id: ID!
        node_id: String
        avatar_url: String
        gravatar_id: String
        url: String
        html_url: String
        followers_url: String
        following_url: String
        gists_url: String
        starred_url: String
        subscriptions_url: String
        organizations_url: String
        repos_url: String
        events_url: String
        received_events_url: String
        type: String
        site_admin: Boolean
    }
    
    extend type Query {
        getGistsByUserName(userName: String!): [Gist]
        getGistById(gistId: ID!): Gist
    }
`;

const resolvers = {
    Query: {
        getGistsByUserName: (parent, { userName }, context) => getGistByUserName(userName, context),
        getGistById: (parent, { gistId }, context) => getGistById(gistId, context)
    },
    Gist: {
        __resolveReference: ({ id }, context) => {
            return getGistById(id, context)
        }
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    dataSources: () => {
        return {
            gistAPI: new GistDatasource()
        }
    }
});

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4100 }).then(({ url }) => {
    console.log(`🚀 Gist Service Server ready at ${url}`);
});
