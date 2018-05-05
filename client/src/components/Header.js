import React from 'react';
import {NavLink} from 'react-router-dom';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Loading from './Loading';

const Header = (props) => (
  <Query
    query={gql`
      {
        pageById(id:"5aeb7b5f477d982b41b1401e"){
          childPages{
            title
            route
            id
          }
        }
      }
    `}
    >
      {({ loading, error, data })=>{
        if(loading) return <Loading/>;
        if(error) return <p>Error...</p>;
        return(
          <div>
          {data.pageById.childPages.map(({title, route, id})=>
            <NavLink key={id} to={`${route}`}>{title}</NavLink>
          )}
        </div>
        );
        }
      }
    </Query>
  );

export default Header;
