import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('Verifying...');
    const navigate = useNavigate();
    const renderAfterCalled = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!renderAfterCalled.current) {
                renderAfterCalled.current = true; // Set it to true before making the request
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/verify-email/`, {
                        params: { token }
                    });
                    if (response.status === 200) {
                        setMessage('Email verified successfully! Redirecting to login page...');
                        setTimeout(() => {
                            navigate("/login");
                        }, 3000);
                    } else {
                        setMessage('Failed to verify email. Please try again.');
                    }
                } catch (error) {
                    setMessage('Invalid or expired verification link.');
                    console.error('Verification error:', error);
                }
            }
        };

        verifyEmail();
    }, []);

    return (
        <div className="verification-container">
            <h1>{message}</h1>
        </div>
    );
};

export default EmailVerification;
