import React, { Component } from 'react';
import './styles/Pages.css';
import PagesButton from './PagesButton';
import faCalendar from '@fortawesome/fontawesome-free-solid/faCalendar';
import faCalendarAlt from '@fortawesome/fontawesome-free-solid/faCalendarAlt';

class Events extends Component{
  render(){
    return(
      <div className="pages-button-container">
        <PagesButton icon={faCalendar} text="Add a New Event" destination="/admin/events/add"/>
        <PagesButton icon={faCalendarAlt} text="Edit an Existing Event" destination="/admin/events/edit"/>
      </div>
    )
  }
}
export default Events;
