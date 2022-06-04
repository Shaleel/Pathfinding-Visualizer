import { useState } from 'react';
import { useStateValue } from '../Context/StateProvider';

export interface NodeMetaData {
    row: number;
    column: number;
    isBlocked: boolean;
    isStart: boolean;
    isDestination: boolean;
    isVisited: boolean;
}

export default function () {
    const [{ grid, WIDTH, HEIGHT, SOURCE, DESTINATION }, dispatch] =
        useStateValue();
    const createNode = (row: number, column: number, isBlocked = false) => {
        return {
            row,
            column,
            isBlocked,
            isStart: row === SOURCE.row && column === SOURCE.column,
            isDestination:
                row === DESTINATION.row && column === DESTINATION.column,
            isVisited: false
        };
    };

    const [mousePressed, setmousePressed] = useState<boolean>(false);

    function clearGrid() {
        let tempgrid = [];

        for (let i = 0; i < HEIGHT; i++) {
            let gridRow = [];
            for (let j = 0; j < WIDTH; j++) {
                gridRow[j] = createNode(i, j);
                document
                    .getElementById(`${i}-${j}`)
                    ?.classList.remove(
                        'visited-slow',
                        'visited-average',
                        'visited-fast'
                    );
                document.getElementById(`${i}-${j}`)?.classList.remove('path');
            }

            tempgrid.push(gridRow);
        }

        dispatch({
            type: 'SET_GRID',
            grid: tempgrid
        });
    }

    const blockPath = (row: number, column: number) => {
        if (grid[row][column].isStart || grid[row][column].isDestination)
            return;
        if (grid[row][column].isBlocked || grid[row][column].isVisited) return;
        let newGrid = [...grid];
        let node = newGrid[row][column];
        let newNode = {
            ...node,
            isBlocked: true
        };
        newGrid[row][column] = newNode;
        dispatch({
            type: 'SET_GRID',
            grid: newGrid
        });
    };

    const handleMouseDown = (row: number, column: number) => {
        setmousePressed(true);
        blockPath(row, column);
    };

    const handleMouseEnter = (row: number, column: number) => {
        if (!mousePressed) return;
        blockPath(row, column);
    };

    const handleMouseUp = () => {
        setmousePressed(false);
    };

    return {
        blockPath,
        handleMouseUp,
        handleMouseEnter,
        handleMouseDown,
        clearGrid
    };
}
