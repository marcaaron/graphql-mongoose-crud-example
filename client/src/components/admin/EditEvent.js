import React, { Component } from 'react';
import gql from 'graphql-tag';

const updateEvent = gql`
  mutation updateEvent($id:String!, $title:String, $eventDate:String, $lastModified:String!, $startTime: String, $endTime:String, $content:String,$location:String,$category:String){
  updateEvent(id:$id, title:$title, eventDate:$eventDate, lastModified:$lastModified, startTime:$startTime, endTime:$endTime, content:$content, location:$location, category:$category){
    id
    title
  }
}
`;

const eventById = gql`
query eventById($id:String!){
  eventById(id:$id){
    id
    title
    eventDate
    startTime
    endTime
    content
    location
    category
  }
}`

class EditEvent extends Component{
  render(){
    return(
      <div></div>
    )
  }
}

export default EditEvent;
