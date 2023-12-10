import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal } from "bootstrap";
import MapSearch from "./MapSearch";
import NutritionFacts from "./NutritionFacts";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function AddIngredient() {
	const SERVER_URL = process.env.REACT_APP_SERVER_URL;
	const authenticated = localStorage.getItem("authenticated");

	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		ingredient_name: "",
		price: "",
		notes: "",
		calories: "",
		protein: "",
		total_fats: "",
		saturated_fats: "",
		trans_fats: "",
		carbohydrates: "",
		fiber: "",
		sugar: "",
		photo: "",
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

	const modal = useRef(null);
	useEffect(() => {
		if (!authenticated) {
			localStorage.setItem("redirectPath", "/AddIngredient");
			console.log("redirectPath: ", localStorage.getItem("redirectPath"));
			navigate("/account");
		}
		// Initialize modal inside the useEffect
		modal.current = new Modal(document.getElementById("confirmationModal"));
	}, [authenticated, navigate]);

	// Initialize Bootstrap alert for form validation
	const locationAlert = document.getElementById("locationAlert");
	const appendLocationAlert = (message, type) => {
		const wrapper = document.createElement("div");
		wrapper.innerHTML = [
			`<div class="alert alert-${type} alert-dismissible" role="alert">`,
			`   <div>${message}</div>`,
			'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
			"</div>",
		].join("");
		locationAlert.append(wrapper);
	};
	const successAlert = document.getElementById("addSuccessAlert");
	const appendSuccessAlert = (message, type) => {
		const wrapper = document.createElement("div");
		wrapper.innerHTML = [
			`<div class="my-3 alert alert-${type} alert-dismissible" role="alert">`,
			`   <div>${message}</div>`,
			'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
			"</div>",
		].join("");
		successAlert.append(wrapper);
	};

	const handlePhotoChange = (e) => {
		setFormData({ ...formData, photo: e.target.files[0] });
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
				return responseData.location_id;
			} else {
				// Handle server response with non-2xx status code
				const errorResponse = await response.json();
				console.error("Error adding location:", errorResponse);
			}
		} catch (error) {
			console.error("Error submitting form for location:", error);
		}
		return null;
	};

	const inputIngredientChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const registerIngredient = async () => {
		// Prevent submission if the ingredient name is not provided
		if (formData.ingredient_name === "" || formData.price === "") {
			return;
		}
		// Create a new FormData object to hold our form data for sending
		const formDataToSend = new FormData();

		// Loop over the existing formData object to append each field to formDataToSend
		// Exclude the photo field at this stage because it's a file
		for (const key in formData) {
			if (key !== "photo") {
				formDataToSend.append(key, formData[key]);
			}
		}

		// Check if the photo key in our state has a file to upload
		// If it does, append the file to formDataToSend
		// 'photo' is the field name expected by the multer middleware on the server
		if (formData.photo) {
			formDataToSend.append("photo", formData.photo);
		}
		try {
			// Make a POST request to the server with the FormData object
			// Notice we are not setting the Content-Type header manually.
			// The fetch API will automatically set it to 'multipart/form-data'
			// along with the proper boundary when FormData is passed as body
			const response = await fetch(`${SERVER_URL}/add_ingredient`, {
				method: "POST",
				body: formDataToSend,
				// We do not specify the Content-Type header here
			});

			if (response.ok) {
				const responseData = await response.json();
				console.log("Ingredient added successfully!");
				return responseData.ingredient_id;
			} else {
				// Handle server response with non-2xx status code
				const errorResponse = await response.json();
				console.error("Error adding ingredient:", errorResponse);
			}
		} catch (error) {
			// Handle any errors that might occur during the fetch call
			console.error("Error submitting form for ingredient:", error);
		}
		return null;
	};

	const registerPost = async (locationId, ingredientId) => {
		// Ensure locationId and ingredientId are available
		if (!locationId || !ingredientId) {
			console.error("Missing location or ingredient ID");
			return;
		}

		const userId = localStorage.getItem("userid");
		try {
			const response = await fetch(
				`${SERVER_URL}/register_ingredient_post`,
				{
					method: "POST",
					body: JSON.stringify({
						posted_by: userId,
						location_id: locationId,
						ingredient_id: ingredientId
					}),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				const responseData = await response.json();
				console.log("Post added successfully!", responseData);
			} else {
				// Handle server response with non-2xx status code
				const errorResponse = await response.json();
				console.error("Error adding post:", errorResponse);
			}
		} catch (error) {
			// Handle any errors that might occur during the fetch call
			console.error("Error submitting form for post:", error);
		}
	};


	const checkExistingIngredient = async (e) => {
		e.preventDefault();
		if (formData.ingredient_name === "" || locationData.address === "") {
			if (locationData.address === "") {
				const alert = document.getElementById("locationAlert");
				alert.innerHTML = "";
				appendLocationAlert("Please enter a location.", "warning");
				alert.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}
			return;
		}
		try {
			const response = await fetch(
				`${SERVER_URL}/check_existing_post?q=${formData.ingredient_name
				}&location=${encodeURIComponent(JSON.stringify(locationData))}`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();

			if (data.length > 0) {
				modal.current.show();
			} else {
				await submitData();
			}
		} catch (error) {
			console.error(
				"There was an error checking existing ingredient: ",
				formData,
				error
			);
			return false;
		}
	};

	async function submitData() {
		try {
			const locationId = await registerLocation();
			const ingredientId = await registerIngredient();
	
			if (locationId && ingredientId) {
				await registerPost(locationId, ingredientId);
				const alert = document.getElementById("addSuccessAlert");
				alert.innerHTML = "";
				appendSuccessAlert("Ingredient added!", "success");
				alert.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
				// Show success alert for 2 seconds
				setTimeout(() => {
					navigate("/");
				}, 2000);
			} else {
				console.error("Error: Location or Ingredient not registered properly.");
				// Add any additional error handling or user notification here
			}
		} catch (error) {
			console.error("Error in submitData:", error);
			// Add any additional error handling or user notification here
		}
	}
	

	return (
		<div
			className="w-100"
			style={{ display: "flex", flexDirection: "column" }}
		>
			<h1>Add Ingredient</h1>
			<div
				className="modal fade"
				id="confirmationModal"
				tabIndex="-1"
				aria-labelledby="confirmationModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1
								className="modal-title fs-5"
								id="confirmationModalLabel"
							>
								Duplicate Ingredient Found At This Location
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							Would you like to still add this ingredient?
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
								onClick={() => {
									modal.current.hide();
								}}
							>
								Close
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => {
									submitData();
									modal.current.hide();
								}}
							>
								Add Ingredient
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container">
				<form
					className="needs-validation"
					onSubmit={(e) => {
						checkExistingIngredient(e);
					}}
				>
					<div className="form-floating mb-3">
						<input
							type="text"
							className="form-control"
							name="ingredient_name"
							id="ingredient_name"
							placeholder="Enter Name of Ingredient:"
							value={formData.ingredient_name}
							onChange={inputIngredientChange}
							required
						/>
						<label htmlFor="ingredient_name">
							Enter Name of Ingredient:
						</label>
						<div className="invalid-feedback">
							Please enter name of Ingredient.
						</div>
					</div>
					<div className="location mb-5">
						<div id="locationAlert"></div>
						<MapSearch
							locationData={locationData}
							setLocationData={setLocationData}
						/>
					</div>
					<span className="float-start mt-2">
						Add a Photo of the Ingredient
					</span>
					<div className="input-group mb-3">
						<button
							className="btn btn-outline-secondary"
							type="button"
							id="take-photo"
						>
							Take Photo
						</button>
						<input
							type="file"
							className="form-control"
							name="photo"
							id="photo"
							onChange={handlePhotoChange}
						/>
					</div>
					<div className="input-group mb-3">
						<span className="input-group-text">$</span>
						<div className="form-floating">
							<input
								type="number"
								name="price"
								value={formData.price}
								onChange={inputIngredientChange}
								min={0}
								className="form-control"
								id="price"
								placeholder="Price of Ingredient:"
								required
							/>
							<label htmlFor="price">Price of Ingredient:</label>
						</div>
					</div>
					<div className="form-floating">
						<textarea
							className="form-control"
							name="notes"
							placeholder="Leave a comment here"
							onChange={inputIngredientChange}
							id="notes"
							style={{ height: 100 }}
							value={formData.notes}
						/>
						<label htmlFor="notes">Additional Notes:</label>
					</div>
					<NutritionFacts
						formData={formData}
						setFormData={setFormData}
					/>
					<button
						type="submit"
						className="btn btn-primary btn-lg mt-2"
						id="submit-ingredient"
					>
						Add Your Ingredient
					</button>
					<div id="addSuccessAlert"></div>
				</form>
			</div>
		</div>
	);
}
export default AddIngredient;
