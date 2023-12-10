import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

function IngredientPostCard({
	ingredient,
	postIsFavorited,
	handleToggleFavorite,
}) {
	const loggedIn = localStorage.getItem("authenticated");

	return (
		<div className="border mb-3 p-3 text-start d-flex">
			<div className="flex-grow-1">
				<Link
					to={`/details?identifier=${ingredient.ingredient_id}`}
					className="no-decoration"
				>
					{ingredient.ingredient_photo && (
						<img
							src={ingredient.ingredient_photo}
							alt={ingredient.ingredient_name}
							style={{ maxWidth: "100px" }}
						/>
					)}
					<h4>{ingredient.ingredient_name}</h4>
					<h5>Available at:</h5>
					<p className="m-0">
						<strong>Location:</strong>{" "}
						{ingredient.location.location_name}
					</p>
					<p className="m-0">
						<strong>Address:</strong> {ingredient.location.address},{" "}
						{ingredient.location.city}, {ingredient.location.state},{" "}
						{ingredient.location.country},{" "}
						{ingredient.location.postal_code}
					</p>
				</Link>
			</div>
			{loggedIn && (
				<div
					className="d-flex flex-column align-items-center justify-content-center"
					style={{ width: "100px" }}
				>
					<button
						className="btn"
						type="button"
						onClick={() => {
							handleToggleFavorite(ingredient.post_id);
						}}
					>
						{postIsFavorited ? (
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
export default IngredientPostCard;
