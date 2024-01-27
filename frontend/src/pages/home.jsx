import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../component/CartContext';
import { arrayBufferToBase64 } from '../component/util';

const Home = () => {
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [sortOption, setSortOption] = useState(''); 
  const { addToCart, cartItems } = useCart();
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchAllStore = async () => {
      try {
        const res = await axios.get("http://localhost:8800/store");
        setStore(res.data);
        setLoading(false); 
      } catch (err) {
        console.log(err);
        setLoading(false); 
      }
    };

    fetchAllStore();
  }, []);


  const handleAddToCart = (storeItem) => {
    // Check if the item is already in the cart
    const isItemInCart = cartItems.some(item => item.id === storeItem.id);
    if (isItemInCart) {
      alert("You have already added this item to your cart.");
    } else {
      // Check if the item is in stock
      if (storeItem.quantity > 0) {
        const itemToAdd = {
          id: storeItem.id,
          prod_name: storeItem.prod_name,
          price: storeItem.price,
          quantity: 1,
          available_stock: storeItem.quantity,
          image: storeItem.image,
        };
  
        addToCart(itemToAdd);
        alert("Item added to cart");
      } else {
        alert("Sorry, this item is out of stock.");
      }
    }
  };

  // Function to handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };


  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const sortedItems = () => {
    if (sortOption === 'name') {
      return [...store].sort((a, b) => a.prod_name.localeCompare(b.prod_name));
    } else if (sortOption === 'price') {
      return [...store].sort((a, b) => a.price - b.price);
    } else {
      return store;
    }
  };

  // Logic to display items for the current page
  const filteredItems = () => {
    if (selectedCategory) {
      return sortedItems().filter(item => item.category === selectedCategory);
    } else {
      return sortedItems();
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems().length);
  const displayedItems = filteredItems().slice(startIndex, endIndex);

  return (
    <div>
      <h1>Home</h1>
      {loading ? (
        <>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading...</p>
        </>
      ) : store.length === 0 ? (
        <p>No items to show.</p> // Display a message when there are no items
      ) : (
        <div className='filter-options'>
          <div>
             <label>Filter by Category:</label>
            <select onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory}>
              <option value="">All Categories</option>
              {Array.from(new Set(store.map((item) => item.category))).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
          </div>
          <div>
            <label>Sort by:</label>
            <select onChange={(e) => handleSortChange(e.target.value)} value={sortOption}>
              <option value="">None</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
        </div>
        </div>
      )}
      <div className='stores'>
        {displayedItems.map((storeItem) => (
          // Your existing item card code here
          <div className='store' key={storeItem.id}>
            {storeItem.image && (
                <img src={`data:image/*;base64,${arrayBufferToBase64(storeItem.image.data)}`} alt="" />
              )}
              <h2>{storeItem.prod_name}</h2>
              <p className='category'>{storeItem.category}</p>
              <p className='description'>{storeItem.prod_description}</p>
              <hr className="separator" />
              <span className='stock'> Stock: {storeItem.quantity}</span>
              <span className='store-price'>
                  {storeItem.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
              </span>
              <button onClick={() => handleAddToCart(storeItem)} style={{ backgroundColor: cartItems.some(item => item.id === storeItem.id) ? 'grey' : '#4CAF50' }}>
                <i className="fas fa-shopping-cart"></i>{cartItems.some(item => item.id === storeItem.id) ? 'In Cart' : 'Add to Cart'}
              </button>
          </div>
        ))}
      </div>
      <div className='paginate'>
        <button  onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}>
              <i className='fa fa-arrow-left'></i>
        </button>
        <span>{`Page ${currentPage} of ${Math.ceil(store.length / itemsPerPage)}`}</span>
        <button  onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(store.length / itemsPerPage)))}>
           <i className='fa fa-arrow-right'></i>
        </button>
      </div>
    </div>
  );
};

export default Home;
