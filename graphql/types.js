const graphql = require('graphql');
const PageModel = require('../models/page');
const mongoose = require('mongoose');

const { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

// Set Up a Page Type
  // Links = an array of page ids to populate the childPages field
  // Each Child Page Can have it's own Child Pages if it has links to populate this field

const PageType = new GraphQLObjectType({
  name:'Page',
  fields: () => ({
    id:{type: GraphQLString},
    title:{type: GraphQLString},
    content:{type: GraphQLString},
    route:{type: GraphQLString},
    links:{type: GraphQLList(GraphQLString)},
    childPages:{
      type: GraphQLList(PageType),
      resolve(parentValue, args){
        return PageModel.find({_id: {$in: parentValue.links }}).then(res=>res);
      }
    }
  })
});

module.exports = PageType;
