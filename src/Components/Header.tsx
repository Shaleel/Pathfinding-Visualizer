import { useState } from 'react';
import styled from 'styled-components';
import useGrid from '../hooks/useGrid';
import useMaze from '../hooks/useMaze';
import useAlgorithms from '../hooks/useAlgorithms';
const HeaderWrapper = styled.div`
    padding: 1.5rem;
    background-color: #6c5cff;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const Title = styled.div`
    font-weight: bold;
`;

const StartBTN = styled.button`
    padding: 0.8rem;
    color: #3c2eb3;
    font-weight: bold;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    background-color: #9afa8e;
    &:hover {
        box-shadow: rgba(0, 0, 0, 0.15) 4px 4px 2px;
    }
`;
const ItemsWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;
interface SelectProps {
    show: boolean;
}
const Select = styled.div<SelectProps>`
    max-width: 15rem;
    margin-right: 1rem;
    border: 2px solid white;
    background-color: #6c5cff;
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    position: relative;
    &:hover {
        border-color: #ffac75;
        color: #ffac75;
    }

    & > div {
        ${({ show }) =>
            show &&
            `
            top:2.5rem;
            z-index:1;
        `}
    }

    & > i {
        transition: transform 0.2s ease-in-out;
        float: right;
        margin-left: 5px;
        ${({ show }) =>
            show &&
            `
            transform:rotate(180deg);
        `}
    }
`;

const Option = styled.div`
    width: 100%;
    background-color: white;
    position: absolute;
    color: #3c2eb3;
    left: 0;
    top: -200%;
    border: 2px solid white;
    border-radius: 0.3rem;
    transition: all 0.2s ease-in-out;
    z-index: -10;
    box-shadow: 0 9px 8px -3px rgb(64 60 67 / 24%),
        8px 0 8px -7px rgb(64 60 67 / 24%), -8px 0 8px -7px rgb(64 60 67 / 24%);
    & > div {
        padding: 0.5rem;
        border-bottom: 1px solid #3c2eb3;
    }

    & > div:last-child {
        border-bottom: none;
    }

    & > div:hover {
        background-color: #ffac7520;
    }
`;
const Label = styled.label`
    font-weight: bold;
`;
const ClearBTN = styled(StartBTN)`
    margin-right: 1rem;
    background-color: #ffac75;

    &:hover {
        & > i {
            transition: transform 0.2s ease;
            transform: rotate(-20deg);
        }
    }
`;
const RandomMazeBTN = styled(ClearBTN)``;

const ALGORITHMS = [
    'Breadth First Search',
    'Depth First Search',
    'Djikstra'
    // 'A* Search'
];
const SPEEDS: Array<'slow' | 'average' | 'fast'> = ['slow', 'average', 'fast'];
function Header() {
    const [algorithm, setalgorithm] = useState<string | null>(null);
    const [speed, setspeed] = useState<'slow' | 'average' | 'fast'>('average');
    const [algorithmSelect, setalgorithmSelect] = useState<boolean>(false);
    const [speedSelect, setspeedSelect] = useState<boolean>(false);
    const { clearGrid } = useGrid();
    const { generateMaze } = useMaze();
    const { BFS, DFS, Djikstra, A_Star } = useAlgorithms();
    const handleStart = () => {
        if (!algorithm) {
            alert('Select an algorithm first');
            return;
        }
        switch (algorithm) {
            case 'Breadth First Search':
                BFS(speed);
                break;
            case 'Depth First Search':
                DFS(speed);
                break;
            case 'Djikstra':
                Djikstra(speed);
                break;
            case 'A* Search':
                A_Star(speed);
                break;
            default:
                break;
        }
    };
    return (
        <HeaderWrapper>
            <Title>Pathfinding Algorithm Visualizer</Title>

            <ItemsWrapper>
                <Label>Algorithm :&nbsp;&nbsp;</Label>
                <Select
                    show={algorithmSelect}
                    onClick={() => setalgorithmSelect(!algorithmSelect)}
                >
                    {algorithm ? algorithm : 'Pick an Algorithm !'}{' '}
                    <i className="fa-solid fa-caret-down"></i>
                    <Option>
                        {ALGORITHMS.map((algorithm, index) => (
                            <div
                                key={index}
                                onClick={() => setalgorithm(algorithm)}
                            >
                                {algorithm}
                            </div>
                        ))}
                    </Option>
                </Select>

                <RandomMazeBTN onClick={generateMaze}>
                    Put Random Maze &nbsp;{' '}
                    <i className="fas fa-light fa-draw-polygon"></i>
                </RandomMazeBTN>
                <ClearBTN onClick={() => clearGrid()}>
                    Clear Board &nbsp; <i className="fa-solid fa-broom"></i>
                </ClearBTN>
                <Label>Speed :&nbsp;&nbsp;</Label>
                <Select
                    show={speedSelect}
                    onClick={() => setspeedSelect(!speedSelect)}
                >
                    {speed ? speed : 'average'}{' '}
                    <i className="fa-solid fa-caret-down"></i>
                    <Option>
                        {SPEEDS.map((speed, index) => (
                            <div key={index} onClick={() => setspeed(speed)}>
                                {speed}
                            </div>
                        ))}
                    </Option>
                </Select>
                <StartBTN onClick={handleStart}>
                    Start &nbsp; <i className="fa-solid fa-play"></i>
                </StartBTN>
            </ItemsWrapper>
        </HeaderWrapper>
    );
}

export default Header;
