import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/PathAlgorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 8;
const START_NODE_COL = 6;
const FINISH_NODE_ROW = 8;
const FINISH_NODE_COL = 43;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }
  //-----Hoạt cảnh của giải thuật Dijkstra------------------------

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }
  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  // visualizeDijkstra() {
  //   const { grid, startNode, finishNode } = this.state;
  //   const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
  //   const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  //   this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  // }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <div className="navbar">
          <div style={{ backgroundColor: 'lightblue', padding: '10px' }}>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <button onClick={() => this.visualizeDijkstra()} className="large-button">
                Visualize Dijkstra's Algorithm
              </button>
              <button onClick={() => window.location.reload()} className="reset-button">
                Reset wall
              </button>
            </div>
          </div>
        </div>


        <div className='instruction'>
          <p>
            - Hướng dẫn sử dụng: Điểm màu xanh(Green) là điểm bắt đầu, điểm màu cam(Orange) là điểm kết thúc,
            người sử dụng sẽ vẽ trên bảng ở dưới để tạo một mê cung.
          </p>
          <p>
            - Bấm nút "Visualize Dijkstra's Algorithm" để thực hiện việc tìm kiếm đường đi ngắn nhất
            giữa điểm đầu và điểm cuối
          </p>
          <p>
            - Bấm nút "Reset wall" để thiết lập lại bảng, vẽ mê cung mới.
          </p>
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 18; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

// const createNode = (col, row) => {
//   return {
//     col,
//     row,
//     isStart: row === this.state.startNode.row && col === this.state.startNode.col,
//     isFinish: row === this.state.finishNode.row && col === this.state.finishNode.col,
//     distance: Infinity,
//     isVisited: false,
//     isWall: false,
//     previousNode: null,
//   };
// };

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};