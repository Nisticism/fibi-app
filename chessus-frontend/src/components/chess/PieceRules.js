import squaresize from '../../assets/variables/global-vars.js'

const PawnRules = (team, upCoordX, upCoordY, downCoordX, downCoordY, capture, lastMove, index) => {
    let validMove = false;
    //let promotionSquare = null;
    //  No capture, regular move 1 or 2 squares

    if (downCoordX === upCoordX && capture === false) {
        if (team === 1) {
            if (downCoordY - upCoordY === squaresize) {
                validMove = true;
            } else if (downCoordY - upCoordY === squaresize * 2 &&
            downCoordY === squaresize * 6) {
                validMove = true;
            } else {
                validMove = false;
            }
        } 
        else if (team === 2) {
            if (downCoordY - upCoordY === -squaresize) {
                validMove = true;
            } else if (downCoordY - upCoordY === -squaresize * 2 &&
            downCoordY === squaresize) {
                validMove = true;
        } else {
            validMove = false;
        }

    }
}
    
    //  validMove false occasions
    
    else if (downCoordX === upCoordX && capture === true) {
        validMove = false;
    }   
    else if (downCoordX !== upCoordX && capture === false) {
        validMove = false;
    } 

    // Capture logic
    else if (capture === true) {
        if (team === 1) {

            if ((downCoordX === upCoordX + squaresize || downCoordX === upCoordX - squaresize) &&
                downCoordY === upCoordY + squaresize) {
                    validMove = true;
                    console.log("valid pawn capture")
                    console.log(team)
                }
            else {
                validMove = false;
            }
        } 
        else if (team === 2) {
            if ((downCoordX === upCoordX + squaresize || downCoordX === upCoordX - squaresize) &&
            downCoordY === upCoordY - squaresize) {
                validMove = true;
                console.log("valid pawn capture")
            }
            else {
                validMove = false;
            }
        }
    }

    // console.log(upCoordX, upCoordY, downCoordX, downCoordY);

    //  Add enpassant and autopromotion
    let enPassant = false;

    if (lastMove && capture === false) {
        //  If the the last move was a pawn move two squares from the second rank and it previously was unmoved
        if (lastMove.piece.type === "Pawn" && (
        (lastMove.yDown === squaresize && lastMove.piece.team === 2) || 
        (lastMove.yDown === 6 * squaresize && lastMove.piece.team === 1))) {
            //  If last move was team 1, and team 2 move a pawn diagonally in front of it, it's a valid move.
            if (lastMove.piece.team === 1 && upCoordX === lastMove.piece.xLocation && (upCoordY - squaresize) === downCoordY && 
            lastMove.piece.yLocation === squaresize * 4 && upCoordY > lastMove.piece.yLocation) {
                validMove = true;
                enPassant = true;
                console.log("en pessant");
            } 
            //  Else, if the other team
            else if (lastMove.piece.team === 2 && upCoordX === lastMove.piece.xLocation && (upCoordY + squaresize) === downCoordY && 
            lastMove.piece.yLocation === squaresize * 3 && upCoordY < lastMove.piece.yLocation) {
                validMove = true;
                enPassant = true;
                console.log("en pessant");
            }
        }
    }
    return {validMove: validMove, enPassant: enPassant, index: index};
}

const KnightRules = (upCoordX, upCoordY, downCoordX, downCoordY) => {
    let validMove = false;
    if (((upCoordX === downCoordX - squaresize * 2 || upCoordX === downCoordX + squaresize * 2) &&
        (upCoordY === downCoordY - squaresize || upCoordY === downCoordY + squaresize)) || 
        ((upCoordX === downCoordX - squaresize || upCoordX === downCoordX + squaresize) &&
        (upCoordY === downCoordY - squaresize * 2 || upCoordY === downCoordY + squaresize * 2))) {
            validMove = true;
        }
    else {
        validMove = false;
    }
    return validMove;
}

const BishupRules = (upCoordX, upCoordY, downCoordX, downCoordY, pieces) => {
    let validMove = false;
    if (Math.abs(upCoordX - downCoordX) === Math.abs(upCoordY - downCoordY)) {
        let squareCount = Math.abs(upCoordX - downCoordX) / squaresize;
        console.log(squareCount)
        let direction = "";
        if (upCoordX < downCoordX && upCoordY < downCoordY) {
            direction = "UpLeft"
        } else if (upCoordX > downCoordX && upCoordY < downCoordY) {
            direction = "UpRight"
        } else if (upCoordX > downCoordX && upCoordY > downCoordY) {
            direction = "DownRight"
        } else {
            direction = "DownLeft"
        }
        console.log(direction);
        if (squareCount > 1) {
            for (let i = 1; i < squareCount; i ++) {

                //  Messy AF????  but it works

                if (direction === "UpLeft") {
                    for (let j = 0; j < pieces.length; j ++) {
                        if (pieces[j].xLocation === (downCoordX - (i * squaresize)) && pieces[j].yLocation === downCoordY - (i * squaresize)) {
                            console.log(pieces[j]);
                            validMove = false;
                            return;
                        }
                    }
                    validMove = true;
                } else if (direction === "UpRight") {
                    for (let j = 0; j < pieces.length; j ++) {
                        if (pieces[j].xLocation === (downCoordX + (i * squaresize)) && pieces[j].yLocation === downCoordY - (i * squaresize)) {
                            console.log(pieces[j]);
                            validMove = false;
                            return;
                        }
                    }
                    validMove = true;
                } else if (direction === "DownRight") {
                    for (let j = 0; j < pieces.length; j ++) {
                        if (pieces[j].xLocation === (downCoordX + (i * squaresize)) && pieces[j].yLocation === downCoordY + (i * squaresize)) {
                            console.log(pieces[j]);
                            validMove = false;
                            return;
                        }
                    }
                    validMove = true;
                } else if (direction === "DownLeft") {
                    for (let j = 0; j < pieces.length; j ++) {
                        if (pieces[j].xLocation === (downCoordX - (i * squaresize)) && pieces[j].yLocation === downCoordY + (i * squaresize)) {
                            console.log(pieces[j]);
                            validMove = false;
                            return;
                        }
                    }
                    validMove = true;
                } else {
                    validMove = true;
                }
            }
        } else {
            validMove = true;
        }
    } else {
        validMove = false;
    }
    return validMove;
}

const RookRules = (upCoordX, upCoordY, downCoordX, downCoordY, pieces, piece = {type: "default"}) => {
    // console.log(piece)
    // console.log(upCoordX, upCoordY, downCoordX, downCoordY)
    // console.log(piece)
    let validMove = false;
    if ((piece.type === "Rook" || piece.type === "Queen") && ((upCoordX === downCoordX && upCoordY !== downCoordY) || (upCoordY === downCoordY && upCoordX !== downCoordX))) {
        console.log(upCoordX, upCoordY, downCoordX, downCoordY)

        let direction = "";
        if (upCoordX < downCoordX && upCoordY === downCoordY) {
            direction = "Left"
        } else if (upCoordX > downCoordX && upCoordY === downCoordY) {
            direction = "Right"
        } else if (upCoordY < downCoordY && upCoordX === downCoordX) {
            direction = "Up"
        } else if (upCoordY > downCoordY && upCoordX === downCoordX) {
            direction = "Down"
        }
        let squareCount = 0;
        if (direction === "Left" || direction === "Right") {
            squareCount = Math.abs(upCoordX - downCoordX) / squaresize;
        } else if (direction === "Up" || direction === "Down") {
            squareCount = Math.abs(upCoordY - downCoordY) / squaresize;
        }
        console.log(direction, squareCount)
        if (squareCount > 1) {
            //console.log(squareCount)
            for (let i = 1; i < squareCount; i ++) {

                //  copied from bishup mostly

                if (direction === "Left") {
                    for (let j = 0; j < pieces.length; j ++) {
                        if (pieces[j].xLocation === downCoordX - (i * squaresize) && pieces[j].yLocation === upCoordY) {
                            console.log(pieces[j]);
                            validMove = false;
                            return;
                        }
                    }
                    validMove = true;
                } else if (direction === "Right") {
                    for (let j = 0; j < pieces.length; j ++) {
                        if (pieces[j].xLocation === downCoordX + (i * squaresize) && pieces[j].yLocation === upCoordY) {
                            console.log(pieces[j]);
                            validMove = false;
                            return;
                        }
                    }
                    validMove = true;
                } else if (direction === "Up") {
                    for (let j = 0; j < pieces.length; j ++) {
                        if (pieces[j].yLocation === downCoordY - (i * squaresize) && pieces[j].xLocation === upCoordX) {
                            //console.log(pieces[j]);
                            validMove = false;
                            return;
                        }
                    }
                    validMove = true;
                } else if (direction === "Down") {
                    for (let j = 0; j < pieces.length; j ++) {
                        if (pieces[j].yLocation === downCoordY + (i * squaresize) && pieces[j].xLocation === upCoordX) {
                            //console.log(pieces[j]);
                            validMove = false;
                            return;
                        }
                    }
                    validMove = true;
                } else {
                    validMove = true;
                }

                //  end bishup copy mostly

            }
        } else {
            //  Moving 1 square is always valid 
            validMove = true;
        }
    } else {
        validMove = false;
    }
    return validMove;
}

const QueenRules = (upCoordX, upCoordY, downCoordX, downCoordY, pieces) => {
    let validMove = false;
    if (RookRules(upCoordX, upCoordY, downCoordX, downCoordY, pieces, {type: "Queen"}) || BishupRules(upCoordX, upCoordY, downCoordX, downCoordY, pieces)) {
        validMove = true;
    }
    return validMove;
}

const KingRules = (upCoordX, upCoordY, downCoordX, downCoordY, king, hasMoved, rookHasMoved, pieces) => {
    let validMove = false;
    if ((Math.abs(upCoordX-downCoordX) === squaresize && Math.abs(upCoordY-downCoordY) === squaresize) || 
    (upCoordX-downCoordX === 0 && Math.abs(upCoordY-downCoordY) === squaresize) ||
    (Math.abs(upCoordX-downCoordX) === squaresize && upCoordY-downCoordY === 0)) {
        validMove = true;
    }

    // // //  Castle if there are no pieces between the rook and the king, and no enemy pieces can move to those squares
    // let castleStyle = 0;
    // // //  Oh how I hate hardcoding... 
    // if (king.team === 1) {

    //     //  Queen Side castling

    //     if (upCoordX === downCoordX - squaresize * 3 && hasMoved === false && rookHasMoved.rookA === false && castleSquaresFree(pieces, 1, 1)) {
    //         castleStyle = 1;
    //         validMove = true;

    //     //  King side castling

    //     } else if (upCoordX === downCoordX - squaresize * 2 && hasMoved === false && rookHasMoved.rookB === false && castleSquaresFree(pieces, 1, 2)) {
    //         castleStyle = 2;
    //         validMove = true;
    //     }
    // } 
    
    // else if (king.team === 2) {

    // }



    //return {validMove: validMove, castle: castleStyle};
    return validMove;

}

// const castleSquaresFree = (pieces, team, side) => {
//     let squaresFree = false;
//     if (team = 1) {
//         if (side = 1) {
//             for(let i = 0; i < pieces.length; i ++) {
//                 if (piece.yLocation = 1 && (piece.xLocation === 2 || piece.xLocation === 3 || piece.xLocation === 4)) {
    
//                 }
//             }
//         } else if (side = 2) {
//             for(let i = 0; i < pieces.length; i ++) {
//                 if (piece.yLocation = 1 && (piece.xLocation === 2 || piece.xLocation === 3 || piece.xLocation === 4)) {
    
//                 }
//             }
//         }
//     } 
    
//     else if (team = 2) {
//         if (side = 1) {
//             for(let i = 0; i < pieces.length; i ++) {
//                 if (piece.yLocation = 1 && (piece.xLocation === 2 || piece.xLocation === 3 || piece.xLocation === 4)) {
    
//                 }
//             }
//         } else if (side = 2) {
//             for(let i = 0; i < pieces.length; i ++) {
//                 if (piece.yLocation = 1 && (piece.xLocation === 2 || piece.xLocation === 3 || piece.xLocation === 4)) {
    
//                 }
//             }
//         }
//     }

//     return squaresFree;
// }

const inCheck = (king, pieces) => {

    let checked = false;
    let kingXCoord = king.x;
    let kingYCoord = king.y;

    for (let i = 0; i < pieces.length; i ++) {
        let downCoordX = pieces[i].xLocation
        let downCoordY = pieces[i].yLocation
        
        if (pieces[i].team !== king.team) {
            if ((PawnRules(pieces[i].team, kingXCoord, kingYCoord, downCoordX, downCoordY, true).validMove && pieces[i].type === "Pawn") || 
            (KnightRules(kingXCoord, kingYCoord, downCoordX, downCoordY) && pieces[i].type === "Knight") ||
            (BishupRules(kingXCoord, kingYCoord, downCoordX, downCoordY, pieces) && pieces[i].type === "Bishup") ||
            (RookRules(kingXCoord, kingYCoord, downCoordX, downCoordY, pieces, pieces[i]) && pieces[i].type === "Rook") ||
            (QueenRules(kingXCoord, kingYCoord, downCoordX, downCoordY, pieces) && pieces[i].type === "Queen") ||
            (KingRules(kingXCoord, kingYCoord, downCoordX, downCoordY) && pieces[i].type === "King")) {
                checked = true;
            }

        }
    }

    return checked;
}

//  May be useful later
// const getDirection = () => {

// }

export {PawnRules, KnightRules, BishupRules, RookRules, QueenRules, KingRules, inCheck};
