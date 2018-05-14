import React, {Component} from 'react';
import './styles/AddPage.css';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCloudUploadAlt from '@fortawesome/fontawesome-free-solid/faCloudUploadAlt';
import faFolderOpen from '@fortawesome/fontawesome-free-solid/faFolderOpen';
import faFilePdf from '@fortawesome/fontawesome-free-solid/faFilePdf';

const mutation = gql`
  mutation addPage($title:String!, $route:String!, $dateCreated:String!, $lastModified:String!, $pageType:String!){
	addPage(title:$title, route:$route, dateCreated: $dateCreated, lastModified:$lastModified, pageType:$pageType){
  	title
    id
    route
  }
}
`;

const allPages = gql`
  {
    allPages {
      title
      route
    }
  }
`;

class AddDocument extends Component{
  constructor(props){
    super(props);
    this.state = {
      pageTitle: '',
      invalidTitle: false,
      invalidDocument: false,
      success: false,
      successResult: {},
      documentUrl: null
    }
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
            this.setState({documentUrl:url});
          }
          else{
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }

  onTitleChange = (e) => {
    let pageTitle = e.target.value;
    const pages = this.props.allPages.allPages;
    let invalidTitle = false;
    if(pages.filter(page=>page.title.toLowerCase() === pageTitle.toLowerCase()).length > 0){
      invalidTitle = true;
    }
    this.setState({
      pageTitle,
      invalidTitle
    });
  };

  handleSubmitClick = () => {
    if(!this.state.invalidTitle && this.state.documentUrl){
      const title = this.state.pageTitle;
      const route = this.state.documentUrl;
      const date = new Date().toISOString();
      const dateCreated = date;
      const lastModified = date;
      const pageType = 'document';
       this.props.mutation(
         {
           variables: {title, route, dateCreated, lastModified, pageType},
           refetchQueries:[{query: allPages}]
         }).then(res=>{
            console.log(res);
            const successResult = res.data.addPage;
            this.setState({success:true, successResult});
         })
            .catch(err=>alert(err));
    }else{
      alert("Failed to submit due to duplicate title or no document. Please pick a new title name and/or upload document.");
    }
  }

  render(){
    const { pageTitle, invalidTitle, invalidDocument, documentUrl, success, successResult } = this.state;
    let btnStyle = {};
    if(invalidTitle){
      btnStyle = {backgroundColor:'grey', color:'darkgrey'};
    }
    if(!success){
      return(
        <div className="add-page-top-level-container">
          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">DOCUMENT PAGE TITLE:</span></div>
            <input
              className="add-page-input"
              type="text"
              value={pageTitle}
              onChange={this.onTitleChange}
            />
            {invalidTitle &&
              <div style={{padding:'0.5em', textAlign:'center', color:'red'}}>A page with this title already exists. Page names must be unique.</div>
            }
          </div>

          { !documentUrl ?
            <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">DOCUMENT UPLOAD:</span></div>
            <div className="add-page-document-drop">
              <FontAwesomeIcon color="#FF7676" size="4x" icon={faCloudUploadAlt}/>
              <span className="add-page-document-drop-text">Drag File to Upload</span>
            </div>
            <label htmlFor="file-input" className="add-page-document-choose-btn">
              Choose File
              <FontAwesomeIcon color="#FF7676" icon={faFolderOpen}/>
            </label>
            <input onChange={this.handleSignedReq} type="file" id="file-input" className="add-page-document-choose-btn"/>
          </div>
          :
            <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">DOCUMENT UPLOAD SUCCESSFUL:</span></div>
            <div className="add-page-document-drop">
              <FontAwesomeIcon color="#FF7676" size="4x" icon={faFilePdf}/>
              <span className="add-page-document-success-text">
                <a href={this.state.documentUrl}>{this.state.documentUrl}</a>
              </span>
            </div>
            <label htmlFor="file-input" className="add-page-document-choose-btn">
              Choose A Different File
              <FontAwesomeIcon color="#FF7676" icon={faFolderOpen}/>
            </label>
            <input onChange={this.handleSignedReq} type="file" id="file-input" className="add-page-document-choose-btn"/>
          </div>
        }


          <button style={btnStyle} onClick={this.handleSubmitClick} className="add-page-submit">SUBMIT</button>
        </div>
      );
    }else{
      return(
        <div className="add-page-top-level-container">
          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">SUCCESS!</span></div>
            <p>'{successResult.title}' has been created</p>
            <p>Test Link to <a rel="noopener noreferrer" target="_blank" href={successResult.route}>{successResult.route}</a></p>
            <p><Link to={`/admin/pages/edit/${successResult.id}`}>To Edit This Page Click Here</Link></p>
            <p><Link to={`/admin/pages`}>To Create A New Page Click Here</Link></p>
          </div>
        </div>
      );
    }
  }
}
export default compose(
   graphql(allPages, {
      name: "allPages"
   }),
   graphql(mutation, {
      name: "mutation"
   })
)(AddDocument);
