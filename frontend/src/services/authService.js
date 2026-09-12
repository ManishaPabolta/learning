import api from "./api";

/*
|--------------------------------------------------------------------------
| Send OTP
|--------------------------------------------------------------------------
*/

export const sendOTP = async (data) => {
  const response = await api.post(
    "/auth/send-otp",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Verify OTP
|--------------------------------------------------------------------------
*/

export const verifyOTP = async (data) => {
  const response = await api.post(
    "/auth/verify-otp",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export const registerUser = async (data) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const loginUser = async (data) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Refresh Token
|--------------------------------------------------------------------------
*/

export const refreshToken = async (
  refreshTokenValue
) => {
  const response = await api.post(
    "/auth/refresh-token",
    {
      refreshToken: refreshTokenValue,
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logoutUser = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export const getCurrentUser = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};