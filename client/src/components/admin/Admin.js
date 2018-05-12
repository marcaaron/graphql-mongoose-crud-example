import React, {Component} from 'react';
import AdminSideBar from './AdminSideBar';
import './styles/Admin.css';
import DecorativeBorder from './DecorativeBorder';
import SiteMap from './SiteMap';

class Admin extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentRoute: props.page,
      mainPageWidth: 0,
      offsetMainPage: 0
    }
  }

  componentDidMount(){
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  onResize = () => {
    const width = window.innerWidth;
    const sideBarWidth = document.querySelector('.admin-sidebar').getBoundingClientRect().width;
    const offsetMainPage = sideBarWidth;
    const mainPageWidth = width-sideBarWidth;
    this.setState({mainPageWidth, offsetMainPage});
  }

  render(){
    return(
      <div className="admin-container">
        <header className="admin-header">
          <h1>KAHUKU ADMIN PANEL</h1>
          <DecorativeBorder/>
        </header>
        <div className="admin-main">
          <AdminSideBar onResize={this.onResize} route={this.props.route}/>
          <div
            style={{width:`${this.state.mainPageWidth}px`, marginLeft:`${this.state.offsetMainPage}px`}} className="admin-page">
            {this.state.currentRoute.page === 'sitemap' ? <SiteMap mainPageWidth={this.state.mainPageWidth}/> : 'No Site Map'}
          </div>
        </div>
      </div>
    );
  }
};

export default Admin;
