import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchResultsMap from '../SearchResultsMap';

function IngredientDetailsPage() {
  const [ingredient, setIngredient] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const identifier = searchParams.get('identifier');

  const authenticated = localStorage.getItem("authenticated");
  const authenticatedUsername = localStorage.getItem("username");

  const navigate = useNavigate();

  const handleDelete = async () => {
    // Ask the user for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this ingredient?");

    if (isConfirmed) {
      // User clicked 'OK', proceed with the deletion
      try {
        const response = await fetch(`/delete_ingredient/${identifier}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Handle successful deletion
          // For example, navigate to another page or update the state
          console.log("Ingredient deleted successfully");
          setIngredient(null);
          navigate("/Home");
        } else {
          // Handle errors (e.g., display a message to the user)
          console.error("Failed to delete ingredient");
        }
      } catch (error) {
        console.error("Error during deletion:", error);
        // Handle network or other errors, display messages as needed
      }
    } else {
      // User clicked 'Cancel', do not proceed with deletion
      console.log("Deletion cancelled");
    }
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/ingredient?identifier=${identifier}`);
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
  }, [identifier]);

  // Function to check if a value is empty
  function isValidValue(value) {
    return value !== null && value !== undefined && value !== '';
  }

  if (!ingredient) return <p>Loading...</p>;

  return (
    <div className="p-3 text-start w-100">
      <h2>Item Details</h2>
      {ingredient.photo && <img src={ingredient.photo} alt={ingredient.ingredient_name} style={{ maxWidth: "200px" }} />}
      <h3>{ingredient.ingredient_name}</h3>
      <div className='misc-info'>
        {isValidValue(ingredient.price) && <p className='m-0'>Price: ${ingredient.price}</p>}
        {isValidValue(ingredient.notes) && <p className='m-0'>Notes: {ingredient.notes}</p>}
      </div>
      <div className="nutrition-info">
        {isValidValue(ingredient.calories) && <p className='m-0'><strong>Calories:</strong> {ingredient.calories}</p>}
        {isValidValue(ingredient.protein) && <p className='m-0'><strong>Protein:</strong> {ingredient.protein}g</p>}
        {isValidValue(ingredient.total_fats) && <p className='m-0'><strong>Total Fats:</strong> {ingredient.total_fats}g</p>}
        {isValidValue(ingredient.saturated_fats) && <p className='m-0'><strong>Saturated Fats:</strong> {ingredient.saturated_fats}g</p>}
        {isValidValue(ingredient.trans_fats) && <p className='m-0'><strong>Trans Fats:</strong> {ingredient.trans_fats}g</p>}
        {isValidValue(ingredient.carbohydrates) && <p className='m-0'><strong>Carbohydrates:</strong> {ingredient.carbohydrates}g</p>}
        {isValidValue(ingredient.fiber) && <p className='m-0'><strong>Fiber:</strong> {ingredient.fiber}g</p>}
        {isValidValue(ingredient.sugar) && <p className='m-0'><strong>Sugar:</strong> {ingredient.sugar}g</p>}
      </div>
      <br></br>
      <h4>Location Information</h4>
      <p className='m-0'><strong>Location:</strong> {ingredient.location.location_name}</p>
      <p className='m-0'><strong>Address:</strong> {ingredient.location.address}, {ingredient.location.city}, {ingredient.location.state}, {ingredient.location.country}, {ingredient.location.postal_code}</p>
      <p className='m-0'><strong>Coordinates:</strong> {ingredient.location.coordinates}</p>
      <br></br>

      <h4>Posted by:</h4>
      <Link to={`/user/${ingredient.postedByUser._id}`}>
          <p className='m-0'>{ingredient.postedByUser.username}</p>
      </Link>
      {/* Show edit button if authenticated */}
      {authenticated && (
        <Link to={`/edit-ingredient/${identifier}`} className="btn btn-warning mb-4 mt-3">
          Edit
        </Link>
      )}
      {/* Show delete button if the authenticated user is the one who posted the ingredient */}
      {authenticated && authenticatedUsername === ingredient.postedByUser.username && (
        <button onClick={handleDelete} className="btn btn-danger mb-4 mt-3 ms-2">
          Delete
        </button>
      )}
      <br></br>
      <SearchResultsMap results={[ingredient]} />
    </div>
  );
}

export default IngredientDetailsPage;
