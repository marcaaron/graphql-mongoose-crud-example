import React, {Component} from 'react';
import AdminAddPageForm from './AdminAddPageForm';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../Loading';
import { compose } from 'react-apollo';

const allPages = gql`
  {
    allPages {
      id
      title
    }
  }
`;

const addPage = gql`
  mutation addPage($title:String!, $content:String!, $route:String!){
  addPage(title:$title, content: $content, route: $route){
    id
  }
}
`;

class AdminAddPage extends Component{
  state = {
    title:'',
    route:'',
    content:'',
    links:[]
  }

  handleChange = (e) => {
    switch(e.target.id){
      case 'route':
      let route = e.target.value;
      if(route[0] !== '/'){
        route = route.split('');
        route.unshift('/');
        route = route.join('');
      }
      this.setState({route});
      break;
      default:
      this.setState({[e.target.id]:e.target.value});
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const validate = () => {
      const pages = [...this.props.allPages.allPages];
      const filter = pages.filter(page => {
        if(page.title === this.state.title || page.route === this.state.route){
          return true;
        }
      });
      if (filter.length>0){
        return false;
      }else{
        return true;
      }
    };

    if(!validate()){
      alert('Title or Route Already Exists!');
    }else{
      this.props.addPage({variables: {title: this.state.title, route: this.state.route, content: this.state.content}});
    }
  }


  render(){
    const {title, route, content, links} = this.state;
    if(this.props.allPages.loading) return <Loading/>
    const { allPages } = this.props.allPages;
    return(
      <div>
        <h1>Add Page</h1>
        <AdminAddPageForm
          title={title}
          route={route}
          content={content}
          links={links}
          allPages={allPages}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
    </div>
  );
  }
}

export default compose(
   graphql(allPages, {
      name: "allPages"
   }),
   graphql(addPage, {
     name: "addPage"
   })
)(AdminAddPage);
