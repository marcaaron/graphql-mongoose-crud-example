import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../Loading';

// Sub Pages
import EditSite from './EditSite';
import EditLink from './EditLink';
import EditDocument from './EditDocument';
import EditContainer from './EditContainer';

import { Link } from 'react-router-dom';

const pageById = gql`
 query pageById($id: String!){
  pageById(id:$id){
    id
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
      route
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
  mutation updatePage($id:String!, $title:String, $content:String, $route:String, $lastModified:String!, $pageLinks:[String]){
    updatePage(id:$id, title:$title, content:$content, route:$route, lastModified:$lastModified, pageLinks:$pageLinks){
      id
      title
      route
    }
  }
`;

const allPages = gql`
  {
    allPages {
      title
      route
      id
    }
  }
`;

class EditPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      success: false,
      successResult: {}
    }
  }

  handleUpdate = (title, content, route, pageLinks, lastModified) => {
    const id = this.props.pageById.pageById.id;
    let pageByIdCopy = {...this.props.pageById.pageById};
    pageByIdCopy.title = title;
    pageByIdCopy.content = content;
    pageByIdCopy.route = route;
    pageByIdCopy.pageLinks = pageLinks;

    if(JSON.stringify(this.props.pageById.pageById) !== JSON.stringify(pageByIdCopy)){
      this.props.updatePage(
        {
          variables: {id, title, content, route, pageLinks, lastModified},
          refetchQueries:[{query: allPages}, {query: pageById, variables:{id:id}}]
        }).then(res=>{
            const successResult = res.data.updatePage;
            this.setState({success:true, successResult});
        })
          .catch(err=>alert(err));
    }else{
      alert('No Changes Have Been Made.');
    }
  }

  render(){
    if(this.props.pageById.loading) return <Loading/>
    if(this.props.allPages.loading) return <Loading/>
    const {pageById} = this.props.pageById;
    const {allPages} = this.props.allPages;
    const {successResult} = this.state;
    console.log(pageById);
    if(!this.state.success){
      let pages = [...allPages];
      console.log(pages, pageById);
      pages = pages.filter(page=>page.id !== pageById.id);
      if(pageById.pageType === 'site'){
        return(
          <EditSite
            handleUpdate={this.handleUpdate}
            pageById={pageById}
            allPages={allPages}
            pages={pages}
          />
        );
      }else if(pageById.pageType === 'container'){
        return(
          <EditContainer
            handleUpdate={this.handleUpdate}
            pageById={pageById}
            pages={pages}
          />
        );
      }else if(pageById.pageType === 'link'){
        return(
          <EditLink
            handleUpdate={this.handleUpdate}
            pageById={pageById}
            pages={pages}
          />
        );
      }else if(pageById.pageType === 'document'){
        return(
          <EditDocument
            handleUpdate={this.handleUpdate}
            pageById={pageById}
            pages={pages}
          />
        );
      }
    }else{
      return(
        <div className="add-page-top-level-container">
          <div className="add-page-container">
            <div className="add-page-header"><span className="add-page-header-text">SUCCESS!</span></div>
            <p>'{successResult.title}' has been updated @ <Link to={successResult.route}>{successResult.route}</Link></p>
            <p><Link to={`/admin/pages/edit/${successResult.id}`} onClick={()=>this.setState({success:false})}>To Edit This Page Again or Add Sidebar Links Click Here</Link></p>
            <p><Link to={`/admin/pages`}>To Create A New Page Click Here</Link></p>
          </div>
        </div>
      )
    }
  }
}

export default compose(
   graphql(pageById, {
      name: "pageById",
      options: (props) => ({variables:{id:props.pageId}})
   }),
   graphql(allPages, {
     name:"allPages"
   }),
   graphql(updatePage, {
      name: "updatePage"
   })
)(EditPage);
