import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import GeneralFeed from "./GeneralFeed";
import Favorites from "./Favorites";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "bootstrap";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

function Home() {
	const { pathname } = useLocation();
	const [searchText, setSearchText] = useState("");
	const navigate = useNavigate();
	const { user } = useContext(UserContext);

	const SERVER_URL = process.env.REACT_APP_SERVER_URL;

	const handleSearch = () => {
		if (searchText) {
			navigate(`/search?criteria=${searchText}`);
		}
	};

	useEffect(() => {
		if (!user.loggedIn) {
			// Initialize tooltips
			const tooltipTriggerList = document.querySelectorAll(
				'[data-bs-toggle="tooltip"]'
			);
			const tooltipList = [...tooltipTriggerList].map(
				(tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
			);

			// Cleanup tooltips on component unmount
			return () => {
				tooltipList.forEach((tooltip) => tooltip.dispose());
			};
		}
	}, []);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				flex: "1",
				justifyContent: "center",
			}}
		>
			{/* Add Ingredient */}
			<div className="d-flex justify-content-center align-items-center mb-3">
				<Link to="/AddIngredient" className="btn btn-primary">
					<FontAwesomeIcon icon={faPlus} /> Add Ingredient
				</Link>
			</div>

			{/* Search */}
			<div className="d-flex justify-content-center align-items-center mb-3">
				<div
					className="d-flex align-items-center justify-content-center"
					style={{ maxWidth: "380px", minWidth: "380px" }}
				>
					<input
						className="form-control"
						type="text"
						placeholder="Search for an ingredient"
						id="example-search-input"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSearch();
							}
						}}
					/>
					{searchText && (
						<button
							className="btn btn-outline-secondary ml-2"
							type="button"
							onClick={() => setSearchText("")}
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					)}
					<button
						className="btn btn-outline-primary ml-2"
						type="button"
						onClick={handleSearch}
					>
						<FontAwesomeIcon icon={faSearch} />
					</button>
				</div>
			</div>

			{/* Display the most recent ingredient */}
			<nav className="nav nav-pills nav-justified mb-2 mx-2">
				<Link
					to="/"
					className={`nav-link ${
						!pathname.includes("Favorites") && "active"
					}`}
				>
					Ingredient Post Feed
				</Link>
				{user.loggedIn && (
					<Link
						to="Favorites"
						className={`nav-link ${
							pathname.includes("Favorites") && "active"
						}`}
					>
						Favorites
					</Link>
				)}
				{/* If signed in, show LoggedInFeed, else disable tab */}
				{!user.loggedIn && (
					<a
						className="nav-link text-secondary"
						href="/account"
						data-bs-toggle="tooltip"
						data-bs-title="Login to view your Favorites"
					>
						Favorites
					</a>
				)}
			</nav>
			<Routes>
				<Route path="/" element={<GeneralFeed />} />
				<Route path="Favorites" element={<Favorites />} />
			</Routes>
		</div>
	);
}

export default Home;
