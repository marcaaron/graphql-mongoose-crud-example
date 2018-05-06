import React, {Component} from 'react';

class AdminPagesAll extends Component{
  constructor(props){
    super(props);
    this.state = {
      search:'',
      matches: props.allPages
    }
  };

  handleChange = (e) =>{
    const search = e.target.value;
    const regex = new RegExp(`${search}`, "gi");
    const matches = this.props.allPages.filter(page => page.title.match(regex));
    this.setState({search, matches})
  }

  render(){
    const {
      handleClick,
      allPages,
      handleDragStart,
      handleDrop,
      handleDragOver,
      handleDragEnd,
      handleDragEnter,
      handleDragLeave
    } = this.props;
    return[
      <form className="admin-search-bar">
        <input type="text" value={this.state.search} onChange={this.handleChange}/>
      </form>,
      <div className="admin-pages-all">
        <div className="admin-page-all-results">
        {this.state.matches.length > 0 && this.state.matches.map(page=>{
           return <span
             onClick={handleClick}
             key={`all_${page.id}`}
             draggable="true"
             data-id={page.id}
             data-title={page.title}
             onDragStart={handleDragStart}
             onDrop={handleDrop}
             onDragOver={handleDragOver}
             onDragEnd={handleDragEnd}
             onDragEnter={handleDragEnter}
             onDragLeave={handleDragLeave}
             className="page-tag pages-all"
           >
             {page.title}
           </span>
        })}
        </div>
      </div>
    ]
  }
}

export default AdminPagesAll;
