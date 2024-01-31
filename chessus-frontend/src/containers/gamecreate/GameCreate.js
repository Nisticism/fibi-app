import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import GameBoard from "../../components/gameboard/GameBoard"
import styles from "./gamecreate.module.scss";

const GameCreate = () => {

  const { user: currentUser } = useSelector((state) => state.auth);

  const [horizontal, setHorizontal] = useState(7);
  const [vertical, setVertical] = useState(7);
  const [topLeftLight, setTopLeftLight] = useState(true);
  const [squareLength, setSquareLength] = useState(80);
  const [gameDescription, setGameDescription] = useState("This is a 2 person strategy game that resembles chess, but on a differently sized board!");
  const [gameDescriptionValidation, setGameDescriptionValidation] = useState("");
  const [gameName, setGameName] = useState("Chessus");
  const [gameNameValidation, setGameNameValidation] = useState("");

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return (
    <div className={styles["outer-container"]}>
    <div className={styles["container"]}>
      <div className={styles["wrapper"]}>
        <div className={styles["game-board"]}>
          <GameBoard horizontal={ horizontal } vertical = { vertical } topLeftLight = { topLeftLight } squareLength = { squareLength } />
        </div>
      </div>
      <form className={styles["game-form"]}>
        <label>Game name: </label>
        <p className={styles["game-validation"]} defaultValue="">{gameNameValidation}</p>
        <input onChange={e => 
          {
            if(e.target.value.length < 3 || e.target.value.length > 50) {
              setGameName(e.target.value);
              setGameNameValidation("Game must have a name between 3 and 50 characters in length!");
            } else {
              setGameName(e.target.value);
              setGameNameValidation("");
            }
          }
        }
        value={gameName}/>
        <label>Description: </label>
        <p className={styles["game-validation"]} defaultValue="">{gameDescriptionValidation}</p>
        <textarea onChange={e => 
          {
            if(e.target.value.length < 50 || e.target.value.length >= 1000) {
              setGameDescription(e.target.value);
              setGameDescriptionValidation("Game description must be between 50 and 1000 characters!");
            } else {
              setGameDescription(e.target.value);
              setGameDescriptionValidation("");
            }
          }
        }
        
        className={styles["game-description"]} 
        value={gameDescription}/>

        <label>Game width (2 - 60): </label>
        <input onChange={e => 
          {
            const nums = /^[0-9\b]+$/;
            if(nums.test(e.target.value) && e.target.value > 0 && e.target.value <= 60) {
              setHorizontal(parseInt(e.target.value));
            } else {
              setHorizontal(8);
            }
          }
        } value={horizontal}/>
        <label>Game height (2 - 60): </label>
        <input onChange={e => 
          {
            const nums = /^[0-9\b]+$/;
            if(nums.test(e.target.value) && e.target.value > 0 && e.target.value <= 60) {
              setVertical(parseInt(e.target.value));
            } else {
              setVertical(8);
            }
          }
        } value={vertical}/>
        <label>Player count (2 - 8): </label>
        <input onChange={e => 
          {
            const nums = /^[0-9\b]+$/;
            if(nums.test(e.target.value) && e.target.value > 0 && e.target.value <= 8) {
              setVertical(parseInt(e.target.value));
            } else {
              setVertical(2);
            }
          }
        }/>
        <label>Actions (moves) each player takes per turn: </label>
        <input onChange={e => 
          {
            const nums = /^[0-9\b]+$/;
            if(nums.test(e.target.value) && e.target.value > 0 && e.target.value <= 8) {
              setVertical(parseInt(e.target.value));
            } else {
              setVertical(2);
            }
          }
        }/>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "200px"}}>
          <label>Randomized starting positions (like in Chess960): </label>
          <input type="checkbox" style={{height: "25px", width: "25px", margin: "0px"}} />
        </div>
      </form>
    </div>
    <div className={styles["game-create-tips"]}>
      <p style={{width: "fit-content", marginLeft: "100px"}}>* Click the board to add starting pieces for each player.</p>
      <p style={{width: "fit-content", marginLeft: "100px"}}>* Right click to add range squares (squares that increase the movement or attack range of any piece on it).</p>
    </div>
    </div>
  );
};

export default GameCreate;