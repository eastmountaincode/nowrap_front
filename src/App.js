import React from "react";
import "./App.css";
import Home from "./Home";
import DatabaseAdmin from "./DatabaseAdmin";
import AddIngredient from "./AddIngredient";
import AccountRegistration from "./AccountRegistration";
import Account from "./Account";
import SearchResults from "./SearchResults";
import "./index.css";
import MainHeader from "./Header";
import IngredientDetailsPage from "./IngredientDetailsPage";

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Footer from "./Footer";
import EditIngredient from "./EditIngredient";
import OtherPersonsAccountPage from "./OtherPersonsAccountPage";

function App() {
	return (
		<Router>
			<div
				className="App"
				style={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<MainHeader />
				<div className="content" style={{ display: "flex", flex: "1" }}>
					<Routes>
						<Route
							path="/"
							element={<Navigate replace to="/Home" />}
						/>
						<Route path="/Home/*" element={<Home />} />
						<Route path="/admin" element={<DatabaseAdmin />} />
						<Route
							path="/AddIngredient"
							element={<AddIngredient />}
						/>
						<Route
							path="/AccountRegistration"
							element={<AccountRegistration />}
						/>
						<Route path="/account" element={<Account />} />
						<Route path="/search" element={<SearchResults />} />
						<Route
							path="/details"
							element={<IngredientDetailsPage />}
						/>
						<Route
							path="/edit-ingredient/:id"
							element={<EditIngredient />}
						/>
						<Route
							path="/user/:userId"
							element={<OtherPersonsAccountPage />}
						/>
					</Routes>
				</div>
				{/* This is handled by the admin button in Account now */}
				<div className="pb-3">
					<Footer />
				</div>
			</div>
		</Router>
	);
}

export default App;
