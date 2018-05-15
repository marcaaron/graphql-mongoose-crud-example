import React, {Component} from 'react';
import uuidv1 from 'uuid/v1';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusSquare from '@fortawesome/fontawesome-free-solid/faPlusSquare';
import EditDeleteIcons from './EditDeleteIcons';
import Modal from 'react-modal';
import faWindowClose from '@fortawesome/fontawesome-free-solid/faWindowClose';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflow              : 'scroll',
    height                : '50%',
    width                 : '50%',
    borderRadius          : '10px',
    boxShadow             : '1px 1px 1px 0 rgba(0,0,0,0.5)',
    padding:0
  }
};

Modal.setAppElement('#root');

class RenderChildPages extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen: false,
      linkSearchQuery: '',
      pages: props.allPages,
      currentPageId:'',
      currentPageLinks:''
    }
  }

  // Modal Functions

  openModal = (pageId, pageLinks) => {
    const currentPageId = pageId;
    const currentPageLinks = pageLinks;
    this.setState({modalIsOpen: true, currentPageId, currentPageLinks});
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  handleSearchQuery = (e) => {
    const linkSearchQuery = e.target.value;
    const regexp = new RegExp(linkSearchQuery, "gi");
    let pages = [...this.props.allPages];
    pages = pages.filter(page=>regexp.test(page.title));
    this.setState({linkSearchQuery, pages});
  }

  handleAddLink = (pageId, parentPageId, parentPageLinks) => {
    this.props.addLink(pageId, parentPageId, parentPageLinks);
    this.closeModal();
  }

  render(){
    const {allPages, addLink, handleDelete, parentPageId, parentPageLinks, parentPageTitle, handleDragLeave, handleDrop, handleDragEnd, handleDragOver, handleDragEnter, handleDragStart, childPages, handleClick, toggle} = this.props;

      let style;
      if(toggle[`toggle_${parentPageId}`]){
        style = {display:'none'}
      };
      return (
        <div
          style={style}
          className={`sitemap-child-pages container_id_${parentPageId} toggle_${parentPageId}`}>

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
                handleDelete={handleDelete}
                allPages={allPages}
                addLink={addLink}
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
                <div onClick={()=>this.openModal(page.id, page.links)} className="sitemap-add-page">
                  <FontAwesomeIcon style={{fontSize:'1.5em'}} color="#8edb81" icon={faPlusSquare}/>
                  Add A Page
                </div>
              </div>
          )}
          <div onClick={()=>this.openModal(parentPageId, parentPageLinks)} className="sitemap-add-page">
            <FontAwesomeIcon style={{fontSize:'1.5em'}} color="#8edb81" icon={faPlusSquare}/>
            Add A Page
          </div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div className="modal-content">
              <h2 className="edit-site-modal-header" ref={subtitle => this.subtitle = subtitle}>
                Add A Page
                <FontAwesomeIcon className="modal-close-btn" icon={faWindowClose} onClick={this.closeModal}/>
              </h2>
              <div className="modal-filter">
                <div className="modal-filter-text">Filter Pages:</div>
                <form className="modal-filter-form" onSubmit={(e)=>e.preventDefault()}>
                  <input ref="modalInput" className="modal-filter-input" onChange={this.handleSearchQuery} value={this.state.linkSearchQuery} />
                </form>
              </div>
              <div className="edit-site-modal-links">
                {this.state.pages.length>0 && this.state.pages.map(page=> page.id !== this.state.currentPageId &&
                  <div className="edit-site-modal-link"
                    onClick={()=>this.handleAddLink(page.id, this.state.currentPageId, this.state.currentPageLinks)}
                    key={`modal-links-${page.id}`}
                    >
                    <FontAwesomeIcon style={{margin:'0.5em'}} icon={faPlusCircle}/>
                    <div>{page.title}</div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        </div>
      );
  }
}

export default RenderChildPages;
