import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';
import Loading from '../Loading';

const allMedia = gql`
{
  allMedia{
    key
    urlString
  }
}
`;

class AdminMedia extends Component{
  render(){
    if(this.props.allMedia.loading) return <Loading/>
    console.log(this.props.allMedia.allMedia);
    return(
      <div>
        Admin Media List
        <div className="admin-media">
          {this.props.allMedia.allMedia.map(media=>{
            return (
              <div key={media.key} className="admin-media-card">
                <img src={media.urlString}/>
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}

export default compose(
   graphql(allMedia, {
      name: "allMedia"
   })
)(AdminMedia);
