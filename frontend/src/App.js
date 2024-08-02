import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [dropdownSelection, setDropdownSelection] = useState([]);
    const [error, setError] = useState('');
    const registrationNumber = 'RA2111003020042';

    useEffect(() => {
        // Set the document title to the registration number
        document.title = registrationNumber;
    }, []);

    const handleSubmit = async () => {
        try {
            setError('');
            const parsedInput = JSON.parse(jsonInput);
            if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
                throw new Error('Invalid data format');
            }
            const res = await axios.post('http://localhost:3000/bfhl', parsedInput);
            setResponse(res.data);
        } catch (error) {
            console.error('Error:', error);
            setError('Invalid JSON input');
        }
    };

    const handleDropdownChange = (e) => {
        const options = e.target.options;
        const selectedOptions = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedOptions.push(options[i].value);
            }
        }
        setDropdownSelection(selectedOptions);
    };

    const renderResponse = () => {
        if (!response) return null;
        const filteredResponse = {};
        if (dropdownSelection.includes('Alphabets')) filteredResponse.alphabets = response.alphabets;
        if (dropdownSelection.includes('Numbers')) filteredResponse.numbers = response.numbers;
        if (dropdownSelection.includes('Highest alphabet')) filteredResponse.highest_alphabet = response.highest_alphabet;
        return JSON.stringify(filteredResponse, null, 2);
    };

    return (
        <div>
            <h1>{registrationNumber}</h1>
            <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder='Enter JSON' />
            <button onClick={handleSubmit}>Submit</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <select multiple={true} onChange={handleDropdownChange}>
                <option value='Alphabets'>Alphabets</option>
                <option value='Numbers'>Numbers</option>
                <option value='Highest alphabet'>Highest alphabet</option>
            </select>
            <pre>{renderResponse()}</pre>
        </div>
    );
}

export default App;