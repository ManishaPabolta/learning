import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  sendOTP as sendOTPApi,
  verifyOTP as verifyOTPApi,
  loginUser as loginUserApi,
  logoutUser as logoutUserApi,
  getCurrentUser as getCurrentUserApi,
} from "../services/authService";

import {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  setUser,
  getUser,
  clearAuthStorage,
} from "../utils/storage";

import { getErrorMessage } from "../utils/helpers";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ==================================================
  // STATE
  // ==================================================

  const [user, setUserState] = useState(() => {
    return getUser();
  });

  // Access token ko state mein rakhenge
  const [accessToken, setAccessTokenState] = useState(() => {
    return getAccessToken();
  });

  const [isAuthenticated, setIsAuthenticated] =
    useState(() => {
      return Boolean(getAccessToken());
    });

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [authError, setAuthError] = useState(null);

  const [registrationData, setRegistrationData] =
    useState(null);

  const [otpData, setOtpData] = useState(null);

  // ==================================================
  // SAVE USER
  // ==================================================

  const saveUser = (userData) => {
    setUserState(userData);

    setUser(userData);

    setIsAuthenticated(true);
  };

  // ==================================================
  // CLEAR ERROR
  // ==================================================

  const clearAuthError = () => {
    setAuthError(null);
  };

  // ==================================================
  // SEND OTP
  // ==================================================

  const sendOTP = async (data) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);

      const cleanData = {
        name: data.name?.trim(),
        email: data.email?.trim().toLowerCase(),
        password: data.password,
        role: data.role || "user",
      };

      const response =
        await sendOTPApi(cleanData);

      // Store registration data
      setRegistrationData(cleanData);

      // Store OTP response
      setOtpData(response);

      return response;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to send OTP"
      );

      setAuthError(message);

      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================================================
  // VERIFY OTP
  // ==================================================

  const verifyOTP = async (email, otp) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);

      if (!email) {
        throw new Error(
          "Email is missing. Please register again."
        );
      }

      if (!otp) {
        throw new Error(
          "OTP is required."
        );
      }

      const cleanEmail =
        email.trim().toLowerCase();

      const cleanOTP =
        String(otp).trim();

      const response =
        await verifyOTPApi({
          email: cleanEmail,
          otp: cleanOTP,
        });

      // Registration successful
      setRegistrationData(null);
      setOtpData(null);

      return response;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "OTP verification failed"
      );

      setAuthError(message);

      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================================================
  // LOGIN
  // ==================================================

  const login = async (email, password) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);

      if (!email || !password) {
        throw new Error(
          "Email and password are required."
        );
      }

      const cleanEmail =
        email.trim().toLowerCase();

      const response =
        await loginUserApi({
          email: cleanEmail,
          password,
        });

      // ==================================================
      // CHECK ACCESS TOKEN
      // ==================================================

      if (!response?.accessToken) {
        throw new Error(
          "Access token was not received."
        );
      }

      // ==================================================
      // SAVE ACCESS TOKEN
      // ==================================================

      setAccessToken(
        response.accessToken
      );

      // IMPORTANT:
      // Update React state also
      setAccessTokenState(
        response.accessToken
      );

      // ==================================================
      // SAVE REFRESH TOKEN
      // ==================================================

      if (response.refreshToken) {
        setRefreshToken(
          response.refreshToken
        );
      }

      // ==================================================
      // SAVE USER
      // ==================================================

      if (response.user) {
        saveUser(response.user);
      }

      return response;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Login failed"
      );

      setAuthError(message);

      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const logout = async () => {
    try {
      setIsSubmitting(true);

      if (getAccessToken()) {
        await logoutUserApi();
      }
    } catch (error) {
      console.error(
        "Logout API Error:",
        error
      );
    } finally {
      // Clear storage
      clearAuthStorage();

      // Clear React state
      setAccessTokenState(null);
      setUserState(null);
      setIsAuthenticated(false);

      setRegistrationData(null);
      setOtpData(null);
      setAuthError(null);

      setIsSubmitting(false);
    }
  };

  // ==================================================
  // REFRESH USER
  // ==================================================

  const refreshUser = async () => {
    try {
      const response =
        await getCurrentUserApi();

      if (response?.user) {
        saveUser(response.user);

        // Make sure token state is also updated
        setAccessTokenState(
          getAccessToken()
        );

        return response.user;
      }

      return null;
    } catch (error) {
      console.error(
        "Unable to refresh user:",
        error
      );

      return null;
    }
  };

  // ==================================================
  // INITIALIZE AUTH
  // ==================================================

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken =
        getAccessToken();

      const refreshToken =
        getRefreshToken();

      // Keep token in React state
      setAccessTokenState(
        storedAccessToken
      );

      // No token
      if (
        !storedAccessToken &&
        !refreshToken
      ) {
        setIsAuthenticated(false);
        setIsLoading(false);

        return;
      }

      try {
        const response =
          await getCurrentUserApi();

        if (response?.user) {
          saveUser(response.user);

          // Update token again
          setAccessTokenState(
            getAccessToken()
          );
        } else {
          clearAuthStorage();

          setAccessTokenState(null);
          setUserState(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(
          "Authentication initialization failed:",
          error
        );

        clearAuthStorage();

        setAccessTokenState(null);
        setUserState(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ==================================================
  // CONTEXT VALUE
  // ==================================================

  const value = {
    // ==================================================
    // USER
    // ==================================================

    user,

    setUser: saveUser,

    // ==================================================
    // AUTHENTICATION
    // ==================================================

    isAuthenticated,

    isLoading,

    isSubmitting,

    // ==================================================
    // ACCESS TOKEN
    // ==================================================

    accessToken,

    // ==================================================
    // ERROR
    // ==================================================

    authError,

    clearAuthError,

    // ==================================================
    // REGISTRATION
    // ==================================================

    registrationData,

    otpData,

    // ==================================================
    // METHODS
    // ==================================================

    sendOTP,

    verifyOTP,

    login,

    logout,

    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================================================
// CUSTOM HOOK
// ==================================================

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;