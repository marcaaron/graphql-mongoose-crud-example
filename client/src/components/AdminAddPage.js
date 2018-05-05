import React, {Component} from 'react';
import AdminAddPageForm from './AdminAddPageForm';

class AdminAddPage extends Component{
  state = {
    title:'',
    route:'',
    content:'',
    links:[]
  }

  handleChange = (e) => {
    this.setState({[e.target.id]:e.target.value});
  }

  render(){
    const {title, route, content, links} = this.state;
    return(
      <div>
        <h1>Add Page</h1>
        <AdminAddPageForm
          title={title}
          route={route}
          content={content}
          links={links}
          handleChange={this.handleChange}
        />
    </div>
  );
  }
}
export default AdminAddPage;
