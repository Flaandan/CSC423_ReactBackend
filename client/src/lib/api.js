import { customFetch } from "../utils/customFetch";

export async function apiLogin(username, password) {
  const params = {
    url: "http://localhost:8000/v1/auth/login",
    method: "POST",
    requestBody: {
      username,
      password,
    },
  };

  const response = await customFetch(params);

  if (response.error) {
    return { error: response.error };
  }

  const jwtToken = response.access_token;

  if (jwtToken) {
    return { accessToken: response.access_token };
  }
}

export async function apiChangePassword(currentPassword, newPassword, jwt) {
  const params = {
    url: "http://localhost:8000/v1/auth/change-password",
    method: "POST",
    jwt,
    requestBody: {
      current_password: currentPassword,
      new_password: newPassword,
    },
  };

  const response = await customFetch(params);

  if (response.error) {
    return { error: response.error };
  }

  return { success: response.success };
}

export async function apiCheckToken(jwt) {
  const params = {
    url: "http://localhost:8000/v1/auth/check",
    method: "GET",
    jwt,
  };

  const response = await customFetch(params);

  if (response.error) {
    return { error: response.error };
  }

  return { success: response.success };
}
