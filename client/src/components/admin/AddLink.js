import React, {Component} from 'react';
import './styles/AddPage.css';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';
import slugify from 'slugify';
import { Link } from 'react-router-dom';

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

class AddLink extends Component{
  constructor(props){
    super(props);
    this.state = {
      link:'',
      pageTitle: '',
      invalidTitle: false,
      invalidLink: false,
      success: false,
      successResult: {}
    }
  }

  onLinkChange = (e) => {
    const link = e.target.value;
    const invalidLink = !(/^https?:\/\//.test(link));
    this.setState({
      link,
      invalidLink
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
    if(!this.state.invalidTitle && !this.state.invalidLink){
      const title = this.state.pageTitle;
      const route = this.state.link;
      const date = new Date().toISOString();
      const dateCreated = date;
      const lastModified = date;
      const pageType = 'link';
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
      alert("Failed to submit due to duplicate title. Please pick a new title name.");
    }
  }

  render(){
    const { pageTitle, invalidTitle, invalidLink, link, success, successResult } = this.state;
    let btnStyle = {};
    if(invalidTitle){
      btnStyle = {backgroundColor:'grey', color:'darkgrey'};
    }
    if(!success){
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
)(AddLink);
