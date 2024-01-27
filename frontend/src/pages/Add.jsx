import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
    const [store, setStore] = useState({
        prod_name: "",
        prod_description: "",
        category: "", 
        image: "",
        price: null,
        quantity: null
    });

    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        // Display image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Check if the field is 'price' or 'quantity'
        if (name === 'price' || name === 'quantity') {
            // Check if the value is a valid non-negative number
            if (!isNaN(value) && parseFloat(value) >= 0) {
                setStore((prev) => ({ ...prev, [name]: value }));
            } else {
                // Show an alert for invalid input
                alert(`${name.charAt(0).toUpperCase() + name.slice(1)} must be a valid non-negative number.`);  
            }
        } else {
            setStore((prev) => ({ ...prev, [name]: value }));
        }
    };
      

    const handleClick = async (e) => {
        e.preventDefault();
        if (!store.prod_name || !store.prod_description || !store.category || !imageFile || !store.price || !store.quantity) {
            alert("Please fill in all required fields");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("prod_name", store.prod_name);
            formData.append("prod_description", store.prod_description);
            formData.append("price", store.price);
            formData.append("quantity", store.quantity);
            formData.append("category", store.category);
            formData.append("image", imageFile);

            await axios.post("http://localhost:8800/store", formData);
            navigate("/store");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>Add New Item</h1>
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

            <button onClick={handleClick}>Add</button>
        </div>
        </div>
    );
};

export default Add;
