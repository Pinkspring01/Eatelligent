import React, { useState, useEffect } from 'react';
import './RecipeList.css';

export default function RecipeList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5050/profile', {
        credentials: 'include' // ADD THIS
      });
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const generateRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch fridge and pantry items
      console.log('Fetching fridge items...');
      const fridgeResponse = await fetch('http://localhost:5050/ingredient/fridge', {
        credentials: 'include' // ADD THIS
      });
      console.log('Fridge response status:', fridgeResponse.status);
      
      console.log('Fetching pantry items...');
      const pantryResponse = await fetch('http://localhost:5050/ingredient/pantry', {
        credentials: 'include' // ADD THIS
      });
      console.log('Pantry response status:', pantryResponse.status);

      if (!fridgeResponse.ok || !pantryResponse.ok) {
        throw new Error(`Failed to fetch inventory. Fridge: ${fridgeResponse.status}, Pantry: ${pantryResponse.status}`);
      }

      const fridge = await fridgeResponse.json();
      const pantry = await pantryResponse.json();
      
      console.log('Fridge items:', fridge);
      console.log('Pantry items:', pantry);

      // Call your recipe generation endpoint
      console.log('Calling recipe generation API...');
      const response = await fetch('http://localhost:5050/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ADD THIS
        body: JSON.stringify({
          fridge: fridge.map(item => ({
            item: item.ingredient_name,
            expiration: item.ingredient_date,
            quantity: item.ingredient_quantity
          })),
          pantry: pantry.map(item => item.ingredient_name),
          dietaryRestrictions: userProfile?.dietaryRestrictions || [],
          preferences: userProfile?.preferences || ''
        }),
      });

      console.log('Recipe generation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate recipes: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Recipe data received:', data);
      
      // Transform LLM response to match your current recipe format
      const transformedRecipes = (data.recipes || []).map((recipe, index) => ({
        id: index,
        name: recipe.name,
        difficulty: recipe.difficulty,
        prepTime: `${recipe.prep_time_minutes} min`,
        cookTime: `${recipe.cook_time_minutes} min`,
        servings: recipe.servings,
        ingredients: recipe.ingredients.map(ing => 
          `${ing.amount} ${ing.item}${ing.already_exists ? ' ✅' : ' 🛒'}`
        ),
        instructions: recipe.instructions,
        expiringItems: recipe.expiring_soon || [],
        dietaryInfo: recipe.dietary_info
      }));

      console.log('Transformed recipes:', transformedRecipes);
      setRecipes(transformedRecipes);
      
    } catch (err) {
      setError(err.message);
      console.error('Error generating recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="header-title">Recipes</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p className="header-subtitle">{recipes.length} recipes available</p>
          <button 
            className="generate-button" 
            onClick={generateRecipes}
            disabled={loading}
          >
            {loading ? '🔄 Generating...' : '✨ Generate Recipes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          ❌ Error: {error}
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <p className="loading-text">🤖 AI is cooking up some recipes for you...</p>
        </div>
      )}

      {!loading && recipes.length === 0 && (
        <div className="empty-container">
          <p className="empty-text">No recipes yet! Click "Generate Recipes" to get started.</p>
          <p className="empty-subtext">Make sure you have items in your fridge and pantry.</p>
        </div>
      )}

      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card"
            onClick={() => handleItemClick(recipe)}
          >
            <div className="card-header">
              <h3 className="recipe-name">{recipe.name}</h3>
              <div className={`difficulty-badge difficulty-${recipe.difficulty}`}>
                <span className="difficulty-text">{recipe.difficulty}</span>
              </div>
            </div>

            <div className="time-container">
              <span className="time-text">⏱️ Prep: {recipe.prepTime}</span>
              <span className="time-text">🍳 Cook: {recipe.cookTime}</span>
              <span className="time-text">🍽️ Servings: {recipe.servings}</span>
            </div>

            {recipe.expiringItems && recipe.expiringItems.length > 0 && (
              <div className="expiring-badge">
                ⚠️ Uses expiring: {recipe.expiringItems.join(', ')}
              </div>
            )}

            {recipe.dietaryInfo && (
              <div className="dietary-tags">
                {recipe.dietaryInfo.vegetarian && <span className="tag">🌱 Vegetarian</span>}
                {recipe.dietaryInfo.vegan && <span className="tag">🥬 Vegan</span>}
                {recipe.dietaryInfo.gluten_free && <span className="tag">🌾 GF</span>}
                {recipe.dietaryInfo.dairy_free && <span className="tag">🥛 DF</span>}
              </div>
            )}

            <p className="view-details">Tap for details</p>
          </div>
        ))}
      </div>

      {modalVisible && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedItem.name}</h2>
              <button className="close-button" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="info-section">
                <span className="info-text">⏱️ Prep: {selectedItem.prepTime}</span>
                <span className="info-text">🍳 Cook: {selectedItem.cookTime}</span>
                <span className="info-text">🍽️ Servings: {selectedItem.servings}</span>
                <span className="info-text">📊 {selectedItem.difficulty}</span>
              </div>

              {selectedItem.expiringItems && selectedItem.expiringItems.length > 0 && (
                <div className="expiring-alert">
                  ⚠️ This recipe uses ingredients expiring soon: {selectedItem.expiringItems.join(', ')}
                </div>
              )}

              <div className="section">
                <h3 className="section-title">Ingredients</h3>
                <ul className="ingredient-list">
                  {selectedItem.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      {ingredient}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  ✅ = You have it | 🛒 = Need to buy
                </p>
              </div>

              <div className="section">
                <h3 className="section-title">Instructions</h3>
                <ol className="instruction-list">
                  {selectedItem.instructions.map((instruction, index) => (
                    <li key={index} className="instruction-item">
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
