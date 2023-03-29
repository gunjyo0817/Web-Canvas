
import './App.css';
import Board from "./Board";
function App() {
  return (
    <div className="App">
      <div className="App-header">
        <div>
                <div className="flex justify-center ml-16">
                    <img src='/logo.png' className="App-logo border-2 rounded-full mr-4 mt-3" alt="logo" />
                    <h1 className="py-8 text-4xl font-bold px-2">Web Canvas</h1>
                    <img src='/canvas.png' className="canvas-logo ml-4 mt-3" alt="logo" />
                </div>
            <hr className="text-white mt-2"/>
            <Board/>
        </div>
      </div>
    </div>
  );
}

export default App;
