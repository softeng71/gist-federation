const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

// Initialize an ApolloGateway instance and pass it an array of
// your implementing service names and URLs
const gateway = new ApolloGateway({
    serviceList: [
        { name: 'gist', url: 'http://localhost:4100' },
        { name: 'db', url: 'http://localhost:4200' }
    ],
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
    gateway,
    // Disable subscriptions (not currently supported with ApolloGateway)
    subscriptions: false,
});

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4050 }).then(({ url }) => {
    console.log(`🚀 Gist Service Server ready at ${url}`);
});
