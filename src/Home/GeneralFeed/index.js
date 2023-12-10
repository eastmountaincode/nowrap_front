import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../Pagination";
import IngredientPostModule from "../../IngredientPostModule";

function GeneralFeed() {
	const loggedIn = localStorage.getItem("authenticated");
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [favoritesMap, setFavoritesMap] = useState(new Map());

	const SERVER_URL = process.env.REACT_APP_SERVER_URL;

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await axios.get(
					`${SERVER_URL}/api/feed?page=${currentPage}&limit=${postsPerPage}`
				);
				setPosts(res.data.data);
				setTotalPages(res.data.totalPages);
			} catch (error) {
				console.error("Error fetching posts", error);
			}
		};

		fetchPosts();
	}, [currentPage]);

	// Fetch favorites if user is authenticated
	useEffect(() => {
		const loggedIn = localStorage.getItem("authenticated") === "true";
		if (loggedIn && posts.length > 0) {
			const fetchFavorites = async () => {
				try {
					// Initialize the map with all search results marked as not favorited
					const initialFavoritesMap = new Map(
						posts.map((post) => [post.ingredientPostId, false])
					);
					//console.log('inital map', initialFavoritesMap);

					const response = await fetch(
						`/api/favorites?username=${localStorage.getItem(
							"username"
						)}`
					);
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					const userFavorites = await response.json();
					// Update the map for items that are favorited
					console.log("favorites", userFavorites);

					userFavorites.forEach((favorite) => {
						if (
							initialFavoritesMap.has(favorite.ingredientPostId)
						) {
							initialFavoritesMap.set(
								favorite.ingredientPostId,
								true
							);
						}
					});
					setFavoritesMap(initialFavoritesMap);
				} catch (error) {
					console.error(
						"There was an error fetching favorites:",
						error
					);
				}
			};

			fetchFavorites();
		} else {
			setFavoritesMap(new Map()); // Reset favorites map if not logged in or no search results
		}
	}, [posts]);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<>
			<div className="ms-4 me-4 mt-2">
				<ul className="list-unstyled">
					{posts.map((ingredientPost) => (
						<li
							key={ingredientPost.ingredient._id}
							className="mb-1 text-start"
						>
							<IngredientPostModule
								ingredientPost={ingredientPost}
								postIsFavoritedVar={favoritesMap.get(
									ingredientPost.ingredientPostId
								)}
							></IngredientPostModule>
						</li>
					))}
				</ul>
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				paginate={paginate}
			/>
		</>
	);
}

export default GeneralFeed;
