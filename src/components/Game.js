import React, {useEffect, useState} from 'react';
import {COUNTRIES} from "./Countries";
import {Button, Form} from "react-bootstrap";
import './Game.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WorldMap from "react-svg-worldmap";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function Game() {
    const [countriesList, setCountriesList] = useState([...COUNTRIES])
    const [enteredCapital, setEnteredCapital] = useState('');
    const [currentCapitalIndex, setCurrentCapitalIndex] = useState(0);
    const [placeHolderText, setPlaceHolderText] = useState('');
    const [guessCounter, setGuessCounter] = useState(3);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCurrentCapitalIndex(getRandomInt(countriesList.length-1));
    }, [countriesList])

    useEffect(() => {
        setLoading(false);
    }, [currentCapitalIndex])

    const enteredCapitalChangeHandler = (event) => {
        setEnteredCapital(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (enteredCapital.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === countriesList[currentCapitalIndex]?.capital.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
            setPlaceHolderText('Nice Work! The capital of ' + countriesList[currentCapitalIndex]?.name + ' is ' + countriesList[currentCapitalIndex]?.capital + '.');
            setEnteredCapital('');
            setScore(oldScore=> oldScore+guessCounter);
            nextCountry();
        } else {
            if (guessCounter > 1) {
                console.log(countriesList[currentCapitalIndex]?.capital.toLowerCase())
                setEnteredCapital('');
                const guessesLeft = guessCounter - 1
                setGuessCounter(guessesLeft);
                setPlaceHolderText(`Try Again, you have ${guessesLeft} guess(es) left.`)
            } else {
                setEnteredCapital('');
                setPlaceHolderText('Sorry, no more guesses left, the capital of ' + countriesList[currentCapitalIndex]?.name + ' is ' + countriesList[currentCapitalIndex]?.capital + '.')
                nextCountry();
            }
        }
    };

    const removeCountryFromList = () => {
        setCountriesList(oldList => {
            setLoading(true);
            return oldList.filter(country => country.name !== countriesList[currentCapitalIndex]?.name);
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
        setPlaceHolderText('The capital of ' + countriesList[currentCapitalIndex]?.name + ' is ' + countriesList[currentCapitalIndex]?.capital + '.')
    }
    let data = [];
    if(countriesList[currentCapitalIndex] && !loading){
        data = [
            { country: countriesList[currentCapitalIndex]?.code , value: 1389618778 }, // china
        ];
    }


    return (
        <>
            <Form onSubmit={submitHandler}>
                {countriesList.length > 0 && <Form.Group className="mb-3 input-field" controlId="formBasicText">
                    <Form.Label>What is the capital of {countriesList[currentCapitalIndex]?.name} </Form.Label>
                    <Form.Control type="text" placeholder='Enter guess' value={enteredCapital}
                                  onChange={enteredCapitalChangeHandler}/>
                    <Form.Text className="text-muted">{placeHolderText}</Form.Text>
                </Form.Group> }
                {countriesList.length === 0 && <Form.Group className="mb-3 input-field" controlId="formBasicText">
                    <Form.Text className="text-muted">That's all da countries</Form.Text>
                </Form.Group> }
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
                data={data}
                richInteraction
            />
        </>

    );
}

export default Game;