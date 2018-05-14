import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../Loading';

const pageById = gql`
 query pageById($id: String!){
  pageById(id:$id){
    title
    links
    content
    route
    pageType
    dateCreated
    pageLinks
    lastModified
    pageLinksInfo{
      title
      id
    }
    childPages{
      title
      id
    }
  }
}
`;

const updatePage = gql`
  mutation updatePage($id:String!, $title:String, $links:[String], $content:String, $route:String, $lastModified:String!, $pageLinks:[String]){
    updatePage(id:$id, title:$title, links:$links, content:$content, route:$route, lastModified:$lastModified, pageLinks:$pageLinks){
      id
    }
  }
`

class EditPage extends Component{
  componentDidMount(){
    console.log(this.props);
  }
  componentWillUpdate(nextProps){
    console.log(this.props, nextProps);
  }
  render(){
    if(this.props.pageById.loading) return <Loading/>
    console.log(this.props.pageById.pageById);
    const {pageById} = this.props.pageById;
    return(
      <div className="add-page-top-level-container">

        <div className="add-page-container">
          <div className="add-page-header">
            <span className="add-page-header-text">Page Title:</span>
          </div>
          <div>{pageById.title}</div>
        </div>

        <div className="add-page-container">
          <div className="add-page-header">
            <span className="add-page-header-text">Page Content:</span>
          </div>
          <div>{pageById.content}</div>
        </div>

        <div className="add-page-container">
          <div className="add-page-header">
            <span className="add-page-header-text">Nav Bar Links:</span>
          </div>
          <div>{pageById.childPages.length > 0 ? pageById.childPages.map(page=>
            <div key={`edit-page-${page.id}`}>{page.title}</div>) 
            : <div>There are no navigation links branching off of this page.</div>}</div>
        </div>

        <div className="add-page-container">
          <div className="add-page-header">
            <span className="add-page-header-text">Side Bar Links:</span>
          </div>
          <div>{pageById.pageLinksInfo.length > 0 ? pageById.pageLinksInfo.map(page=><div>{page.title}</div>) : <div>There are no sidebar links on this page.</div>}</div>
        </div>

      </div>

    );
  }
}

export default compose(
   graphql(pageById, {
      name: "pageById",
      options: (props) => ({variables:{id:props.pageId}})
   }),
   graphql(updatePage, {
      name: "updatePage"
   })
)(EditPage);
