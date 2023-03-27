import logo from './logo.svg';
import './App.css';
import Board from "./Board";
function App() {
  return (
    <div className="App">
      <div className="App-header">
        <div>
            <h1 className="py-8 text-4xl font-bold">Web Canvas</h1>
            <hr className="text-white"/>
            <Board/>
        </div>


      </div>
    </div>
  );
}

export default App;
