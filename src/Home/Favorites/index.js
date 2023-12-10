import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import IngredientPostModule from "../../IngredientPostModule";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

function Favorites() {
	const SERVER_URL = process.env.REACT_APP_SERVER_URL;
	const username = localStorage.getItem("username");
	const { user } = useContext(UserContext);

	const [userFavoritesPosts, setUserFavoritesPosts] = useState([]);
	const [postIsFavorited, setPostIsFavorited] = useState(new Map());

	useEffect(() => {
		if (user.loggedIn) {

			const fetchFavorites = async () => {
				try {
					const response = await axios.get(
						`${SERVER_URL}/api/favorites?username=${username}`
					);
					const data = response.data;
					setUserFavoritesPosts(data.reverse());
					const favoritesMap = new Map(
						data.map((item) => [item.ingredientPostId, true])
					);
					setPostIsFavorited(favoritesMap);
				} catch (error) {
					const errorMsg = error.response
						? error.response.data
						: error.message;
					console.error("Error fetching favorites:", errorMsg);
				}
			};

			fetchFavorites();
		} else {
			setUserFavoritesPosts([])
			setPostIsFavorited(new Map());
		}
	}, [user.loggedIn]);

	return (
		<>
			<ul className='list-unstyled'>
				{userFavoritesPosts.map((ingredientPost) => (
					<li key={ingredientPost.ingredient._id} className='mb-1 text-start'>
						<IngredientPostModule
							ingredientPost={ingredientPost}
							postIsFavoritedVar={postIsFavorited.get(ingredientPost.ingredientPostId)}></IngredientPostModule>
					</li>
				))}
			</ul>
			{userFavoritesPosts.length === 0 && <p>No favorites found!</p>}
		</>
	);
}
export default Favorites;
