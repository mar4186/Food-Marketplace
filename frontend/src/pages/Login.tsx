import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { useState } from 'react';
import axios from 'axios';

function Login(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleLogin = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoginError('');

        try{
            const res = await axios.post(`${API_URL}/auth/login`, { username, password });

            const token = res.data.accessToken;

            sessionStorage.setItem(
                'accessToken',
                token
            );

            sessionStorage.setItem(
                'user',
                JSON.stringify(res.data.user)
            );

            navigate('/dashboard');
        }
        catch(err: any){
            console.error('Login failed:', err);
            
            setLoginError(err.response?.data?.message || 'Something went wrong. Try again');
        }
    }

    return(
        <div className='login-page'>
            <div className="login-container">
                <div className="login-header">
                    <h1>Foodland</h1>
                    <p>Welcome! Enter your username and password</p>

                    {loginError && (<p className='error-message'>{loginError}</p>)}
                </div>

                <div className="login-form">
                    <form className='auth-form' onSubmit={handleLogin}>
                        <label htmlFor="username-input">Username</label>
                        <input
                            id="username-input"
                            type="text"
                            placeholder="Enter username"
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

                        <button className="button" type="submit">Log In</button>
                    </form>
                </div>

                <Link to='/register' className="button">Register</Link>
            </div>
        </div>
    )
}

export default Login;