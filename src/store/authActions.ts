import { AppDispatch } from "../store";
import { loginStart, loginSuccess, loginFailure } from "./slices/authSlice";

export const loginUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());

      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token);

      // ✅ Dispatch success with user data (which includes userId)
      dispatch(loginSuccess(data.user));
    } catch (err: any) {
      dispatch(loginFailure(err.message));
    }
  };
