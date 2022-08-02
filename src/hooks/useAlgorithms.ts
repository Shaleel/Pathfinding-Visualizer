import { useStateValue } from '../Context/StateProvider';
import { NodeMetaData } from './useGrid';

interface AStarMeta extends NodeMetaData {
    g: number;
    h: number;
    f: number;
}
interface PredecessorMeta {
    row: number;
    column: number;
}
export default function () {
    const [{ grid, WIDTH, HEIGHT, SOURCE, DESTINATION }, dispatch] =
        useStateValue();
    //algorithms

    const getNeighbours = (row: any, column: any) => {
        let neighbors = [];
        if (row < HEIGHT - 1 && !grid[row + 1][column].isBlocked)
            neighbors.push(grid[row + 1][column]);
        if (column < WIDTH - 1 && !grid[row][column + 1].isBlocked)
            neighbors.push(grid[row][column + 1]);
        if (row !== 0 && !grid[row - 1][column].isBlocked)
            neighbors.push(grid[row - 1][column]);
        if (column !== 0 && !grid[row][column - 1].isBlocked)
            neighbors.push(grid[row][column - 1]);

        return neighbors;
    };

    const markVisited = (node: NodeMetaData | AStarMeta) => {
        node.isVisited = true;
    };

    const updateDistance = (
        distances: Array<Array<number>>,
        srcNode: NodeMetaData,
        currNode: NodeMetaData
    ) => {
        distances[currNode.row][currNode.column] =
            distances[srcNode.row][srcNode.column] + 1 >
            distances[currNode.row][currNode.column]
                ? distances[srcNode.row][srcNode.column] + 1
                : distances[srcNode.row][srcNode.column];
    };

    const updatePredecessor = (
        predecessors: Array<Array<PredecessorMeta | null>>,
        srcNode: NodeMetaData,
        currNode: NodeMetaData
    ) => {
        predecessors[currNode.row][currNode.column] = {
            row: srcNode.row,
            column: srcNode.column
        };
    };

    const Speed = (speed: 'slow' | 'average' | 'fast') => {
        switch (speed) {
            case 'slow':
                return 30;
            case 'average':
                return 20;
            case 'fast':
                return 5;
        }
    };

    const animate = (
        visitedInOrder: any,
        path: any,
        speed: 'slow' | 'average' | 'fast'
    ) => {
        visitedInOrder.forEach((node: NodeMetaData, idx: number) => {
            setTimeout(
                () =>
                    document
                        .getElementById(`${node?.row}-${node?.column}`)
                        ?.classList.add(`visited-${speed}`),
                idx * Speed(speed)
            );
            if (idx === visitedInOrder.length - 1) {
                setTimeout(
                    () => animatePath(path, speed),
                    visitedInOrder.length * Speed(speed)
                );
            }
        });
    };
    const animatePath = (path: any, speed: 'slow' | 'average' | 'fast') => {
        path.forEach((node: NodeMetaData, idx: number) => {
            setTimeout(
                () =>
                    document
                        .getElementById(`${node?.row}-${node?.column}`)
                        ?.classList.add('path'),
                idx * Speed(speed)
            );
        });
    };

    const getShortestPath = (predecessors: Array<Array<PredecessorMeta>>) => {
        let pathInOrder = [];
        let curr = predecessors[DESTINATION.row][DESTINATION.column];
        pathInOrder.push(grid[DESTINATION.row][DESTINATION.column]);
        pathInOrder.push(curr);
        while (curr !== null) {
            let row = curr?.row;
            let column = curr?.column;
            pathInOrder.push({ row: row, column: column });
            curr = predecessors[row][column];
        }

        return pathInOrder;
    };

    const Djikstra = (speed: 'slow' | 'average' | 'fast') => {
        const DjikstraUtil = () => {
            let gridCopy = [...grid];
            let visitedInOrder = [];
            // let distances = [...Array(grid.length)].map((cell) =>
            //     Array(grid[0].length).fill(Number.MAX_SAFE_INTEGER)
            // );
            let predecessors = <Array<Array<NodeMetaData>>>(
                [...Array(grid.length)].map((cell) =>
                    Array(grid[0].length).fill(null)
                )
            );
            let queue = [];
            queue.push(gridCopy[SOURCE.row][SOURCE.column]);
            // distances[SOURCE.row][SOURCE.column] = 0;
            while (!!queue.length) {
                let top = queue.shift(); //return top
                if (!top?.isVisited && !top?.isBlocked) {
                    markVisited(top);
                    visitedInOrder.push(top);

                    if (top?.isDestination) {
                        break;
                    }
                }

                let neighbors = getNeighbours(top?.row, top?.column);
                neighbors.forEach((neighbor) => {
                    if (!neighbor?.isVisited && !neighbor?.isBlocked) {
                        // updateDistance(distances, top, neighbor);
                        updatePredecessor(predecessors, top, neighbor);
                        queue.push(neighbor);
                    }
                });
            }

            return {
                visitedInOrder,
                gridCopy,
                // distances,
                predecessors
            };
        };

        const { visitedInOrder, gridCopy, predecessors } = DjikstraUtil();
        const path = getShortestPath(predecessors);

        animate(visitedInOrder, path, speed);

        dispatch({
            type: 'SET_GRID',
            grid: gridCopy
        });
    };

    const BFS = (speed: 'slow' | 'average' | 'fast') => {
        const BFSUtil = () => {
            let gridCopy = [...grid];
            let visitedInOrder = [];
            // let distances = [...Array(grid.length)].map((cell) =>
            //     Array(grid[0].length).fill(Number.MAX_SAFE_INTEGER)
            // );
            let predecessors = <Array<Array<PredecessorMeta>>>(
                [...Array(grid.length)].map((cell) =>
                    Array(grid[0].length).fill(null)
                )
            );
            let queue = [];
            queue.push(gridCopy[SOURCE.row][SOURCE.column]);
            // distances[SOURCE.row][SOURCE.column] = 0;
            while (!!queue.length) {
                let top = queue.shift(); //return top
                if (!top?.isVisited && !top?.isBlocked) {
                    markVisited(top);
                    visitedInOrder.push({
                        row: top.row,
                        column: top.column
                    });

                    if (top?.isDestination) {
                        break;
                    }
                }

                let neighbors = getNeighbours(top?.row, top?.column);
                neighbors.forEach((neighbor) => {
                    if (!neighbor?.isVisited && !neighbor?.isBlocked) {
                        // updateDistance(distances, top, neighbor);
                        updatePredecessor(predecessors, top, neighbor);
                        queue.push(neighbor);
                    }
                });
            }
            return {
                visitedInOrder,
                gridCopy,
                // distances,
                predecessors
            };
        };

        const { visitedInOrder, gridCopy, predecessors } = BFSUtil();
        const path = getShortestPath(predecessors);

        animate(visitedInOrder, path, speed);

        dispatch({
            type: 'SET_GRID',
            grid: gridCopy
        });
    };

    const DFS = (speed: 'slow' | 'average' | 'fast') => {
        const DFSUtil = () => {
            let gridCopy = [...grid];
            let visitedInOrder = [];
            let distances = [...Array(grid.length)].map((cell) =>
                Array(grid[0].length).fill(Number.MAX_SAFE_INTEGER)
            );
            let predecessors = <Array<Array<NodeMetaData>>>(
                [...Array(grid.length)].map((cell) =>
                    Array(grid[0].length).fill(null)
                )
            );
            let stack = [];
            stack.push(gridCopy[SOURCE.row][SOURCE.column]);
            distances[SOURCE.row][SOURCE.column] = 0;
            while (!!stack.length) {
                let top = stack.pop();
                if (!top?.isVisited && !top?.isBlocked) {
                    markVisited(top);
                    visitedInOrder.push({
                        row: top.row,
                        column: top.column
                    });

                    if (top?.isDestination) {
                        break;
                    }
                }

                let neighbors = getNeighbours(top?.row, top?.column);
                neighbors.forEach((neighbor) => {
                    if (!neighbor?.isVisited && !neighbor?.isBlocked) {
                        // updateDistance(distances, top, neighbor);
                        updatePredecessor(predecessors, top, neighbor);
                        stack.push(neighbor);
                    }
                });
            }

            return {
                visitedInOrder,
                gridCopy,
                distances,
                predecessors
            };
        };

        const { visitedInOrder, gridCopy, predecessors } = DFSUtil();

        const path = getShortestPath(predecessors);
        animate(visitedInOrder, path, speed);

        dispatch({
            type: 'SET_GRID',
            grid: gridCopy
        });
    };

    const createAStarNode = (
        row: number,
        column: number,
        isBlocked = false
    ) => {
        return {
            row,
            column,
            isBlocked,
            isStart: row === SOURCE.row && column === SOURCE.column,
            isDestination:
                row === DESTINATION.row && column === DESTINATION.column,
            isVisited: false,
            g: !isBlocked
                ? Math.abs(SOURCE.row - row) + Math.abs(SOURCE.column - column)
                : -1,
            h: !isBlocked
                ? Math.abs(DESTINATION.row - row) +
                  Math.abs(DESTINATION.column - column)
                : -1,
            f: !isBlocked
                ? Math.abs(SOURCE.row - row) +
                  Math.abs(SOURCE.column - column) +
                  Math.abs(DESTINATION.row - row) +
                  Math.abs(DESTINATION.column - column)
                : -1
        };
    };

    const getLowestFNode = (openList: Array<AStarMeta>) => {
        let lowestFNode = openList[0];
        openList.forEach((node, index) => {
            if (node.f && lowestFNode.f && node.f < lowestFNode.f) {
                lowestFNode = node;
            }
        });

        return lowestFNode;
    };

    const A_Star = (speed: 'slow' | 'average' | 'fast') => {
        let gridCopy = [...grid];
        let gridUtil = <Array<Array<AStarMeta>>>[];
        let visitedInOrder = [];
        let openList: Array<AStarMeta> = [];
        let closedList: Array<AStarMeta> = [];

        for (let i = 0; i < HEIGHT; i++) {
            let gridRow: Array<AStarMeta> = [];
            for (let j = 0; j < WIDTH; j++) {
                gridRow[j] = createAStarNode(i, j, grid[i][j].isBlocked);
            }

            gridUtil.push(gridRow);
        }

        const getNode = (src: AStarMeta, row: any, column: any) => {
            // gridUtil[row][column] is the successor

            let g =
                src.g + Math.abs(column - src.column) + Math.abs(row - src.row);
            let h =
                Math.abs(DESTINATION.column - column) +
                Math.abs(DESTINATION.row - row);

            gridUtil[row][column].g = g;
            gridUtil[row][column].h = h;
            gridUtil[row][column].f = g + h;

            return gridUtil[row][column];
        };

        const getA_StarNeighbors = (row: any, column: any) => {
            let neighbors = [];
            if (row < HEIGHT - 1 && !gridUtil[row + 1][column].isBlocked)
                neighbors.push(getNode(gridUtil[row][column], row + 1, column));

            if (column < WIDTH - 1 && !gridUtil[row][column + 1].isBlocked)
                neighbors.push(getNode(gridUtil[row][column], row, column + 1));

            if (row !== 0 && !gridUtil[row - 1][column].isBlocked)
                neighbors.push(getNode(gridUtil[row][column], row - 1, column));

            if (column !== 0 && !gridUtil[row][column - 1].isBlocked)
                neighbors.push(getNode(gridUtil[row][column], row, column - 1));

            return neighbors;
        };
        // put the starting node on the open
        // list (you can leave its f at zero)
        openList.push(gridUtil[SOURCE.row][SOURCE.column]);

        while (!!openList.length) {
            let currentNode = getLowestFNode(openList);

            openList.forEach((node) => {
                if (
                    node.f < currentNode.f ||
                    (node.f === currentNode.f && node.h < currentNode.h)
                )
                    currentNode = node;
            });

            closedList.push(currentNode);

            //removing current node from open list
            openList = openList.filter(
                (node) =>
                    node.row !== currentNode.row &&
                    node.column !== currentNode.column
            );

            const neighbors = getA_StarNeighbors(
                currentNode.row,
                currentNode.column
            );
        }

        // while (!!openList.length) {
        //     let current = getLowestFNode(openList);
        //     closedList.push(current);

        //     if (current.isDestination) break;

        //     const neighbors = getA_StarNeighbors(current.row, current.column)

        //     neighbors.forEach(neighbor=>{

        //     })
        // }
    };
    return {
        BFS,
        DFS,
        Djikstra,
        A_Star
    };
}
