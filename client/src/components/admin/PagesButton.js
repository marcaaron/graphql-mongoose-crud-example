import React, {Component} from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
// import faFileAlt from '@fortawesome/fontawesome-free-solid/faFileAlt';
// import faLink from '@fortawesome/fontawesome-free-solid/faLink';
// import faBoxOpen from '@fortawesome/fontawesome-free-solid/faBoxOpen';
// import faSitemap from '@fortawesome/fontawesome-free-solid/faSitemap';
import {Link} from 'react-router-dom';

class PagesButton extends Component{
  render(){
    return(
      <Link style={{color:'black'}} to={`/admin/pages${this.props.destination}`}>
      <div className="pages-button">
        <FontAwesomeIcon style={{padding:'0.5em', alignSelf:'flex-start'}} icon={faPlusCircle}/>
        <FontAwesomeIcon style={{marginTop:'0.1em'}} size="3x" icon={this.props.icon}/>
        <span style={{margin:'1em'}}>{this.props.text}</span>
      </div>
      </Link>
    );
  }
}
export default PagesButton;
