import React from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const ADD_PAGE = gql`
  mutation addPage($title:String!, $content:String!, $route:String!){
  addPage(title:$title, content: $content, route: $route){
    id
  }
}
`;

const AdminAddPageForm = ({handleChange, title, route, content, links}) => {
  return (
    <Mutation mutation={ADD_PAGE}>
      {(addPage, { data }) => (
      <form onSubmit={e => {e.preventDefault(); addPage({variables:{title, route, content, links}});}}>
        <label>Title</label>
        <input onChange={handleChange} type="text" id="title" value={title}></input>

        <label>Route</label>
        <input onChange={handleChange} type="text" id="route" value={route}></input>

        <label>Content</label>
        <input onChange={handleChange} type="text" id="content" value={content}></input>
        <input type="submit" value="Submit"/>
      </form>
    )}
    </Mutation>
  );
}
export default AdminAddPageForm;
