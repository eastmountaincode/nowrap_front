import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';
import IngredientPostModule from '../IngredientPostModule'

function OtherPersonsAccountPage() {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const { user } = useContext(UserContext);

    const [userPosts, setUserPosts] = useState([]);
    const [userPostsFavoriteMap, setUserPostsFavoriteMap] = useState(new Map());

    const [otherUsersFavoritesPosts, setOtherUsersFavoritesPosts] = useState([]);
    const [otherUsersFavoritesPostsFavoriteMap, setOtherUsersFavoritesPostsFavoriteMap] = useState(new Map());

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        console.log('User ID from URL params:', userId); // Log the User ID

        const fetchUserData = async () => {
            const url = `${SERVER_URL}/api/users/details?userId=${userId}`;
            //console.log('Fetching data from:', url); // Log the fetch URL

            try {
                const userResponse = await fetch(url);
                if (!userResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const userDetails = await userResponse.json();
                console.log('User Details:', userDetails); // Log the fetched user details
                setUserData(userDetails);
            } catch (error) {
                console.error("There was an error fetching user details:", error);
            }

            // Fetch posts made by the user
            try {
                const postsResponse = await fetch(`${SERVER_URL}/api/user_posts/${userId}`);
                if (!postsResponse.ok) {
                    throw new Error('Failed to fetch user posts');
                }
                const postsData = await postsResponse.json();
                setUserPosts(postsData);
                if (user.loggedIn) {
                    // Get our own favorites data              
                    const favoritesResponse = await axios.get(`${SERVER_URL}/api/favorites?username=${user.username}`);
                    const favoritesData = favoritesResponse.data;
                    const favoritesMap = new Map(favoritesData.map((item) => [item.ingredientPostId, true]));
                    console.log('favorites map:', favoritesMap);
                    setUserPostsFavoriteMap(favoritesMap)

                }

            } catch (error) {
                console.error("There was an error fetching user posts:", error);
            }

            // If admin, fetch the user's favorites too, but get them as posts
            if (user.loggedIn) {
                if (localStorage.getItem('userrole') === 'admin') {
                    const otherUsersUsername = await axios.get(`${SERVER_URL}/api/users/username/${userId}`);
                    const otherUsersFavoritesPostsResponse = await axios.get(`${SERVER_URL}/api/favorites?username=${otherUsersUsername.data.username}`);
                    const otherUsersFavoritesPosts = otherUsersFavoritesPostsResponse.data;
                    setOtherUsersFavoritesPosts(otherUsersFavoritesPosts);

                    // Initialize the map with all results marked as not favorited
                    const initialFavoritesMap = new Map(
                        otherUsersFavoritesPosts.map((post) => [post.ingredientPostId, false])
                    );

                    // get our own favorites
                    const response = await fetch(`${SERVER_URL}/api/favorites?username=${user.username}`);
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const ourOwnFavorites = await response.json();
                    ourOwnFavorites.forEach((favorite) => {
                        if (
                            initialFavoritesMap.has(favorite.ingredientPostId)
                        ) {
                            initialFavoritesMap.set(
                                favorite.ingredientPostId,
                                true
                            );
                        }
                    });
                    setOtherUsersFavoritesPostsFavoriteMap(initialFavoritesMap);

                }
            }
        };

        fetchUserData();
    }, [userId, user.loggedIn]);

    if (!userData) return <p>Loading user data...</p>;

    return (
        <div className='ms-2'>
            <h2>{userData.username}'s Profile</h2>
            {userData.photo && (
                <img
                    src={userData.photo}
                    alt={userData.username}
                    style={{ maxHeight: '300px', maxWidth: '300px', height: 'auto', width: 'auto' }}
                />
            )}
            <h3>User's Posts</h3>
            <ul className='list-unstyled'>
                {userPosts.map((ingredientPost) => (
                    <li key={ingredientPost.ingredient._id} className='mb-1 text-start'>
                        <IngredientPostModule
                            ingredientPost={ingredientPost}
                            postIsFavoritedVar={userPostsFavoriteMap.get(ingredientPost.ingredientPostId)}></IngredientPostModule>
                    </li>
                ))}
            </ul>
            {localStorage.getItem('userrole') === 'admin' && (
                <>
                    <h3>ADMIN VIEW: User's Favorites</h3>
                    <ul>
                        {otherUsersFavoritesPosts.map((ingredientPost) => (
                            <li key={ingredientPost.ingredient._id} className='mb-1 text-start'>
                                <IngredientPostModule
                                    ingredientPost={ingredientPost}
                                    postIsFavoritedVar={otherUsersFavoritesPostsFavoriteMap.get(ingredientPost.ingredientPostId)}
                                />
                            </li>
                        ))}
                    </ul>
                </>
            )}


        </div>
    );

}

export default OtherPersonsAccountPage;

