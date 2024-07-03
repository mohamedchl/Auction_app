import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const OAuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const values = queryString.parse(location.search);
        const code = values.code ? values.code : null;
        console.log('Code: ' + code);

        const googleAuthenticate = async (code) => {
            if (code && !localStorage.getItem('access')) {
                const config = {
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                const body = JSON.stringify({ code });

                try {
                    console.log(code);
                    const res = await axios.post(`${import.meta.env.VITE_API_URL}/dj-rest-auth/google/`, body, config);
                    const { access, refresh, email } = res.data;

                    // Save the tokens to local storage
                    localStorage.setItem(ACCESS_TOKEN, res.data.access);
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                    console.log('Authenticated as: ', email);
                    navigate("/"); // Redirect to the home page or any other page
                } catch (err) {
                    alert(err);
                }
            }
        };

        if (code) {
            googleAuthenticate(code);
        } else {
            console.error('Invalid OAuth callback');
            navigate('/login'); // Redirect to the login page if no code is found
        }
    }, [location, navigate]);

    return <div>Loading...</div>;
};

export default OAuthCallback;
