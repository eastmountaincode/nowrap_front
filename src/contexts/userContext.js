import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        loggedIn: false,
        username: '',
        userPhoto: ''
    });

    // Function to update user information
    const updateUser = (userData) => {
        localStorage.setItem('authenticated', userData.loggedIn ? "true" : "false");
        localStorage.setItem('username', userData.username || '');
        localStorage.setItem('userphoto', userData.userPhoto || '');

        setUser({
            loggedIn: userData.loggedIn,
            username: userData.username,
            userPhoto: userData.userPhoto
        });
    };

    // Effect to initialize user state from localStorage
    useEffect(() => {
        setUser({
            loggedIn: localStorage.getItem("authenticated") === "true",
            username: localStorage.getItem("username"),
            userPhoto: localStorage.getItem("userphoto")
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
