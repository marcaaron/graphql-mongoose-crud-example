const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const schema = require('./schemas/schema');
const mongoose = require('./mongoose/server');
const db = mongoose();

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}));

app.listen(4000, ()=>console.log('Running GraphQL Server...'));
