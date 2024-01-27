import React, { useState, useEffect  } from "react";
import { Link, useNavigate} from "react-router-dom";

import validation from "../component/validation"; 
import { useAuth } from "../component/AuthContext"; 
import axios from "axios";


function Login(){
    const [values, setValues] = useState({
        email:'',
        password:''
    })
    const navigate = useNavigate();
    const [errors, setErrors]= useState({})
    const { isAuthenticated, login } = useAuth();

    
    useEffect(() => {
        // Check if the user is already authenticated when the component mounts
        if (isAuthenticated) {
        navigate('/home');
        }
    }, [isAuthenticated, navigate]);
    
    const handleInput = (event) =>{
        setValues(prev=> ({...prev, [event.target.name]: event.target.value}))
    }

    const handleSubmit=(event)=>{
        event.preventDefault();
        const err = validation(values, false);
        setErrors(err);
        if (err.email === "" && err.password === "") {
        axios.post("http://localhost:8800/login", values)
            .then((res) => {
            if (res.data.success === "Success") {
                const user = {
                    username: res.data.username,
                    userId: res.data.userId
                  };
                login(user); //
                navigate('/home');
            } else {
                alert("Incorrect Email and Password!!!");
            }
            })
            .catch((err) => console.log(err));
        }
    }

    return(
    
        <div className="userform">
          
            <div className="infoform">
                <h2>Log In</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className="info">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="Enter Email" name='email' 
                        onChange={handleInput} className="form-control rounded-0"/>
                        <div className="error-message">
                            {errors.email && <span className="text-danger">{errors.email}</span>}
                        </div>
                    </div>
                    <div className="info">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder="Enter Password" name='password'
                        onChange={handleInput} className="form-control rounded-0"/>
                         <div className="error-message">
                         {errors.password && <span className="text-danger">{errors.password}</span>}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0 " >Log In</button>
                    <p>Dont have account?</p>
                    <Link to='/signup' className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Create Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login