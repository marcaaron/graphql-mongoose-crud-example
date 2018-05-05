import React, {Component} from 'react';
import uuidv1 from 'uuid/v1';
import Loading from './Loading';
import gql from 'graphql-tag';
import { Query } from "react-apollo";

const query = gql`
  query pageByTitle($title: String!){
    pageByTitle(title: $title){
      title
      id
      links
      childPages{
        title
        id
        links
        childPages{
          title
        }
      }
    }
  }
`;

const RenderChildPages = (
  {
    title,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragStart
  })=>(
  <Query query={query} variables={{title}}>
    {({loading, error, data})=>{
      if(loading) return <Loading/>;
      if(error) return <div>Error!</div>;
      console.log(data);
      return (
        <div
          className="child-pages"
          key={uuidv1()}>

          {data.pageByTitle.childPages.map((page, i)=>
            page.childPages && page.childPages.length > 0 ?
            [
              <div id={page.id} key={uuidv1()}>
                <span
                  id={page.id}
                  draggable="true"
                  data-index={i}
                  data-id={page.id}
                  data-title={page.title}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  className="page-tag"
                >
                  {page.title}
                  {/* { !toggle[`cp${index}${i}`] ? '▼' : '►' } */}
                </span>
              </div>,
              <RenderChildPages
                title={page.title}
                handleDragLeave={handleDragLeave}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDragEnd={handleDragEnd}
                handleDragEnter={handleDragEnter}
                handleDrop={handleDrop}
              />
            ]
            :
              <div key={uuidv1()}>
                <span
                  id={page.id}
                  draggable="true"
                  data-index={i}
                  data-id={page.id}
                  data-title={page.title}
                  data-parentlinks={JSON.stringify(data.pageByTitle.links)}
                  data-parentid={data.pageByTitle.id}
                  data-parenttitle={data.pageByTitle.title}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  className="page-tag"
                >
                  {page.title}
                </span>
              </div>
          )}
        </div>
      );
    }}
  </Query>
  );

export default RenderChildPages;
