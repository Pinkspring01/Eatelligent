import React, { useState } from 'react';
import './FridgeList.css';

export default function FridgeList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeletItem = async (itemId, itemName) => {
    if (!window.confirm('Are ou sure you want to delete "${itemName}"?')) {
        return;
    }
    try {
        const result = await itemAPI.deleteItem(userId, itemId);
        if (result.sucess) {
            setItems(fridge_ingredients.filter(i => i.item_id != itemId));

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
        <h1 className="header-title">Fridge List</h1>
        <p className="header-subtitle">{fridge_ingredients.length} ingredients available</p>
      </div>

      <div className="ingredient-list">
        {fridge_ingredients.map((f_item) => (
          <div
            key={f_item.id}
            className="ingredient-card"
            onClick={() => handleItemClick(f_item)}
           >
            <div className="card-header">
              <h3 className="ingredient-name">{f_item.name}</h3>
              <button
                className="delete-button-small"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeletItem(f_item.item_id, f_item.name);
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
