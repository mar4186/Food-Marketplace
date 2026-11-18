import { Link } from 'react-router-dom';
import '../styles/Login.css';
import { useState } from 'react';
import axios from 'react';

function Login(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return(
        <div className='login-page'>
            <div className="login-container">
                <div className="login-header">
                    <h1>Foodland</h1>
                    <p>Welcome! Enter your username and password</p>
                </div>

                <div className="login-form">
                    <form className='auth-form' onSubmit={handleLogin}>
                        <label htmlFor="username-input">Username</label>
                        <input
                            id="username-input"
                            type="text"
                            required
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        ></input>

                        <label htmlFor="password-input">Password</label>
                        <input
                            id="password-input"
                            type="password"
                            required
                            placeholder="Enter username"
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