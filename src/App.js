import React, {Component} from 'react';
import {Button, Tooltip, OverlayTrigger, Jumbotron} from "react-bootstrap";
import ReactStopwatch from 'react-stopwatch';
import './App.css';
import './index.css'
import './custumBootstrap.scss';
import Alert from "@material-ui/lab/Alert";

class App extends Component {
    state = {
        squareInfo: [],
        round: 0,
        correct: 0,
        maxround: 10,
        time: 0,
        difficulty: 80,
        errorIsOpen: false,
        errorMessage: "Error"
    }

    componentDidMount() {
        if (localStorage.getItem("difficulty")) {
            this.setState({difficulty: parseInt(localStorage.getItem("difficulty"))})
        } else {
            localStorage.setItem("difficulty", 80);
        }
        this.makeSquares();
    }

    isCorrect = () => {
        this.setState({
            correct: this.state.correct += 1,
            round: this.state.round += 1
        })
        if (this.state.round != this.state.maxround) {
            this.makeSquares()
        }
        console.log("true")
    }
    isFalse = () => {
        this.setState({round: this.state.round += 1})
        this.makeSquares()
        console.log("false")
    }

    makeSquares = () => {
        var retArr = [];


        function rgbToHex(rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex;
        };

        function fullColorHex(r, g, b) {
            var red = rgbToHex(r);
            var green = rgbToHex(g);
            var blue = rgbToHex(b);
            return red + green + blue;
        };

        function getRandomAbovePercent(percent) {
            if (Math.floor(Math.random() * 100) >= percent) {
                return percent / 100
            }
            return getRandomAbovePercent(percent)
        }

        var r = Math.floor(Math.random() * 255) + 0
        var g = Math.floor(Math.random() * 255) + 0
        var b = Math.floor(Math.random() * 255) + 0
        var trueColor = fullColorHex(r, g, b)
        var guessNumber = Math.floor(Math.random() * 99) + 0
        console.log(r, g, b)

        for (let i = 0; i < 100; i++) {
            let style = {
                display: "inline-block",
                width: 3.5 + "vw",
                height: 3.5 + "vw",
                background: "#c41a1a"
            }
            if (window.outerHeight > window.outerWidth) {
                console.log("bigger height")
                style.width = 6.5 + "vw"
                style.height = 6.5 + "vw"
            } else {
                console.log("bigger width")
                style.width = 6.5 + "vh"
                style.height = 6.5 + "vh"
            }

            if (i % 10 == 0) {
                retArr.push(<br/>)
            }

            if (i == guessNumber) {

                var fr = parseInt(r * (getRandomAbovePercent(this.state.difficulty)))
                var fg = parseInt(g * (getRandomAbovePercent(this.state.difficulty)))
                var fb = parseInt(b * (getRandomAbovePercent(this.state.difficulty)))
                var falseColor = fullColorHex(fr, fg, fb)
                console.log(fr, fg, fb)

                style.background = "#" + falseColor
                retArr.push(
                    <div className={"m-1 rectangle"} onClick={this.isCorrect} style={style}/>
                )
            } else {
                style.background = "#" + trueColor

                retArr.push(
                    <div className={"m-1 rectangle"} onClick={this.isFalse} style={style}/>
                )
            }
        }
        this.setState({squareInfo: retArr})
    }

    render() {
        const renderTooltip = (props) => (
            <Tooltip id="button-tooltip" {...props}>This will reset your score</Tooltip>
        );
        return (
            <div>
                <Alert severity={'error'} hidden={!this.state.errorIsOpen}
                       onClose={() => this.setState({errorIsOpen: false})}>
                    {this.state.errorMessage}
                </Alert>
                <Jumbotron>
                    <p><h1>Correct: {this.state.correct} of {this.state.round}</h1></p>
                    <p><h3>Difficulty: {this.state.difficulty} of 100</h3></p>

                    <OverlayTrigger
                        placement="bottom"
                        delay={{show: 550, hide: 50}}
                        overlay={renderTooltip}
                    >
                        <Button variant="outline-success" className={"m-2 p-2"}
                                onClick={this.makeEasier}>EASIER</Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                        placement="bottom"
                        delay={{show: 550, hide: 50}}
                        overlay={renderTooltip}
                    >
                        <Button variant="outline-danger" className={"m-2 p-2"} onClick={this.makeHarder}>HARDER</Button>
                    </OverlayTrigger>

                </Jumbotron>
                <div className={'col-lg-10 col-centered'}>
                    {this.state.squareInfo}
                </div>

            </div>
        );
    }

    makeHarder = () => {
        if (this.state.difficulty < 95) {
            this.setState({
                difficulty: this.state.difficulty += 5
            })
            localStorage.setItem("difficulty", this.state.difficulty);
        } else {
            this.setState({errorIsOpen: true, errorMessage: 'TO HARD'})
        }
    }


    makeEasier = () => {
        if (this.state.difficulty > 5) {
            this.setState({
                difficulty: this.state.difficulty -= 5
            })
            localStorage.setItem("difficulty", this.state.difficulty);
        } else {
            this.setState({errorIsOpen: true, errorMessage: 'TO EASY'})
        }
        
    }
}

export default App;
