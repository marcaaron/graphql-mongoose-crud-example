import React, {Component} from 'react';
import './styles/AddPage.css';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './styles/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const format = 'h:mm a';

const addEvent = gql`
  mutation addEvent($title:String!, $allDay:Boolean!, $eventDate:String!, $dateCreated:String!, $lastModified:String!, $startTime: String, $endTime:String, $content:String, $location:String, $category:String){
  addEvent(title:$title, allDay: $allDay, eventDate:$eventDate, dateCreated:$dateCreated, lastModified:$lastModified, startTime:$startTime, endTime:$endTime, content:$content, location:$location, category:$category){
    id
    title
  }
}`;

const allEvents = gql`{
  allEvents{
    id
    title
    eventDate
    dateCreated
    lastModified
  }
}`;

function getSignedRequest(file){
  return new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:4000/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        }
        else{
          reject('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  });
}

function uploadFile(file, signedRequest, url){
  return new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          resolve(url);
        }
        else{
          reject('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  })
}

function uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      getSignedRequest(file)
      .then(
        res=>
        uploadFile(file, res.signedRequest, res.url)
        .then(res=>
          resolve({data:{link:res}})
        )
        .catch(err=>reject(err))
      )
      .catch(err=>reject(err));
    },
  );
}

class AddEvent extends Component{
  constructor(props){
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      success: false,
      successResult: {},
      eventTitle:'',
      eventLocation:'',
      eventDate: null,
      startTime: null,
      endTime: null,
      allDay: false
    }
  }

  handleDateChange = (date) => {
    const eventDate = date;
    this.setState({eventDate});
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onTitleChange = (e) => {
    let eventTitle = e.target.value;
    this.setState({
      eventTitle
    });
  };

  onLocationChange = (e) => {
    let eventLocation = e.target.value;
    this.setState({
      eventLocation
    });
  };

  onStartTimeChange = (value) => {
    let startTime = value;
    this.setState({startTime});
  }

  onEndTimeChange = (value) => {
    let endTime = value;
    this.setState({endTime});
  }

  handleCheckbox = () => {
    const allDay = !this.state.allDay;
    this.setState({allDay})
  }

  handleSubmitClick = () => {
    if(this.state.eventTitle === '' || !this.state.eventDate){
      alert('All events must have a title and date.')
    }else{
      const content = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
      const title = this.state.eventTitle;
      const location = this.state.eventLocation;
      const date = new Date().toISOString();
      const dateCreated = date;
      const lastModified = date;
      const eventDate = this.state.eventDate.toISOString();
      let startTime, endTime;
      const allDay = this.state.allDay;
      if(!this.state.allDay){
        if(this.state.startTime){
          startTime = this.state.startTime.format('h:mm a');
        }
        if(this.state.endTime){
          endTime = this.state.endTime.format('h:mm a');
        }
      }

       this.props.addEvent(
         {
           variables: {title, eventDate, startTime, endTime, content, dateCreated, lastModified, location, allDay},
           refetchQueries:[{query:allEvents}]
         }).then(res=>{
            console.log(res);
            const successResult = res.data.addEvent;
            this.setState({success:true, successResult});
         })
            .catch(err=>alert(err));
    }
  }

  render(){
    const { editorState, eventTitle, eventLocation, success, successResult } = this.state;
    let btnStyle = {};
    if(!success){
      return(
        <div className="add-page-top-level-container">
          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">EVENT TITLE:</span></div>
            <input
              className="add-page-input"
              type="text"
              value={eventTitle}
              onChange={this.onTitleChange}
            />
          </div>
          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">LOCATION:</span></div>
            <input
              className="add-page-input"
              type="text"
              value={eventLocation}
              onChange={this.onLocationChange}
            />
          </div>

          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">DATE:</span></div>
            <DatePicker
              selected={this.state.eventDate}
              onChange={this.handleDateChange}
              className="datepicker-styles"
            />
          </div>
          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">TIME:</span></div>
            {!this.state.allDay &&
              <div style={{display:'flex', alignItems:'center', margin:'0.5em'}}>
              START TIME:
              <TimePicker
                className="datepicker-styles"
                showSecond={false}
                format={format}
                use12Hours
                value={this.state.startTime}
                onChange={this.onStartTimeChange}
              />
              END TIME:
              <TimePicker
                className="datepicker-styles"
                showSecond={false}
                format={format}
                use12Hours
                value={this.state.endTime}
                onChange={this.onEndTimeChange}
              />
              </div>
            }
            <div style={{margin:'1em'}}>
              All Day
              <input type="checkbox" name="allDay" checked={this.state.allDay} onChange={this.handleCheckbox}/>
            </div>
          </div>

          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">DETAILS:</span></div>
              <Editor
                wrapperClassName="add-page-editor-wrapper"
                editorClassName="add-page-editor"
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                  image: {
                    previewImage: true,
                    uploadCallback: uploadImageCallBack,
                    alt: { present: true, mandatory: false },
                  },
                }}
              />
          </div>
          <button style={btnStyle} onClick={this.handleSubmitClick} className="add-page-submit">SUBMIT</button>
        </div>
      );
    }else{
      return(
        <div className="add-page-top-level-container">
          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">SUCCESS!</span></div>
            <p>Your Event... '{successResult.title}' has been created</p>
            <p><Link to={`/admin/events/edit/${successResult.id}`}>To Edit This Event Click Here</Link></p>
            <p><Link to={`/admin/events/add`}>To Create A New Event Click Here</Link></p>
          </div>
        </div>
      );
    }
  }
}
export default compose(
   graphql(addEvent, {
      name: "addEvent"
   })
)(AddEvent);
