import React, {Component} from 'react';
import './styles/AddPage.css';
import slugify from 'slugify';

class EditContainer extends Component{
  constructor(props){
    super(props);
    this.state = {
      pageTitle: props.pageById.title,
      invalidTitle: false,
      pages:props.pages,
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

  handleSubmitClick = () => {
    if(!this.state.invalidTitle){
      const content = '';
      const title = this.state.pageTitle;
      let route = '/'
      const cleanTitle = title.split(' ').map(word => word.replace(/\W|_|@|\$|\(|\)/g,'')).join(' ');
      route += slugify(cleanTitle).toLowerCase();
      const date = new Date().toISOString();
      const lastModified = date;
      const pageLinks = [];
      this.props.handleUpdate(title, content, route, pageLinks, lastModified);
    }else{
      alert("Failed to submit due to duplicate title. Please pick a new title name.");
    }
  }

  render(){
    const { pageTitle, invalidTitle } = this.state;
    let btnStyle = {};
    if(invalidTitle){
      btnStyle = {backgroundColor:'grey', color:'darkgrey'};
    }
    return(
      <div className="add-page-top-level-container">
        <div className="add-page-container">
          <div className="add-page-header"><span className="add-page-header-text">CONTAINER PAGE TITLE:</span></div>
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
        <button style={btnStyle} onClick={this.handleSubmitClick} className="add-page-submit">UPDATE</button>
      </div>
    );
  }
}

export default EditContainer;
