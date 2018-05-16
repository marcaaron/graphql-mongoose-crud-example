import React, {Component} from 'react';

const ArrowHead = () => {
  return(
    <svg className="admin-header-arrowhead"
      viewBox='181.8300018310547 202.13800048828125 139.7949981689453 100.86199951171875'
      width='30' xmlns='http://www.w3.org/2000/svg'>
    <polygon shapeRendering="geomtricPrecision" id='polygon15-copy' strokeWidth="5" stroke='#000' fill='#FFF' points='181.83 229.427 218.141 202.138 321.625 252.951 217.231 300 182.74 273.653 221.772 251.065'
    />
    </svg>
  )
}

class DecorativeBorder extends Component{
  constructor(props){
    super(props);
    this.state = {
      width: 0
    }
  }

  componentDidMount(){
    const width = window.innerWidth;
    this.setState({width});
    window.addEventListener('resize', this.onResize);
  }

  onResize = () => {
    const width = window.innerWidth;
    this.setState({width});
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.onResize);
  }


  render(){
    const arrowheads = [];
    for(let i=0; i<this.state.width; i+=19){
      arrowheads.push(<ArrowHead key={`arrowhead$_${i}`}/>);
    }
    return(
      <div className="admin-header-arrowhead-box">
       {arrowheads.length > 0 && arrowheads.map(item=>item)}
      </div>
    )
  }
}

export default DecorativeBorder;
