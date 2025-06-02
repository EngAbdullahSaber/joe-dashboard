import Cookies from "js-cookie";

const initialState = {
  lang: "en",
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  accessToken: Cookies.get("accessToken") || null,
  refreshToken: Cookies.get("refreshToken") || null,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER_DATA":
      // Set the user in cookies and stringify it to store as a string
      Cookies.set("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload };

    case "SET_TOKENS":
      // Set the access and refresh tokens in cookies
      Cookies.set("accessToken", action.payload.accessToken);
      Cookies.set("refreshToken", action.payload.refreshToken);
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };

    case "REMOVE_TOKENS":
      // Remove the access and refresh tokens from cookies
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return { ...state, accessToken: null, refreshToken: null };

    default:
      return state;
  }
}
