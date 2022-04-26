import React, {useEffect, useState} from 'react';
import {COUNTRIES} from "./Countries";
import {Button, Form} from "react-bootstrap";
import './Game.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WorldMap from "react-svg-worldmap";

// Seeded with current day to a 'good-enough' pseudo-random number generator
// Hopefully every day will produce the same order for everyone???
const fullDaysSinceEpoch = Math.floor((new Date()) / 8.64e7);
let seed = fullDaysSinceEpoch;

function seededRandom() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(seededRandom() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

function Game() {
    const [countriesList, setCountriesList] = useState([{name:"none",code:"none",capital:"none"}]);
    const [enteredCapital, setEnteredCapital] = useState('');
    const [placeHolderText, setPlaceHolderText] = useState('');
    const [guessCounter, setGuessCounter] = useState(3);
    const [score, setScore] = useState(0);

    useEffect(()=>{
        setCountriesList(shuffleArray(COUNTRIES));
    },[]);

    const enteredCapitalChangeHandler = (event) => {
        setEnteredCapital(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (enteredCapital.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === countriesList[0].capital.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
            setPlaceHolderText('Nice Work! The capital of ' + countriesList[0].name + ' is ' + countriesList[0].capital + '.');
            setEnteredCapital('');
            setScore(oldScore=> oldScore+guessCounter);
            nextCountry();
        } else {
            if (guessCounter > 1) {
                console.log(countriesList[0].capital.toLowerCase())
                setEnteredCapital('');
                const guessesLeft = guessCounter - 1
                setGuessCounter(guessesLeft);
                setPlaceHolderText(`Try Again, you have ${guessesLeft} guess(es) left.`)
            } else {
                setEnteredCapital('');
                setPlaceHolderText('Sorry, no more guesses left, the capital of ' + countriesList[0].name + ' is ' + countriesList[0].capital + '.')
                nextCountrySkip();
            }
        }
    };

    const removeCountryFromList = () => {
        setCountriesList(oldList => {
            const newList = [...oldList];
            newList.shift();
            return newList;
        })
    }

    const nextCountry = () => {
        setGuessCounter(3);
        removeCountryFromList();
    }

    const nextCountrySkip = () => {
        setGuessCounter(3);
        removeCountryFromList();
        setScore(oldScore=> oldScore-1);
        setPlaceHolderText('The capital of ' + countriesList[0].name + ' is ' + countriesList[0].capital + '.')
    }

    const mapData = [{country: countriesList[0].code, value: 1389618778}];

    return (
        <>
            <Form onSubmit={submitHandler}>
                {countriesList.length > 0 && <Form.Group className="mb-3 input-field" controlId="formBasicText">
                    <Form.Label>What is the capital of {countriesList[0].name} </Form.Label>
                    <Form.Control type="text" placeholder='Enter guess' value={enteredCapital}
                                  onChange={enteredCapitalChangeHandler}/>
                    <Form.Text className="text-muted">{placeHolderText}</Form.Text>
                </Form.Group>}
                {countriesList.length === 0 && <Form.Group className="mb-3 input-field" controlId="formBasicText">
                    <Form.Text className="text-muted">That's all da countries</Form.Text>
                </Form.Group>}
                {countriesList.length > 0 && <Button variant="primary" type="submit" className="me-2">
                    Submit
                </Button>}
                {' '}
                {countriesList.length > 0 && <Button variant="danger" onClick={nextCountrySkip}>
                    &nbsp;&nbsp;Skip&nbsp;&nbsp;
                </Button>
                }
            </Form>
            <br/>
            <h5>
                Score: {score}
            </h5>
            <WorldMap
                color="red"
                title=""
                value-suffix="people"
                size="responsive"
                data={mapData}
                richInteraction
            />
        </>

    );
}

export default Game;