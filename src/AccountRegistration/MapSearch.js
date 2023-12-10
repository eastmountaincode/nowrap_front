import React, { useState, useCallback } from "react";
import { SearchBox, AddressMinimap } from "@mapbox/search-js-react";
import "./index.css";

function MapSearch({ locationData, setLocationData }) {
	const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
	const [showFormExpanded, setShowFormExpanded] = useState(false);
	const initialFeature = {
		type: "Feature",
		properties: {
			description:
				"<strong>Northeastern University</strong><p>Best university in Boston, MA.</p>",
		},
		geometry: {
			type: "Point",
			coordinates: [-71.088753, 42.338879],
		},
	};
	const [feature, setFeature] = useState(initialFeature);
	const [address, setAddress] = useState({
		address: "",
		city: "",
		state: "",
		postal_code: "",
		coordinates: "",
	});
	const [userLocation, setUserLocation] = useState(null);

	const handleRetrieve = useCallback(
		(res) => {
			const feature = res.features[0];
			setFeature(feature);
			setShowFormExpanded(true);
			const address = {
				location_name: feature.properties.name || "",
				address: feature.properties.address || "",
				city: feature.properties.context.place.name || "",
				state: feature.properties.context.region.region_code || "",
				postal_code: feature.properties.context.postcode.name || "",
			};
			console.log("Feature: ", feature);
			const coordinates = `${
				feature.properties.coordinates?.latitude || ""
			}, ${feature.properties.coordinates?.longitude || ""}`;
			const country = feature.properties.context.country.name || "";
			setAddress(address);
			setLocationData({
				...address,
				coordinates: coordinates,
				country: country,
			});
		},
		[setFeature, setShowFormExpanded, setLocationData]
	);

	// get user location
	function getLocation() {
		function success(position) {
			setShowFormExpanded(true);
			const lat = position.coords.latitude;
			const lng = position.coords.longitude;
			const location = [lng, lat];
			setUserLocation(location);
			console.log(location);
			markLocation(location);
		}

		function error() {
			console.log("Unable to retrieve your location");
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error);
		}
	}

	// reverse geocode user location
	function markLocation(coordinate) {
		console.log(coordinate);
		console.log(`Marker moved to ${JSON.stringify(coordinate)}.`);
		fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinate[0]},${coordinate[1]}.json?access_token=${accessToken}country=US`
		)
			.then((data) => {
				return data.json();
			})
			.then((res) => {
				console.log("User location:");
				console.log(res);
				setFeature(res.features[0]);
				let address = {
					address: res.features[0].address,
					city: res.features[0].context[2].text,
					state: res.features[0].context[4].text,
					postal_code: res.features[0].context[1].text,
				};
				console.log(address);
				setAddress(address);
				setLocationData(address);
			});
	}

	const inputChange = (e) => {
		const { name, value } = e.target;
		setLocationData({ ...locationData, [name]: value });
	};

	return (
		<>
			<div className="mb-2">
				<SearchBox
					id="mapbox-searchbox"
					accessToken={accessToken}
					placeholder="What store are you associated with?"
					onRetrieve={handleRetrieve}
					value=""
					options={{ proximity: userLocation, country: "US" }}
				/>
				<button
					type="button"
					className="btn btn-link"
					onClick={() => setShowFormExpanded(!showFormExpanded)}
				>
					Manually enter address
				</button>
				{/* Form */}
				{showFormExpanded && (
					<>
						<input
							className="form-control my-2"
							type="text"
							placeholder="Nickname of Store"
							onChange={inputChange}
							value={locationData["location_name"]}
							name="location_name"
							id="location_name"
							required
						/>
						<input
							className="form-control my-2"
							type="text"
							placeholder="Address Line 1"
							onChange={inputChange}
							value={address["address"]}
							name="address"
							id="address"
							required
						/>
						<input
							className="form-control my-2"
							type="text"
							placeholder="City"
							onChange={inputChange}
							value={address["city"]}
							name="city"
							id="city"
							required
						/>
						<input
							className="form-control my-2"
							type="text"
							placeholder="State"
							onChange={inputChange}
							value={address["state"]}
							name="state"
							id="state"
							required
						/>
						<input
							className="form-control my-2"
							type="text"
							placeholder="Postal Code"
							onChange={inputChange}
							value={address["postal_code"]}
							name="postal_code"
							id="postal_code"
							required
						/>
					</>
				)}
			</div>
		</>
	);
}
export default MapSearch;
