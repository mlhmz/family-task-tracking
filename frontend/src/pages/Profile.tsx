import { useKeycloak } from '@react-keycloak/web';
import { KeycloakProfile } from 'keycloak-js';
import { useCallback, useEffect, useState } from 'react';

export const Profile = () => {
  const { keycloak } = useKeycloak();
  const [userProfile, setUserProfile] = useState<KeycloakProfile | null>(null);

  const loadUserProfile = useCallback(() => {
    keycloak.loadUserProfile().then((profile) => setUserProfile(profile));
  }, [keycloak]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  return (
    <div className='mt-8 flex flex-col text-center'>
      <h1 className='mb-4 text-4xl font-bold text-purple-400'>Profile</h1>
      <span className='font-semibold'>
        Username: {userProfile && userProfile.username}
      </span>
      <span className='font-semibold'>
        Email: {userProfile && userProfile.email}
      </span>
      <span className='font-semibold'>ID: {userProfile && userProfile.id}</span>
    </div>
  );
};
