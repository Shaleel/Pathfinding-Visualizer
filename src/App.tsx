import { useState } from 'react';
import './App.css';
import Board from './Components/Board';
import Header from './Components/Header';
import { UserStateProvider } from './Context/StateProvider';
import Reducer, { initialState } from './Context/reducer';
import styled from 'styled-components';
import GithubLogo from './img/github-logo.png';

const RepoLink = styled.a`
    position: absolute;
    background-color: white;
    bottom: 0;
    left: 0;
    transform: rotate(0deg);
    display: flex;
    justify-content: center;
    padding: 0.5rem;
    align-items: center;
    img {
        height: 30px;
    }
`;

function App() {
    return (
        <UserStateProvider initialState={initialState} reducer={Reducer}>
            <>
                <RepoLink
                    target="blank"
                    href="https://github.com/Shaleel/Pathfinding-Visualizer"
                >
                    <img src={GithubLogo}></img>
                </RepoLink>
                <Header />
                <Board />
            </>
        </UserStateProvider>
    );
}

export default App;
