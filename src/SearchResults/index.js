import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css"
import SearchResultsMap from '../SearchResultsMap';
import "./index.css"
import IngredientPostModule from '../IngredientPostModule';


function SearchResults() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const criteria = searchParams.get('criteria');
    const [view, setView] = useState('list'); // 'list' or 'map'
    
    const [searchResults, setSearchResults] = useState([]);
    const [favoritesMap, setFavoritesMap] = useState(new Map());

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

    // runs this when it mounts
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/search?q=${criteria}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const ingredientPostSearchResults = await response.json();
                setSearchResults(ingredientPostSearchResults);
            } catch (error) {
                console.error("There was an error fetching search results:", error);
            }
        };

        fetchSearchResults();
    }, [criteria]); // This useEffect will re-run whenever `criteria` changes.

    // Fetch favorites if user is authenticated
    useEffect(() => {
        const loggedIn = localStorage.getItem("authenticated") === 'true';
        console.log("logged in?", loggedIn)
        console.log("searchResults?", searchResults);
        if (loggedIn && searchResults.length > 0) {
            const fetchFavorites = async () => {
                try {
                    // Initialize the map with all search results marked as not favorited
                    const initialFavoritesMap = new Map(searchResults.map(result => [result.ingredientPostId, false]));
    
                    const response = await fetch(`${SERVER_URL}/api/favorites?username=${localStorage.getItem("username")}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const userFavorites = await response.json();
                    // Update the map for items that are favorited
                    console.log('user favorites in fetch favorites', userFavorites)

                    userFavorites.forEach(favorite => {
                        if (initialFavoritesMap.has(favorite.ingredientPostId)) {
                            initialFavoritesMap.set(favorite.ingredientPostId, true);
                        }
                    });
                    setFavoritesMap(initialFavoritesMap);
                } catch (error) {
                    console.error("There was an error fetching favorites:", error);
                }
            };
    
            fetchFavorites();
        } else {
            setFavoritesMap(new Map()); // Reset favorites map if not logged in or no search results
        }
    }, [searchResults]);
    

    return (
        <div className='w-100 ps-4 pe-4'>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${view === 'list' ? 'active' : ''}`}
                        onClick={() => setView('list')}
                    >
                        List View
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${view === 'map' ? 'active' : ''}`}
                        onClick={() => setView('map')}
                    >
                        Map View
                    </button>
                </li>
            </ul>

            {view === 'list' ? (
                <ListView searchResults={searchResults} criteria={criteria} favoritesMap={favoritesMap} />
            ) : (
                <MapView results={searchResults} />
            )}
        </div>
    );
}

function ListView({ searchResults, criteria, favoritesMap }) {
    console.log("favorites map in list view", favoritesMap);
    return (
        <div className='p-3'>
            {searchResults.length > 0 ? (
                <>
                    <h3>Search Results for "{criteria}":</h3>
                    <ul className='list-unstyled'>
                        {searchResults.map((ingredientPost) => (
                            <li key={ingredientPost.ingredient._id} className='mb-1 text-start'>
                                <IngredientPostModule 
                                    ingredientPost={ingredientPost} 
                                    postIsFavoritedVar={favoritesMap.get(ingredientPost.ingredientPostId)}></IngredientPostModule>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>No search results found for "{criteria}".</p>
            )}
        </div>
    );
}


function MapView({ results }) {
    return (
        <div>
            <h4>Map</h4>
            <SearchResultsMap results={results} />
        </div>
    );
}

export default SearchResults;

