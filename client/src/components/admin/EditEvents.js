import React, { Component } from 'react';
import gql from 'graphql-tag';

const allEvents = gql`{
  allEvents{
    id
    title
    eventDate
  }
}`;

class EditEvents extends Component{
  render(){
    return(
      <div></div>
    )
  }
}

export default EditEvents;
