import React, {Component} from 'react';
import './styles/AddPage.css';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './styles/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';
import slugify from 'slugify';
import { Link } from 'react-router-dom';

const mutation = gql`
  mutation addPage($title:String!, $content:String, $route:String!, $dateCreated:String!, $lastModified:String!, $pageType:String!){
	addPage(title:$title, content:$content, route:$route, dateCreated: $dateCreated, lastModified:$lastModified, pageType:$pageType){
  	title
    id
    content
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

class AddSite extends Component{
  constructor(props){
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      pageTitle: '',
      invalidTitle: false,
      success: false,
      successResult: {}
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

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
    if(!this.state.invalidTitle){
      const content = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
      const title = this.state.pageTitle;
      let route = '/'
      const cleanTitle = title.split(' ').map(word => word.replace(/\W|_|@|\$|\(|\)/g,'')).join(' ');
      route += slugify(cleanTitle).toLowerCase();
      const date = new Date().toISOString();
      const dateCreated = date;
      const lastModified = date;
      const pageType = 'site';
       this.props.mutation(
         {
           variables: {title, content, route, dateCreated, lastModified, pageType},
           refetchQueries:[{query: allPages}]
         }).then(res=>{
            console.log(res);
            const successResult = res.data.addPage;
            this.setState({success:true, successResult});
         })
            .catch(err=>alert(err));
    }else{
      alert("Failed to submit due to duplicate title. Please pick a new title name.");
    }
  }

  render(){
    const { editorState, pageTitle, invalidTitle, success, successResult } = this.state;
    let btnStyle = {};
    if(invalidTitle){
      btnStyle = {backgroundColor:'grey', color:'darkgrey'};
    }
    if(!success){
      return(
        <div className="add-page-top-level-container">
          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">SITE PAGE TITLE:</span></div>
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

          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">PAGE CONTENT:</span></div>
              <Editor
                wrapperClassName="add-page-editor-wrapper"
                editorClassName="add-page-editor"
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
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
            <p>'{successResult.title}' has been created @ <Link to={successResult.route}>{successResult.route}</Link></p>
            <p><Link to={`/admin/pages/edit/${successResult.id}`}>To Edit This Page or Add Sidebar Links Click Here</Link></p>
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
)(AddSite);
