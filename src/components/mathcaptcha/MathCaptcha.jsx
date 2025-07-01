import React, { useState, useEffect } from 'react';

const MathCaptcha = ({ onSuccess, className = '',btnClasses }) => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isValid, setIsValid] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const generateCaptcha = () => {

        const newNum1 = Math.floor(Math.random() * 9) + 1;
        const newNum2 = Math.floor(Math.random() * 9) + 1;

        setNum1(newNum1);
        setNum2(newNum2);
        setUserAnswer('');
        setIsValid(null);
        setShowResult(false);
    };

    const getCorrectAnswer = () => {
        return num1 + num2;
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!userAnswer) return;

        const correctAnswer = getCorrectAnswer();
        const userNum = parseInt(userAnswer);

        if (userNum === correctAnswer) {
            setIsValid(true);
            setShowResult(true);
            onSuccess && onSuccess();
        } else {
            setIsValid(false);
            setAttempts(prev => prev + 1);
            setShowResult(true);
            setTimeout(generateCaptcha, 2000);
        }
    };

    const handleRefresh = () => {
        generateCaptcha();
        setAttempts(0);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    return (
        <div className={`rounded-2xl w-full max-w-md ${className}`}>
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Captcha</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200 text-center">
                <div className="text-3xl font-mono font-bold text-gray-800 mb-2">
                    {num1} + {num2} = ?
                </div>
                <button
                    onClick={handleRefresh}
                    className="text-sm items-center justify-center gap-1 text-blue-600 hover:text-blue-800"
                >
                    🔄 refresh
                </button>
            </div>
            <div className="flex items-center justify-center">
                <div className="space-y-4 w-full max-w-xs text-center">
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-center font-medium"
                        placeholder="Enter your answer"
                        disabled={isValid === true}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={!userAnswer || isValid === true}
                        className={btnClasses}
                    >
                        {isValid === true ? 'Verified!' : 'Verify Answer'}
                    </button>
                </div>
            </div>

            {showResult && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-medium border ${
                    isValid ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                    {isValid ? (
                        <div className="flex items-center text-emerald-600 justify-center">
                            ✅ Correct! Captcha verified.
                        </div>
                    ) : (
                        <div className="flex items-center  text-danger justify-center">
                            ❌ Incorrect. The correct answer was {getCorrectAnswer()}.
                        </div>
                    )}
                </div>
            )}

            {attempts > 0 && (
                <div className="mt-3 text-center text-xs text-gray-500">
                    Attempts: {attempts}
                </div>
            )}
        </div>
    );
};

export default MathCaptcha;