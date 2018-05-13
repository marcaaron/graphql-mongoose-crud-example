import React, {Component} from 'react';
import './styles/AddPage.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './styles/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';
import slugify from 'slugify';

const mutation = gql`
  mutation addPage($title:String!, $content:String, $route:String!){
	addPage(title:$title, content:$content, route:$route){
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
      invalidTitle: false
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onTitleChange = (e) => {
    console.log(this.props);
    const pageTitle = e.target.value;
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
      route += slugify(title).toLowerCase();
      console.log(route);
       this.props.mutation(
         {
           variables: {title, content, route},
           refetchQueries:[{query: allPages}]
         });
    }else{
      alert("Failed to submit due to duplicate title. Please pick a new title name.");
    }
  }

  render(){
    const { editorState, pageTitle, invalidTitle } = this.state;
    let btnStyle = {};
    if(invalidTitle){
      btnStyle = {backgroundColor:'grey', color:'darkgrey'};
    }
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
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
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
