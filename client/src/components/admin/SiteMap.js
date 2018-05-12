import React, {Component} from 'react';
import RenderChildPages from "./RenderChildPages";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../Loading';
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

class SiteMap extends Component{
  constructor(props){
    super(props);

    this.state = {
      toggle: {
        toggle_Home: false
      },
      addPage: false
    }
  }

  addPage = () => {
    const addPage = !this.state.addPage;
    this.setState({addPage})
  }

  handleDelete = (parentPageId, parentPageLinks, pageId) => {
    const res = window.confirm("This action will immediately delete the selected page from the site tree, but will not delete it's associated content. Are you sure you want to do this?");
    if(res){
    console.log(parentPageId, pageId, parentPageLinks);
      const links = [...parentPageLinks];
      links.splice(links.indexOf(pageId),1);
      console.log(links);
      this.props.mutation(
        {
          variables: {id: parentPageId, links: links},
          refetchQueries:[{query: refetch, variables:{id:parentPageId}}]
        });
    }
  }

  handleClick = (e) => {
    // e.target.scrollIntoView({behavior:'smooth', block:'start'});
    if(e.target.dataset.children){
      const toggleString = e.target.dataset.toggle;
      const toggle = {...this.state.toggle};
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
    console.log(dragSource);
    // IF IT'S A NEW PAGE....
    if(dragSource.dataset.type==="new-page"){
      if(dropSource.dataset.type !== "new-page"){
        const drpSrc = {
          parentid: dropSource.dataset.parentid,
          parentlinks: JSON.parse(dropSource.dataset.parentlinks),
          indexInLinks: dropSource.dataset.index,
          title: dropSource.dataset.title,
          id: dropSource.dataset.id
        };
        if(drpSrc.parentlinks.includes(dragSource.dataset.id)){
          alert('Page already exists on this branch.');
        }else{
          const links = [...drpSrc.parentlinks];
          links.splice(drpSrc.indexInLinks, 0, dragSource.dataset.id);
          // CALL MUTATION AND PASS LINKS & CHILD PAGES
          this.props.mutation(
            {
              variables: {id: drpSrc.parentid, links: links},
              refetchQueries:[{query: refetch, variables:{id:drpSrc.parentid}}]
            });
        }
      }
    }else{
      // IF PAGE IS ALREADY IN SITE MAP
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
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDragEnter = (e) => {
    if(e.target !== dragSource && e.target.dataset.type !== "new-page"){
      if(dragSource.dataset.type==="new-page"){
        e.target.classList.add('sitemap-page-tag-above-active');
      }else{
        if(e.target.dataset.parentid === dragSource.dataset.parentid){
          console.log(e.target.dataset.index, dragSource.dataset.index);
          if(e.target.dataset.index > dragSource.dataset.index){
            if(Number(e.target.dataset.index) === JSON.parse(e.target.dataset.parentlinks).length-1){
              e.target.classList.add('sitemap-page-tag-below-active');
            }else{
              e.target.classList.add('sitemap-page-tag-below-active');
            }
          }
          else{
            if(Number(e.target.dataset.index)===0){
              e.target.classList.add('sitemap-page-tag-above-active');
            }else{
              e.target.classList.add('sitemap-page-tag-above-active');
            }
          }
        }
      }
    }
    dropSource = e.target;
  }

  handleDragLeave = (e) => {
      e.target.classList.remove('sitemap-page-tag-above-active');
      e.target.classList.remove('sitemap-page-tag-below-active');
  }

  handleDragEnd = (e) => {
    console.log('dragend', e.target);
      e.target.classList.remove('sitemap-page-tag-above-active');
      e.target.classList.remove('sitemap-page-tag-below-active');
      dropSource.classList.remove('sitemap-page-tag-below-active');
      dropSource.classList.remove('sitemap-page-tag-above-active');
      dragSource.style.opacity = "";
  }

  render(){
    if(this.props.pageByTitle.loading) return <Loading/>;
    const {title, id, links, childPages} = this.props.pageByTitle.pageByTitle;
    return(
      <div className="admin-pages-container" style={{textAlign:"left"}}>
        <div className="admin-pages-header">Site Map</div>
        <div className="admin-pages-main">
          <div className="sitemap-child-pages">
            <span
              onClick={this.handleClick}
              data-toggle={`toggle_${id}`}
              data-children={true}
              className={`sitemap-root sitemap-page-tag`}>
                {title}
                { !this.state.toggle[`toggle_${id}`] ?
                  <span className="sitemap-triangle">▼</span> :
                  <span className="sitemap-triangle">►</span>
                }
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
            addPage={this.addPage}
            handleDelete={this.handleDelete}
          />
        </div>
        {
          this.state.addPage &&
          <AdminPagesAll
            mainPageWidth={this.props.mainPageWidth}
            allPages={this.props.allPages.allPages}
            handleDragLeave={this.handleDragLeave}
            handleDragStart={this.handleDragStart}
            handleDragOver={this.handleDragOver}
            handleDragEnd={this.handleDragEnd}
            handleDragEnter={this.handleDragEnter}
            handleDrop={this.handleDrop}
          />
        }
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
)(SiteMap);
