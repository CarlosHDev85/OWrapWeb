import React, { useState } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import CryptoJS from 'crypto-js';
import './AuthModal.css';

const poolData = {
  UserPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_AWS_COGNITO_WEB_CLIENT_ID,
  ClientSecret: import.meta.env.VITE_AWS_COGNITO_CLIENT_SECRET
};
const userPool = new CognitoUserPool(poolData);

const cognitoISP = new AWS.CognitoIdentityServiceProvider({
  region: import.meta.env.VITE_AWS_REGION,
});

// compute SECRET_HASH for Cognito operations when client secret is enabled
const computeSecretHash = (username) => {
  const message = username + poolData.ClientId;
  const hash = CryptoJS.HmacSHA256(message, poolData.ClientSecret);
  return CryptoJS.enc.Base64.stringify(hash);
};

export default function AuthModal({ onClose, onLogin }) {
  // Ensure AWS Cognito config is provided
  if (!poolData.UserPoolId || !poolData.ClientId) {
    return (
      <div className="auth-modal-overlay">
        <div className="auth-modal">
          <button className="close-button" onClick={onClose}>×</button>
          <div className="error">AWS Cognito UserPoolId and ClientId are required. Please set your .env and restart.</div>
        </div>
      </div>
    );
  }

  const [mode, setMode] = useState('signin'); // signin, signup, confirm
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSignUp = async () => {
    setError('');
    try {
      await cognitoISP
        .signUp({
          ClientId: poolData.ClientId,
          Username: email,
          Password: password,
          SecretHash: computeSecretHash(email),
          UserAttributes: [] // add any CognitoUserAttribute entries here
        })
        .promise();
      setMode('confirm');
      setInfo('Verification code sent to your email');
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    }
  };

  const handleConfirm = async () => {
    setError('');
    try {
      await cognitoISP
        .confirmSignUp({
          ClientId: poolData.ClientId,
          Username: email,
          ConfirmationCode: verificationCode,
          SecretHash: computeSecretHash(email)
        })
        .promise();
      setInfo('Registration confirmed, please sign in');
      setMode('signin');
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    }
  };

  const handleSignIn = async () => {
    setError('');
    try {
      await cognitoISP
        .initiateAuth({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: poolData.ClientId,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: computeSecretHash(email)
          }
        })
        .promise();
      setInfo('Sign in successful');
      if (onLogin) onLogin(email);
      onClose();
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    }
  };

  const handleSubmit = () => {
    if (mode === 'signup') handleSignUp();
    else if (mode === 'signin') handleSignIn();
    else if (mode === 'confirm') handleConfirm();
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>
          {mode === 'signup'
            ? 'Sign Up'
            : mode === 'signin'
            ? 'Sign In'
            : 'Confirm Sign Up'}
        </h2>
        {error && <div className="error">{error}</div>}
        {mode !== 'confirm' && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </>
        )}
        {mode === 'confirm' && (
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
          />
        )}
        <button onClick={handleSubmit}>
          {mode === 'signup'
            ? 'Sign Up'
            : mode === 'signin'
            ? 'Sign In'
            : 'Confirm'}
        </button>
        <div className="switch-mode">
          {mode === 'signin' && (
            <p>
              Don't have an account?{' '}
              <span onClick={() => { setMode('signup'); setError(''); }}>Sign Up</span>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Have an account?{' '}
              <span onClick={() => { setMode('signin'); setError(''); }}>Sign In</span>
            </p>
          )}
          {mode === 'confirm' && (
            <p>
              <span onClick={() => { setMode('signin'); setError(''); }}>Back to Sign In</span>
            </p>
          )}
        </div>
        {info && <div className="info">{info}</div>}
      </div>
    </div>
  );
}