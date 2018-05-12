import React, {Component} from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';

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
      handleDragStart,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleDragEnter,
      handleDragEnd
    } = this.props;
    return(
      <div style={{width: (this.props.mainPageWidth-70)/2}} className="sitemap-pages">
        <div style={{width: (this.props.mainPageWidth-70)/2}} className="sitemap-pages-header">
          <span style={{minWidth:'75px'}}>Add A Page</span>
          <div className="sitemap-pages-all-search-bar-box">
            <FontAwesomeIcon style={{padding:'0 0.5em'}} icon={faSearch}/>
            <input className="sitemap-pages-all-search-bar" type="text" value={this.state.search} onChange={this.handleChange}/>
          </div>
        </div>
          <div className="sitemap-pages-results">
          {this.state.matches.length > 0 && this.state.matches.map(page=>{
             return <span
               onClick={handleClick}
               key={`all_${page.id}`}
               data-id={page.id}
               draggable="true"
               data-title={page.title}
               data-type="new-page"
               className="sitemap-page-tag pages-all"
               onDragStart={handleDragStart}
               onDrop={handleDrop}
               onDragOver={handleDragOver}
               onDragEnd={handleDragEnd}
               onDragEnter={handleDragEnter}
               onDragLeave={handleDragLeave}
             >
               {page.title}
             </span>
          })}
      </div>
    </div>
    )
  }
}

export default AdminPagesAll;
