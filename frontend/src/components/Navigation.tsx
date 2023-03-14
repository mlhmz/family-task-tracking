import { useKeycloak } from '@react-keycloak/web';
import { NavLink } from 'react-router-dom';

import { Logo } from './Logo';

export const Navigation = () => {
  const { keycloak } = useKeycloak();

  const getNavLinkClasses = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? 'decoration-1 decoration-purple-400 underline underline-offset-4'
      : 'text-gray-300';
  };

  return (
    <nav className='w-full border-b-2 border-purple-400 py-3'>
      <div className='container mx-auto flex items-center gap-4'>
        <NavLink className='ml-1' to='/'>
          <Logo />
        </NavLink>
        <ul className='flex gap-3 text-xl'>
          <li>
            <NavLink to='/' className={getNavLinkClasses}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to='profile' className={getNavLinkClasses}>
              Profile
            </NavLink>
          </li>
        </ul>
        <div className='mr-2 inline-flex w-full justify-end gap-5'>
          <button
            type='button'
            className='float-right'
            onClick={() => {
              if (keycloak.authenticated === true) {
                void keycloak.logout();
              } else {
                void keycloak.login();
              }
            }}
          >
            <span>{keycloak.authenticated === false ? 'Login' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
