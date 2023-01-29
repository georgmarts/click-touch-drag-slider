const { useState, useEffect, useContext, useRef, useMemo, Children, useLayoutEffect, useCallback } = React;

function Carousel({data, itemWidth, itemsPerBlock}) {

  // const itemWidth = 300
  // const itemsPerBlock = 3

  //Start and changed position of the mouse cursor

  const offset = Math.ceil(itemsPerBlock/2)
  const items1 = data.slice(data.length - offset)
  const items0 = data
  const items2 = data.slice(0, offset)
  const mergedItems = items1.concat(items0, items2)

  console.log(mergedItems)

  const [items, setItems] = useState(mergedItems)

  const [startPosition, setStartPosition] = useState()
  const [changedPosition, setChangedPosition] = useState(-itemWidth)

  // Function than changes the ID according to changedPosition value

  function setStyleId(number) {
    return (changedPosition/itemWidth) + number
  }

  // const [items, setItems] = useState([
  //   {title: 'title'},
  //   {title: 'title'},
  //   {title: 'title'},
  //   {title: 'title'},
  //   {title: 'title'},
  //   {title: 'title'},
  //   {title: 'title'},
  //   {title: 'title'},
  //   {title: 'title'},
  //   {title: 'title'}   ])

  const containerWidth = itemWidth*items.length

  // Changing style of active item

    const overflowWidth = itemWidth*itemsPerBlock

    const overflowStyle = {
      width: `${overflowWidth}px`,
    }

    const itemStyleNonActive = {
      width: `${itemWidth}px`,
    }
  
    const itemStyleActive = {
      backgroundColor: 'red',
      transform: 'scale(1.1)',
      width: `${itemWidth}px`,
    }

  const [smooth, setSmooth] = useState('transform 0.5s')
  const [status, setStatus] = useState(false) // make the movement start on mouseDown
  const element = useRef()
  const walk = itemWidth // the length of the move

  const xStyle = {
    transform: `translateX(${changedPosition}px)`,
    transition: smooth,
    width: `${containerWidth}px`
  }

    useEffect(() => {
    
    const updatedItems = (items.map((x, index) => {return {...x, styleId: setStyleId(index + 1)}}))
    setItems(updatedItems)

  }, [changedPosition])
  
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

    function prev() {
      changedPosition >= -itemWidth ? (setChangedPosition(-itemWidth*data.length-itemWidth), setSmooth(null)) : (setChangedPosition(prev => prev + itemWidth), setSmooth('transform 0.5s'))
    }
  
    function next() {
      changedPosition <= -itemWidth*data.length ? (setChangedPosition(0), setSmooth(null)) : (setChangedPosition(prev => prev - itemWidth), setSmooth('transform 0.5s'))
    }

  function handleMouseUpAndLeave() {
    if (!status) return;
    setChangedPosition(Math.round(changedPosition/itemWidth)*itemWidth)
    setSmooth('transform 0.5s')
    setStatus(false)
    changedPosition >= -itemWidth ? prev() : null
    changedPosition <= -itemWidth*data.length ? next() : null
  }

  useEffect(() => {
    changedPosition === 0 ? next() : null
    changedPosition === -itemWidth*data.length-itemWidth ? prev() : null
    return () => {
      
    }
  }, [changedPosition])
  

  console.log(changedPosition)

  return <>
  
    <main style={overflowStyle}>

    <div ref={element} className='section' style={xStyle}
    onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} 
    onMouseUp={handleMouseUpAndLeave} onMouseLeave={handleMouseUpAndLeave}
    onTouchStart={handleMouseDown} onTouchMove={handleMouseMove}
    onTouchEnd={handleMouseUpAndLeave} onTouchCancel={handleMouseUpAndLeave}>
      
    {items.map((x)=>
        <div style={x.styleId === Math.round(itemsPerBlock/2) ? itemStyleActive : itemStyleNonActive} className='item'>
          <div className='inner-content'>
            <div style={{width: '100px', height: '40px', backgroundImage: `url(${x.img})`}}></div>
            <p>{x.title}</p>
            <p>{x.description}</p>
            </div>
        </div>
        )}
    </div>

  </main> 

  <button onClick={prev}>prev</button>
  <button onClick={next}>next</button>
  </> 
}


function App() {
    const data = [
    {title: '1', description: 'aaa', img: 'https://www.w3schools.com/howto/img_nature_wide.jpg'},
    {title: '2', description: 'aaa', img: 'https://www.w3schools.com/howto/img_nature_wide.jpg'},
    {title: '3', description: 'aaa', img: 'https://www.w3schools.com/howto/img_nature_wide.jpg'},
    {title: '4', description: 'aaa', img: 'https://www.w3schools.com/howto/img_nature_wide.jpg'},
    {title: '5', description: 'aaa', img: 'https://www.w3schools.com/howto/img_nature_wide.jpg'},
    {title: '6', description: 'aaa', img: 'https://www.w3schools.com/howto/img_nature_wide.jpg'},
    {title: '7', description: 'aaa', img: 'https://www.w3schools.com/howto/img_nature_wide.jpg'},
    {title: '8', description: 'aaa', img: 'https://www.w3schools.com/howto/img_nature_wide.jpg'},   ]

    return <Carousel data = {data} itemWidth = {100} itemsPerBlock = {4} />
  
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>)
