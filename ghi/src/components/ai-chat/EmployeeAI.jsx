import React, { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const EmployeeAI = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const exampleQuestions = [
        "How much dry wall do I need for a room 10x8x12?",
        "How many gallons of paint would I need for a room X size?",
        "How long would it take to make x, y, or z?"
    ];

    const randomExample = exampleQuestions[Math.floor(Math.random() * exampleQuestions.length)];

    const handleAsk = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://us-central1-fjz-llc.cloudfunctions.net/askOpenAI', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: question }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            setAnswer(data.answer);
            setQuestion(''); // Reset the question after submission
        } catch (error) {
            console.error("Error asking OpenAI:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 p-4">
            <h2 className="text-2xl mb-4 dark:text-gray-200">Hello! I'm  your personal assistant. <br />Ask me anything!</h2>
            <div className="overflow-y-auto p-4 space-y-4">
                {question && <div className="bg-blue-500 text-white max-w-md rounded p-2 self-end">{question}</div>}
                {answer && <div className="bg-green-500 text-white max-w-md rounded p-2 self-start">{answer}</div>}
                {loading && <AiOutlineLoading3Quarters className="animate-spin self-center text-xl text-blue-500 dark:text-gray-300" />}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-40">Ask any question for an instant response. Example: "{randomExample}"</p>
            <div className="mt-4 border-t-2 border-gray-200 dark:border-gray-700 pt-4">
                <input
                    className="border rounded w-full p-2 mb-2 dark:bg-gray-700 dark:text-gray-300 pt-4 pb-4"
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Ask your question here..."
                />
                <button
                    className="bg-blue-500 text-white rounded w-full py-2 dark:bg-blue-600"
                    onClick={handleAsk}
                    disabled={loading || !question}
                >
                    Ask
                </button>
            </div>
        </div>
    );
}

export default EmployeeAI;
