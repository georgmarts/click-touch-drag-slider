const { useState, useEffect, useContext, useRef, useMemo, Children, useLayoutEffect, useCallback } = React;

function ClickTouchMoveCarousel({data, itemWidth, itemsPerBlock}) {

  const offset = Math.ceil(itemsPerBlock/2) //Number of items per each side of the centered one
  const items1 = data.slice(data.length - offset)
  const items0 = data
  const items2 = data.slice(0, offset)
  const mergedItems = items1.concat(items0, items2)
  const [items, setItems] = useState(mergedItems)

  const [startPosition, setStartPosition] = useState()
  const [changedPosition, setChangedPosition] = useState(-itemWidth)
  const transform = 'transform 1s' // transition duration when sliding elements
  const [smooth, setSmooth] = useState(transform)
  const [status, setStatus] = useState(false) // make the movement start onMouseDown and stop onMouseUp and onMouseLeave
  const element = useRef() // reference to the container
  const containerWidth = itemWidth*items.length
  const overflowWidth = itemWidth*itemsPerBlock

  // Function than changes the ID according to changedPosition value

  function setStyleId(number) {
    return (changedPosition/itemWidth) + number
  }

  // Dynamic styles

    const overflowStyle = {
      width: `${overflowWidth}px`,
    }

    const itemStyleNonActive = {
      width: `${itemWidth}px`,
    }
  
    const itemStyleActive = {
      // boxShadow: '0.5px 0.5px 3px 0.5px black',
      transform: 'scale(1.15)',
      width: `${itemWidth}px`,
    }

    const containerStyle = {
      transform: `translateX(${changedPosition}px)`,
      transition: smooth,
      width: `${containerWidth}px`
    }

  // This dynamically changes the styleId to make the centered element stylized
  
  useEffect(() => {
    
    const updatedItems = (items.map((x, index) => {return {...x, styleId: setStyleId(index + 1)}}))
    setItems(updatedItems)

  }, [changedPosition])


  // Functions for PC

    function prev() {
      changedPosition >= -itemWidth ? (setChangedPosition(-itemWidth*data.length-itemWidth), setSmooth(null)) : (setChangedPosition(prev => prev + itemWidth), setSmooth(transform))
    }

    function next() {
      changedPosition <= -itemWidth*data.length ? (setChangedPosition(0), setSmooth(null)) : (setChangedPosition(prev => prev - itemWidth), setSmooth(transform))
    }
    
    function handleMouseDown(e) {
      setStatus(true)
      setSmooth(null)
      setStartPosition((e.nativeEvent.pageX - element.current.offsetLeft) - changedPosition)
    }

    function handleMouseMove(e) {
      if (!status) return;
      e.preventDefault();
      changedPosition < -(itemWidth*data.length)-itemWidth || changedPosition > 0 ? null
      : setChangedPosition((e.nativeEvent.pageX - element.current.offsetLeft) - startPosition)
      }


    function handleMouseUpAndLeave() {
      if (!status) return;
      setChangedPosition(Math.round(changedPosition/itemWidth)*itemWidth)
      setSmooth(transform)
      setStatus(false)
      changedPosition >= -itemWidth ? prev() : null
      changedPosition <= -itemWidth*data.length ? next() : null
      changedPosition < -itemWidth*data.length+itemWidth ? setChangedPosition(-itemWidth) : null
      changedPosition > 0 ? setChangedPosition(-itemWidth*data.length) : null
    }

  // Functions for mobile devices

      function handleTouchStart(e) {
          setStatus(true)
          setSmooth(null)
          setStartPosition((e.touches[0].pageX - element.current.offsetLeft) - changedPosition)
        }
      
      function handleTouchMove(e) {
        if (!status) return;
        changedPosition < -(itemWidth*data.length)-itemWidth || changedPosition > 0 ? null
        : setChangedPosition((e.touches[0].pageX - element.current.offsetLeft) - startPosition)
        }

      function handleTouchEnd() {
        if (!status) return;
        setChangedPosition(Math.round(changedPosition/itemWidth)*itemWidth)
        setSmooth(transform)
        setStatus(false)
        changedPosition >= -itemWidth ? prev() : null
        changedPosition <= -itemWidth*data.length ? next() : null
        changedPosition < -itemWidth*data.length+itemWidth ? setChangedPosition(-itemWidth) : null
        changedPosition > 0 ? setChangedPosition(-itemWidth*data.length) : null
      }


  // This make the transition between the last and the first items smoothly infinite

  useEffect(() => {
    changedPosition === 0 ? next() : null
    changedPosition === -itemWidth*data.length-itemWidth ? prev() : null
    
  }, [changedPosition])

  console.log(changedPosition)

  return <>
  
    <div className='overflow-container' style={overflowStyle}>

    <div ref={element} className='container' style={containerStyle}
    onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} 
    onMouseUp={handleMouseUpAndLeave} onMouseLeave={handleMouseUpAndLeave}
    onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}>
      
    {items.map((x, index)=>
        <div key={index} style={x.styleId === Math.round(itemsPerBlock/2) && !status? itemStyleActive : itemStyleNonActive} className='item'>
          <div className='item-content'>
            <div style={{backgroundImage: `url(${x.img})`}}></div>
            <div style={x.styleId === Math.round(itemsPerBlock/2) && !status ? {height:'23%'} : {}}><p>{x.title}</p><p>{x.description}</p></div>
            </div>
        </div>
        )}
    </div>

    <div className='prev-btn' onClick={prev}><svg xmlns="http://www.w3.org/2000/svg" fillRule="currentColor" className="bi bi-arrow-left-square" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
    </svg></div>
    
    <div className='next-btn' onClick={next}> <svg xmlns="http://www.w3.org/2000/svg" fillRule="currentColor" className="bi bi-arrow-right-square" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
    </svg></div>

    <div className='dots-container'>{items.map((x, index)=><button style={
      {display: index < offset || index > data.length + Math.floor(itemsPerBlock/2) - (itemsPerBlock+1)%2? 'none' : 'block',
      backgroundColor: x.styleId === Math.round(itemsPerBlock/2) && !status ? 'grey' : 'inherit',
      color: x.styleId === Math.round(itemsPerBlock/2) && !status ? 'white' : 'inherit'}}
      onClick={() => itemsPerBlock%2 != 0 ? setChangedPosition((index-Math.floor(itemsPerBlock/2))*-Math.abs(itemWidth))
      : setChangedPosition(((index+1)-Math.floor(itemsPerBlock/2))*-Math.abs(itemWidth))}>
      {index - Math.ceil(itemsPerBlock/2) + 1}</button>)}</div>

  </div> 
  </> 
}


function App() {
    const data = [
    {title: 'John Smith 1', description: 'Junior Developer', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
    {title: 'John Smith 2', description: 'Junior Developer', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
    {title: 'John Smith 3', description: 'Junior Developer', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
    {title: 'John Smith 4', description: 'Junior Developer', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
    {title: 'John Smith 5', description: 'Junior Developer', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
    {title: 'John Smith 6', description: 'Junior Developer', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
    {title: 'John Smith 7', description: 'Junior Developer', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
    {title: 'John Smith 8', description: 'Junior Developer', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
    {title: 'John Smith 9', description: 'Junior Developer', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
     ]

    return <ClickTouchMoveCarousel data = {data} itemWidth = {300} 
    itemsPerBlock = {3} />
  
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>)
