import React, {Component} from 'react';
import './styles/Pages.css';
import PagesButton from './PagesButton';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../Loading';
import EditDeleteIcons from './EditDeleteIcons';
import { compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import moment from 'moment';

const allPages = gql`
  {
    allPages{
      id
      title
      route
      pageType
      dateCreated
      lastModified
      links
    }
  }
`;

const deletePage = gql`
  mutation deletePage($id:String!){
    deletePage(id:$id){
      id
    }
  }
`;

const updatePage = gql`
  mutation updatePage($id:String!, $links:[String]!, $lastModified:String!){
    updatePage(id:$id, links:$links, lastModified:$lastModified){
      id
    }
  }
`

class EditPages extends Component{
  constructor(props){
    super(props);
    this.state = {
      pageQuery:'',
      queryFail: false,
      allPages: props.allPages.allPages || []
    }
  }

  componentWillUpdate(nextProps){
    console.log('component will update');

    if((JSON.stringify(this.props.allPages.allPages) !== JSON.stringify(nextProps.allPages.allPages))){
      const allPages = [...nextProps.allPages.allPages];
      console.log(allPages);
      this.setState({allPages});
    }
  }

  handleSearchChange = (e) => {
    const pageQuery = e.target.value;
    let allPages = [...this.props.allPages.allPages];
    let query = new RegExp(pageQuery, "gi");
    allPages = allPages.filter(page=>{
      if(query.test(page.title) || query.test(page.pageType)) return true;
    })
    this.setState({pageQuery, allPages});
  }

  handleDelete = (pageId) => {
    const confirm = window.confirm("This action will delete this page permanently from the database and can not be undone! All connections made to this page from other pages will be REMOVED and it will no longer be accessible via the sitemap, navigation menu, or sidebar links. Are you 100% sure this is the action you want to take?");
    if(confirm){
      const allPagesCopy = this.props.allPages.allPages;
      this.props.deletePage({
        variables: {id: pageId},
        refetchQueries:[{query:allPages}]
      });
      const filteredPages = allPagesCopy.filter(page=>page.links.includes(pageId));
      filteredPages.forEach(page=>{
        const links = [...page.links];
        links.splice(links.indexOf(pageId),1);
        const lastModified = new Date().toISOString();
        this.props.updatePage({
          variables: {id: page.id, links, lastModified},
          refetchQueries:[{query:allPages}]
        });
      });
    }
  }

  render(){
    const {queryFail, pageQuery} = this.state;
    const flexTwo = {flex:'2'};
    return(
      <div className="add-page-top-level-container">
        <div className="add-page-container">
          <div className="add-page-header">
            <span className="add-page-header-text">FILTER EXISTING PAGES:</span>
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
            <span style={flexTwo} className="add-page-header-text">Route</span>
            <span className="add-page-header-text">Type</span>
            <span className="add-page-header-text">Date Created</span>
            <span className="add-page-header-text">Last Modified</span>
            <span className="add-page-header-text">Edit/Delete</span>
          </div>
          {this.props.allPages.loading ? <Loading/> :
            this.state.allPages.map(page=>
          <div key={page.id} className="edit-page-row">
            <span style={flexTwo} className="edit-page-row-text row-title">{page.title}</span>
            <span style={flexTwo} className="edit-page-row-text row-route">{page.route}</span>
            <span className="edit-page-row-text row-type">{page.pageType}</span>
            <span className="edit-page-row-text row-created">{moment(page.dateCreated).format('MM-DD-YYYY')}</span>
            <span className="edit-page-row-text row-modified">{moment(page.lastModified).format('MM-DD-YYYY')}</span>
            <span className="edit-page-row-text row-edit-delete">
              <EditDeleteIcons type="edit" pageId={page.id} handleDelete={this.handleDelete}/>
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
   graphql(allPages, {
      name: "allPages"
   }),
   graphql(deletePage, {
      name: "deletePage"
   }),
   graphql(updatePage, {
      name: "updatePage"
   })
)(EditPages);
