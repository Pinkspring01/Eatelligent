import React, { useState } from 'react';
import './PantryList.css';

const pantry_ingredients= [  // Sample data; replace with actual data source
  { id: 1, item_id: 101, name: 'Rice', quantity: '2 kg', date: '2024-12-01' },
  { id: 2, item_id: 102, name: 'Beans', quantity: '1 kg', date: '2024-11-15' },
  // Add more items as needed
];
export default function PantryList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeletItem = async (itemId, itemName) => {
    if (!window.confirm('Are ou sure you want to delete "${itemName}"?')) {
        return;
    }
    try {
        const result = await itemAPI.deleteItem(userId, itemId);
        if (result.sucess) {
            setItems(pantry_ingredients.filter(i => i.item_id != itemId));

            if (selectedItem?.item_id === itemId) {
                setModalVisible(false);
                setSelectedItem(null);
            }

            alert('Item deleted successfully!');
        } else {
            alert('Failed to delete item');
        }
    } catch (error) {
        console.error('Error deleting item: ', error);
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
        <h1 className="header-title">Pantry List</h1>
        <p className="header-subtitle">{pantry_ingredients.length} ingredients available</p>
      </div>

      <div className="ingredient-list">
        {pantry_ingredients.map((p_item) => (
          <div
            key={p_item.id}
            className="ingredient-card"
            onClick={() => handleItemClick(p_item)}
           >
            <div className="card-header">
              <h3 className="ingredient-name">{p_item.name}</h3>
              <button
                className="delete-button-small"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeletItem(p_item.item_id, p_item.name);
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
              <h2 className="modal-title">{selectedItem.name}</h2>
              <div className="modal-header-actions">
                <button
                    className="delete-button"
                    onClick={() => handleDeletItem(selectedItem.item_id, selectedItem.name)}
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
                <span className="info-text">Quantity: {selectedItem.quantity}</span>
                <span className="info-text">Expiration Date: {selectedItem.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
