import React, { useState } from 'react';

const EmployeeAI = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleAsk = async () => {
        try {
            const response = await fetch('YOUR_SERVER_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: question }),
            });
            const data = await response.json();
            setAnswer(data.answer);
        } catch (error) {
            console.error("Error asking OpenAI:", error);
        }
    };

    return (
        <div>
            <h2>Ask Employee AI</h2>
            <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask your question here..."
            />
            <button onClick={handleAsk}>Ask</button>
            <div>
                <h3>Answer:</h3>
                <p>{answer}</p>
            </div>
        </div>
    );
}

export default EmployeeAI;
