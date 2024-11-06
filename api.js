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
// New Code //
export const apiCreateCourse = async (jwt, courseData) => {
  try {
    const response = await fetch("http://localhost:8000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`, // Include JWT token here
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create course");
    }

    return await response.json(); // Return the created course data
  } catch (error) {
    console.error("Error creating course:", error);
    return { error: error.message };
  }
};

