import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/verification_email.css';

const EmailVerification = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('Verifying...');
    const navigate = useNavigate();
    const renderAfterCalled = useRef(false);
    const [Contacter, setcontacter] = useState('');

    useEffect(() => {
        const verifierEmail = async () => {
            if (!renderAfterCalled.current) {
                renderAfterCalled.current = true; // Le mettre à true avant de faire la requête
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/verify-email/`, {
                        params: { token }
                    });
                    if (response.status === 200) {
                        setMessage('Email vérifié avec succès ! Redirection vers la page de connexion...');
                        setTimeout(() => {
                            navigate("/connection");
                        }, 3000);
                    } else {
                        setMessage('Échec de la vérification de l\'email. Veuillez réessayer.');
                        setcontacter("Contacter notre support pour plus d'information");
                    }
                } catch (error) {
                    setMessage('Lien de vérification invalide ou expiré.');
                    setcontacter("Contacter notre support pour plus d'information");

                    console.error('Erreur de vérification :', error);
                }
            }
        };
        

        verifierEmail();
    }, []);

    return (
        <div className="verification-email-container">
            <div id="message-verifivation_email_container">
            <h1>{message}</h1>
            <p>{Contacter}</p>
            </div>
        </div>
    );
};

export default EmailVerification;
