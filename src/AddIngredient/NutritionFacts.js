import { useState } from "react";

function NutritionFacts({ formData, setFormData }) {
	const [showNutritionFormExpanded, setShowNutritionFormExpanded] =
		useState(false);
	const inputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	return (
		<div className="nutrition-facts">
			<button
				type="button"
				className="btn btn-link nutrition-facts-button"
				onClick={() =>
					setShowNutritionFormExpanded(!showNutritionFormExpanded)
				}
			>
				Manually Enter Nutrition Facts
			</button>
			{showNutritionFormExpanded && (
				<div className="nutrition-facts-form w-50 container">
					<input
						className="form-control mb-2"
						type="number"
						min={0}
						pattern="[0-9]"
						placeholder="Calories"
						id="calories"
						name="calories"
						value={formData.calories}
						onChange={inputChange}
					/>
					<input
						className="form-control mb-2"
						type="number"
						min={0}
						pattern="[0-9]"
						placeholder="Protein"
						id="protein"
						name="protein"
						value={formData.protein}
						onChange={inputChange}
					/>
					<input
						className="form-control mb-2"
						type="number"
						min={0}
						pattern="[0-9]"
						placeholder="Carbohydrates"
						id="carbohydrates"
						name="carbohydrates"
						value={formData.carbohydrates}
						onChange={inputChange}
					/>
					<input
						className="form-control mb-2"
						type="number"
						min={0}
						pattern="[0-9]"
						placeholder="Total Fats"
						id="total_fats"
						name="total_fats"
						value={formData.total_fats}
						onChange={inputChange}
					/>
					<input
						className="form-control mb-2"
						type="number"
						min={0}
						pattern="[0-9]"
						placeholder="Saturated Fats"
						id="saturated_fats"
						name="saturated_fats"
						value={formData.saturated_fats}
						onChange={inputChange}
					/>
					<input
						className="form-control mb-2"
						type="number"
						min={0}
						pattern="[0-9]"
						placeholder="Trans Fats"
						id="trans_fats"
						name="trans_fats"
						value={formData.trans_fats}
						onChange={inputChange}
					/>
					<input
						className="form-control mb-2"
						type="number"
						min={0}
						pattern="[0-9]"
						placeholder="Fiber"
						id="fiber"
						name="fiber"
						value={formData.fiber}
						onChange={inputChange}
					/>
					<input
						className="form-control mb-2"
						type="number"
						min={0}
						pattern="[0-9]"
						placeholder="Sugar"
						id="sugar"
						name="sugar"
						value={formData.sugar}
						onChange={inputChange}
					/>
				</div>
			)}
		</div>
	);
}
export default NutritionFacts;
