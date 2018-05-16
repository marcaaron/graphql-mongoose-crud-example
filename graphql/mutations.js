const graphql = require('graphql');

// Models
const PageModel = require('../models/page');
const StaffMemberModel = require('../models/StaffMember');
const EventModel = require('../models/Event');


const { GraphQLNonNull, GraphQLBoolean, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

// GQL Types
const { PageType, StaffMemberType, EventType } = require('./types');

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
    // Delete by ID
    deleteEvent: {
      type: EventType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {id}){
        return EventModel.findByIdAndRemove(id);
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
    updateEvent:{
      type: EventType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: GraphQLString},
        eventDate: {type: GraphQLString},
        startTime: {type: GraphQLString},
        endTime: {type: GraphQLString},
        content: {type: GraphQLString},
        location: {type: GraphQLString},
        lastModified: {type: new GraphQLNonNull(GraphQLString)},
        category: {type: GraphQLString},
        allDay:{type: new GraphQLNonNull(GraphQLBoolean)}
      },
      resolve(parentValue, args){
        return EventModel.findByIdAndUpdate(args.id, args, {new:true});
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
    },
    addEvent: {
      type: EventType,
      args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
        eventDate: {type: new GraphQLNonNull(GraphQLString)},
        startTime: {type: GraphQLString},
        endTime: {type: GraphQLString},
        content: {type: GraphQLString},
        location: {type: GraphQLString},
        dateCreated: {type: new GraphQLNonNull(GraphQLString)},
        lastModified: {type: new GraphQLNonNull(GraphQLString)},
        category: {type: GraphQLString},
        allDay:{type: new GraphQLNonNull(GraphQLBoolean)}
      },
      resolve(parentValue, {title, allDay, eventDate, startTime, endTime, content, location, dateCreated, lastModified, category}){
        const instance = new EventModel ({
          title, allDay, eventDate, startTime, endTime, content, location, dateCreated, lastModified, category
        });
        return instance.save();
      }
    }
  }
});

module.exports = mutation;
