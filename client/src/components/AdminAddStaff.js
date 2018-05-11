import React, {Component} from 'react';
import axios from 'axios';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';
import Loading from './Loading';

const addStaffMember = gql`
  mutation addStaffMember($firstName: String!, $lastName: String!, $dept: String!, $description: String, $contact: String!, $route: String!, $avatarUrl: String){
  addStaffMember(firstName:$firstName, lastName:$lastName, dept:$dept, description:$description, contact:$contact, route:$route, avatarUrl:$avatarUrl){
    id
    firstName
    lastName
    dept
    description
    contact
    route
    avatarUrl
  }
}
`

class AdminAddStaff extends Component{
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      dept: '',
      description: '',
      route:'',
      contact:'',
      avatarUrl:''
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.id]:e.target.value});
  }

  componentDidMount(){
    console.log(this.props.addStaffMember);
  }

  componentWillUpdate(nextProps){
    console.log(this.props);
    console.log(nextProps);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {firstName, lastName, dept, description, route, contact, avatarUrl} = this.state;
    this.props.addStaffMember(
      {
        variables: {
          firstName,
          lastName,
          dept,
          description,
          route,
          contact,
          avatarUrl
        }
      }
    ).then(res=>console.log(res));
  }

  handleSignedReq = (e) => {
    const files = e.target.files;
    const file = files[0];
    if(file === null){
      return alert('No file selected.');
    }
    this.getSignedRequest(file);
  }

  getSignedRequest = (file) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:4000/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          this.uploadFile(file, response.signedRequest, response.url);
        }
        else{
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  uploadFile = (file, signedRequest, url) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          console.log('Success!');
          this.setState({avatarUrl:url});
        }
        else{
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  render(){
    const { firstName, lastName, dept, description, route, contact } = this.state;
    return(
      <div>
        <h1>Add A Staff Member</h1>
        <form className="admin-add-staff-form" onSubmit={this.handleSubmit}>
          <label>First Name</label>
          <input type="text" id="firstName" value={firstName} onChange={this.handleChange}/>
          <label>Last Name</label>
          <input type="text" id="lastName" value={lastName} onChange={this.handleChange}/>
          <label>Department</label>
          <input type="text" id="dept" value={dept} onChange={this.handleChange}/>
          <label>Description</label>
          <input type="text" id="description" value={description} onChange={this.handleChange}/>
          <label>Route</label>
          <input type="text" id="route" value={route} onChange={this.handleChange}/>
          <label>Contact</label>
          <input type="text" id="contact" value={contact} onChange={this.handleChange}/>
          <label>Avatar Upload</label>
          <input onChange={this.handleSignedReq} type="file" id="file-input"/>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}

export default compose(
   graphql(addStaffMember, {
      name: "addStaffMember"
   })
)(AdminAddStaff);
