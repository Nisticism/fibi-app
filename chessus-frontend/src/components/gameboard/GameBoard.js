import React from "react";
import { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import styles from "./gameboard.module.scss";

const GameBoard = (props) => {

  function getWindowDimensions() {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    return {
      windowWidth,
      windowHeight
    };
  }
  
  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowDimensions;
  }

  // function isScrollBarPresent() {
  //   useEffect(() => {
  //     if (document.body.clientHeight > windowHeight) {

  //     }
  //   })
  // }

  const { windowHeight, windowWidth } = useWindowDimensions();

  const { user: currentUser } = useSelector((state) => state.auth);
  if (!currentUser) {
    alert("Must be logged in");
    return <Navigate to="/login" />;
  }

  let board = [];

  const darkSquare = {
    background: "rgb(8, 35, 77)"
  }

  const lightSquare = {
    background: "rgb(202, 213, 232)"
  }

  function createGrid() {
    for (let i = 0; i < props.vertical; i ++) {
      for (let j = 0; j < props.horizontal; j ++) {
        if ((i + j)%2 === 0) {
          board.push(
            <div key={"r" + i + "c" + j} style={lightSquare} />
          )
        } else {
          board.push(
            <div key={"r" + i + "c" + j} style={darkSquare} />
          )
        }
      }
    }
  }

  const getWidth = (squares, windowWidth) => {
    if (squares * windowWidth > 600) {
      return 600;
    } else {
      return squares * windowWidth;
    }
  }

  const getBoardSize = () => {
    let length = windowWidth * 0.6;
    if (windowWidth <= 912) {
      length = windowWidth * 0.85;
    }
    if (length < 350) {
      return 350;
    } else {
      return length;
    }
  }
  
  const getSquareLength = (horizontal, vertical, length) => {
    if (horizontal > vertical) {
      return (length/horizontal)
    } else {
      return (length/vertical)
    }
  }

  // Max squares is 60 for both dimensions:

  const getHorizontal = (horizontal) => {
    if (horizontal > 60) {
      return 60;
    } else {
      return horizontal;
    }
  }

  const getVertical = (vertical) => {
    if (vertical > 60) {
      return 60;
    } else {
      return vertical;
    }
  }

  const boardStyle = {
    display: "grid",
    gridTemplateRows: `repeat(${getHorizontal(props.vertical)}, ${getSquareLength(props.horizontal, props.vertical, getBoardSize())}px)`,
    gridTemplateColumns: `repeat(${getVertical(props.horizontal)}, ${getSquareLength(props.horizontal, props.vertical, getBoardSize())}px)`,
    width: "max-content",
    height: "max-content"
  }

  createGrid();

  return (
      <div style={ boardStyle } >
        { board }
      </div>
  );
};

export default GameBoard;