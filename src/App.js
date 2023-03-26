import logo from './logo.svg';
import './App.css';
import Board from "./Board";
import ToolBoard1 from "./ToolBoard1";
import ToolBoard2 from "./ToolBoard2";
function App() {
  return (
    <div className="App">
      <div className="App-header">
        <ToolBoard1/>
        <div>
            <h1 style={{
                // position: 'absolute',
                // left: '10%',
                top: '0%',

            }}>Web Canvas</h1>
            <Board/>
        </div>

        <ToolBoard2/>


      </div>
    </div>
  );
}

export default App;
