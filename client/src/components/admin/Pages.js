import React, {Component} from 'react';
import './styles/Pages.css';
import PagesButton from './PagesButton';
import faFileAlt from '@fortawesome/fontawesome-free-solid/faFileAlt';
import faLink from '@fortawesome/fontawesome-free-solid/faLink';
import faBoxOpen from '@fortawesome/fontawesome-free-solid/faBoxOpen';
import faSitemap from '@fortawesome/fontawesome-free-solid/faSitemap';

class Pages extends Component{
  render(){
    return(
      <div className="pages-button-container">
        <PagesButton icon={faSitemap} text="Create a Site Page" destination="/add-site"/>
        <PagesButton icon={faFileAlt} text="Create a Document Page" destination="/add-document"/>
        <PagesButton icon={faLink} text="Create a Link Page" destination="/add-link"/>
        <PagesButton icon={faBoxOpen} text="Create a Container Page" destination="/add-container"/>

        {/* <PagesButton/>
        <PagesButton/>
        <PagesButton/> */}
      </div>
    )
  }
}

export default Pages;
