import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

type Props = { children: React.ReactNode }

function ProtectedRoute({ children }: Props){
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        let active = true;

        const checkSession = async() => {

            const token = sessionStorage.getItem("accessToken");

            // check if there is a JWT 
            if(!token){
                if(active){
                    setLoading(false);
                    setAuthenticated(false);
                }
                return;
            }

            try{
                await axios.get(`${API_URL}/auth/protected`, { headers: { Authorization: `Bearer ${token}`}});

                if(active){
                    setAuthenticated(true);
                }
            }
            catch(err){
                sessionStorage.removeItem('accessToken');

                if(active){
                    setAuthenticated(false);
                }
            }
            finally{
                if(active){
                    setLoading(false);
                }
            }
        };

        void checkSession();

        return () => { active = false; };
    }, []);

    if(loading){
        return <p>Checking authentication...</p>;
    }

    if(!authenticated){
        return <Navigate to='/' replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;