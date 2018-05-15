import React, {Component} from 'react';
import './styles/AddPage.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './styles/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import slugify from 'slugify';
import Modal from 'react-modal';
import EditDeleteIcons from './EditDeleteIcons';
import faWindowClose from '@fortawesome/fontawesome-free-solid/faWindowClose';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

function getSignedRequest(file){
  return new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:4000/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        }
        else{
          reject('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  });
}

function uploadFile(file, signedRequest, url){
  return new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          resolve(url);
        }
        else{
          reject('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  })
}

function uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      getSignedRequest(file)
      .then(
        res=>
        uploadFile(file, res.signedRequest, res.url)
        .then(res=>
          resolve({data:{link:res}})
        )
        .catch(err=>reject(err))
      )
      .catch(err=>reject(err));
    },
  );
}


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

class EditSite extends Component{
  constructor(props){
    super(props);
    let html = props.pageById.content;
    if(/^<img/.test(html)){
      html = `<p>${html}`;
    }
    console.log(html);
    const contentBlock = htmlToDraft(html);
    let contentState, editorState;
    if(contentBlock){
      contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      editorState = EditorState.createWithContent(contentState);
    }
    this.state = {
      editorState: editorState || EditorState.createEmpty(),
      pageTitle: props.pageById.title,
      invalidTitle: false,
      pageLinks: props.pageById.pageLinks,
      modalIsOpen: false,
      linkSearchQuery: '',
      pages:props.pages,
      pageLinksInfo: props.pageById.pageLinksInfo || []
    }
  }

  // Modal Functions

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onTitleChange = (e) => {
    let pageTitle = e.target.value;
    let pages = [...this.props.pages];
    let invalidTitle = false;
    if(pages.filter(page=>page.title.toLowerCase() === pageTitle.toLowerCase()).length > 0){
      invalidTitle = true;
    }
    this.setState({
      pageTitle,
      invalidTitle
    });
  };

  handleDelete = (pageId) => {
    const confirm = window.confirm("This action will remove the page from the current pages sidebar links but will not delete the linked page. Are you sure this is the action you want to take?");
    if(confirm){
      let pageLinks = [...this.state.pageLinks];
      let pageLinksInfo = [...this.state.pageLinksInfo];
      pageLinks.splice(pageLinks.indexOf(pageId),1);
      pageLinksInfo = pageLinksInfo.filter(page=>page.id!==pageId);
      this.setState({pageLinks, pageLinksInfo});
    }
  }

  handleSubmitClick = () => {
    if(!this.state.invalidTitle){
      const content = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
      const title = this.state.pageTitle;
      let route = '/'
      const cleanTitle = title.split(' ').map(word => word.replace(/\W|_|@|\$|\(|\)/g,'')).join(' ');
      route += slugify(cleanTitle).toLowerCase();
      const date = new Date().toISOString();
      const lastModified = date;
      const pageLinks = [...this.state.pageLinks];
      this.props.handleUpdate(title, content, route, pageLinks, lastModified);
    }else{
      alert("Failed to submit due to duplicate title. Please pick a new title name.");
    }
  }

  handleAddLink = () => {
    console.log('adding link');
    this.openModal();
  }

  handleSearchQuery = (e) => {
    const linkSearchQuery = e.target.value;
    const regexp = new RegExp(linkSearchQuery, "gi");
    let pages = [...this.props.pages];
    pages = pages.filter(page=>regexp.test(page.title));
    this.setState({linkSearchQuery, pages});
  }

  addLink = (pageId, title, route) => {
    let pageLinks = [...this.state.pageLinks];
    pageLinks.push(pageId);
    const pageLinksInfo = [...this.state.pageLinksInfo];
    const newItem = {title, route, id:pageId};
    pageLinksInfo.push(newItem);
    this.setState({pageLinks, pageLinksInfo});
    this.closeModal();
  }

  render(){
    const { editorState, pageTitle, invalidTitle } = this.state;
    let btnStyle = {};
    if(invalidTitle){
      btnStyle = {backgroundColor:'grey', color:'darkgrey'};
    }
    return(
      <div className="add-page-top-level-container">
        <div className="add-page-container">
          <div className="add-page-header"><span className="add-page-header-text">SITE PAGE TITLE:</span></div>
          <input
            className="add-page-input"
            type="text"
            value={pageTitle}
            onChange={this.onTitleChange}
          />
          {invalidTitle &&
            <div style={{padding:'0.5em', textAlign:'center', color:'red'}}>A page with this title already exists. Page names must be unique.</div>
          }
        </div>

        <div className="add-page-container">
          <div className="add-page-header"><span className="add-page-header-text">PAGE CONTENT:</span></div>
            <Editor
              wrapperClassName="add-page-editor-wrapper"
              editorClassName="add-page-editor"
              editorState={editorState}
              onEditorStateChange={this.onEditorStateChange}
              toolbar={{
                image: {
                  previewImage: true,
                  uploadCallback: uploadImageCallBack,
                  alt: { present: true, mandatory: false },
                },
              }}
            />
        </div>
        <div className="add-page-container">
          <div className="add-page-header"><span className="add-page-header-text">SIDE BAR LINKS:</span></div>
          <div className="edit-page-sidebar-container">
            <span className="add-page-header-text">Title</span>
            <span className="add-page-header-text">Link</span>
            <span className="add-page-header-text">Edit/Delete</span>
          </div>
          {this.state.pageLinksInfo.length > 0 ?
            this.state.pageLinksInfo.map((link, index)=>
            <div data-index={index} data-id={link.id} draggable={true} key={`pageLinksInfo_${link.id}`} className="edit-page-row">
            <span className="edit-page-row-text">{link.title}</span>
            <span className="edit-page-row-text">{link.route}</span>
            <EditDeleteIcons type="page-link" pageId={link.id} handleDelete={this.handleDelete}/>
            </div>
          ):
          <div style={{padding:'0.5em'}} className="edit-page-sidebar-container">
            There are no sidebar links to display.
          </div>
          }
          <div onClick={this.handleAddLink} className="edit-page-sidebar-container edit-page-add-link-btn">
            <FontAwesomeIcon style={{margin:'0.5em'}} icon={faPlusCircle}/>
            <span>Add A New Link</span>
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
                Add A Link Page
                <FontAwesomeIcon className="modal-close-btn" icon={faWindowClose} onClick={this.closeModal}/>
              </h2>
              <div className="modal-filter">
                <div className="modal-filter-text">Filter Pages:</div>
                <form className="modal-filter-form" onSubmit={(e)=>e.preventDefault()}>
                  <input className="modal-filter-input" onChange={this.handleSearchQuery} value={this.state.linkSearchQuery} />
                </form>
              </div>
              <div className="edit-site-modal-links">
                {this.state.pages.length>0 && this.state.pages.map(page=> !this.state.pageLinks.includes(page.id) &&
                  <div className="edit-site-modal-link"
                    onClick={()=>this.addLink(page.id, page.title, page.route)}
                    key={page.id}
                    >
                    <FontAwesomeIcon style={{margin:'0.5em'}} icon={faPlusCircle}/>
                    <div>{page.title}</div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        </div>
        <button style={btnStyle} onClick={this.handleSubmitClick} className="add-page-submit">UPDATE</button>
      </div>
    );
  }
}

export default EditSite;
