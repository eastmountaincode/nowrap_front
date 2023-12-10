import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";


function IngredientPostModule( { ingredientPost, postIsFavoritedVar } ) {
	const SERVER_URL = process.env.REACT_APP_SERVER_URL;

	const { user } = useContext(UserContext);

	const postId = ingredientPost.ingredientPostId;

	const [isFavorited, setIsFavorited] = useState(postIsFavoritedVar);

	useEffect(() => {
		setIsFavorited(postIsFavoritedVar);
	}, [postIsFavoritedVar]);

	// console.log("post is favorited?", postIsFavoritedVar)
	// console.log("post is favorited?", isFavorited)
	// console.log("post", ingredientPost.ingredient.ingredient_name);

	const handleFavorite = async (post_id) => {
		try {
			const response = await axios.post(
				`${SERVER_URL}/api/favorites`,
				{
					user_id: localStorage.getItem("userid"),
					post_id: post_id,
				}
			);
			const data = response.data;
			//console.log(data);
			setIsFavorited(!isFavorited);
		} catch (error) {
			const errorMsg = error.response
				? error.response.data
				: error.message;
			console.error("Error fetching favorites:", errorMsg);
		}
	};

	const handleUnfavorite = async (post_id) => {
		try {
			const response = await axios.delete(
				`${SERVER_URL}/api/favorites`,
				{
					data: {
						user_id: localStorage.getItem("userid"),
						post_id: post_id,
					},
				}
			);
			const data = response.data;
			//console.log(data);
			setIsFavorited(!isFavorited);
		} catch (error) {
			const errorMsg = error.response
				? error.response.data
				: error.message;
			console.error("Error fetching favorites:", errorMsg);
		}
	};

	const handleToggleFavorite = async () => {
		console.log("isCurrentlyFavorited", postIsFavoritedVar);
		console.log("post_id", postId);

		try {
			if (isFavorited) {
				await handleUnfavorite(postId);
				console.log("unfavorite!")
			} else {
				await handleFavorite(postId);
				console.log("favorite!")
			}
		} catch (error) {
			console.error("Error toggling favorite:", error);
		}
	};

	return (
		<div className="border mb-3 p-3 text-start d-flex">
			<div className="flex-grow-1">
				<Link
					to={`/details?identifier=${ingredientPost.ingredient._id}`}
					className="no-decoration"
				>
					{ingredientPost.ingredient.photo && (
						<img
							src={ingredientPost.ingredient.photo}
							alt={ingredientPost.ingredient.ingredient_name}
							style={{ maxWidth: "100px" }}
						/>
					)}
					<h4>{ingredientPost.ingredient.ingredient_name}</h4>
					<h5>Available at:</h5>
					<p className="m-0">
						<strong>Location:</strong>{" "}
						{ingredientPost.location.location_name}
					</p>
					<p className="m-0">
						<strong>Address:</strong> {ingredientPost.location.address},{" "}
						{ingredientPost.location.city}, {ingredientPost.location.state},{" "}
						{ingredientPost.location.country},{" "}
						{ingredientPost.location.postal_code}
					</p>
				</Link>
			</div>
			{user.loggedIn && (
				<div
					className="d-flex flex-column align-items-center justify-content-center"
					style={{ width: "100px" }}
				>
					<button
						className="btn"
						type="button"
						onClick={() => {
							handleToggleFavorite();
						}}
					>
						{isFavorited ? (
							<FontAwesomeIcon icon={faStar} color="gold"/>
						) : (
							<FontAwesomeIcon icon={faStarEmpty} />
						)}
					</button>
				</div>
			)}
		</div>
	);
}
export default IngredientPostModule;