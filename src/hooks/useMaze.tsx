import { useStateValue } from '../Context/StateProvider';
import { NodeMetaData } from './useGrid';

export default function () {
    const [{ grid, WIDTH, HEIGHT, SOURCE, DESTINATION }, dispatch] =
        useStateValue();

    const chooseOrientation = (start: any, end: any) => {
        const width = end.y - start.y;
        const height = end.x - start.x;
        if (width < height) return 'horizontal';
        else if (height < width) return 'vertical';
        else
            return Math.floor(Math.random() * 2) === 0
                ? 'horizontal'
                : 'vertical';
    };

    const divide = (
        grid: Array<Array<NodeMetaData>>,
        start: { x: number; y: number },
        end: { x: number; y: number },
        orientation: 'horizontal' | 'vertical'
    ) => {
        if (end.x - start.x <= 2 || end.y - start.y <= 2) {
            return;
        }

        if (orientation === 'horizontal') {
            let blockedRow = start.x + Math.floor((end.x - start.x) / 2);

            if (blockedRow === SOURCE.row || blockedRow === DESTINATION.row) {
                blockedRow -= 1;
            }

            let randomPos = Math.floor(Math.random() * (end.y - 1 - start.y));
            while (randomPos === 0)
                randomPos = Math.floor(Math.random() * (end.y - 1 - start.y));
            for (let i = start.y; i < end.y; i++) {
                grid[blockedRow][i].isBlocked = randomPos !== i && true;
                // grid[blockedRow][i].isBlocked = true;
            }
            dispatch({
                type: 'SET_GRID',
                grid: grid
            });
            const topStart = {
                x: start.x,
                y: start.y
            };
            const topEnd = {
                x: blockedRow - 1,
                y: end.y
            };
            const bottomStart = {
                x: blockedRow + 1,
                y: start.y
            };

            const bottomEnd = {
                x: end.x,
                y: end.y
            };

            divide(grid, topStart, topEnd, chooseOrientation(topStart, topEnd));
            divide(
                grid,
                bottomStart,
                bottomEnd,
                chooseOrientation(bottomStart, bottomEnd)
            );
        } else {
            let blockedColumn = start.y + Math.floor((end.y - start.y) / 2);

            if (
                blockedColumn === SOURCE.column ||
                blockedColumn === DESTINATION.column
            ) {
                blockedColumn -= 1;
            }

            let randomPos = Math.floor(Math.random() * (end.x - 1 - start.x));

            while (randomPos === 0)
                randomPos = Math.floor(Math.random() * (end.x - 1 - start.x));

            for (let i = start.x; i < end.x; i++) {
                grid[i][blockedColumn].isBlocked = randomPos !== i && true;
                // grid[i][blockedColumn].isBlocked = true;
            }
            dispatch({
                type: 'SET_GRID',
                grid: grid
            });
            const leftStart = {
                x: start.x,
                y: start.y
            };

            const leftEnd = {
                x: end.x,
                y: blockedColumn - 1
            };

            const rightStart = {
                x: start.x,
                y: blockedColumn + 1
            };

            const rightEnd = {
                x: end.x,
                y: end.y
            };

            divide(
                grid,
                leftStart,
                leftEnd,
                chooseOrientation(leftStart, leftEnd)
            );
            divide(
                grid,
                rightStart,
                rightEnd,
                chooseOrientation(rightStart, rightEnd)
            );
        }
    };

    const generateMaze = () => {
        let gridCopy = [...grid];

        //bordering grid
        for (let i = 0; i < gridCopy.length; i++) {
            for (let j = 0; j < gridCopy[i].length; j++) {
                if (
                    i === 0 ||
                    j === 0 ||
                    i === gridCopy.length - 1 ||
                    j === gridCopy[i].length - 1
                )
                    gridCopy[i][j].isBlocked = true;
            }
        }

        dispatch({
            type: 'SET_GRID',
            grid: gridCopy
        });
        const start = {
            x: 1,
            y: 1
        };
        const end = {
            x: HEIGHT - 2,
            y: WIDTH - 2
        };

        divide(gridCopy, start, end, chooseOrientation(start, end));
    };

    return {
        generateMaze
    };
}
