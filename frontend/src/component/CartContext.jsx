import React, { createContext, useContext, useState, useEffect,useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  
  //use indexdb to save the item when refresh
  const initializeIndexedDB = useCallback (async () => {
    try {
      const db = await openDatabase();
      const items = await getItemsFromDB(db);
      setCartItems(items);
    } catch (error) {
      console.error('Error initializing IndexedDB:', error);
    }
  }, []);

  useEffect(() => {
    // Initialize IndexedDB on component mount
    initializeIndexedDB();
  }, [initializeIndexedDB]);

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('CartDB', 1);
  
      request.onerror = (event) => {
        reject('Error opening IndexedDB:', event.target.error);
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('cart', { keyPath: 'id', autoIncrement: true });
      };
    });
  };
  

  const getItemsFromDB = (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readonly');
      const objectStore = transaction.objectStore('cart');
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result || []);
      };

      request.onerror = (event) => {
        reject('Error fetching items from IndexedDB:', event.target.error);
      };
    });
  };

  const addToCart = (product) => {
    setCartItems((current) => {
      const updatedCart = [...current, product];
      saveItemsToDB(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== itemId);
      saveItemsToDB(updatedCart);
      return updatedCart;
    });
  };

  const saveItemsToDB = (items) => {
    openDatabase().then((db) => {
      const transaction = db.transaction(['cart'], 'readwrite');
      const objectStore = transaction.objectStore('cart');
      objectStore.clear(); 
      items.forEach((item) => objectStore.add(item)); 
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,setCartItems,saveItemsToDB }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
