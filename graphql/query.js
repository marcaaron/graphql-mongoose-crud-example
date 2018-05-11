const graphql = require('graphql');
const PageModel = require('../models/page');
const StaffMemberModel = require('../models/StaffMember');
const mongoose = require('mongoose');
const { PageType, StaffMemberType, MediaType } = require('./types');
const getS3Media = require('./helpers/getS3Media');
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
    },
    allStaff:{
      type: new GraphQLList(StaffMemberType),
      resolve(parentValue, args){
        return StaffMemberModel.find();
      }
    },
    allMedia:{
      type: new GraphQLList(MediaType),
      resolve(parentValue, args){
        return getS3Media().then(res=>res);
      }
    },
    staffById:{
      type: StaffMemberType,
      args: {id: {type: GraphQLString}},
      resolve(parentValue, args){
        return StaffMemberModel.findOne({_id:args.id});
      }
    }
  }
});

module.exports = RootQuery;
