import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Register.css';
import axios from 'axios';

function Register(){

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleRegistration = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setRegisterError('');

        if(!firstName){
            setRegisterError('First name is required');
            return;
        }
        if(!lastName){
            setRegisterError('First name is required');
            return;
        }
        if(!email.trim()){
            setRegisterError('Email is required');
            return;
        }
        if(!username){
            setRegisterError('Username is required');
            return;
        }
        if(!password){
            setRegisterError('Password is required');
            return;
        }
        else if(password.length < 8){
            setRegisterError('Password must be at least 8 characters');
            return;
        }

        try{
            const res = await axios.post(`${API_URL}/auth/register`, {firstName, lastName, email, username, password})

            console.log(res.data);

            setRegisterSuccess('Registered successfully!')

            setTimeout(() => {navigate('/');}, 3000);
        }
        catch(err: any){
            console.error('Registration failed:', err);

            if(err.response?.status === 401){
                setRegisterError('Invalid input. Please try again');
            }
            else{
                setRegisterError('Something went wrong. Try again');
            }
        }
    }

    return(
        <div className='register-page'>
            <div className='register-container'>
                <div className='register-header'>
                    <h1>Register</h1>
                    <p>Enter your details below to create your account</p>

                    {registerError && (<p className='error-message'>{registerError}</p>)}
                    {registerSuccess && (<p className='success-message'>{registerSuccess}</p>)}
                </div>

                <form className='register-form' onSubmit={handleRegistration}>
                    <label htmlFor="first-name-input">First Name</label>
                    <input
                        id="first-name-input"
                        type="text"
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    ></input>

                    <label htmlFor="last-name-input">Last Name</label>
                    <input
                        id="last-name-input"
                        type="text"
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    ></input>

                    <label htmlFor="email-input">Email</label>
                    <input
                        id="email-input"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>

                    <label htmlFor="username-input">Username</label>
                    <input
                        id="username-input"
                        type="text"
                        placeholder="Enter a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    ></input>

                    <label htmlFor="password-input">Password</label>                        
                    <input
                        id="password-input"
                        type="password"
                        placeholder="Enter password"
                        value={password}                            
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>

                    <button className="button" type="submit">Register account</button>
                </form>

                <Link to='/' className="button">Back to Login</Link>
            </div>
        </div>
    )
}

export default Register;