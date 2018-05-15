import React, {Component} from 'react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faAngleDoubleLeft from '@fortawesome/fontawesome-free-solid/faAngleDoubleLeft';
import faAngleDoubleRight from '@fortawesome/fontawesome-free-solid/faAngleDoubleRight';
import uuidv1 from 'uuid/v1';

class AdminSideBar extends Component{

  state = {
    searchValue: '',
    sideBarToggle: false
  }

  handleChange = (e) => {
    const searchValue = e.target.value;
    this.setState({searchValue})
  }

  handleSideBarToggle = () => {
    document.addEventListener('transitionend', this.props.onResize);
    this.setState({sideBarToggle: !this.state.sideBarToggle});
  }

  render(){
    let style = {};
    let hide = {};
    if(this.state.sideBarToggle){
      style = {maxWidth:'30px',minWidth:0};
      hide = {display:'none'};
    }
    return(
      <div style={style} className="admin-sidebar">
        <div className="admin-sidebar-search">
          {!this.state.sideBarToggle && <FontAwesomeIcon style={{padding:'0.5em'}} icon={faSearch}/>}
          <input style={hide} className="admin-sidebar-search-input" onChange={this.handleChange} type="text" id="admin-search" value={this.state.searchValue}/>
            <FontAwesomeIcon
              onClick={this.handleSideBarToggle}
              style={{padding:'0.5em'}}
              icon={!this.state.sideBarToggle ? faAngleDoubleLeft : faAngleDoubleRight}
            />
        </div>
        <NavLink style={hide} className="admin-sidebar-item" to="/admin/sitemap">
          <span>Site Map</span>
          <span>{this.props.route === '/admin/sitemap' ? '▼' : '▶︎'}</span>
        </NavLink>

        <NavLink style={hide} className="admin-sidebar-item" to="/admin/pages">
          <span>Pages</span>
          <span>
            {
              (this.props.route === '/admin/pages' ||
              this.props.route === '/admin/pages/edit' ||
              this.props.route === `/admin/pages/edit/${this.props.match.params.page}`
              ) ? '▼' : '▶︎'
            }
          </span>
        </NavLink>
        {
          (this.props.route === '/admin/pages' ||
            this.props.route === '/admin/pages/edit' ||
            this.props.route === `/admin/pages/edit/${this.props.match.params.page}`) &&
          [
            <Link key={uuidv1()} style={hide} className="admin-sidebar-item" to="/admin/pages">
            <span>– Add New Page</span>
            <span>{this.props.route === '/admin/pages' ? '▼' : '▶︎'}</span>
            </Link>,
            <Link key={uuidv1()} style={hide} className="admin-sidebar-item" to="/admin/pages/edit">
              <span>– Update Existing Pages</span>
              <span>{
                (
                  this.props.route === '/admin/pages/edit' ||  this.props.route===`/admin/pages/edit/${this.props.match.params.page}`
                ) ? '▼' : '▶︎'
              }</span>
            </Link>
          ]
        }

        <NavLink style={hide} className="admin-sidebar-item" to="/admin/events">
          <span>Events Listings</span>
          <span>{this.props.route === '/admin/events' ? '▼' : '▶︎'}</span>
        </NavLink>

        <NavLink style={hide} className="admin-sidebar-item" to="/admin/staff">
          <span>Staff Directory</span>
          <span>{this.props.route === '/admin/staff' ? '▼' : '▶︎'}</span>
        </NavLink>

        <NavLink style={hide} className="admin-sidebar-item" to="/admin/food">
          <span>Food Menu</span>
          <span>{this.props.route === '/admin/food' ? '▼' : '▶︎'}</span>
        </NavLink>

        <NavLink style={hide} className="admin-sidebar-item" to="/admin/news">
          <span>News</span>
          <span>{this.props.route === '/admin/news' ? '▼' : '▶︎'}</span>
        </NavLink>

        <NavLink style={hide} className="admin-sidebar-item" to="/admin/bulletins">
          <span>Daily Bulletins</span>
          <span>{this.props.route === '/admin/bulletins' ? '▼' : '▶︎'}</span>
        </NavLink>

        <NavLink style={hide} className="admin-sidebar-item" to="/admin/bell-schedule">
          <span>Bell Schedule</span>
          <span>{this.props.route === '/admin/bell-schedule' ? '▼' : '▶︎'}</span>
        </NavLink>

        <NavLink style={hide} className="admin-sidebar-item" to="/admin/assets">
          <span>Asset Manager</span>
          <span>{this.props.route === '/admin/assets' ? '▼' : '▶︎'}</span>
        </NavLink>
      </div>
    )
  }
}

export default withRouter(AdminSideBar);
