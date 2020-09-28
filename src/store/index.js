
const types = {
  GET_USER_REPO: "get_user_repo",
  GET_STARRED_REPO: "get_starred_repo",
  GET_ACCESS_TOKEN: "get_access_token",
  GET_LOGGED_USER_DATA: "get_logged_user_data",
  USER_REPO_LIST: "user_repo_list",
  ERROR : "error",
};

export const initialState = {
  logUserData: {},
  userRepo:[],
  starredRepo: [],
  data: [],
  token: "",
  error:""
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ACCESS_TOKEN: {
      return { ...state, token: action.token };
    }
    case types.GET_LOGGED_USER_DATA: {
      return { ...state, logUserData: action.logUserData };
    }
    case types.USER_REPO_LIST: {
      return { ...state, userRepo: action.userRepoList };
    }
    case types.GET_STARRED_REPO: {
      return { ...state, starredRepo: action.starredRepo };
    }
    case types.ERROR: {
      return { ...state, error: action.error };
    }
    default:
      return state;
  }
};
