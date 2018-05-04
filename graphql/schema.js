const graphql = require('graphql');
const PageModel = require('../models/page');
const mongoose = require('mongoose');
const RootQuery = require('./query.js');

const { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

const PageType = require('./types');
const mutation = require('./mutations');

// Export our Scheme with query and mutation objects attached
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
