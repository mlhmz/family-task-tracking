import { ReactKeycloakProvider } from '@react-keycloak/web';
import { KeycloakInitOptions } from 'keycloak-js';
import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import axiosInstance from './axios';
import { Navigation } from './components/Navigation';
import keycloak from './keycloak';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';

function App() {
  const initOptions: KeycloakInitOptions = {
    flow: 'implicit',
    onLoad: 'login-required',
    silentCheckSsoRedirectUri: window.location.origin + '/silent_sso.html',
  };

  return (
    <div className="antialiased">
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={initOptions}
        onEvent={(event) => {
          console.log('auth event', event);
        }}
        onTokens={() => {
          axiosInstance.interceptors.request.use(
            (config) => {
              // is this handling refresh tokens at all?
              if (keycloak.token != null) {
                console.log('added token');
                config.headers.Authorization = `${keycloak.token}`;
              }
              return config;
            },
            async (error) => {
              return await Promise.reject(error);
            }
          );
        }}
      >
        <StrictMode>
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </StrictMode>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
