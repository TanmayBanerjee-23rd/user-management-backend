const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const resolvers = require('./resolvers');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    if (token) {
      try {
        const user = jwt.verify(token.replace('Bearer ', ''), 'your-secret-key');
        return { user };
      } catch (error) {
        throw new Error('Invalid token');
      }
    }
    return {};
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});