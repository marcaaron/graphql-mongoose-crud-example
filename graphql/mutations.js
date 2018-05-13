const graphql = require('graphql');
const PageModel = require('../models/page');
const StaffMemberModel = require('../models/StaffMember');

const { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

const { PageType, StaffMemberType } = require('./types');

// Mutations to Create a Page, or Delete / Update an Existing page by ID
// Can Create a new Page without links but all other fields are required!!!
const mutation = new GraphQLObjectType({
  name:'Mutation',
  fields: {
    addPage: {
      type: PageType,
      args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: GraphQLString},
        route: {type: new GraphQLNonNull(GraphQLString)},
        pageType: {type: new GraphQLNonNull(GraphQLString)},
        pageLinks:{type: GraphQLList(GraphQLString)},
        dateCreated:{type: new GraphQLNonNull(GraphQLString)},
        lastModified:{type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {title, content, route, dateCreated, lastModified, pageType}){
        const instance = new PageModel({ title, content, route, dateCreated, lastModified, pageType});
        return instance.save();
      }
    },
    // Delete by ID
    deletePage: {
      type: PageType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {id}){
        return PageModel.findByIdAndRemove(id);
      }
    },
    // Update by ID - pageType & dateCreated are immutable - a page's type can not be changed once instantiated
    updatePage: {
      type: PageType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        route: {type: GraphQLString},
        links:{type: GraphQLList(GraphQLString)},
        pageLinks:{type: GraphQLList(GraphQLString)},
        lastModified:{type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, args){
        return PageModel.findByIdAndUpdate(args.id, args, {new:true});
      }
    },
    addStaffMember: {
      type: StaffMemberType,
      args: {
        firstName: {type: new GraphQLNonNull(GraphQLString)},
        lastName: {type: new GraphQLNonNull(GraphQLString)},
        dept: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLString},
        contact: {type: GraphQLString},
        avatarUrl: {type: GraphQLString},
        route: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {firstName, lastName, dept, description, contact, avatarUrl, route}){
        const instance = new StaffMemberModel ({ firstName, lastName, dept, description, contact, avatarUrl, route});
        return instance.save();
      }
    }
  }
});

module.exports = mutation;
