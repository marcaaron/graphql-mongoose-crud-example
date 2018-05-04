import React, {Component} from 'react';
import ChildPages from "./ChildPages";
import uuidv1 from 'uuid/v1';

class RenderAdminSites extends Component{
  state = {
    style:{
      cp0:{},
      cp1:{},
      cp2:{},
      cp3:{},
      cp4:{}
    },
    cp0: false,
    cp1: false,
    cp2: false,
    cp3: false,
    cp4: false
  };

  handleClick = (e) => {
    const style = {...this.state.style};
    const toggle = this.state[e.target.dataset.index];
    if(!toggle){
      style[e.target.dataset.index] = {display: 'none'}
    }else{
      style[e.target.dataset.index] = {display: 'block'}
    }
    this.setState({[e.target.dataset.index]: !toggle, style});
  }

  render(){
    return(
        <div style={{textAlign:"left"}}>
          <span onClick={this.handleClick} data-index="cp0" className="site-root page-tag">{this.props.title} { !this.state.cp0 ? '▼' : '►' }</span>
          <div style={this.state.style.cp0} className="child-pages" key={uuidv1()}>
            {this.props.childPages.map(page=>
              page.childPages.length > 0 ?
              [
                <span key={uuidv1()} onClick={this.handleClick} data-index="cp1" className="page-tag">{page.title} { !this.state.cp1 ? '▼' : '►' } </span>,
                <div style={this.state.style.cp1} className="child-pages" key={uuidv1()}>
                  <ChildPages
                    toggle={this.state}
                    style={this.state.style} handleClick={this.handleClick} index="2" key={uuidv1()} title={page.title} childPages={page.childPages}/>
                </div>
              ]
              :
                <div key={uuidv1()}>
                  <span className="page-tag" >{page.title}</span>
                </div>
            )}
          </div>
      </div>
    );
  }
}

export default RenderAdminSites;
