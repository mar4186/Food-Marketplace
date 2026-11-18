import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Register.css';

function Register(){

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegistration = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return(
        <div className='register-page'>
            <div className='register-container'>
                <div className='register-header'>
                    <h1>Register</h1>
                    <p>Enter your details below to create your account</p>
                </div>

                <form className='register-form' onSubmit={handleRegistration}>
                    <label htmlFor="first-name-input">First Name</label>
                    <input
                        id="first-name-input"
                        type="text"
                        required
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    ></input>

                    <label htmlFor="last-name-input">Last Name</label>
                    <input
                        id="last-name-input"
                        type="text"
                        required
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    ></input>

                    <label htmlFor="email-input">Email</label>
                    <input
                        id="email-input"
                        type="email"
                        required
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>

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

                    <button className="button" type="submit">Register account</button>
                </form>

                <Link to='/' className="button">Back to Login</Link>
            </div>
        </div>
    )
}

export default Register;