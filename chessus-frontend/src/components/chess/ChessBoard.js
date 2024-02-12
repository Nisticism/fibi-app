import React, { Component } from 'react'
import chessboard from '../../assets/chessboard960p.png';
import {pieces} from '../../assets/pieces.js';
import squaresize from '../../assets/variables/global-vars.js';
import checkSound from '../../assets/sounds/zapsplat_check.mp3';
import moveSound from '../../assets/sounds/zapsplat_move.mp3';
import {PawnRules, KnightRules, BishupRules, RookRules, QueenRules, KingRules, inCheck} from './PieceRules.js';
import './ChessBoard.scss';

class ChessBoard extends Component {


    constructor() {
        super();
        this.state = {};
        this.state.verticalSquares = 8;
        this.state.horizontalSquares = 8;
        this.state.boardwidth = squaresize * this.state.horizontalSquares;
        this.state.boardheight = squaresize * this.state.verticalSquares;
        this.state.pieces = [];
        this.state.mouseDownCoordinates = {x: null, y: null}
        this.state.movingPieceIndex = null;
        this.state.mouseUpCoordinates = {x: null, y: null}
        this.loadPieceData = this.loadPieceData.bind(this);
        this.checkIfClicked = this.checkIfClicked.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.toggleTurns = this.toggleTurns.bind(this);
        this.backtrackMove = this.backtrackMove.bind(this);
        this.handleMouseUpOutside = this.handleMouseUpOutside.bind(this);
        this.getKing = this.getKing.bind(this);
        this.canvasRef = React.createRef();
        this.canvas = null;
        this.ctx = null;
        this.state.turn = 1;
        this.state.playerCount = 2;
        this.state.pieceImages = [];
        this.state.kings = [];
        for (let i = 0; i < pieces.length; i ++) {
            if (pieces[i].type === "King") {
                this.state.kings.push({id: pieces[i].id, type: pieces[i].type, team: pieces[i].team, x: pieces[i].xLocation, y: pieces[i].yLocation, inCheck: false})
            }
            let image = new Image();
            image.id = pieces[i].id;
            image.src = pieces[i].src;
            this.state.pieceImages.push(image);
        }
        let boardImage = new Image();
        boardImage.src = chessboard
        this.state.boardImage = boardImage;
        this.state.boardRendered = false;
        this.state.lastMove = null;

        let checkSoundAudio = new Audio();
        checkSoundAudio.src = checkSound;
        this.state.checkSound = checkSoundAudio;

        let moveSoundAudio = new Audio();
        moveSoundAudio.src = moveSound;
        this.state.moveSound = moveSoundAudio;

        //this.state.squareHash = new Map();

        //  rAF make framerate?

        // this.lastFrame = 0;
        // this.startTime = undefined;
        // this.framerate = 1000/10;
        // this.time = 0;

    }

    componentDidMount() {
        console.log(this.state.pieceImages)
        this.loadPieceData();
        console.log(this.state);
        window.addEventListener('mouseup', this.setWindowListener.bind(this));
        this.updateCanvas();
    }

    getKing(team) {
        let king = null;
        let index = null;
        for(let i = 0; i < this.state.kings.length; i ++) {
            if (this.state.kings[i].team === team) {
                king = this.state.kings[i];
                index = i;
            }
        }
        return {king: king, index: index};
    }

    updateCanvas() {

        //  Set the canvas

        if (!this.canvas) {
            this.canvas = this.canvasRef.current;
            this.ctx = this.canvas.getContext('2d');
        }
        if (this.ctx != null) {

            //  Draw the board
            this.ctx.drawImage(this.state.boardImage, 0, 0, this.state.boardwidth, this.state.boardheight);
            this.setState({boardRendered: true});

            //  Draw the images
            for (let i = 0; i < this.state.pieces.length; i ++) {
                this.ctx.drawImage(this.state.pieceImages[i], 
                this.state.pieces[i].xLocation, this.state.pieces[i].yLocation, 
                this.state.pieces[i].squaresize, this.state.pieces[i].squaresize);
                
            }
        }
        requestAnimationFrame(this.updateCanvas);
    }

    checkIfClicked(x,y) {
        let clicked = false;
        let index = null;
        let count = 0
        this.state.pieces.forEach((piece) => {
            if (x >= piece.xLocation && x <= piece.xLocation + squaresize && y >= piece.yLocation && y <= piece.yLocation + squaresize) {
                clicked = true;
                index = count;
            }
            count ++;
        })
        return {isClicked: clicked, location: index};
    }
 
    handleMouseDown(event) {
        event.preventDefault();
        console.log(this.state.kings)
        let eventListened = this.checkIfClicked(event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop)
        console.log(eventListened)
        if (eventListened.isClicked) {
            this.setState({movingPieceIndex: eventListened.location})
            this.setState({mouseDownCoordinates: {x: this.state.pieces[eventListened.location].xLocation, y: this.state.pieces[eventListened.location].yLocation}})
        }
    }

    handleMouseUp(event) {
        //console.log(this.state.squareHash)
        // console.log(this.canvas)
        // console.log(this.state.lastMove)
        event.preventDefault();
        let index = this.state.movingPieceIndex;
        if (index != null) {

            //  All piece logic goes here

            //  Once a piece is moved, it's going to be untracked no matter what
            this.setState({movingPieceIndex: null});


            let xEventLocation = Math.floor((event.clientX - event.target.offsetLeft)/squaresize) * squaresize;
            let yEventLocation = Math.floor((event.clientY - event.target.offsetTop)/squaresize) * squaresize;

            let downCoordX = this.state.mouseDownCoordinates.x;
            let downCoordY = this.state.mouseDownCoordinates.y;

            let currentTeam = this.state.pieces[index].team;
            let enemyTeam = 0;

            //  This is not a permanent solution to teams

            if (currentTeam === 1) {
                enemyTeam = 2;
            } else {
                enemyTeam = 1;
            }

            let currentKing = this.getKing(currentTeam).king;
            let enemyKing = this.getKing(enemyTeam).king;

            console.log(currentKing)
            let kingIndex = this.getKing(this.state.pieces[index].team).index;


            //  If it's the correct player's turn, they will be able to move

            console.log(this.state.turn, this.state.pieces[this.state.movingPieceIndex].team);

            if (this.state.pieces[this.state.movingPieceIndex].team === this.state.turn) {
                let trueX = Math.floor((event.clientX - event.target.offsetLeft)/squaresize) + 1
                let trueY = Math.floor((event.clientY - event.target.offsetTop)/squaresize) + 1
                console.log(trueX, trueY);
                let pieceCollision = false;
                let legalMove = true;
                for (let i = 0; i < this.state.pieces.length; i ++) {

                    //  If a piece captures a piece, remove it

                    if (this.state.pieces[i].xLocation === xEventLocation &&
                        this.state.pieces[i].yLocation === yEventLocation) {
                            pieceCollision = true;
                            if (this.state.pieces[i].team !== this.state.turn) {

                                //  Add piece specific logic for captures here:

                                console.log(this.state.pieces[index].type)
                                console.log(this.state.pieces[index].team, 
                                    xEventLocation, yEventLocation, this.state.mouseDownCoordinates.x,
                                    this.state.mouseDownCoordinates.y)

                                //  Check if legal move

                                //  Pawns
                                //let enPassant = false;
                                if (this.state.pieces[index].type === "Pawn" && PawnRules(this.state.pieces[index].team, 
                                    xEventLocation, yEventLocation, this.state.mouseDownCoordinates.x,
                                    this.state.mouseDownCoordinates.y, true).validMove) {
                                    legalMove = true;
                                    // if (this.state.pieces[index].type === "Pawn" && PawnRules(this.state.pieces[index].team, 
                                    //     xEventLocation, yEventLocation, this.state.mouseDownCoordinates.x,
                                    //     this.state.mouseDownCoordinates.y, true).enPassant) {
                                    //         enPassant = true;
                                    //     }
                                }

                                //  Knights
                                else if (this.state.pieces[index].type === "Knight" && KnightRules(xEventLocation, yEventLocation, 
                                    this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y)) {
                                    legalMove = true;
                                }

                                //  Bishups
                                else if (this.state.pieces[index].type === "Bishup" && BishupRules(xEventLocation, yEventLocation, 
                                    this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y, this.state.pieces)) {
                                    legalMove = true;
                                } 

                                //  Rooks
                                else if (this.state.pieces[index].type === "Rook" && RookRules(xEventLocation, yEventLocation, 
                                    this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y, this.state.pieces, this.state.pieces[index])) {
                                    legalMove = true;
                                }

                                //  Queens
                                else if (this.state.pieces[index].type === "Queen" && QueenRules(xEventLocation, yEventLocation, 
                                    this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y, this.state.pieces)) {
                                    legalMove = true;
                                } 

                                //  Kings
                                else if (this.state.pieces[index].type === "King" && KingRules(xEventLocation, yEventLocation, 
                                    this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y)) {
                                    legalMove = true;
                                } 
                                
                                //  All Other illegal moves
                                else {
                                    legalMove = false;
                                }

                                //  Check if in check.  Must simulate an actual capture/move in order to determine if, after the move, the king is still in check or not.
                                let piecesCopy = this.state.pieces;

                                if (piecesCopy[index].type === "King") {
                                    let kingsCopy = this.state.kings;
                                    kingsCopy[kingIndex].x = xEventLocation;
                                    kingsCopy[kingIndex].y = yEventLocation;
                                    console.log("currentKing updated");
                                    currentKing = kingsCopy[kingIndex];
                                }

                                let tempPiecesRemovalIndex = null;

                                if (inCheck(currentKing, this.state.pieces)) {
                                    //  Loop through the entire piece array, if a piece occupies that square, remove it, save the copy
                                    for (let i = 0; i < piecesCopy.length; i ++) {
                                        if (piecesCopy[i].xLocation === xEventLocation && piecesCopy[i].yLocation === yEventLocation) {
                                            tempPiecesRemovalIndex = i;
                                        }
                                    }
                                    piecesCopy[index].xLocation = xEventLocation;
                                    piecesCopy[index].yLocation = yEventLocation;
                                }

                                console.log(this.state.pieces)
                                let slicedCopy = piecesCopy;

                                if (tempPiecesRemovalIndex !== null) {
                                    slicedCopy = piecesCopy.slice(0, tempPiecesRemovalIndex).concat(piecesCopy.slice(tempPiecesRemovalIndex + 1))
                                    console.log(piecesCopy)
                                    console.log(this.state.pieces)
                                }

                                if (inCheck(currentKing, slicedCopy)) {
                                    legalMove = false;
                                    console.log("still in check");
                                    console.log(currentKing);
                                }

                                console.log(this.state.pieces)
                                
                                
                                if (legalMove === true) {

                                    //  Copy State

                                    let stateCopy = this.state.pieces;

                                    //  If it's a king, add to king array.  This array is probably just two pieces.

                                    if (this.state.pieces[index].type === "King") {
                                        let kingArray = this.state.kings;
                                        for (let i = 0; i < kingArray.length; i ++) {
                                            if (kingArray[i].id === this.state.pieces[index].id) {
                                                kingArray[i].x = xEventLocation;
                                                kingArray[i].y = yEventLocation;
                                            }
                                        }
                                        this.setState({kings: kingArray});
                                        console.log("king state changed");
                                        console.log(this.state.kings);
                                    }
                                    stateCopy[index].xLocation = xEventLocation;
                                    stateCopy[index].yLocation = yEventLocation;

                                    // let tempHash = this.state.squareHash;
                                    // tempHash.set({x: xEventLocation, y: yEventLocation}, stateCopy[index].id)
                                    // tempHash.delete(stateCopy[i].id);
                                    // console.log(tempHash)
                                    // this.setState({squareHash: tempHash})



                                    stateCopy.splice(i, 1);
                                    this.setState({pieces: stateCopy});
                                    console.log("Piece captured");
                                    let imagesCopy = this.state.pieceImages;
                                    imagesCopy.splice(i, 1);
                                    this.setState({pieceImages: imagesCopy});

                                    //  Set the last move
                                    //this.setState({lastMove: {this.state.pieces[]}})

                                    //  Calculate checkmate for the opponent here.  If the opponent's king is in check, and they have no legal moves, it's checkmate.

                                    if (inCheck(enemyKing, piecesCopy)) {
                                        console.log("check!")
                                        this.state.checkSound.play();
                                    } else {
                                        this.state.moveSound.play();
                                    }
                                    
                                    this.toggleTurns();
                                }
                                else {
                                    this.backtrackMove(index);
                                }
                                return;

        
                                //  Backtrack if the correct player move a piece on their own piece
                            } else if (this.state.pieces[i].team === this.state.turn || legalMove === false) {
                                this.backtrackMove(index);
                                return;
                            }
                    } 
                }

                //  If there are no collisions and the piece moved past its original square, move the piece into position
                //console.log(this.state.mouseDownCoordinates, xEventLocation, yEventLocation)
                let sameLocation = false;
                if (xEventLocation === downCoordX && yEventLocation === downCoordY) {
                    sameLocation = true;
                }
                if (pieceCollision === false && sameLocation === false) {
                    // console.log(this.state.pieces)
                    // console.log(this.state.pieces[index])

                    //  If it's a legal move, go on

                    //  Pawns
                    let enPassant = false;
                    if (this.state.pieces[index].type === "Pawn" && PawnRules(this.state.pieces[index].team, 
                        xEventLocation, yEventLocation, this.state.mouseDownCoordinates.x,
                        this.state.mouseDownCoordinates.y, false, this.state.lastMove, index).validMove) {
                        console.log(this.state.lastMove)
                        legalMove = true;
                        if (this.state.pieces[index].type === "Pawn" && PawnRules(this.state.pieces[index].team, 
                            xEventLocation, yEventLocation, this.state.mouseDownCoordinates.x,
                            this.state.mouseDownCoordinates.y, false, this.state.lastMove, index).enPassant) {
                                enPassant = true;
                            }
                    }

                    //  Knights
                    else if (this.state.pieces[index].type === "Knight" && KnightRules(xEventLocation, yEventLocation, 
                        this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y)) {
                        legalMove = true;
                    }

                    //  Bishups
                    else if (this.state.pieces[index].type === "Bishup" && BishupRules(xEventLocation, yEventLocation, 
                        this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y, this.state.pieces)) {
                        legalMove = true;
                    } 

                    //  Rooks
                    else if (this.state.pieces[index].type === "Rook" && RookRules(xEventLocation, yEventLocation, 
                        this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y, this.state.pieces, this.state.pieces[index])) {
                        legalMove = true;
                    }

                    //  Queens
                    else if (this.state.pieces[index].type === "Queen" && QueenRules(xEventLocation, yEventLocation, 
                        this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y, this.state.pieces)) {
                        legalMove = true;
                    } 

                    //  Kings
                    else if (this.state.pieces[index].type === "King" && KingRules(xEventLocation, yEventLocation, 
                        this.state.mouseDownCoordinates.x, this.state.mouseDownCoordinates.y)) {
                        legalMove = true;
                    } 
                    
                    //  All other illegal moves
                    else {
                        legalMove = false;
                    }

                     //  Check if in check.  Must simulate an actual capture/move in order to determine if, after the move, the king is still in check or not.
                     let piecesCopy = this.state.pieces;

                     if (piecesCopy[index].type === "King") {
                         let kingsCopy = this.state.kings;
                         kingsCopy[kingIndex].x = xEventLocation;
                         kingsCopy[kingIndex].y = yEventLocation;
                         console.log("currentKing updated");
                         currentKing = kingsCopy[kingIndex];
                     }

                     let tempPiecesRemovalIndex = null;

                     if (inCheck(currentKing, this.state.pieces)) {
                         //  Loop through the entire piece array, if a piece occupies that square, remove it, save the copy
                         for (let i = 0; i < piecesCopy.length; i ++) {
                             if (piecesCopy[i].xLocation === xEventLocation && piecesCopy[i].yLocation === yEventLocation) {
                                 tempPiecesRemovalIndex = i;
                             }
                         }
                         piecesCopy[index].xLocation = xEventLocation;
                         piecesCopy[index].yLocation = yEventLocation;
                     }

                     //console.log(this.state.pieces)
                     let slicedCopy = piecesCopy;

                     if (tempPiecesRemovalIndex !== null) {
                         slicedCopy = piecesCopy.slice(0, tempPiecesRemovalIndex).concat(piecesCopy.slice(tempPiecesRemovalIndex + 1))
                         console.log(piecesCopy)
                         console.log(this.state.pieces)
                     }

                     if (inCheck(currentKing, slicedCopy)) {
                         legalMove = false;
                         // console.log(slicedCopy)
                         console.log("still in check");
                         // console.log(currentKing);
                     }

                    // Finally, get the true legalMove, and move things

                    if (legalMove === true) {

                        //  If it's a king, add to king array.  This array is probably just two pieces.

                        if (this.state.pieces[index].type === "King") {
                            let kingArray = this.state.kings;
                            for (let i = 0; i < kingArray.length; i ++) {
                                if (kingArray[i].id === this.state.pieces[index].id) {
                                    kingArray[i].x = xEventLocation;
                                    kingArray[i].y = yEventLocation;
                                }
                            }
                            this.setState({kings: kingArray});
                            console.log("king state changed");
                            console.log(this.state.kings);
                        }

                        // let tempHash = this.state.squareHash;
                        // tempHash.set(this.state.pieces[index].id, {x: xEventLocation, y: yEventLocation})
                        // console.log(tempHash)
                        // this.setState({squareHash: tempHash})

                        //  Temp lastMove
                        let tempLastMove = this.state.lastMove;
                        let lastMovePiece = this.state.pieces[index];
                        lastMovePiece.xLocation = xEventLocation;
                        lastMovePiece.yLocation = yEventLocation;
                        
                        //  Set lastMove here
                        let lastMove = {piece: lastMovePiece, index: index, yDown: downCoordY}
                        this.setState({lastMove: lastMove})
                        console.log("settings lastMove: ", lastMove)

                        this.setState(({pieces}) => ({
                            pieces: [
                                ...pieces.slice(0, index),
                                {
                                    ...pieces[index],
                                    xLocation: xEventLocation,
                                    yLocation: yEventLocation,
                                },
                                ...pieces.slice(index + 1)
                            ]
                        }));

                        //  En Passant

                        if (enPassant === true) {

                            // remove the piece
                            //console.log("removing pawn via en passant")
                            let piecesCopy = this.state.pieces;
                            piecesCopy.splice(tempLastMove.index, 1);
                            this.setState({pieces: piecesCopy});

                            let imagesCopy = this.state.pieceImages;
                            imagesCopy.splice(tempLastMove.index, 1);
                            this.setState({pieceImages: imagesCopy});
                        }

                        //  Calculate checkmate for the opponent here.  If the opponent's king is in check, and they have no legal moves, it's checkmate.

                        if (inCheck(enemyKing, piecesCopy)) {
                            console.log("check!")
                            this.state.checkSound.play();
                        } else {
                            this.state.moveSound.play();
                        }


                        this.toggleTurns();
                    }
                    else {
                        this.backtrackMove(index);
                    }
                } else if (sameLocation === true) {
                    this.backtrackMove(index);
                    console.log("didn't move")
                }
            }   else {
                    this.backtrackMove(index);
                    console.log("backtracking")
                }

        }
    }

    backtrackMove(index) {

        //  If wrong turn, put the piece back where it was before it was selected
        this.setState(({pieces}) => ({
            pieces: [
                ...pieces.slice(0, index),
                {
                    ...pieces[index],
                    xLocation: this.state.mouseDownCoordinates.x,
                    yLocation: this.state.mouseDownCoordinates.y,
                },
                ...pieces.slice(index + 1)
            ]
        }));
        //  reset the king, as the move with backfire anyway
        if (this.state.pieces[index].type === "King") {
            let kingsCopy = this.state.kings;
            let kingIndex = this.getKing(this.state.pieces[index].team).index
            kingsCopy[kingIndex].x = this.state.mouseDownCoordinates.x;
            kingsCopy[kingIndex].y = this.state.mouseDownCoordinates.y;
            this.setState({kings: kingsCopy});
        }
    }

    handleMouseUpOutside(event) {
        let offsetTop = document.getElementById("canvas").offsetTop;
        let offsetLeft = document.getElementById("canvas").offsetLeft;
        console.log(event.clientX, event.clientY)
        let index = this.state.movingPieceIndex;
        if (index != null && ((event.clientX - offsetLeft) > this.state.boardwidth ||
        (event.clientX) < offsetLeft ||
        (event.clientY - offsetTop) > this.state.boardheight ||
        (event.clientY) < offsetTop)) {
            console.log("outside")
            this.setState(({pieces}) => ({
                pieces: [
                    ...pieces.slice(0, index),
                    {
                        ...pieces[index],
                        xLocation: this.state.mouseDownCoordinates.x,
                        yLocation: this.state.mouseDownCoordinates.y,
                    },
                    ...pieces.slice(index + 1)
                ]
            }));
        }
        this.setState({movingPieceIndex: null});
    }

    toggleTurns() {
        if (this.state.turn !== this.state.playerCount) {
            this.setState({turn: this.state.turn + 1})
        } else if (this.state.turn === this.state.playerCount) {
            this.setState({turn: 1})
        }
    }

    handleMouseMove(event) {
        if (this.state.movingPieceIndex != null) {
            let index = this.state.movingPieceIndex;
            this.setState(({pieces}) => ({
                pieces: [
                    ...pieces.slice(0, index),
                    {
                        ...pieces[index],
                        xLocation: event.clientX - event.target.offsetLeft - 0.5 * squaresize,
                        yLocation: event.clientY - event.target.offsetTop - 0.5 * squaresize
                    },
                    ...pieces.slice(index + 1)

                ]
            }));
        }
    }

    setWindowListener(e) {
        let canvas = null;
        if(document.getElementById("canvas")){
            canvas = document.getElementById("canvas");
        };
        if (canvas != null) {
            let offsetTop = canvas.offsetTop;
            let offsetLeft = canvas.offsetLeft;
            let index;
            if (this.state.movingPieceIndex >= 0) {
                index = this.state.movingPieceIndex
            }
                if (index != null && ((e.clientX - offsetLeft) > this.state.boardwidth ||
                (e.clientX) < offsetLeft ||
                (e.clientY - offsetTop) > this.state.boardheight ||
                (e.clientY) < offsetTop)) {
                    console.log("outside")
                    this.setState(({pieces}) => ({
                        pieces: [
                            ...pieces.slice(0, index),
                            {
                                ...pieces[index],
                                xLocation: this.state.mouseDownCoordinates.x,
                                yLocation: this.state.mouseDownCoordinates.y,
                            },
                            ...pieces.slice(index + 1)
                        ]
                    }));
                }
            this.setState({movingPieceIndex: null});
        }
    }

    render () {
        return (
        <div className = 'fullScreen'>
            <div className='chessboardWrapper'>
                <canvas
                ref={this.canvasRef} 
                width = {this.state.boardwidth} 
                height = {this.state.boardheight}
                onMouseDown = {this.handleMouseDown}
                onMouseUp = {this.handleMouseUp} 
                onMouseMove = {this.handleMouseMove}
                id="canvas"/>
            </div>
            <p>Sound effects obtained from https://www.zapsplat.com</p>
        </div>
        )
    }

    loadPieceData() {
        this.setState({pieces: pieces})
    }
}

export default ChessBoard
