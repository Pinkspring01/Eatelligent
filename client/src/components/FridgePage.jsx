import React, { useState, useEffect } from 'react';
import './FridgeList.css';

export default function FridgeList() {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch fridge items from backend
  useEffect(() => {
    async function fetchFridgeItems() {
      try {
        const response = await fetch('http://localhost:5050/ingredient');
        if (!response.ok) {
          throw new Error('Failed to fetch ingredients');
        }
        const allIngredients = await response.json();
        // Filter for only fridge items
        const fridgeOnly = allIngredients.filter(item => item.location === 'Fridge');
        setFridgeItems(fridgeOnly);
      } catch (error) {
        console.error('Error fetching fridge items:', error);
      }
    }
    fetchFridgeItems();
  }, []);
  
  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5050/ingredient/${itemId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove item from state
        setFridgeItems(fridgeItems.filter(item => item._id !== itemId));
        if (selectedItem?._id === itemId) {
          setModalVisible(false);
          setSelectedItem(null);
        }
        alert('Item deleted successfully!');
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
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
        <h1 className="header-title">Fridge List</h1>
        <p className="header-subtitle">{fridgeItems.length} ingredients available</p>
      </div>

      <div className="ingredient-list">
        {fridgeItems.map((item) => (
          <div
            key={item._id}
            className="ingredient-card"
            onClick={() => handleItemClick(item)}
          >
            <div className="card-header">
              <h3 className="ingredient-name">{item.ingredient_name}</h3>
              <button
                className="delete-button-small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item._id, item.ingredient_name);
                }}
                title='Delete ingredient'
              >
                Delete
              </button>
            </div>
            <p className="view-details">Tap for details</p>
          </div>
        ))}
      </div>

      {modalVisible && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedItem.ingredient_name}</h2>
              <div className="modal-header-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDeleteItem(selectedItem._id, selectedItem.ingredient_name)}
                >
                  Delete
                </button>
                <button className="close-button" onClick={closeModal}>
                  ✕
                </button>
              </div>
            </div>

            <div className="modal-body">
              <div className="info-section">
                <span className="info-text">Quantity: {selectedItem.ingredient_quantity}</span>
                <span className="info-text">Expiration Date: {selectedItem.ingredient_date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}