import {useRef, useState} from "react";

export default function Board() {
    const painter = useRef()

    const [tool, setTool] = useState('rectangle')
    const [color, setColor] = useState('black')
    const [brushWidth, setBrushWidth] = useState(5)
    const [eraserWidth, setEraserWidth] = useState(20)
    const [isDrawing, setIsDrawing] = useState(false)
    const [clickX, setClickX] = useState(0)
    const [clickY, setClickY] = useState(0)
    const [lastX, setLastX] = useState(0)
    const [lastY, setLastY] = useState(0)
    const [direction, setDirection] = useState(true)

    const onMouseDown = (e) => {
        console.log('mouse down')
        setIsDrawing(true)
        setLastX(e.clientX)
        setLastY(e.clientY)
        setClickX(e.clientX)
        setClickY(e.clientY)
        const ctx = painter.current.getContext('2d')
        ctx.beginPath()
    }
    const onMousemove = (e) => {
        console.log('mouse move')
        if (!isDrawing) return;
        const ctx = painter.current.getContext('2d')
        ctx.strokeStyle = color
        ctx.width = brushWidth
        //ctx.lineTo(e.clientX-64, e.clientY-112);
        // console.log('lastX: ' + lastX + ' lastY: ' + lastY)
        console.log('clientX: ' + e.clientX + ' clientY: ' + e.clientY)
        if(tool === 'brush'){
            ctx.lineTo(e.clientX-64, e.clientY-112)
        }
        else if(tool === 'eraser'){
            //erase by the mouse,but don't just change the color
            ctx.clearRect(e.clientX-64, e.clientY-112, eraserWidth, eraserWidth)

        }
        else if(tool === 'rectangle'){
            //avoids dragging the image
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            ctx.beginPath()
            ctx.strokeRect(clickX, clickY, e.clientX-clickX, e.clientY-clickY)
            ctx.stroke()
            // ctx.strokeRect(e.clientX, e.clientY, lastX-e.clientX, lastY-e.clientY)
        }
        else if(tool === 'circle'){
            //draw a circle, but don't erase the previous one, dont't clearRect
            ctx.beginPath()
            ctx.arc(lastX, lastY, Math.abs(e.clientX-clickX), 0, Math.PI*2)
            ctx.stroke()
        }
        else if(tool === 'triangle'){
            //draw a triangle
            ctx.beginPath()
            ctx.moveTo(lastX, lastY)
            ctx.lineTo(e.clientX-64, e.clientY-112)
            ctx.lineTo(lastX, e.clientY-112)
            ctx.lineTo(lastX, lastY)
            ctx.stroke()
        }
        else if(tool === 'line'){
            //draw a line
            // ctx.beginPath()
            // ctx.moveTo(lastX, lastY)
            //ctx.lineTo(e.clientX-64, e.clientY-112)
            ctx.stroke()
        }
        else if(tool === 'reset'){
            ctx.clearRect(0, 0, painter.current.width, painter.current.height);
        }
        setLastY(e.clientY)
        setLastX(e.clientX)
        // ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
    }
    const onMouseUp = () => {
        console.log('mouse up')
        setIsDrawing(false)
    }
    return (
        <div className="item">
            <canvas
                ref={painter}
                onMouseDown={onMouseDown}
                onMouseMove={onMousemove}
                onMouseUp={onMouseUp}
                style={{
                    position:'relative',
                    // marginTop:'-1000px',
                    backgroundColor: 'white',}}
                width={window.innerWidth*0.4}
                height={window.innerHeight*0.6}
            />
        </div>
    );
}

