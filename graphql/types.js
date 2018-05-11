const graphql = require('graphql');
const PageModel = require('../models/page');
const StaffMemberModel = require('../models/StaffMember');
const mongoose = require('mongoose');

const { GraphQLNonNull, GraphQLScalarType, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

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
        return PageModel.find({_id: {$in: parentValue.links }})
        .then(res => res.sort((a,b)=>{
          return parentValue.links.indexOf(a._id) - parentValue.links.indexOf(b._id)
        }));
      }
    }
  })
});

// Staff Member Type

const StaffMemberType = new GraphQLObjectType({
  name:'Staff',
  fields: () => ({
    id:{type: GraphQLString},
    firstName:{type: GraphQLString},
    lastName:{type: GraphQLString},
    dept:{type: GraphQLString},
    description:{type: GraphQLString},
    contact:{type: GraphQLString},
    route:{type: GraphQLString},
    avatarUrl:{type: GraphQLString}
  })
});

// S3 Media Type

const MediaType = new GraphQLObjectType({
  name:'Media',
  fields: ()=>({
    key:{type: GraphQLString},
    lastModified: {type: GraphQLString},
    urlString: {type: GraphQLString}
  })
});

module.exports = { PageType, StaffMemberType, MediaType };
