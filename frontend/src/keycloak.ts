import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'ftt',
  clientId: 'ftt',
});

export default keycloak;
