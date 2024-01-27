import React from 'react';
import { useCart } from '../component/CartContext';
import { arrayBufferToBase64 } from '../component/util';
import axios from 'axios';


const Cart = () => {
  const { cartItems, removeFromCart, setCartItems } = useCart();
  
  
  const handleBuy = async () => {
    alert('Thank you for your purchase!');
    // Create an array of items to be purchased with their quantities
    const purchaseItems = cartItems.map(item => ({ id: item.id, quantity: item.quantity }));
    // Make a POST request to the server to update quantities
    try {
      await axios.post("http://localhost:8800/purchase", { purchaseItems });
      await setCartItems([]); 
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };

  const handleIncrement = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.min(item.quantity + 1, item.available_stock) }
        : item
    );
    setCartItems(updatedCart);
  };
  
  const handleDecrement = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(updatedCart);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: Math.min(Math.max(Number(newQuantity), 1), item.available_stock),
          }
        : item
    );
    setCartItems(updatedCart);
  };
  
  // Calculate total
  const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div>
      <h1>Cart</h1>
      <div className='cart-box'>
        {cartItems.length === 0 ? (
          <p>No items in the cart</p>
        ) : (
          <>
            <div className='cart-items'>
              {cartItems.map((item) => (
                <div key={item.id} className='cart-item'>
                   {console.log('Image Data:', item.image.data)}
                   
                  <img src={`data:image/*;base64,${arrayBufferToBase64(item.image.data)}`} alt="" />
                  <div className='cart-item-info'>
                    <p>{item.prod_name}</p>
                    {item.price && (
                      <p>Price: {item.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
                    )}
                    <p>Stock:  {item.available_stock}</p>
                    <div className='quantity-info'>
                      <button onClick={() => handleDecrement(item.id)}>-</button>
                      <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, e.target.value)} />
                      <button onClick={() => handleIncrement(item.id)}>+</button>
                      <button onClick={() => removeFromCart(item.id)}>Remove Item</button>
                    </div>
                  </div>
                </div>
              ))}
              
            </div>
            <div className='cart-total'>
              <p>Total: {total.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
              <div className='cart-buy'>
                <button onClick={handleBuy}>Buy</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
  
};

export default Cart;
