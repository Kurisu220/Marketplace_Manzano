import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Update = () => {
    const [store, setStore] = useState({
        prod_name: "",
        prod_description: "",
        category: "", 
        image: "",
        price: null,
        quantity: null,
    });

    const navigate = useNavigate();
    const location = useLocation();
    const storeId = location.pathname.split("/")[2];

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
        
        // Display image preview if a file is selected
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Check if the field is price or quantity
        if (name === 'price' || name === 'quantity') {
            // Check if the value is a valid non-negative number
            if (!isNaN(value) && parseFloat(value) >= 0) {
                setStore((prev) => ({ ...prev, [name]: value }));
            } else {
                alert(`${name.charAt(0).toUpperCase() + name.slice(1)} must be a valid non-negative number.`);  
            }
        } else {
            setStore((prev) => ({ ...prev, [name]: value }));
        }
    };
    
    
       
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
    
            for (const [key, value] of Object.entries(store)) {
                // Only append non-empty values to the FormData
                if (value !== "" && value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            }
    
            // Append the image to FormData only if it's not null
            if (imageFile) {
                formData.append("image", imageFile);
            }
    
            await axios.put(`http://localhost:8800/store/${storeId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            alert('Item updated successfully.');

            navigate("/store");
        } catch (err) {
            console.log(err);
        }
    };

    console.log(store);

    return (
        <div>
            <h1>Update Item</h1>
            <div className='form'>
                <div className='form-group'>
                    <label htmlFor="prod_name">Product Name:</label>
                    <input type="text" placeholder='name' onChange={handleChange} name='prod_name' />
                </div>
                <div className='form-group'>
                    <label htmlFor="prod_description">Product Description:</label>
                    <input type="text" placeholder='description' onChange={handleChange} name='prod_description' />
                </div>
                <div className='form-group'>
                    <label htmlFor="category">Category:</label>
                    <select onChange={handleChange} name="category" id="category" value={store.category || ''}>
                        <option value="" disabled>Select a category</option>
                        <option value="clothing">Clothing</option>
                        <option value="electronics">Electronics</option>
                        <option value="instruments">Instruments</option>
                        <option value="furniture">Furniture</option>
                        <option value="accessory">Accessory</option>
                        <option value="toys">Toys</option>
                        <option value="other">Others</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor="image">Image:</label>
                    <input type="file" onChange={handleImageChange} name="image" id="image" />
                </div>
                {imagePreview && (
                        <div className="image-preview">
                            <p>Image Preview:</p>
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}
                <div className='form-group'>
                    <label htmlFor="price">Price:</label>
                    <input type="number" placeholder='price' onChange={handleChange} name='price' />
                </div>
                <div className='form-group'>
                    <label htmlFor="Quantity">Quantity:</label>
                    <input type="number" placeholder='quantity' onChange={handleChange} name='quantity' />
                </div>
                
                <button onClick={handleClick}>Update</button>
            </div>
        </div>
    );
};

export default Update;
