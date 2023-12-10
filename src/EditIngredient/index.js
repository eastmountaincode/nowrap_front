import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditIngredient() {
    const [ingredient, setIngredient] = useState({
        ingredient_name: '',
        calories: '',
        protein: '',
        total_fats: '',
        saturated_fats: '',
        trans_fats: '',
        carbohydrates: '',
        fiber: '',
        sugar: '',
        photo: ''
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/ingredient?identifier=${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setIngredient(data);
            } catch (error) {
                console.error("There was an error fetching ingredient details:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        setIngredient({ ...ingredient, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setIngredient({ ...ingredient, photo: e.target.files[0] });
    };


    const handleUpdate = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        Object.keys(ingredient).forEach(key => {
            if (key === 'photo' && ingredient[key] instanceof File) {
                formData.append(key, ingredient[key], ingredient[key].name);
            } else {
                formData.append(key, ingredient[key]);
            }
        });

        try {
            const response = await fetch(`${SERVER_URL}/update_ingredient/${id}`, {
                method: 'PUT',
                body: formData,
                // Do not set Content-Type for FormData; the browser will handle it
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Ingredient updated successfully', responseData);
                navigate(-1); // redirect to ingredient details page
            } else {
                console.error('Failed to update ingredient', responseData);
                // Handle errors, display messages as needed
            }
        } catch (error) {
            console.error('Error during update:', error);
            // Handle network or other errors, display messages as needed
        }
    };


    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className='ms-4 me-2 mt-2' style={{ textAlign: 'left' }}>
            <form onSubmit={handleUpdate}>
                <div className="form-group mb-2">
                    <label htmlFor="ingredient_name">Ingredient Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="ingredient_name"
                        name="ingredient_name"
                        value={ingredient.ingredient_name}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="calories">Calories</label>
                    <input
                        type="number"
                        className="form-control"
                        id="calories"
                        name="calories"
                        value={ingredient.calories}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="protein">Protein</label>
                    <input
                        type="number"
                        className="form-control"
                        id="protein"
                        name="protein"
                        value={ingredient.protein}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="total_fats">Total Fats</label>
                    <input
                        type="number"
                        className="form-control"
                        id="total_fats"
                        name="total_fats"
                        value={ingredient.total_fats}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="saturated_fats">Saturated Fats</label>
                    <input
                        type="number"
                        className="form-control"
                        id="saturated_fats"
                        name="saturated_fats"
                        value={ingredient.saturated_fats}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="trans_fats">Trans Fats</label>
                    <input
                        type="number"
                        className="form-control"
                        id="trans_fats"
                        name="trans_fats"
                        value={ingredient.trans_fats}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="carbohydrates">Carbohydrates</label>
                    <input
                        type="number"
                        className="form-control"
                        id="carbohydrates"
                        name="carbohydrates"
                        value={ingredient.carbohydrates}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="fiber">Fiber</label>
                    <input
                        type="number"
                        className="form-control"
                        id="fiber"
                        name="fiber"
                        value={ingredient.fiber}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="sugar">Sugar</label>
                    <input
                        type="number"
                        className="form-control"
                        id="sugar"
                        name="sugar"
                        value={ingredient.sugar}
                        onChange={handleInputChange}
                    />
                </div>

                {ingredient.photo && (
                    <img
                        src={typeof ingredient.photo === 'string' ? ingredient.photo : URL.createObjectURL(ingredient.photo)}
                        alt="Ingredient"
                        className='mb-2'
                        style={{ maxWidth: '150px', height: 'auto' }}
                    />
                )}
                <div className="form-group mb-2">
                    <label htmlFor="photo">Photo</label>
                    <input
                        type="file"
                        className="form-control"
                        id="photo"
                        name="photo"
                        onChange={handleFileChange}
                    />
                </div>

                <div className='mt-2'>
                    <button type="submit" className="btn btn-warning me-2">Update</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );

}

export default EditIngredient;
