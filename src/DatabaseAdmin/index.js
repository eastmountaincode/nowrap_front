import {React, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function DatabaseAdmin() {
    /* useState is initialized with null. data is a variable holding the current data. setSet is a function you can use to update that data state*/
    const [data, setData] = useState(null);
    const [seedMessage, setSeedMessage] = useState(null);
    const [clearMessage, setClearMessage] = useState(null);

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;


    const fetchData = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/fetch-all-data`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const seedDatabase = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/seed-data`);
            if (!response.ok) {
                throw new Error('Failed to seed database');
            }
            const result = await response.json();
            setSeedMessage(result.message);
    
            // Hide the message after 3 seconds
            setTimeout(() => {
                setSeedMessage(null);
            }, 3000);
        } catch (error) {
            console.error('Error seeding data:', error);
            setSeedMessage('Error seeding data. Check the console for more details.');
    
            // Hide the error message after 3 seconds
            setTimeout(() => {
                setSeedMessage(null);
            }, 3000);
        }
    };

    const clearDatabase = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/clear-data`);
            if (!response.ok) {
                throw new Error('Failed to clear database');
            }
            const result = await response.json();
            setClearMessage(result.message);
    
            // Hide the message after 3 seconds
            setTimeout(() => {
                setClearMessage(null);
            }, 3000);
        } catch (error) {
            console.error('Error clearing data:', error);
            setClearMessage('Error clearing data. Check the console for more details.');
    
            // Hide the error message after 3 seconds
            setTimeout(() => {
                setClearMessage(null);
            }, 3000);
        }
    };

    return (
        <div className='w-100'>
            <h2>Database Administration</h2>
            <button onClick={fetchData}>Fetch Data</button>
            <button onClick={seedDatabase} className="ms-3">Seed Data</button>
            <button onClick={clearDatabase} className="ms-3">Clear Data</button>


            {/* Display seed message */}
            {seedMessage && <div className="mt-3">{seedMessage}</div>}

            {/* Display clear database message */}
            {clearMessage && <div className="mt-3">{clearMessage}</div>}

            {/* Display fetched data */}
            <div className='fetched-data-container mt-3' style={{"border": "1px solid red"}}>
                <h3>Fetched data:</h3>
                {data && (
                    <div>
                        <h3>Users</h3>
                        <pre>{JSON.stringify(data.users, null, 2)}</pre>

                        <h3>Ingredient Posts</h3>
                        <pre>{JSON.stringify(data.ingredientPosts, null, 2)}</pre>

                        <h3>Ingredients</h3>
                        <pre>{JSON.stringify(data.ingredients, null, 2)}</pre>

                        <h3>Locations</h3>
                        <pre>{JSON.stringify(data.locations, null, 2)}</pre>

                        <h3>Favorites</h3>
                        <pre>{JSON.stringify(data.favorites, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DatabaseAdmin;