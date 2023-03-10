import { useKeycloak } from '@react-keycloak/web';
import { NavLink } from 'react-router-dom';

import { Logo } from './Logo';

export const Navigation = () => {
  const { keycloak } = useKeycloak();

  function getNavLinkClasses(isActive: boolean) {
    return isActive ? 'text-grow-4' : 'text-grow-2 hover:text-grow-4';
  }

  return (
    <nav className='border-grow-6 bg-grow-6 flex w-full items-center gap-4 border-b p-3'>
      <NavLink className='ml-1' to='/'>
        <Logo />
      </NavLink>
      <ul className='flex gap-3 text-xl'>
        <li>
          <NavLink
            to='/'
            className={({ isActive }) => getNavLinkClasses(isActive)}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to='profile'
            className={({ isActive }) => getNavLinkClasses(isActive)}
          >
            Profile
          </NavLink>
        </li>
      </ul>

      <div className='mr-2 inline-flex w-full justify-end gap-5'>
        <button
          type='button'
          className='text-grow-4 hover:text-grow-1 float-right'
          onClick={() => {
            if (keycloak.authenticated === true) {
              void keycloak.logout();
            } else {
              void keycloak.login();
            }
          }}
        >
          {keycloak.authenticated === false ? 'Login' : 'Logout'}
        </button>
      </div>
    </nav>
  );
};
