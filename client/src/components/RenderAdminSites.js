import React, {Component} from 'react';
import RenderChildPages from "./RenderChildPages";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from './Loading';
import { compose } from 'react-apollo';
import AdminPagesAll from './AdminPagesAll';
let dragSource = null;
let dropSource = null;

const mutation =  gql`
  mutation UpdatePage($id: String!, $links:[String]!){
  updatePage(id:$id, links:$links){
    id
    links
    childPages{
      id
      links
      title
    }
  }
}
`;

const allPages = gql`
  {
    allPages {
      id
      title
    }
  }
`;

const pageByTitle = gql`
{
  pageByTitle(title:"Home"){
    title
    id
    links
    childPages{
      title
      id
      links
      childPages{
        title
        id
        links
        childPages{
          title
          id
          links
          childPages{
            title
            id
            links
            childPages{
              title
              id
              links
              childPages{
                title
                id
                links
                childPages{
                  title
                  id
                  links
                }
                childPages{
                  title
                  id
                  links
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

const refetch = gql`
  query pageById($id: String!){
    pageById(id: $id){
      id
      title
      links
      childPages{
        title
        links
        id
      }
    }
  }
`

class RenderAdminSites extends Component{
  constructor(props){
    super(props);

    this.state = {
      toggle: {
        toggle_Home: false
      },
    }
  }

  handleClick = (e) => {
    e.target.scrollIntoView({behavior:'smooth', block:'start'});
    if(e.target.dataset.children){
      const toggleString = e.target.dataset.toggle;
      const toggle = {...this.state.toggle};
      console.log(toggleString);
      if(!toggle[toggleString]){
        toggle[toggleString] = true;
      }else{
        toggle[toggleString] = !toggle[toggleString];
      }
      this.setState({toggle});
    }
  }

  handleDragStart = (e) => {
    dragSource = e.target;
    e.currentTarget.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', e.target.dataset.index);
  }

  handleDrop = (e) => {
    e.stopPropagation();

    const drpSrc = {
      parentid: dropSource.dataset.parentid,
      parentlinks: JSON.parse(dropSource.dataset.parentlinks),
      indexInLinks: dropSource.dataset.index,
      title: dropSource.dataset.title,
      id: dropSource.dataset.id
    };

    const drgSrc = {
      parentid: dragSource.dataset.parentid,
      parentlinks: JSON.parse(dragSource.dataset.parentlinks),
      indexInLinks: dragSource.dataset.index,
      title: dragSource.dataset.title,
      id: dragSource.dataset.id
    };

    // CHECK TO SEE IF OUR DROP SOURCE SHARES A PARENT WITH OUR DRAG SOURCE
    if(drpSrc.parentid === drgSrc.parentid){
      // MAKE A COPY OF THE SHARED LINKS
      const links = [...drpSrc.parentlinks];
      // SPLICE THE ID OUT OF THE CURRENT INDEX OF DRAG SOURCE
      links.splice(drgSrc.indexInLinks, 1);
      // SPLICE THE ID AT THE CURRENT INDEX OF DROP SOURCE
      links.splice(drpSrc.indexInLinks, 0, drgSrc.id)

      // CREATE CHILD PAGES OBJECT TO PASS TO OPTIMISTIC RESULT
      let data = {...this.props.pageByTitle};

      const searchTree = (id, obj, rmIndex, insIndex) => {
        if(obj.id===id){
          const resultObj = {...obj};
          let childPages = [...resultObj.childPages];
          const temp = childPages.splice(rmIndex, 1);
          childPages.splice(insIndex, 0, temp[0]);
          resultObj.childPages = childPages;
          childPages = resultObj.childPages;
          return childPages;
        }else if (obj.childPages.length>0){
          let result = null;
          for(let i=0; result === null && i < obj.childPages.length; i++){
            result = searchTree(id, obj.childPages[i], rmIndex, insIndex);
          }
          return result;
        }
        return null;
      }

      // CALL MUTATION AND PASS LINKS & CHILD PAGES
      this.props.mutation(
        {
          variables: {id: drpSrc.parentid, links: links},
          optimisticResponse: {
            updatePage:{
              id: drpSrc.parentid,
              links: links,
              childPages: searchTree(drpSrc.parentid, data.pageByTitle, drgSrc.indexInLinks, drpSrc.indexInLinks),
              __typename:'Page'
            },
            __typename: 'Mutation'
          },
          refetchQueries:[{query: refetch, variables:{id:drpSrc.parentid}}]
        });
    }
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDragEnter = (e) => {
    if(e.target !== dragSource){
      if(e.target.dataset.parentid === dragSource.dataset.parentid){
        if(e.target.dataset.index > dragSource.dataset.index){
          if(Number(e.target.dataset.index) === JSON.parse(e.target.dataset.parentlinks).length-1){
            e.target.style.border = "2px solid black";
          }else{
            e.target.style.marginBottom = "10px";
          }
        }
        else{
          if(Number(e.target.dataset.index)===0){
            e.target.style.marginTop = "10px";
          }else{
            e.target.style.marginTop = "10px";
          }
        }
      }
    }
    dropSource = e.target;
  }

  handleDragLeave = (e) => {
    if(e.target.dataset.index > dragSource.dataset.index){
      e.target.style.marginBottom = "";
    }
    else{
      e.target.style.marginTop = "";
    }
    e.target.style.border = '';
  }

  handleDragEnd = (e) => {
    dropSource.style.marginBottom = "";
    dropSource.style.marginTop = "";
    dragSource.style.opacity = "";
  }

  render(){
    if(this.props.pageByTitle.loading) return <Loading/>;
    console.log(this.props);
    const {title, id, links, childPages} = this.props.pageByTitle.pageByTitle;
    return(
      <div className="admin-pages-container" style={{textAlign:"left"}}>
        <div className="admin-pages-sitemap">
          <div className="child-pages">
            <span
              onClick={this.handleClick}
              data-toggle={`toggle_${id}`}
              data-children={true}
              className={`site-root page-tag`}>
                {title}
                { !this.state.toggle[`toggle_${id}`] ? '▼' : '►' }
            </span>
          </div>
          <RenderChildPages
            parentPageTitle={title}
            parentPageId={id}
            parentPageLinks={links}
            childPages={childPages}
            handleDragLeave={this.handleDragLeave}
            handleDragStart={this.handleDragStart}
            handleDragOver={this.handleDragOver}
            handleDragEnd={this.handleDragEnd}
            handleDragEnter={this.handleDragEnter}
            handleDrop={this.handleDrop}
            handleClick={this.handleClick}
            toggle={this.state.toggle}
          />
        </div>
        <AdminPagesAll
           handleClick={this.handleClick}
           allPages={this.props.allPages.allPages}
           handleDragStart={this.handleDragStart}
           handleDrop={this.handleDrop}
           handleDragOver={this.handleDragOver}
           handleDragEnd={this.handleDragEnd}
           handleDragEnter={this.handleDragEnter}
           handleDragLeave={this.handleDragLeave}
        />
      </div>
    );
  }
}

export default compose(
   graphql(allPages, {
      name: "allPages"
   }),
   graphql(pageByTitle, {
      name: "pageByTitle"
   }),
   graphql(mutation, {
      name: "mutation"
   })
)(RenderAdminSites);
