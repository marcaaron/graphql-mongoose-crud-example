import React, {Component} from 'react';
import './styles/AddPage.css';
import slugify from 'slugify';

class EditLink extends Component{
  constructor(props){
    super(props);
    this.state = {
      pageTitle: props.pageById.title,
      link:props.pageById.route,
      invalidTitle: false,
      invalidLink: false,
      pages:props.pages
    }
  }

  onTitleChange = (e) => {
    let pageTitle = e.target.value;
    let pages = [...this.props.pages];
    let invalidTitle = false;
    if(pages.filter(page=>page.title.toLowerCase() === pageTitle.toLowerCase()).length > 0){
      invalidTitle = true;
    }
    this.setState({
      pageTitle,
      invalidTitle
    });
  };

   onLinkChange = (e) => {
     const link = e.target.value;
     const invalidLink = !(/^https?:\/\//.test(link));
     this.setState({
       link,
       invalidLink
     });
   };

  handleSubmitClick = () => {
    if(!this.state.invalidTitle && !this.state.invalidLink){
      const content = '';
      const title = this.state.pageTitle;
      let route = this.state.link;
      const date = new Date().toISOString();
      const lastModified = date;
      const pageLinks = [];
      this.props.handleUpdate(title, content, route, pageLinks, lastModified);
    }else{
      alert("Failed to submit due to duplicate title. Please pick a new title name.");
    }
  }

  render(){
    const { pageTitle, invalidTitle, link, invalidLink } = this.state;
    let btnStyle = {};
    if(invalidTitle){
      btnStyle = {backgroundColor:'grey', color:'darkgrey'};
    }
    return(
      <div className="add-page-top-level-container">
        <div className="add-page-container">
          <div className="add-page-header"><span className="add-page-header-text">LINK PAGE TITLE:</span></div>
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
          <div className="add-page-header"><span className="add-page-header-text">PAGE LINK:</span></div>
          <input
            className="add-page-input"
            type="text"
            value={link}
            onChange={this.onLinkChange}
          />
          {invalidLink &&
            <div style={{padding:'0.5em', textAlign:'center', color:'red'}}>Links must be prefixed with http:// or https://</div>
          }
        </div>
        <button style={btnStyle} onClick={this.handleSubmitClick} className="add-page-submit">UPDATE</button>
      </div>
    );
  }
}

export default EditLink;
