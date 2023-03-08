import axios, { CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
import Keycloak from 'keycloak-js';

export default class KeycloakAxios extends Keycloak {
  createAxiosInstance(config: CreateAxiosDefaults<any> | undefined) {
    const instance = axios.create(config);

    instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      await this.updateToken(5).catch(async () => {
        void this.login();
      });

      if (this.token != null) {
        config.headers.Authorization = 'Bearer ' + this.token;
      }

      return config;
    });

    return instance;
  }

  static get axios() {
    return axios;
  }
}
