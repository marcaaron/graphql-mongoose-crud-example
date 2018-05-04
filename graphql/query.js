const graphql = require('graphql');
const PageModel = require('../models/page');
const mongoose = require('mongoose');
const PageType = require('./types');

const { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

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
    pageByRoute:{
      type: PageType,
      args: { route: {type: GraphQLString}},
      resolve(parentValue, args){
        return PageModel.findOne({route:args.route});
      }
    },
    pageByTitle:{
      type: PageType,
      args: { title: {type: GraphQLString}},
      resolve(parentValue, args){
        return PageModel.findOne({title:args.title});
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

module.exports = RootQuery;
