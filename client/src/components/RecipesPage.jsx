import React, { useState } from 'react';
import './RecipeList.css';

export default function RecipeList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
        <p className="header-subtitle">{recipes.length} recipes available</p>
      </div>

      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card"
            onClick={() => handleItemClick(recipe)}
          >
            <div className="card-header">
              <h3 className="recipe-name">{recipe.name}</h3>
              <div className="difficulty-badge">
                <span className="difficulty-text">{recipe.difficulty}</span>
              </div>
            </div>

            <div className="time-container">
              <span className="time-text">Prep: {recipe.prepTime}</span>
              <span className="time-text">Cook: {recipe.cookTime}</span>
            </div>
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
                <span className="info-text">📊 {selectedItem.difficulty}</span>
              </div>

              <div className="section">
                <h3 className="section-title">Ingredients</h3>
                <ul className="ingredient-list">
                  {selectedItem.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      {ingredient}
                    </li>
                  ))}
                </ul>
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
