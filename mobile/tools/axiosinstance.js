import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "./url";

const axiosInstance = axios.create({
  baseURL: `http://${url}`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `http://${url}/auth/refresh-token`,
            {
              token: refreshToken,
            }
          );

          await AsyncStorage.setItem("accessToken", response.data.accessToken);

          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed", refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
