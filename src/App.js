
import './App.css';
import Board from "./Board";
function App() {
  return (
    <div className="App">
      <div className="App-header">
        <div>
            <div className="flex justify-between text-center">
                <div></div>
                <div className="flex flex-col justify-center text-center">
                    <p className="text-3xl text-center">Settings</p>
                </div>
                <div className="ml-20 flex justify-center">
                    <img src='/logo.png' className="App-logo border-2 rounded-full mr-1 mt-3" alt="logo" />
                    <h1 className="py-8 text-4xl font-bold px-2">Web Canvas</h1>
                    <img src='/canvas.png' className="canvas-logo ml-1 mt-3" alt="logo" />
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-3xl">Tools Box</p>
                </div>
                <div></div>
            </div>
            <hr className="text-white"/>
            <Board/>
        </div>
      </div>
    </div>
  );
}

export default App;
