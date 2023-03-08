import React from 'react';
import Logo from './Logo';
import { NavLink } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

function Navigation() {
  const { keycloak } = useKeycloak();

  function getNavLinkClasses(isActive: boolean) {
    return isActive ? 'text-grow-4' : 'text-grow-2 hover:text-grow-4';
  }

  return (
    <nav className="flex gap-4 w-full border-b border-grow-6 p-3 items-center bg-grow-6">
      <NavLink className="ml-1" to="/">
        <Logo />
      </NavLink>
      <ul className="text-xl flex gap-3">
        <li>
          <NavLink to="/" className={({ isActive }) => getNavLinkClasses(isActive)}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="profile" className={({ isActive }) => getNavLinkClasses(isActive)}>
            Profile
          </NavLink>
        </li>
      </ul>

      <div className="inline-flex justify-end w-full gap-5 mr-2">
        <button
          type="button"
          className="float-right text-grow-4 hover:text-grow-1"
          onClick={() => {
            if (keycloak.authenticated === true) {
              void keycloak.logout();
            } else {
              void keycloak.login();
            }
          }}>
          {keycloak.authenticated === false ? 'Login' : 'Logout'}
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
