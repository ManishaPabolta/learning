export const isRequired = (value) => {
  return (
    value !== undefined &&
    value !== null &&
    String(value).trim().length > 0
  );
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
};

export const isValidPassword = (password) => {
  return password.length >= 6;
};

export const isValidOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

export const validateRegisterForm = ({
  name,
  email,
  password,
}) => {
  const errors = {};

  if (!isRequired(name)) {
    errors.name = "Name is required";
  }

  if (!isRequired(email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!isRequired(password)) {
    errors.password = "Password is required";
  } else if (!isValidPassword(password)) {
    errors.password =
      "Password must contain at least 6 characters";
  }

  return errors;
};

export const validateLoginForm = ({
  email,
  password,
}) => {
  const errors = {};

  if (!isRequired(email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!isRequired(password)) {
    errors.password = "Password is required";
  }

  return errors;
};