const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const schema = require('./graphql/schema');
const mongoose = require('./mongoose/server');
const db = mongoose();

// import PageModel for testing mongo queries before
const PageModel = require('./models/page');

// Sets up a graphql endpoint and graphiql query zone
app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}));

// Start Server...
app.listen(4000, ()=>console.log('Running GraphQL Server...'));
