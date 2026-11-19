import axios from 'axios';
import { useState, useEffect } from 'react';

function Dashboard(){

    const [firstName, setFirstName] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getUser = async () => {
            try{
                const token = sessionStorage.getItem('accessToken');

                const res = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}`}});

                setFirstName(res.data.firstName);
            }
            catch(err){
                console.error('Unable to retrieve user');
            }
        }

        getUser();
    }, []);

    return(
        <div className='header'>
            <h1>Welcome {firstName}!</h1>
        </div>
    )
}

export default Dashboard;