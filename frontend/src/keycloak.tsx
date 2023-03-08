import KeycloakAxios from './KeycloakAxios';

const keycloak = new KeycloakAxios({
  url: 'http://localhost:8080/auth',
  realm: 'ftt',
  clientId: 'ftt'
});

export default keycloak;
