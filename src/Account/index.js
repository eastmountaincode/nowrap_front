import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import axios from "axios";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IngredientPostModule from "../IngredientPostModule";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";



function Account() {

	const [authenticated, setAuthenticated] = useState(false);
	const [username, setUsername] = useState("");
	const [userid, setUserID] = useState("");
	const [useremail, setEmail] = useState("");
	const [userfirstname, setFirstName] = useState("");
	const [userlastname, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [userPhoto, setUserPhoto] = useState(null);
	const [userrole, setUserRole] = useState('');
	const [businessLocationId, setBusinessLocationId] = useState('');

	const [editView, setEditView] = useState(false);

	const [userFavoritesPosts, setUserFavoritesPosts] = useState([]);
	const [favoritePostIsFavoritedMap, setFavoritePostIsFavoritedMap] = useState(new Map());

	const [userPosts, setUserPosts] = useState([]);
	const [userPostsFavoriteMap, setUserPostsFavoriteMap] = useState(new Map());

	const [businessPosts, setBusinessPosts] = useState([]);
	const [businessPostsFavoritedMap, setBusinessPostsFavoritedMap] = useState(new Map());


	const SERVER_URL = process.env.REACT_APP_SERVER_URL;
	const navigate = useNavigate();

	const { updateUser } = useContext(UserContext);

	const handleLogin = async () => {
		try {
			const response = await fetch(`${SERVER_URL}/login`, {
				method: "POST",
				body: JSON.stringify({ username, password }),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				// Pull user data
				const userDataFetch = await fetch(
					`${SERVER_URL}/api/users/details?username=${username}`
				);
				const userData = await userDataFetch.json();

				// update context
				updateUser({
					loggedIn: true,
					username: username,
					userPhoto: userData.photo,
				});

				console.log('userData', userData);

				// Login successful
				setAuthenticated(true);
				setUsername(username);
				setUserID(userData._id);
				setEmail(userData.email);
				setFirstName(userData.first_name);
				setLastName(userData.last_name);
				setUserPhoto(userData.photo);
				setUserRole(userData.role);

				if (userData.role === 'business') {
					console.log('location id222:', userData.location_id);
					setBusinessLocationId(userData.location_id);
					localStorage.setItem("location_id", userData.location_id);
				}

				localStorage.setItem("authenticated", "true");
				localStorage.setItem("username", username);
				localStorage.setItem("userid", userData._id);
				localStorage.setItem("useremail", userData.email);
				localStorage.setItem("userfirstname", userData.first_name);
				localStorage.setItem("userlastname", userData.last_name);
				localStorage.setItem("userphoto", userData.photo);
				localStorage.setItem('userrole', userData.role);

				// Redirect to previous page after successful login
				const redirectPath =
					localStorage.getItem("redirectPath") || "/";
				console.log("redirectPath", redirectPath);
				navigate(redirectPath);
				localStorage.removeItem("redirectPath");

				// Update authentication state
			} else {
				setError("Username or password is incorrect");
				console.error("Login failed");
			}
		} catch (error) {
			// Handle unexpected errors, e.g., network issues, server unavailability
			setError(
				"An error occurred while logging in. Please try again later."
			);
			console.error("Error during login:", error);
		}
	};

	useEffect(() => {
		const isAuthenticated =
			localStorage.getItem("authenticated") === "true";
		const retrieveUserID = localStorage.getItem("userid") || "";
		const retrieveUsername = localStorage.getItem("username") || "";
		const retrieveUserEmail = localStorage.getItem("useremail") || "";
		const retrieveUserFirstName =
			localStorage.getItem("userfirstname") || "";
		const retrieveUserLastName = localStorage.getItem("userlastname") || "";
		const retrieveUserPhoto = localStorage.getItem("userphoto") || null;
		const retrieveUserRole = localStorage.getItem('userrole') || '';
		const retrieveBusinessLocationId = localStorage.getItem('location_id') || '';

		setAuthenticated(isAuthenticated);
		setUserID(retrieveUserID);
		setUsername(retrieveUsername);
		setEmail(retrieveUserEmail);
		setFirstName(retrieveUserFirstName);
		setLastName(retrieveUserLastName);
		setUserPhoto(retrieveUserPhoto);
		setUserRole(retrieveUserRole);
		setBusinessLocationId(retrieveBusinessLocationId);
	}, []);

	const handleLogout = () => {
		// Clear authentication data from localStorage
		localStorage.removeItem("authenticated");
		localStorage.removeItem("userid");
		localStorage.removeItem("username");
		localStorage.removeItem("useremail");
		localStorage.removeItem("userfirstname");
		localStorage.removeItem("userlastname");
		localStorage.removeItem("userphoto");
		localStorage.removeItem('userrole');
		localStorage.removeItem('location_id')

		// Update context to reflect logout
		updateUser({
			loggedIn: false,
			username: '',
			userPhoto: '',
		});

		// Update state to reflect logout
		setAuthenticated(false);
		setUserID("");
		setUsername("");
		setEmail("");
		setFirstName("");
		setLastName("");
		setUserPhoto(null);
		setUserRole('');
		setBusinessLocationId('');
	};

	useEffect(() => {
		const fetchFavoritesAndUserPosts = async () => {
			if (!authenticated) {
				setUserFavoritesPosts([]);
				setUserPosts([]);
				setFavoritePostIsFavoritedMap(new Map());
				setUserPostsFavoriteMap(new Map());
				setBusinessPosts([]);
				setBusinessPostsFavoritedMap(new Map());
				return;
			}

			console.log('User ID from URL:', userid);

			try {
				// Fetch Favorites
				const favoritesResponse = await axios.get(`${SERVER_URL}/api/favorites?username=${username}`);
				const favoritesData = favoritesResponse.data;
				setUserFavoritesPosts(favoritesData);

				// Create a map of favorited post IDs
				const favoritesMap = new Map(favoritesData.map((item) => [item.ingredientPostId, true]));
				setFavoritePostIsFavoritedMap(favoritesMap);

				// Fetch User Posts
				const postsResponse = await axios.get(`${SERVER_URL}/api/user_posts/${userid}`);
				const postsData = postsResponse.data;
				//console.log('user posts:', postsData);

				// Update each user post with favorite status
				const updatedPosts = postsData.map(post => ({
					...post,
					isFavorited: favoritesMap.has(post.ingredientPostId) // Adjusted to use ingredientPostId
				}));

				setUserPosts(updatedPosts);
				const userPostsFavoriteMap = new Map(updatedPosts.map(post => [post.ingredientPostId, post.isFavorited]));
				setUserPostsFavoriteMap(userPostsFavoriteMap);

				if (userrole === 'business') {

					// Fetch Business Posts
					// Replace 'locationId' with the actual location ID you want to query
					console.log('business location id:', businessLocationId);
					const businessPostsResponse = await axios.get(`${SERVER_URL}/api/ingredient_posts/location/${businessLocationId}`);
					const businessPostsData = businessPostsResponse.data;

					// Update each business post with favorite status
					const updatedBusinessPosts = businessPostsData.map(post => ({
						...post,
						isFavorited: favoritesMap.has(post.ingredientPostId)
					}));

					setBusinessPosts(updatedBusinessPosts);
					const businessPostsFavoritedMap = new Map(updatedBusinessPosts.map(post => [post.ingredientPostId, post.isFavorited]));
					setBusinessPostsFavoritedMap(businessPostsFavoritedMap);

				}

			} catch (error) {
				const errorMsg = error.response ? error.response.data : error.message;
				console.error("Error fetching data:", errorMsg);
			}
		};

		fetchFavoritesAndUserPosts();
	}, [authenticated]);




	const handleEditButton = () => {
		setEditView(true);
	};

	const handleSaveChanges = async () => {
		try {
			console.log('handle save user id', userid);
			const response = await fetch(`${SERVER_URL}/api/users/details/${userid}`, {
				method: 'PUT',
				body: JSON.stringify({
					username,
					email: useremail,
					first_name: userfirstname,
					last_name: userlastname,
					role: userrole
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 200) {
				console.log('User information updated successfully');
				setEditView(false); // Exit edit mode on successful update

				// Update context with new user data
				updateUser({
					loggedIn: true,
					username: username,
					userPhoto: userPhoto,
				});

				localStorage.setItem('username', username);
				localStorage.setItem('useremail', useremail);
				localStorage.setItem('userfirstname', userfirstname);
				localStorage.setItem('userlastname', userlastname);
				localStorage.setItem('userrole', userrole);
			} else if (response.status === 404) {
				console.error('User not found');
				// You may want to inform the user that their record was not found
			} else {
				console.error('Failed to update user information:', response.statusText);
				// Handle other error cases as needed
			}
		} catch (error) {
			console.error('Error during information update:', error);
			// Handle network errors, server unavailability, etc.
		}
	};


	const handleCancelEdit = () => {
		setEditView(false);
	};

	if (authenticated) {
		return (
			<div className="user-page nw-login-format">
				<h2>Hello, {userfirstname}!</h2>
				{editView ? (
					<div className="container">
						<div className="row zw-account-format">
							<div className="col">
								<input
									type="text"
									className="form-control"
									value={username}
									placeholder="Username*"
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
						</div>
						<div className="row zw-account-format">
							<div className="col">
								<input
									type="text"
									className="form-control"
									value={useremail}
									placeholder="Email*"
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>
						<div className="row zw-account-format">
							<div className="col">
								<input
									type="text"
									className="form-control"
									value={userfirstname}
									placeholder="First Name"
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</div>
						</div>
						<div className="row zw-account-format">
							<div className="col">
								<input
									type="text"
									className="form-control"
									value={userlastname}
									placeholder="Last Name"
									onChange={(e) => setLastName(e.target.value)}
								/>
							</div>
						</div>
						{/* eliminate editing user role*/}
						{/* <div className="row zw-account-format">
							<div className="col text-center" style={{ display: 'flex', alignItems: 'center' }}>
								<select
									name="role"
									className="form-select"
									value={userrole}
									onChange={(e) => setUserRole(e.target.value)}
									required
								>
									<option value="user">User</option>
									<option value="business">Business</option>
								</select>
							</div>
						</div> */}
						<div>
							<button type="button" className="btn btn-danger" onClick={handleCancelEdit} style={{ marginRight: '1px' }}>
								Cancel
							</button>
							<button type="button" className="btn btn-primary" onClick={handleSaveChanges} style={{ marginLeft: '1px' }}>
								Save
							</button>
						</div>
					</div>
				) : (
					<div>
						{userPhoto && <img className="mb-2" src={userPhoto} alt="User Avatar" style={{ maxHeight: '300px', maxWidth: '300px', height: 'auto', width: 'auto' }} />} {/* Display user photo if available */}
						<p>Username: {username}</p>
						<p>Email: {useremail}</p>
						<p>Full Name: {userfirstname + " " + userlastname}</p>
						<p>User ID: {userid}</p>
						<p>Role: {userrole}</p>
						<div>
							<button type="button" className="btn btn-warning" onClick={handleEditButton} style={{ marginBottom: '5px', width: '225px', color: 'white' }}>
								Edit Personal Information
							</button>
						</div>
						<div>
							<button type="button" className="btn btn-danger" onClick={handleLogout} style={{ width: '225px' }}>
								Logout
							</button>
						</div>
						<div className="admin_button mt-2">
							{userrole === 'admin' && (
								<div>
									<button type="button" className="btn btn-primary" onClick={() => { window.location.href = '/admin' }} style={{ marginBottom: '5px', width: '225px' }}>
										Go to Database Admin
									</button>
								</div>
							)}
						</div>

						<div className="mt-5">
							<h3>My favorites:</h3>

							<ul className='list-unstyled'>
								{userFavoritesPosts.map((ingredientPost) => (
									<li key={ingredientPost.ingredient._id} className='mb-1 text-start'>
										<IngredientPostModule
											ingredientPost={ingredientPost}
											postIsFavoritedVar={favoritePostIsFavoritedMap.get(ingredientPost.ingredientPostId)}></IngredientPostModule>
									</li>
								))}
							</ul>

							<h3>My posts:</h3>
							<ul className='list-unstyled'>
								{userPosts.map((ingredientPost) => (
									<li key={ingredientPost.ingredient._id} className='mb-1 text-start'>
										<IngredientPostModule
											ingredientPost={ingredientPost}
											postIsFavoritedVar={userPostsFavoriteMap.get(ingredientPost.ingredientPostId)}></IngredientPostModule>
									</li>
								))}
							</ul>

							{userrole === "business" && (
								<div>
									<h3>Posts associated with my business:</h3>
									<ul className='list-unstyled'>
										{businessPosts.map((ingredientPost) => (
											<li key={ingredientPost.ingredient._id} className='mb-1 text-start'>
												<IngredientPostModule
													ingredientPost={ingredientPost}
													postIsFavoritedVar={businessPostsFavoritedMap.get(ingredientPost.ingredientPostId)}></IngredientPostModule>
											</li>
										))}
									</ul>
								</div>
							)}


						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="nw-login-format">
			<h2>Log in to your no-wrap account!</h2>
			<h5>
				Don't have an account yet?{" "}
				<Link to="/AccountRegistration">Register here</Link>
			</h5>
			{error && <div className="alert alert-danger">{error}</div>}
			<div className="container">
				<div className="row zw-account-format">
					<div className="col">
						<input
							type="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="form-control"
							placeholder="Username"
							required
						/>
					</div>
				</div>
				<div className="row zw-account-format">
					<div className="col">
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="form-control"
							id="login-password"
							placeholder="Password"
							required
						/>
					</div>
				</div>
				<div className="row">
					<div className="col zw-cancel-button-format">
						<Link to="/">
							<button type="button" className="btn btn-light">
								Cancel
							</button>
						</Link>
					</div>
					<div className="col zw-submit-button-format">
						<button
							type="button"
							className="btn btn-info"
							onClick={handleLogin}
						>
							Log In
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Account;
