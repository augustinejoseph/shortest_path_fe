import { useEffect, useState } from "react";
import "./App.css";
import axios from 'axios';

function App() {
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [grid, setGrid] = useState([]);
  const [path, setPath] = useState([]);
  const [gridSize, setGridSize] = useState(20);

  const initialGrid = [];
  const createInitialGrid = () => {
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let j = 0; j < gridSize; j++) {
        row.push({ x: i, y: j });
      }
      initialGrid.push(row);
    }
    setGrid(initialGrid);
  };

  useEffect(() => createInitialGrid, []);

  const handleGridSelection = (x, y) => {
    if (!start) {
      setStart([x, y]);
    } else if (!end) {
      setEnd([x, y]);
    }
  };

  const getCellColor = (x,y) => {
    // debugger
    if(start && x == start[0] && y == start[1]) return 'green';
    if(end && x == end[0] && y == end[1]) return 'red';
    const isInpath  = path.some((point) => point[0] == x && point[1] == y)
    return isInpath ? "blue" : "white"

  }

  const handleReset = () => {
    setStart(null)
    setEnd(null)
    setPath([])
  }

  const handleCalculateShortestPath = async () => {
    if ((!start) && (!end)){
      alert('Please select one start and end point')
      return
    }
    const url = "http://localhost:8000/find-path/"
    const data = {
      start : start,
      end : end
    }
    const response = await axios.post(url,data)
    if (response){
      setPath(response.data.result)
    }
    console.log("path", path);
    
    
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button onClick={handleCalculateShortestPath}>Calculate Shortest Path</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(20, 30px)",
          }}
        >
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                onClick={() => handleGridSelection(i, j)}
                key={`${i} - ${j}`}
                style={{
                  width: "30px",
                  gap: "2px",
                  height: "20px",
                  backgroundColor: getCellColor(i, j),
                  border: "1px solid black",
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
