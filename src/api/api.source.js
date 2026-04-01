import axios from "axios";

export class Globals {
  static apiUrl =
//  'http://localhost:3000';
  // 'http://51.83.167.198:4040';
    'https://api.musheas-lab.com';
}

class Api {
  constructor() {
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new Api();
    }
    return this._instance;
  }

  createAxiosInstance() {
    return axios.create({
      baseURL: Globals.apiUrl,
      timeout: 500000,
    });
  }

  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      this.handleSuccess.bind(this),
      this.handleError.bind(this)
    );
  }

  handleSuccess(response) {
    return response;
  }

  async handleError(error) {
    return Promise.reject(error);
  }

  getAxios() {
    return this.axiosInstance;
  }
}

export default Api;
