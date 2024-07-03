import axios from 'axios';
import IsAuthorized from "../components/IsAuthorized";
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation

const ACCESS_TOKEN = 'accessToken'; // Ensure these constants are defined or imported correctly
const REFRESH_TOKEN = 'refreshToken';

export const googleAuthenticate = async (state, code) => {
    const navigate = useNavigate(); // Hook to use navigate, if you're using functional components
console.log('hiiii')
    if (state && code && !localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const details = {
            'state': state,
            'code': code
        };

        const formBody = Object.keys(details)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
            .join('&');

        try {
            const res = await axios.post(`${import.meta.env.VITE_FRONT_URL}/auth/o/google-oauth2/?${formBody}`, {}, config);
  alert(res.data.access)
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
        } catch (err) {
            alert(err);
        }
    }
};
