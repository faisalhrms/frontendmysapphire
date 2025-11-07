import React, { useState } from 'react';
import api from "@config/axiosConfig.js";

const OdooSSOButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSSOLogin = async () => {
        setLoading(true);
        setError('');

        try {
            // Make API call directly
            const response = await api.post('sso/odoo/generate/')

            const ssoData = response.data;
            console.log(ssoData)
            if (ssoData.success) {
                window.open(ssoData.sso_url, '_blank', 'noopener,noreferrer');
            } else {
                setError(ssoData.error || 'Failed to generate SSO token');
            }
        } catch (err) {
            // Handle different error types
            if (err.response) {
                // Server responded with error status
                const errorMessage = err.response.data?.error ||
                    err.response.data?.detail ||
                    'Server error occurred';
                setError(errorMessage);

                // If unauthorized, redirect to login
                if (err.response.status === 401) {
                    localStorage.removeItem('access_token');
                    window.location.href = '/login';
                }
            } else if (err.request) {
                // Request was made but no response received
                setError('Network error: Unable to connect to server');
            } else {
                // Other errors
                setError(err.message || 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="odoo-sso-container">
            <button
                className={`odoo-sso-button ${loading ? 'loading' : ''}`}
                onClick={handleSSOLogin}
                disabled={loading}
                style={{
                    background: loading ? '#6c757d' : 'linear-gradient(135deg, #714B67 0%, #8E5A7B 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '200px',
                    justifyContent: 'center',
                    opacity: loading ? 0.7 : 1,
                }}
            >
                {loading ? (
                    <>
                        <span
                            className="spinner"
                            style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                            }}
                        ></span>
                        Connecting to Odoo...
                    </>
                ) : (
                    'Login to Odoo'
                )}
            </button>

            {error && (
                <div
                    className="error-message"
                    style={{
                        background: '#f8d7da',
                        color: '#721c24',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #f5c6cb',
                        fontSize: '14px',
                        textAlign: 'center',
                        marginTop: '10px',
                    }}
                >
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div
                className="sso-info"
                style={{
                    color: '#6c757d',
                    fontSize: '12px',
                    textAlign: 'center',
                    marginTop: '8px',
                }}
            >
                <small>You will be automatically logged into Odoo</small>
            </div>

            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .odoo-sso-button:hover:not(:disabled) {
                        background: linear-gradient(135deg, #5A3A52 0%, #7A4A68 100%) !important;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }
                `}
            </style>
        </div>
    );
};

export default OdooSSOButton;