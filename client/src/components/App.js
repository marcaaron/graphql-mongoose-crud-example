import React, { Component } from 'react';
import '../styles/App.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from "react-apollo";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './Home';
import Page from './Page';
import Admin from './Admin';
import Header from './Header';
import AdminAddPage from './AdminAddPage';
import AdminAddStaff from './AdminAddStaff';
import AdminMedia from './AdminMedia';
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
            <Header/>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/admin" component={()=><Admin/>}/>
              <Route exact path="/admin/add-page" component={()=><AdminAddPage/>}/>
              <Route exact path="/admin/add-staff" component={()=><AdminAddStaff/>}/>
              <Route exact path="/admin/media" component={()=><AdminMedia/>}/>
              <Route path="/:page" component={({match})=><Page route={match.url}/>}/>
            </Switch>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
