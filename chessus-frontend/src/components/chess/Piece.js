import React, { Component } from 'react'

export default class Piece extends Component {

    constructor(props) {
        super();
        this.state = {
            name: props.name,
            xLocation: props.xLocation,
            yLocation: props.yLocation,
            squareSize: props.squareSize,
            alt: props.alt,
            imageSource: props.imageSource
        }
    }

    render() {
        return (
            <div>
                <img 
                src = {this.state.imageSource} 
                alt={this.state.alt} 
                width = {this.state.squareSize}
                // x = {this.state.xLocation}
                // y = {this.state.yLocation}
                />
            </div>
        )
    }
}
