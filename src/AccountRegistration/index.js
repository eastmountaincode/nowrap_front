import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import MapSearch from "./MapSearch";

function AccountRegistration() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        photo: '',
        role: 'user',
        location: '',
    });

    const [locationData, setLocationData] = useState({
        location_name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        coordinates: "",
    });

    const [error, setError] = useState(null); // Error state
    const [isRegistered, setIsRegistered] = useState(false); // Flag to indicate successful registration
    const [locations, setLocations] = useState([]);


    const { username, password, email, first_name, last_name, photo, role, location } = formData;

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

    const inputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const photoChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, photo: file });
    };

    const registerLocation = async () => {
        if (locationData.address === "") {
            return;
        }
        try {
            const response = await fetch(`${SERVER_URL}/add_location`, {
                method: "POST",
                body: JSON.stringify(locationData),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log("Location added successfully!");
                return responseData.location_id; // Return the location ID

            } else {
                // Handle server response with non-2xx status code
                const errorResponse = await response.json();
                console.error("Error adding location:", errorResponse);
            }
        } catch (error) {
            console.error("Error submitting form for location:", error);
        }
    };

    const isNotEmpty = (value) => {
        return value.trim() !== '';
    };

    const isFormValid = () => {
        return isNotEmpty(username) && isNotEmpty(password) && isNotEmpty(email);
    };

    const registerUser = async () => {
        console.log('Register button clicked.');

        if (!isFormValid()) {
            setError('Please fill in all the required fields.');
            return;
        }
        // First register the location
        const locationId = await registerLocation();
        if (locationId === null) {
            setError('Failed to register location');
            return;
        }

        // Use FormData to handle file uploads
        const formDataToSend = new FormData();
        formDataToSend.append('username', username);
        formDataToSend.append('password', password);
        formDataToSend.append('email', email);
        formDataToSend.append('first_name', first_name);
        formDataToSend.append('last_name', last_name);
        formDataToSend.append('role', role);
        formDataToSend.append('location_id', locationId);

        // Only append photo if it is available
        if (photo) {
            formDataToSend.append('photo', photo);
        }

        console.log('about to send data', formDataToSend);
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch(`${SERVER_URL}/api/users/register_account`, {
                method: 'POST',
                body: formDataToSend, // Send the FormData object
                // Do not set Content-Type header, the browser will set it with the correct boundary
                headers: {
                    'Accept': 'application/json',
                }
            });

            const responseData = await response.json(); // Parse the JSON response

            if (response.status === 201) {
                console.log('User registered successfully', responseData);
                setIsRegistered(true);
                setError(null);

                window.location.href = '/account';
            } else {
                console.error('Registration failed', responseData);
                if (response.status === 400) {
                    setError(responseData.message);
                } else {
                    setError("Registration failed. Please check your information and try again.");
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setError('An error occurred');
        }
    };


    return (
        <div className="w-100">
            <h2>Create your no-wrap account!</h2>
            <h5>Already have an account? <Link to="/account">Log in here</Link></h5>
            {formSubmitted && !username && !password && !email && <div className="alert alert-danger">Please fill out all required fields (*)</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="container">
                <div className="row zw-account-format">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            id="registration-username"
                            name="username"
                            value={username}
                            onChange={inputChange}
                            placeholder="Username*"
                            required
                        />
                    </div>
                </div>

                <div className="row zw-account-format">
                    <div className="col">
                        <input
                            type="password"
                            className="form-control"
                            id="registration-password"
                            name="password"
                            value={password}
                            onChange={inputChange}
                            placeholder="Password*"
                            required
                        />
                    </div>
                </div>
                <div className="row zw-account-format">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            id="registration-email"
                            name="email"
                            value={email}
                            onChange={inputChange}
                            placeholder="Email*"
                            required
                        />
                    </div>
                </div>
                <div className="row zw-account-format">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            id="registration-first-name"
                            name="first_name"
                            value={first_name}
                            onChange={inputChange}
                            placeholder="First Name" />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            id="registration-last-name"
                            name="last_name"
                            value={last_name}
                            onChange={inputChange}
                            placeholder="Last Name" />
                    </div>
                </div>
                <div className="row">
                    <div className="col zw-upload-title-format">
                        <label className="form-label" htmlFor="customFile">Upload your avatar:</label>
                    </div>
                </div>
                <div className="row zw-account-format">
                    <div className="col">
                        <input
                            type="file"
                            className="form-control"
                            id="customFile"
                            name="photo"
                            accept="image/*"
                            onChange={photoChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col zw-upload-title-format">
                        <label className="form-label" htmlFor="customFile">Role:</label>
                    </div>
                </div>
                <div className="row zw-account-format">
                    <select
                        name="role"
                        className="form-select"
                        value={role}
                        onChange={inputChange}
                        required
                    >
                        <option value="user">User</option>
                        <option value="business">Business</option>
                    </select>
                </div>
                {role === 'business' && (
                    <div className="location mb-5">
                        <div id="locationAlert"></div>
                        <MapSearch
                            locationData={locationData}
                            setLocationData={setLocationData}
                        />
                    </div>
                )}
                <div className="row justify-content-between">
                    <div className="col zw-cancel-button-format">
                        <Link to="/">
                            <button
                                type="button"
                                className="btn btn-light">
                                Cancel
                            </button>
                        </Link>
                    </div>
                    <div className="col zw-submit-button-format">
                        <button
                            type="button"
                            className="btn btn-info"
                            onClick={registerUser}
                        >
                            Register
                        </button>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountRegistration;