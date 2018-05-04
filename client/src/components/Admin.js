import React from 'react';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import RenderAdminSites from './RenderAdminSites';
import uuidv1 from 'uuid/v1';
import { NavLink } from 'react-router-dom';

const query = gql`
{
  pageByTitle(title:"Home"){
    title
    childPages{
      title
      childPages{
        title
      }
    }
  }
}
`
const Admin = () => (
  <Query query={query}>
  {({ loading, error, data })=>{
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return(
      <div>
      <h1>Admin</h1>
      <NavLink to="/admin/add-page">Add Page</NavLink>
      <h2>Site Navigation</h2>
      <h3>All Sites</h3>
      <RenderAdminSites title={data.pageByTitle.title} childPages={data.pageByTitle.childPages}/>
      </div>
    )
  }}
</Query>
)

export default Admin;
