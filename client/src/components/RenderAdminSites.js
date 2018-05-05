import React, {Component} from 'react';
import RenderChildPages from "./RenderChildPages";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from './Loading';

let dragSource = null;
let dropSource = null;

const mutation =  gql`
  mutation UpdatePage($id: String!, $links:[String]!){
  updatePage(id:$id, links:$links){
    id
  }
}
`;

const query = gql`
{
  pageByTitle(title:"Home"){
    title
    id
    links
    childPages{
      title
      id
      links
    }
  }
}
`

class RenderAdminSites extends Component{
  componentDidMount(){
    console.log('this.props', this.props);
  }

  handleDragStart = (e) => {
    console.log(
      "ID of page: ", e.target.dataset.id+"\n",
      "Title of Page: ", e.target.dataset.title+"\n",
      "ID of Parent: ", e.target.dataset.parentid+"\n",
      "Title of Parent: ", e.target.dataset.parenttitle
    );
    console.table(JSON.parse(e.target.dataset.parentlinks));

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
      console.log(drpSrc.parentid);
      console.table(links);
      // SPLICE THE ID OUT OF THE CURRENT INDEX OF DRAG SOURCE
      links.splice(drgSrc.indexInLinks, 1);
      // SPLICE THE ID AT THE CURRENT INDEX OF DROP SOURCE
      links.splice(drpSrc.indexInLinks, 0, drgSrc.id)
      // CALL MUTATION AND PASS LINKS!
      console.table(links);
      console.log(this.props);
      this.props.mutate(
        {
          variables: {id: drpSrc.parentid, links: links},
          optimisticResponse: {
            updatePage:{
              id: drpSrc.parentid, links: links, __typename: 'Page'
            }
          },
          refetchQueries:[{query}]
        });
    }
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDragEnter = (e) => {
    if(e.target !== dragSource){
      if(e.target.dataset.i > dragSource.dataset.i){
        if(Number(e.target.dataset.i) === this.state.childPages.length-1){
          e.target.style.border = "2px solid black";
        }else{
          e.target.style.marginBottom = "10px";
        }
      }
      else{
        if(Number(e.target.dataset.i)===0){
          e.target.style.border = "2px solid black";
        }else{
          e.target.style.marginTop = "10px";
        }
      }
    }
    dropSource = e.target;
  }

  handleDragLeave = (e) => {
    if(e.target.dataset.i > dragSource.dataset.i){
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

  componentWillUpdate(nextProps){
    console.log(this.props, nextProps);
  }

  render(){
    const title = "Home";
    return(
      <div style={{textAlign:"left"}}>
        <div>
          <span
            className="site-root page-tag">
              {title}
              {/* { !this.state.toggle.cp0 ? '▼' : '►' } */}
          </span>
        </div>
        <RenderChildPages
          title={title}
          handleDragLeave={this.handleDragLeave}
          handleDragStart={this.handleDragStart}
          handleDragOver={this.handleDragOver}
          handleDragEnd={this.handleDragEnd}
          handleDragEnter={this.handleDragEnter}
          handleDrop={this.handleDrop}
        />
      </div>
    );
  }
}

export default graphql(mutation)(RenderAdminSites);
