import './Quiz.css';
import React, { useEffect, useRef, useState } from 'react';
import { data } from '../../assets/data';

const Quiz = () => {
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(data[0]);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [timer, setTimer] = useState(15);
    const timerRef = useRef(null);

    const Option1 = useRef(null);
    const Option2 = useRef(null);
    const Option3 = useRef(null);
    const Option4 = useRef(null);

    const option_array = [Option1, Option2, Option3, Option4];

    const checkAns = (e, ans) => {
        if (!lock) {
            if (question.ans === ans) {
                e.target.classList.add('correct');
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add('wrong');
                option_array[question.ans - 1].current.classList.add('correct');
            }
            setLock(true);
        }
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, []);

    const next = () => {
        if (lock) {
            clearInterval(timerRef.current);
            setTimer(15);
            startTimer(15);
            setIndex(prevIndex => {
                const newIndex = prevIndex + 1;
                if (newIndex < data.length) {
                    setQuestion(data[newIndex]);
                    resetOptions();
                    setLock(false);
                } else {
                    setQuizFinished(true);
                    setTimer(0); 
                }
                return newIndex;
            });
        }
    };

    const resetOptions = () => {
        option_array.forEach(option => {
            if (option.current) {
                option.current.classList.remove('correct', 'wrong');
            }
        });
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    clearInterval(timerRef.current);
                    autoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const autoSubmit = () => {
        setLock(true);
        option_array[question.ans - 1].current.classList.add('correct');
    };

    const restartQuiz = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setLock(false);
        setQuizFinished(false);
        resetOptions();
        setTimer(15); 
        startTimer(); 
    };

    useEffect(() => {
        if (quizFinished) {

            const timerId = setTimeout(() => {
                restartQuiz();
            }, 2000);
            return () => clearTimeout(timerId);
        }
    }, [quizFinished]);

    return (
        <div className="container">
            <div className="timer">Kalan Süre: {timer} saniye</div>

            <h1>Quiz App</h1>
            <hr />
            {quizFinished ? (
                <div className="end-quiz">
                    <h2 className="end-text">Quiz Bitti! 🎉</h2>
                    <p className="end-score">Skorunuz: {score} / {data.length}</p>
                    <button onClick={restartQuiz} className="end-btn">Tekrar Başlat</button>
                </div>
            ) : (
                <div>
                    <h2 className="questions">{index + 1}. {question.question}</h2>
                    <ul>
                        <li ref={Option1} onClick={e => checkAns(e, 1)}>{question.option1}</li>
                        <li ref={Option2} onClick={e => checkAns(e, 2)}>{question.option2}</li>
                        <li ref={Option3} onClick={e => checkAns(e, 3)}>{question.option3}</li>
                        <li ref={Option4} onClick={e => checkAns(e, 4)}>{question.option4}</li>
                    </ul>
                    <button onClick={next}>Next</button>
                    <div className="index">
                        {index + 1} of {data.length} questions
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
