import React, { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // for the spinner

const EmployeeAI = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

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
        } catch (error) {
            console.error("Error asking OpenAI:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 p-4">
            <h2 className="text-2xl mb-4">Ask Employee AI</h2>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {question && <div className="bg-blue-500 text-white max-w-md rounded p-2 self-end">{question}</div>}
                {answer && <div className="bg-green-500 text-white max-w-md rounded p-2 self-start">{answer}</div>}
                {loading && <AiOutlineLoading3Quarters className="animate-spin self-center text-xl text-blue-500" />}
            </div>
            <div className="mt-4 border-t-2 border-gray-200 pt-4">
                <input
                    className="border rounded w-full p-2 mb-2"
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Ask your question here..."
                />
                <button
                    className="bg-blue-500 text-white rounded w-full py-2"
                    onClick={handleAsk}
                    disabled={loading}
                >
                    Ask
                </button>
            </div>
        </div>
    );
}

export default EmployeeAI;
