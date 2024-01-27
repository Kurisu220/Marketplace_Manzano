import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validation from "../component/validation"; 
import axios from "axios";


function Signup(){
    const [values, setValues] = useState({
        name:'',
        email:'',
        password:'',
        confirmPassword: '',  
    })
    const navigate = useNavigate();
    const [errors, setErrors]= useState({})

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit=(event)=>{
        event.preventDefault();
        const err = validation(values, true);
        setErrors(err);
    
        if (Object.values(err).every((e) => e === "")) {
            // Check if password and confirm password match
            if (values.password !== values.confirmPassword) {
                setErrors((prev) => ({
                    ...prev, confirmPassword: "Passwords do not match",
                }));
                return;
            }
            //proceed to API call
            axios.post("http://localhost:8800/signup", values)
            .then((res) => {
                console.log("Signup Response:", res);

                if (res.data) {
                    if (res.data === "Email already taken") {
                        // If the email is already taken, show an alert
                        window.alert("Email already taken. Please use a different email.");
                    } else if (res.data === "Error") {
                        // If there is an error, show an alert
                        window.alert("Signup failed due to an error. Please try again.");
                    } else {
                        // If the response is successful, show an alert and redirect to login
                        window.alert("Signup successful!");
                        navigate('/');
                    }
                } else {
                    // Handle unexpected response format
                    console.error("Unexpected response format:", res);
                    window.alert("Signup failed due to an unexpected response. Please try again.");
                }
            })
            .catch((err) => console.log(err.response));
        }
    }

    return(
        <div className="userform">
            <div className="infoform">
                <h2>Sign Up</h2>
                <form action="" onSubmit={handleSubmit}>
                <div className="info">
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type="text" placeholder="Enter Username" name="name"
                         onChange={handleInput} className="form-control rounded-0"/>
                         <div className="error-message">
                         {errors.name && <span className="text-danger">{errors.name}</span>}
                        </div>
                    </div>
                    <div className="info">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="Enter Email" name="email"
                        onChange={handleInput} className="form-control rounded-0"/>
                        <div className="error-message">
                            {errors.email && <span className="text-danger">{errors.email}</span>}
                        </div>
                    </div>
                    <div className="info">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder="Enter Password" name="password"
                        onChange={handleInput} className="form-control rounded-0"/>
                          <div className="error-message">
                            {errors.password && <span className="text-danger">{errors.password}</span>}
                        </div>
                    </div>
                    <div className="info">
                        <label htmlFor="confirmPassword"><strong>Confirm Password</strong></label>
                        <input type="password" placeholder="Confirm Password" name="confirmPassword"
                            onChange={handleInput} className="form-control rounded-0"/>
                        <div className="error-message">
                            {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success w-100 rounded-0" >Sign Up</button>
                    <p>Already have account?</p>
                    <Link to='/' className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Log In</Link>
                </form>
            </div>
        </div>
    )
}

export default Signup