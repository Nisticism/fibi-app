//import squaresize from './variables/global-vars.js';
import store from '../store.js';
import { WhitePawn, BlackPawn, WhiteKnight, BlackKnight,
WhiteBishup, BlackBishup, WhiteRook, BlackRook,
WhiteQueen, BlackQueen, WhiteKing, BlackKing } from './piece-images.js';


    //  Set square size
    const state = store.getState();
    let squaresize = state.chessReducer.squaresize;

    //  All chess pieces

    const pieces =

        [

    //  White Pawns
        { id: 1, src: WhitePawn, type: 'Pawn', description: 'pawn',
    xLocation: 0, yLocation: 6 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 2, src: WhitePawn, type: 'Pawn', description: 'pawn',
    xLocation: squaresize, yLocation: 6 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 3, src: WhitePawn, type: 'Pawn', description: 'pawn',
    xLocation: 2 * squaresize, yLocation: 6 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 4, src: WhitePawn, type: 'Pawn', description: 'pawn',
    xLocation: 3 * squaresize, yLocation: 6 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 5, src: WhitePawn, type: 'Pawn', description: 'pawn',
    xLocation: 4 * squaresize, yLocation: 6 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 6, src: WhitePawn, type: 'Pawn', description: 'pawn',
    xLocation: 5 * squaresize, yLocation: 6 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 7, src: WhitePawn, type: 'Pawn', description: 'pawn',
    xLocation: 6 * squaresize, yLocation: 6 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 8, src: WhitePawn, type: 'Pawn', description: 'pawn',
    xLocation: 7 * squaresize, yLocation: 6 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},

    //  Black Pawns
    { id: 101, src: BlackPawn, type: 'Pawn', description: 'pawn',
    xLocation: 0, yLocation: 1 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 102, src: BlackPawn, type: 'Pawn', description: 'pawn',
    xLocation: squaresize, yLocation: 1 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 103, src: BlackPawn, type: 'Pawn', description: 'pawn',
    xLocation: 2 * squaresize, yLocation: 1 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 104, src: BlackPawn, type: 'Pawn', description: 'pawn',
    xLocation: 3 * squaresize, yLocation: 1 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 105, src: BlackPawn, type: 'Pawn', description: 'pawn',
    xLocation: 4 * squaresize, yLocation: 1 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 106, src: BlackPawn, type: 'Pawn', description: 'pawn',
    xLocation: 5 * squaresize, yLocation: 1 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 107, src: BlackPawn, type: 'Pawn', description: 'pawn',
    xLocation: 6 * squaresize, yLocation: 1 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 108, src: BlackPawn, type: 'Pawn', description: 'pawn',
    xLocation: 7 * squaresize, yLocation: 1 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 2},

    //  White Knights
    { id: 9, src: WhiteKnight, type: 'Knight', description: 'pawn',
    xLocation: 1 * squaresize, yLocation: 7 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 10, src: WhiteKnight, type: 'Knight', description: 'pawn',
    xLocation: 6 * squaresize, yLocation: 7 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},

    //  Black Knights
    { id: 109, src: BlackKnight, type: 'Knight', description: 'pawn',
    xLocation: 1 * squaresize, yLocation: 0, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 110, src: BlackKnight, type: 'Knight', description: 'pawn',
    xLocation: 6 * squaresize, yLocation: 0, squaresize: squaresize, alt: 'Pawn', team: 2},

    //  White Bishups
    { id: 11, src: WhiteBishup, type: 'Bishup', description: 'pawn',
    xLocation: 2 * squaresize, yLocation: 7 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 12, src: WhiteBishup, type: 'Bishup', description: 'pawn',
    xLocation: 5 * squaresize, yLocation: 7 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},

    //  Black Bishups
    { id: 111, src: BlackBishup, type: 'Bishup', description: 'pawn',
    xLocation: 2 * squaresize, yLocation: 0, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 112, src: BlackBishup, type: 'Bishup', description: 'pawn',
    xLocation: 5 * squaresize, yLocation: 0, squaresize: squaresize, alt: 'Pawn', team: 2},

    //  White Rooks
    { id: 13, src: WhiteRook, type: 'Rook', description: 'pawn',
    xLocation: 0, yLocation: 7 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 14, src: WhiteRook, type: 'Rook', description: 'pawn',
    xLocation: 7 * squaresize, yLocation: 7 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},

    //  Black Rooks
    { id: 113, src: BlackRook, type: 'Rook', description: 'pawn',
    xLocation: 0, yLocation: 0, squaresize: squaresize, alt: 'Pawn', team: 2},
    { id: 114, src: BlackRook, type: 'Rook', description: 'pawn',
    xLocation: 7 * squaresize, yLocation: 0, squaresize: squaresize, alt: 'Pawn', team: 2},

    //  Queens
    { id: 15, src: WhiteQueen, type: 'Queen', description: 'pawn',
    xLocation: 3 * squaresize, yLocation: 7 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 115, src: BlackQueen, type: 'Queen', description: 'pawn',
    xLocation: 3 * squaresize, yLocation: 0, squaresize: squaresize, alt: 'Pawn', team: 2},

    //  Kings
    { id: 16, src: WhiteKing, type: 'King', description: 'pawn',
    xLocation: 4 * squaresize, yLocation: 7 * squaresize, squaresize: squaresize, alt: 'Pawn', team: 1},
    { id: 116, src: BlackKing, type: 'King', description: 'pawn',
    xLocation: 4 * squaresize, yLocation: 0, squaresize: squaresize, alt: 'Pawn', team: 2},


    ];
    



export {pieces};