import React, { Component } from 'react';
import '../styles/App.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from "react-apollo";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './Home';
import Page from './Page';
import Admin from './admin/Admin';
import Header from './Header';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id || null
});

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" component={()=><Home><Header/></Home>}/>
              {/* Admin Routes */}
              <Route exact path="/admin" component={()=><Admin/>}/>
              <Route exact path="/admin/:page" component={({match})=><Admin page={match.params} route={match.url}/>}/>
              <Route exact path="/admin/pages/:page" component={({match})=><Admin page={match.params} route={match.url}/>}/>
              <Route exact path="/admin/pages/edit/:page" component={({match})=><Admin page={match.params} route={match.url}/>}/>
              {/* Main Page Routes */}
              <Route path="/:page" component={({match})=><Page route={match.url}><Header/></Page>}/>
            </Switch>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
