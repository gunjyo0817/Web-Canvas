import {useEffect, useRef, useState} from "react";
import ToolButton from "./ToolButton";
import {SketchPicker} from "react-color";

export default function Board() {
    const painter = useRef()
    const userInput = useRef(null)
    const [isInitial, setIsInitial] = useState(true)
    const [tool, setTool] = useState('brush')
    const [fontColor, setFontColor] = useState('#000000')
    const [size, setSize] = useState("18px")
    const [font, setFont] = useState('sans-serif')
    const [drawWidth, setDrawWidth] = useState(3)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isFill, setIsFill] = useState(false)
    const [clickX, setClickX] = useState(0)
    const [clickY, setClickY] = useState(0)
    const [savedShape, setSavedShape] = useState(new Image());
    const [redoStack, setRedoStack] = useState([])

    const [undoStack, setUndoStack] = useState([])
    const [textContent, setTextContent] = useState('')
    const [isTexting, setIsTexting] = useState(false)
    const [isHidden , setIsHidden] = useState(true)
    const [isSelecting, setIsSelecting] = useState(true)
    const [selectedShape, setSelectedShape] = useState(new Image())

    const presetColors = [
        '#000000',
        '#ffffff',
        '#34d399',
        '#22d3ee',
        '#a78bfa',
        '#fb7185',
        '#fde047',
        ]

    useEffect(()=>{
        setIsInitial(false)
        console.log(undoStack)
        const ctx = painter.current.getContext('2d')
        let dataURL = localStorage.getItem(ctx);
        let saved_img = new Image;
        saved_img.src = dataURL;
        saved_img.onload = function () {
            ctx.drawImage(saved_img, 0, 0);
        };
    }, [isInitial])

    const upload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                const img = new Image()
                img.src = e.target.result
                img.width = painter.current.width
                img.height = painter.current.height
                img.onload = () => {
                    const ctx = painter.current.getContext('2d')
                    ctx.drawImage(img, 0, 0)
                }
            }
        }
        input.click()
    }
    const download = () => {
        const dataUrl = painter.current.toDataURL();
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = 'canvas.png'
        a.click()
    }
    const saveShape = () => {
        const dataUrl = painter.current.toDataURL();
        const img = new Image()
        img.src = dataUrl
        setSavedShape(img)
    }

    const loadShape = () => {
        const ctx = painter.current.getContext('2d')
        ctx.drawImage(savedShape, 0, 0)
    }

    const saveCanvas = () => {
        const dataUrl = painter.current.toDataURL();
        const img = new Image()
        img.src = dataUrl
        console.log('saveCanvas')
        console.log(undoStack.length)
        undoStack.push(img)
        // if(undoStack.length === 0) setUndoStack([img])
        // else setUndoStack([...undoStack, img])
        console.log(undoStack)
        console.log('saveCanvas done')
        // download()
    }

    const saveCanvasToRedo = () => {
        const dataUrl = painter.current.toDataURL();
        const img = new Image()
        img.src = dataUrl
        console.log('saveCanvas')
        console.log(redoStack.length)
        redoStack.push(img)
        // if(undoStack.length === 0) setUndoStack([img])
        // else setUndoStack([...undoStack, img])
        console.log(redoStack)
        console.log('saveCanvas done')

    }

    const toolClick = (tool) => {
        const ctx = painter.current.getContext('2d')
        if(tool === 'reset'){
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            setTool('brush')
            console.log(painter.current.width)

        }
        else if(tool === 'undo'){
            console.log('undo')
            console.log(undoStack)
            saveCanvasToRedo()
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            //undoStack.pop()
            // saveShape()
            const img = undoStack.pop()
            console.log(undoStack)
            console.log('undo done')
            setTool('brush')
            if(!img) return
            ctx.drawImage(img, 0, 0)
        }
        else if(tool === 'redo'){
            console.log('redo')
            saveCanvas()
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            const img = redoStack.pop()
            setTool('brush')
            if(!img) return
            ctx.drawImage(img, 0, 0)
        }
        else if(tool === 'download'){
            download()
            setTool('brush')
        }
        else if(tool === 'upload'){
            upload()
            setTool('brush')
        }
        else if(tool === 'isFill'){
            setIsFill(!isFill)
            setTool('brush')
        }
        else if(tool === 'select'){
            setIsSelecting(true)
        }
        else if(tool === 'save'){
            localStorage.setItem(ctx, painter.current.toDataURL())
            setTool('brush')

        }
    }

    const onMouseDown = (e) => {

        const ctx = painter.current.getContext('2d')
        console.log('mouse down')
        setIsDrawing(true)
        setClickX(e.nativeEvent.offsetX)
        setClickY(e.nativeEvent.offsetY)
        ctx.beginPath()
        if(tool === 'select' || tool === 'text' || tool === 'brush' || tool === 'eraser' || tool === 'line' || tool === 'curve' || tool === 'rectangle' || tool === 'circle' || tool === 'equal-triangle' || tool === 'triangle') {
            saveCanvas()
            saveShape()
        }
        if(tool === 'text'){
            if(isTexting){
                setIsTexting(false)
                setIsHidden(true)
                ctx.fillText(textContent, clickX, clickY)
                saveCanvas()
                setTextContent('')
            }
            else{
                setIsTexting(true)
                setIsHidden(false)
                setTimeout(() => {
                    userInput.current.focus()
                }, 50)
            }
        }
    }
    const onMousemove = (e) => {
        console.log('mouse move')
        if (!isDrawing) return;
        const ctx = painter.current.getContext('2d')
        ctx.strokeStyle = fontColor
        ctx.fillStyle = fontColor
        ctx.lineWidth = drawWidth
        ctx.font= `${size} ${font}`
        const x = e.nativeEvent.offsetX
        const y = e.nativeEvent.offsetY
        if (tool === 'brush') {
            ctx.lineTo(x, y)
        } else if (tool === 'eraser') {
            ctx.clearRect(x, y, drawWidth*4, drawWidth*4)
        } else if (tool === 'rectangle') {
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            loadShape()
            ctx.beginPath()
            if(isFill) {ctx.fillRect(clickX, clickY, x - clickX, x - clickY)}
            else {ctx.strokeRect(clickX, clickY, y - clickX, y - clickY)}
        } else if (tool === 'circle') {
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            loadShape()
            ctx.beginPath()
            ctx.arc(clickX, clickY, Math.abs(x - clickX), 0, Math.PI * 2)
            if(isFill) ctx.fill()
        } else if (tool === 'equal-triangle') {
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            loadShape()
            ctx.beginPath()
            ctx.moveTo(clickX, clickY)
            ctx.lineTo(x, y)
            ctx.lineTo(clickX - (x - clickX), y)
            ctx.lineTo(clickX, clickY)
            if(isFill) ctx.fill()
        } else if(tool === 'triangle'){
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            loadShape()
            ctx.beginPath()
            ctx.moveTo(clickX, clickY)
            ctx.lineTo(x, y)
            ctx.lineTo(clickX, y)
            ctx.lineTo(clickX, clickY)
            if(isFill) ctx.fill()
        }
        else if (tool === 'line') {
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            loadShape()
            ctx.beginPath()
            ctx.moveTo(clickX, clickY)
            ctx.lineTo(x, y)
        }
        else if(tool === 'curve'){
            ctx.clearRect(0, 0, painter.current.width, painter.current.height)
            loadShape()
            ctx.beginPath()
            ctx.moveTo(y, clickY)
            ctx.quadraticCurveTo(x,y,clickX,clickY)
        }
        else if(tool === 'select'){
            if(isSelecting){
                ctx.clearRect(0, 0, painter.current.width, painter.current.height)
                loadShape()
                ctx.beginPath()
                let tmp_color = fontColor
                ctx.strokeStyle = 'rgb(0, 0, 0,0)'
                ctx.strokeRect(clickX, clickY, y - clickX, y - clickY)
                ctx.strokeStyle = tmp_color
            }
            else{  //ismoving
                ctx.clearRect(0, 0, painter.current.width, painter.current.height)
                loadShape()
                ctx.putImageData(selectedShape, x, y)
            }
        }
        ctx.stroke()
    }
    const onMouseUp = (e) => {
        console.log('mouse up')
        const ctx = painter.current.getContext('2d')
        setIsDrawing(false)
        // if(tool === 'text' || tool === 'brush' || tool === 'eraser' || tool === 'line' || tool === 'curve' || tool === 'rectangle' || tool === 'circle' || tool === 'equal-triangle' || tool === 'triangle') {
        //     saveCanvas()
        //     saveShape()
        // }
        if(tool === 'select'){
            if(isSelecting){
                setIsSelecting(false)
                setSelectedShape(ctx.getImageData(clickX, clickY, e.nativeEvent.offsetX - clickX, e.nativeEvent.offsetY - clickY))
                ctx.clearRect(clickX, clickY, e.nativeEvent.offsetX - clickX, e.nativeEvent.offsetY - clickY);

            }
            else{
                setIsSelecting(true)
            }
        }
    }
    return (
        <div className="flex justify-between my-8">
            <div className="tool-board1 flex justify-between py-6">
                <div className="max-w-2xl ml-6 text-black">
                    <SketchPicker
                        z-index={5}
                        width={175}
                        color={fontColor}
                        presetColors={presetColors}
                        onChange={(color) => {
                            setFontColor(color.hex);
                        }}/>
                    <input type="range" min="1" max="20" className="py-8" color="text-red-500"
                           style={{width: '195px'}}
                           defaultValue={drawWidth}
                           onInput={(e) => { console.log(e.target.value); setDrawWidth(e.target.value) }}
                           onChange={(e) => { setDrawWidth(e.target.value) }}
                    />

                </div>
                <div className="flex flex-col mr-4">
                    {['undo','redo', 'reset', 'download','save'].map(
                        (tool) =>
                            (<ToolButton src={`/${tool}.png`} key={tool} id={tool} onClick={() => {
                                setTool(tool)
                                toolClick(tool)
                            }
                            }/>)
                    )}
                    <p className="text-white text-lg py-4 pr-4">粗細</p>
                </div>
            </div>

            <div className="canvas">
                <div className="relative">
                    <canvas
                        ref={painter}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMousemove}
                        onMouseUp={onMouseUp}
                        style={{
                            position: 'relative',
                            backgroundColor: 'white',
                            cursor:`url(${tool}.png), auto`,
                            // cursor:`url(select.png), auto`,
                        }}

                        width={window.innerWidth * 0.4}
                        height={400}
                    />
                    {/*<input name=${textBox} type="text" className="text-box"></input>*/}
                    <input onChange={e=>{
                        setTextContent(e.target.value)}
                    }  type="text" ref={userInput} value={textContent} className={`text-box border-2 border-black absolute ${isHidden && "hidden"}`} style={{color:fontColor, fontSize:size, fontFamily:font,position:"absolute", top:clickY, left:clickX }}></input>
                </div>

            </div>
            <div className="tool-board2 flex flex-col">
                <div className="flex justify-between">
                    <div className="py-6 px-4">
                        {['brush','eraser','select','isFill'].map(
                            (tool) =>
                                (<ToolButton src={`/${tool}.png`} key={tool} id={tool} onClick={() => {
                                    setTool(tool)
                                    toolClick(tool)
                                }
                                }/>)
                        )}
                    </div>
                    <div className="py-6">
                        {['rectangle', 'circle', 'equal-triangle','triangle'].map(
                            (tool) =>
                                (<ToolButton src={`/${tool}.png`} key={tool} id={tool} onClick={() => {
                                    setTool(tool)
                                    toolClick(tool)
                                }
                                }/>)
                        )}
                    </div>
                    <div className="py-6 px-4">
                        {['line', 'curve','upload', 'text'].map(
                            (tool) =>
                                (<ToolButton src={`/${tool}.png`} key={tool} id={tool} onClick={() => {
                                    setTool(tool)
                                    toolClick(tool)
                                }
                                }/>)
                        )}
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-between px-0">
                        {/*make font description and selector in same line*/}
                        <p className="text-white text-lg pl-6 py-1">字體</p>
                        <div className="pl-10">
                            <select className="text-black text-lg" onChange={(e) => {setFont(e.target.value)}}>
                                <option value="Arial">Arial</option>
                                <option value="Impact">Impact</option>
                                <option value="Times">Times</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Copperplate">Copperplate</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-between px-0 py-4">
                        <p className="text-white text-lg pl-2">字體大小</p>
                        <div className="pl-14">
                            <select className="text-black" onChange={(e) => {setSize(e.target.value)}} value={size}>
                                <option value="18px">18</option>
                                <option value="20px">20</option>
                                <option value="22px">22</option>
                                <option value="24px">24</option>
                                <option value="26px">26</option>
                                <option value="28px">28</option>
                                <option value="30px">30</option>
                                <option value="32px">32</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

