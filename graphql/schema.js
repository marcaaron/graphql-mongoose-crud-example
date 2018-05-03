const graphql = require('graphql');
const PageModel = require('../models/page');
const mongoose = require('mongoose');

const { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

const PageType = require('./types');
const mutation = require('./mutations');

// Queries for a specific Page by ID and All Pages

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    pageById:{
      type: PageType,
      args: { id: {type: GraphQLString}},
      resolve(parentValue, args){
        return PageModel.findOne({_id:args.id});
      }
    },
    allPages:{
      type: new GraphQLList(PageType),
      resolve(parentValue, args){
        return PageModel.find();
      }
    }
  }
});


// Export our Scheme with query and mutation objects attached
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
