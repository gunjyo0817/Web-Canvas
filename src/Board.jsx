import {useRef, useState} from "react";
import ToolButton from "./ToolButton";

export default function Board() {
    const painter = useRef()
    const [initial, setInitial] = useState(true)
    const [tool, setTool] = useState('rectangle')
    const [color, setColor] = useState('black')
    const [size, setSize] = useState(10)
    const [font, setFont] = useState('sans-serif')
    const [drawWidth, setdrawWidth] = useState(5)
    const [eraserWidth, setEraserWidth] = useState(20)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isFill, setIsFill] = useState(false)
    const [clickX, setClickX] = useState(0)
    const [clickY, setClickY] = useState(0)
    const [lastX, setLastX] = useState(0)
    const [lastY, setLastY] = useState(0)
    const [savedShape, setSavedShape] = useState(new Image());

    const saveShape = () => {
        const dataUrl = painter.current.toDataURL();
        const img = new Image()
        img.src = dataUrl
        setSavedShape(img)
    }

    const loadCanvas = () => {
        const ctx = painter.current.getContext('2d')
        ctx.drawImage(savedShape, 0, 0)
    }
    const onClick = (e) => {
        console.log('click')
        setTool(e.target.id)
    }
    const toolClick = (tool) => {
        const ctx = painter.current.getContext('2d')
        if(tool === 'reset'){
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            console.log(painter.current.width)
        }
        // else if(tool === 'undo'){
        //     ctx.clearRect(0, 0, painter.current.width, painter.current.height)
        //     // loadCanvas()
        // }
        // else if(tool === 'redo'){
        //     ctx.clearRect(0, 0, painter.current.width, painter.current.height)
        //
        // }
    }

    const onMouseDown = (e) => {
        const ctx = painter.current.getContext('2d')
        // if(initial){
        //     // setInitial(false)
        // }
        console.log('mouse down')
        setIsDrawing(true)
        setLastX(e.nativeEvent.offsetX)
        setLastY(e.nativeEvent.offsetY)
        setClickX(e.nativeEvent.offsetX)
        setClickY(e.nativeEvent.offsetY)
        ctx.beginPath()
    }
    const onMousemove = (e) => {
        console.log('mouse move')
        if (!isDrawing) return;
        const ctx = painter.current.getContext('2d')
        ctx.strokeStyle = color
        ctx.width = drawWidth
        ctx.font= `${size} ${font}`
        const x = e.nativeEvent.offsetX
        const y = e.nativeEvent.offsetY
        if (tool === 'brush') {
            ctx.lineTo(x, y)
        } else if (tool === 'eraser') {
            ctx.clearRect(x, y, eraserWidth, eraserWidth)

        } else if (tool === 'rectangle') {
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            ctx.beginPath()
            if(isFill) {ctx.fillRect(clickX, clickY, e.nativeEvent.offsetX - clickX, e.nativeEvent.offsetY - clickY)}
            else {ctx.strokeRect(clickX, clickY, e.nativeEvent.offsetX - clickX, e.nativeEvent.offsetY - clickY)}
            // ctx.strokeRect(clickX, clickY, x - clickX, y - clickY)
            ctx.stroke()
        } else if (tool === 'circle') {
            //draw a circle, but don't erase the previous one, dont't clearRect
            ctx.beginPath()
            ctx.arc(lastX, lastY, Math.abs(x - clickX), 0, Math.PI * 2)
            ctx.stroke()
        } else if (tool === 'triangle') {
            //draw a triangle
            ctx.beginPath()
            ctx.moveTo(lastX, lastY)
            ctx.lineTo(x, y)
            ctx.lineTo(lastX, y)
            ctx.lineTo(lastX, lastY)
            ctx.stroke()
        } else if (tool === 'line') {
            //draw a line
            ctx.beginPath()
            ctx.moveTo(clickX, clickY)
            ctx.lineTo(x, y)
            ctx.stroke()
        }
        setLastY(x)
        setLastX(y)
        ctx.stroke()
    }
    const onMouseUp = () => {
        console.log('mouse up')
        const ctx = painter.current.getContext('2d')
        setIsDrawing(false)

    }
    return (
        <div className="flex justify-between my-8">
            <div className="tool-board1">
                <h1>he</h1>
                {['undo','redo', 'text', 'download', 'upload'].map(
                    (tool) =>
                        (<ToolButton src={`/${tool}.png`} key={tool} id={tool} onClick={() => {
                            setTool(tool)
                            toolClick(tool)
                        }
                        }/>)
                )}
                {tool}
            </div>
            <div className="canvas">
                <canvas
                    ref={painter}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMousemove}
                    onMouseUp={onMouseUp}
                    style={{
                        position: 'relative',
                        backgroundColor: 'white',
                    }}
                    width={window.innerWidth * 0.4}
                    height={400}
                />
            </div>
            <div className="tool-board2 flex justify-center">
                <h1>hehe</h1>
                <div>
                    {['brush','eraser','fill', 'line', 'reset'].map(
                    (tool) =>
                        (<ToolButton src={`/${tool}.png`} key={tool} id={tool} onClick={() => {
                            setTool(tool)
                            toolClick(tool)
                        }
                        }/>)
                    )}
                </div>
                <div>
                    {['isFill','rectangle', 'circle', 'triangle', 'reset'].map(
                        (tool) =>
                            (<ToolButton src={`/${tool}.png`} key={tool} id={tool} onClick={() => {
                                setTool(tool)
                                toolClick(tool)
                            }
                            }/>)
                    )}
                </div>
                {tool}
            </div>
        </div>

    );
}

