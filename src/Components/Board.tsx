import styled from 'styled-components';
import useGrid from '../hooks/useGrid';
import './Node.css';
import { useStateValue } from '../Context/StateProvider';
interface NodeMetaData {
    row: number;
    column: number;
    isBlocked: boolean;
    isStart: boolean;
    isDestination: boolean;
    className: string;
    isVisited: boolean;
}

const Node = styled.div<NodeMetaData>`
    width: ${window.innerWidth / 30}px;
    height: ${window.innerHeight / 30}px;
    border: 1px solid #6c5cff50;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffff;
    flex: 1;
    &:hover {
        background-color: lightgray;
    }
`;

function Board() {
    const { handleMouseDown, handleMouseUp, handleMouseEnter } = useGrid();
    const [{ grid }, dispatch] = useStateValue();

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {grid.map((row: Array<NodeMetaData>, idx: number) => (
                <div style={{ display: 'flex', flex: 1 }} key={idx}>
                    {row.map(
                        (
                            {
                                row,
                                column,
                                isBlocked,
                                isStart,
                                isDestination,
                                isVisited
                            },
                            index
                        ) => (
                            <Node
                                id={`${row}-${column}`}
                                isVisited={isVisited}
                                className={`${isBlocked && 'blocked'}`}
                                row={row}
                                column={column}
                                isBlocked={isBlocked}
                                isStart={isStart}
                                isDestination={isDestination}
                                key={index}
                                onMouseDown={() => handleMouseDown(row, column)}
                                onMouseUp={() => handleMouseUp()}
                                onMouseEnter={() =>
                                    handleMouseEnter(row, column)
                                }
                            >
                                {/* <i style={{color:`${isVisited?'red':'blue'}`}} className="fa-solid fa-circle"></i> */}
                                {isStart && <i className="fa-solid fa-sun"></i>}
                                {isDestination && (
                                    <i className="fa-solid fa-flag-checkered"></i>
                                )}
                                {/* {row} {column} */}
                            </Node>
                        )
                    )}
                </div>
            ))}
        </div>
    );
}

export default Board;
