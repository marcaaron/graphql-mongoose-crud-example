const graphql = require('graphql');
const PageModel = require('../models/page');

const { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

const PageType = new GraphQLObjectType({
  name:'Page',
  fields: () => ({
    title:{type: GraphQLString},
    content:{type: GraphQLString},
    route:{type: GraphQLString}
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    page:{
      type: PageType,
      args: { id: {type: GraphQLString}},
      resolve(parentValue, args){
        return PageModel.findOne({_id:args.id});
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name:'Mutation',
  fields: {
    addPage: {
      type: PageType,
      args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        route: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {title, content, route}){
        const instance = new PageModel({ title: title, content:content, route:route});
        return instance.save();
      }
    },
    deletePage: {
      type: PageType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {id}){
        return PageModel.findByIdAndRemove(id);
      }
    },
    updatePage: {
      type: PageType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        route: {type: GraphQLString}
      },
      resolve(parentValue, args){
        return PageModel.findByIdAndUpdate(args.id, args, {new:true});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
