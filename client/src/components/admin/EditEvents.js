import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../Loading';
import EditDeleteIcons from './EditDeleteIcons';
import moment from 'moment';

const allEvents = gql`{
  allEvents{
    id
    title
    eventDate
    dateCreated
    lastModified
  }
}`;

const deleteEvent = gql`
  mutation deleteEvent($id:String!){
    deleteEvent(id:$id){
      id
    }
  }
`;

class EditEvents extends Component{
  constructor(props){
    super(props);
    this.state = {
      pageQuery: '',
      queryFail: false,
      allEvents: props.allEvents.allEvents || []
    }
  }

  handleDelete = (eventId) => {
    const confirm = window.confirm("This action will delete this event permanently from the database and can not be undone! Are you 100% sure this is the action you want to take?");
    if(confirm){
      this.props.deleteEvent({
        variables: {id: eventId},
        refetchQueries:[{query:allEvents}]
      });
    }
  }

  componentWillUpdate(nextProps){
    if((JSON.stringify(this.props.allEvents.allEvents) !== JSON.stringify(nextProps.allEvents.allEvents))){
      const allEvents = [...nextProps.allEvents.allEvents];
      this.setState({allEvents});
    }
  }

  handleSearchChange = (e) => {
    const pageQuery = e.target.value;
    let allEvents = [...this.props.allEvents.allEvents];
    let query = new RegExp(pageQuery, "gi");
    allEvents = allEvents.filter(event=>{
      if(query.test(event.title) || query.test(event.category)) return true;
      return false;
    })
    this.setState({pageQuery, allEvents});
  }

  render(){
    const {queryFail, pageQuery} = this.state;
    const flexTwo = {flex:'2'};
    return(
      <div className="add-page-top-level-container">
        <div className="add-page-container">
          <div className="add-page-header">
            <span className="add-page-header-text">FILTER EXISTING EVENTS:</span>
          </div>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-around'}}>
            <FontAwesomeIcon icon={faSearch} style={{margin:'1em'}}/>
            <input
              style={{flex:'1', marginRight:'1em'}}
              className="add-page-input"
              type="text"
              value={pageQuery}
              onChange={this.handleSearchChange}
            />
          </div>
          {queryFail &&
            <div style={{padding:'0.5em', textAlign:'center', color:'red'}}>No Results Found.</div>
          }
        </div>

        <div style={{marginBottom:'1em'}} className="add-page-container">
          <div style={{alignItems:'center'}} className="add-page-header">
            <span style={flexTwo} className="add-page-header-text">Title</span>
            <span style={flexTwo} className="add-page-header-text">Date</span>
            <span className="add-page-header-text">Category</span>
            <span className="add-page-header-text">Date Created</span>
            <span className="add-page-header-text">Last Modified</span>
            <span className="add-page-header-text">Edit/Delete</span>
          </div>
          {this.props.allEvents.loading ? <Loading/> :
            this.state.allEvents.map(event=>
          <div key={event.id} className="edit-page-row">
            <span style={flexTwo} className="edit-page-row-text row-title">{event.title}</span>
            <span style={flexTwo} className="edit-page-row-text row-route">
              {moment(event.eventDate).format('MM-DD-YYYY')}
            </span>
            <span className="edit-page-row-text row-type">{event.category}</span>
            <span className="edit-page-row-text row-created">{moment(event.dateCreated).format('MM-DD-YYYY')}</span>
            <span className="edit-page-row-text row-modified">{moment(event.lastModified).format('MM-DD-YYYY')}</span>
            <span className="edit-page-row-text row-edit-delete">
              <EditDeleteIcons type="event" eventId={event.id} handleDelete={this.handleDelete}/>
            </span>
          </div>
          )
        }
        </div>
      </div>
    )
  }
}

export default compose(
   graphql(allEvents, {
      name: "allEvents"
   }),
  graphql(deleteEvent, {
     name: "deleteEvent"
  })
)(EditEvents);
