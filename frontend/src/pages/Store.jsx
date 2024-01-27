//edit page
import React, {useEffect} from 'react'
import {useState} from 'react'
import axios from 'axios'
import { Link} from 'react-router-dom'
import { arrayBufferToBase64 } from '../component/util';


const Store =()=>{

    const [store, setStore]=useState([])
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1); 
    const [sortOption, setSortOption] = useState(''); 
    const itemsPerPage = 20;

    useEffect(()=>{
        const fecthAllStore= async()=>{
            try{ 
                const res= await axios.get("http://localhost:8800/store")
                setStore(res.data)
                setLoading(false);
            }catch(err){
                console.log(err)
                setLoading(false);
            }
        }
        fecthAllStore()
    },[])

    const handleDelete = async (id) => {
        try {
          await axios.delete(`http://localhost:8800/store/${id}`);
          // Update the local state by removing the deleted item
          setStore((prevStore) => prevStore.filter(item => item.id !== id));
          alert("Item successfully deleted")
        } catch (err) {
          console.log(err);
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
          <h1>Edit Item</h1>
          {loading ? (
            <>
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </>
          ) : store.length === 0 ? (
            <p>No items in the store.</p>
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
                <div className='store' key={storeItem.id}>
                  {storeItem.image && (
                    <img src={`data:image/*;base64,${arrayBufferToBase64(storeItem.image.data)}`} alt='' />
                  )}
                  <h2>{storeItem.prod_name}</h2>
                  <p className='category'>{storeItem.category}</p>
                  <p className='description'>{storeItem.prod_description}</p>
                  <hr className="separator" />
                  <span className='stock'>Stock: {storeItem.quantity}</span>
                  <span className='store-price'>
                      {storeItem.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                  </span>
                  <div className='edit-button'>
                    <button className='delete' onClick={() => handleDelete(storeItem.id)}>Delete</button>
                    <button >
                      <Link className='update-link' to={`/update/${storeItem.id}`}>Update</Link>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          <div className='paginate'>
            <button onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}>
            <i className='fa fa-arrow-left'></i>
            </button>
            <span>{`Page ${currentPage} of ${Math.ceil(store.length / itemsPerPage)}`}</span>
            <button onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(store.length / itemsPerPage)))}>
            <i className='fa fa-arrow-right'></i>
            </button>
          </div>
        </div>
      );
    
}

export default Store