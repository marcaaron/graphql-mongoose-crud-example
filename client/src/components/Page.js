import React from 'react';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Link } from 'react-router-dom';

const query = gql`
query PageByRoute($route:String!){
  pageByRoute(route:$route){
    id
    title
    content
    childPages{
      title
      route
      id
    }
  }
}
`;

const Page = ({route}) => (
  <Query query={query} variables={{route}}>
      {
        ({ loading, error, data }) => {
        if(loading) return <p></p>;
        if(error) return <p></p>;
        const {pageByRoute} = data;
        if(pageByRoute !== null){
          return (
            <div>
              {pageByRoute.childPages.map(page=>{
                return <Link key={`${page.id}`} to={`${page.route}`}>{page.title}</Link>
              })}
              <h3>{pageByRoute.title}</h3>
              <p>{pageByRoute.content}</p>
            </div>
          );
        }else{
          return <div>404 FAIL WHALE</div>
        }
      }
    }
    </Query>
)

export default Page;
