import React from 'react';
import uuidv1 from 'uuid/v1';
import gql from "graphql-tag";
import { Query } from "react-apollo";

const query = gql`
query PageByTitle($title: String!){
  pageByTitle(title:$title){
    title
    childPages{
      title
      childPages{
        title
      }
    }
  }
}
`

const ChildPages = ({childPages, toggle, style, handleClick, index, title}) => (
  <Query query={query} variables={{title}}>
    {({ loading, error, data })=>{
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return(
        <div>
        {data.pageByTitle.childPages.length > 0 && data.pageByTitle.childPages.map(page=>
          page.childPages.length > 0 ?
          [
            <span onClick={handleClick} data-index={`cp${index}`} className="page-tag" key={uuidv1()}>{page.title} { !toggle[`cp${index}`] ? '▼' : '►' }</span>,
            <div style={style[`cp${index}`]} className="child-pages" key={uuidv1()}>
              <ChildPages
                index={Number(index) + 1}
                key={uuidv1()}
                toggle={toggle}
                handleClick={handleClick}
                style={style}
                title={page.title} childPages={page.childPages}/>
            </div>
          ]
          :
            <div key={uuidv1()}><span className="page-tag">{page.title}</span></div>
        )}
      </div>
      )
    }}
  </Query>
)
export default ChildPages;
