import React, {Component} from 'react';
import uuidv1 from 'uuid/v1';

class RenderChildPages extends Component{
  render(){
    const {parentPageId, parentPageLinks, parentPageTitle, handleDragLeave, handleDrop, handleDragEnd, handleDragOver, handleDragEnter, handleDragStart, childPages, handleClick, toggle} = this.props;

      let style;
      if(toggle[`toggle_${parentPageId}`]){
        style = {display:'none'}
      };

      return (
        <div
          style={style}
          className={`child-pages container_id_${parentPageId} toggle_${parentPageId}`}
          key={uuidv1()}>

          {childPages.map((page, i)=>
            page.childPages && page.childPages.length > 0 ?
            [
              <div key={uuidv1()}>
                <span
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
                  className="page-tag"
                >
                  {page.title}
                  { !toggle[`toggle_${page.id}`] ? '▼' : '►' }
                </span>
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
              />
            ]
            :
              <div key={uuidv1()}>
                <span
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
                  className="page-tag"
                >
                  {page.title}
                </span>
              </div>
          )}
        </div>
      );
  }
}

export default RenderChildPages;
