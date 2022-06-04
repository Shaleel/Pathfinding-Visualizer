const WIDTH = window.innerWidth / 30;
const HEIGHT = window.innerHeight / 35;
const SOURCE = {
    row: Math.floor(HEIGHT / 2),
    column: Math.floor(WIDTH / 2 / 2)
};

const DESTINATION = {
    row: Math.floor(HEIGHT / 2),
    column: Math.floor(WIDTH - WIDTH / 2 / 2)
};
const createNode = (row: number, column: number, isBlocked = false) => {
    return {
        row,
        column,
        isBlocked,
        isStart: row === SOURCE.row && column === SOURCE.column,
        isDestination: row === DESTINATION.row && column === DESTINATION.column,
        isVisited: false
    };
};

const generateGrid = () => {
    let tempgrid = [];

    for (let i = 0; i < HEIGHT; i++) {
        let gridRow = [];
        for (let j = 0; j < WIDTH; j++) {
            gridRow[j] = createNode(i, j);
        }

        tempgrid.push(gridRow);
    }
    return tempgrid;
};

export const initialState = {
    grid: generateGrid(),
    WIDTH: WIDTH,
    HEIGHT: HEIGHT,
    SOURCE: SOURCE,
    DESTINATION: DESTINATION
};

export const actionTypes = {
    SET_GRID: 'SET_GRID'
};
interface NodeMetaData {
    row: number;
    column: number;
    isBlocked: boolean;
    isStart: boolean;
    isDestination: boolean;
    isVisited: boolean;
}
const UserReducer = (
    state: any,
    action: { type: any; grid: Array<Array<NodeMetaData>> }
) => {
    switch (action.type) {
        case actionTypes.SET_GRID:
            return {
                ...state,
                grid: action.grid
            };

        default:
            return state;
    }
};

export default UserReducer;
