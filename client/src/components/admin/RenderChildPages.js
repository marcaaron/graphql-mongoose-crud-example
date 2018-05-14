import React, {Component} from 'react';
import uuidv1 from 'uuid/v1';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusSquare from '@fortawesome/fontawesome-free-solid/faPlusSquare';
import EditDeleteIcons from './EditDeleteIcons';

class RenderChildPages extends Component{

  render(){
    const {handleDelete, addPage, parentPageId, parentPageLinks, parentPageTitle, handleDragLeave, handleDrop, handleDragEnd, handleDragOver, handleDragEnter, handleDragStart, childPages, handleClick, toggle} = this.props;

      let style;
      if(toggle[`toggle_${parentPageId}`]){
        style = {display:'none'}
      };
      return (
        <div
          style={style}
          className={`sitemap-child-pages container_id_${parentPageId} toggle_${parentPageId}`}
          key={uuidv1()}>

          {childPages.map((page, i)=>
            page.childPages && page.childPages.length > 0 ?
            [
              <div className="sitemap-child-page" key={uuidv1()}>
                <span
                  key={uuidv1()}
                  data-toggle={`toggle_${page.id}`}
                  onClick={handleClick}
                  id={page.id}
                  draggable="true"
                  data-index={i}
                  data-children={true}
                  data-id={page.id}
                  data-title={page.title}
                  data-parentid={parentPageId}
                  data-parentlinks={JSON.stringify(parentPageLinks)}
                  data-parenttitle={parentPageTitle}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  className="sitemap-page-tag"
                >
                  {page.title}
                  { !toggle[`toggle_${page.id}`] ?
                    <span className="sitemap-triangle">▼</span> :
                    <span className="sitemap-triangle">►</span>}
                </span>
                <EditDeleteIcons
                  type="sitemap" parentPageLinks={parentPageLinks} parentPageId={parentPageId} handleDelete={handleDelete} pageId={page.id} />
              </div>,
              <RenderChildPages
                key={uuidv1()}
                parentPageTitle={page.title}
                parentPageId={page.id}
                parentPageLinks={page.links}
                childPages={page.childPages}
                handleDragLeave={handleDragLeave}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDragEnd={handleDragEnd}
                handleDragEnter={handleDragEnter}
                handleDrop={handleDrop}
                toggle={toggle}
                handleClick={handleClick}
                addPage={addPage}
                handleDelete={handleDelete}
              />
            ]
            :
              <div className="sitemap-child-page" key={uuidv1()}>
                <span
                  key={uuidv1()}
                  onClick={handleClick}
                  id={page.id}
                  data-children={false}
                  draggable="true"
                  data-index={i}
                  data-id={page.id}
                  data-title={page.title}
                  data-parentid={parentPageId}
                  data-parentlinks={JSON.stringify(parentPageLinks)}
                  data-parenttitle={parentPageTitle}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  className="sitemap-page-tag"
                >
                  {page.title}
                </span>
                <EditDeleteIcons type="sitemap" parentPageLinks={parentPageLinks} parentPageId={parentPageId} handleDelete={handleDelete} pageId={page.id} />
              </div>
          )}
          <div onClick={addPage} className="sitemap-add-page">
            <FontAwesomeIcon style={{fontSize:'1.5em'}} color="#8edb81" icon={faPlusSquare}/>
            Add A Page
          </div>
        </div>
      );
  }
}

export default RenderChildPages;
