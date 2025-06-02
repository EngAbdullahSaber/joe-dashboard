// Action to store user data
export function changeUserData(data) {
  return {
    type: "SET_USER_DATA",
    payload: data,
  };
}

export const setTokens = (accessToken, refreshToken) => ({
  type: "SET_TOKENS",
  payload: { accessToken, refreshToken },
});

export const removeTokens = () => ({
  type: "REMOVE_TOKENS",
});