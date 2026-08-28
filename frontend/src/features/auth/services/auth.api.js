import api from "../../../api/axios.js";

/**
 * @description Signup a new user
 * @access public
 * @params username, email, password
 */
export async function signup({ username, email, password }) {
  try {
    const response = await api.post(
      "/api/auth/signup",
      {
        username,
        email,
        password,
      },
      { withCredentials: true },
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Login a user
 * @access public
 * @params email, password
 */
export async function login({ email, password }) {
  try {
    const response = await api.post(
      "/api/auth/login",
      { email, password },
      { withCredentials: true },
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Logout a user
 * @access private
 * @params void
 */
export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Get current user
 * @access private
 * @params void
 */
export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");

    return response.data;
  } catch (err) {
    console.log(err);
  }
}
