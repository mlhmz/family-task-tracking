import { useKeycloak } from '@react-keycloak/web';

export const Profile = () => {
  const { keycloak } = useKeycloak();

  return (
    <div>
      <h1>Profile</h1>
      <p>{keycloak.tokenParsed?.preferred_username}</p>
    </div>
  );
};
