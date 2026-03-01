import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const refreshToken = params.get('refreshToken');
        const role = params.get('role');
        const name = params.get('name');

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken || '');
            localStorage.setItem('role', role || '');
            localStorage.setItem('name', name || '');
            navigate('/');
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg">Logging you in...</p>
        </div>
    );
};

export default OAuth2Callback;