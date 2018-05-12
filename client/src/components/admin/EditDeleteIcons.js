import React, {Component} from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import {Link} from 'react-router-dom';

class EditDeleteIcons extends Component{
  render(){
    const {parentPageLinks, pageId, parentPageId, handleDelete} = this.props;
    return(
      <div>
        <Link to={`/admin/pages/edit/${pageId}`}>
          <FontAwesomeIcon
            className="edit-btn"
            style={{fontSize:'1.2em', padding:'0.2em'}}
            icon={faEdit}/>
        </Link>
        <FontAwesomeIcon
          onClick={()=>handleDelete(parentPageId, parentPageLinks, pageId)}
          className="delete-btn"
          style={{fontSize:'1.2em', padding:'0.2em'}}
          icon={faTrashAlt}/>
      </div>
    )
  }
}
export default EditDeleteIcons;
