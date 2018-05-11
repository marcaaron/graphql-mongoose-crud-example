const graphql = require('graphql');
const mongoose = require('mongoose');
const RootQuery = require('./query.js');

const { GraphQLSchema } = graphql;

const mutation = require('./mutations');

// Export our Scheme with query and mutation objects attached
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
