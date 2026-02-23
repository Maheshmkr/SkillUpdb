import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Clock, Award } from 'lucide-react';

const QuizAttempt = ({ quiz, onFinish }) => {
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const questions = quiz.questions || [];
    const currentQ = questions[currentQuestion];

    const handleSelect = (optionIndex) => {
        setAnswers({ ...answers, [currentQuestion]: optionIndex });
    };

    const handleSubmit = () => {
        const correctCount = questions.reduce((acc, q, idx) => {
            return acc + (answers[idx] === q.correctAnswer ? 1 : 0);
        }, 0);

        const scorePercentage = Math.round((correctCount / questions.length) * 100);
        const isPassed = scorePercentage >= (quiz.passPercentage || 80);

        setIsSubmitted(true);
        onFinish({ scorePercentage, isPassed });
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{quiz.title}</h2>
                    <p className="text-gray-500 text-sm">Pass Threshold: {quiz.passPercentage || 80}%</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Question {currentQuestion + 1} of {questions.length}</p>
                </div>
            </div>

            <div className="mb-10">
                <h3 className="text-xl font-medium text-gray-800 mb-6">{currentQ.questionText}</h3>
                <div className="space-y-3">
                    {currentQ.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            className={`w-full p-4 text-left border rounded-lg transition-all ${answers[currentQuestion] === idx
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-blue-400 text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion] === idx ? 'border-blue-600' : 'border-gray-300'
                                    }`}>
                                    {answers[currentQuestion] === idx && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                <span>{option}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <button
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 text-gray-500 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={20} /> Previous
                </button>

                {currentQuestion === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < questions.length}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-gray-400"
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                        className="flex items-center gap-2 text-blue-600 font-bold"
                    >
                        Next <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

const QuizResult = ({ result, onRetry, onContinue }) => {
    const { scorePercentage, isPassed } = result;

    return (
        <div className="max-w-2xl mx-auto py-16 px-10 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
            <div className="mb-8 flex justify-center">
                {isPassed ? (
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle size={64} />
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                        <XCircle size={64} />
                    </div>
                )}
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                {isPassed ? 'Congratulations!' : 'Keep Trying!'}
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                {isPassed
                    ? "You've successfully passed this module quiz! You can now move on to the next module."
                    : "You didn't reach the required percentage to pass this module. Review the material and try again."}
            </p>

            <div className="flex justify-center gap-8 mb-10">
                <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Score</p>
                    <p className={`text-4xl font-black ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                        {scorePercentage}%
                    </p>
                </div>
                <div className="w-px bg-gray-200 h-16" />
                <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pass Score</p>
                    <p className="text-4xl font-black text-gray-900">80%</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {isPassed ? (
                    <button
                        onClick={onContinue}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        Continue to Next Module
                    </button>
                ) : (
                    <button
                        onClick={onRetry}
                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200"
                    >
                        Retry Quiz
                    </button>
                )}
                <button
                    onClick={() => window.location.reload()}
                    className="text-gray-500 text-sm font-bold hover:text-gray-900 transition-colors"
                >
                    Review Lesson Material
                </button>
            </div>
        </div>
    );
};

export { QuizAttempt, QuizResult };
