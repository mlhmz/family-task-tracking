import { ReactKeycloakProvider } from '@react-keycloak/web';
import { KeycloakInitOptions } from 'keycloak-js';
import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import { Navigation } from './components/Navigation';
import keycloak from './keycloak';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';

function App() {
  const initOptions: KeycloakInitOptions = {
    onLoad: 'login-required',
  };

  return (
    <div className='antialiased'>
      <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
        <StrictMode>
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </StrictMode>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
