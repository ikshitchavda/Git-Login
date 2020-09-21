import React, { useEffect, useReducer, useState } from 'react';
import { getAcessToken, getUser }       from "./action";
import { getStarredList, getUserList }  from "./action";
import { initialState, reducer }        from "./store";

import GitHubLogin  from 'react-github-login';
import Home         from './home';
import NewContext   from './context';
import { isEmpty }                      from 'lodash';

const CLIENT_ID = "22f71f00213e8ab8d23e";
const token = localStorage.getItem("token");


function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isRedirect, setIsRedirect] = useState(false);

  const logout = () => {setIsRedirect(!isRedirect)}

  useEffect(() => {
    if (token && !isEmpty(token)) getUserData(token);
  }, []);

  const getUserData = async(token) => {
    const logUserData = await getUser(token);

    dispatch({ type: "get_logged_user_data", logUserData: logUserData });
    setIsRedirect(!isRedirect);
    
    if (!isEmpty(logUserData)) getUserRepo(logUserData.login);
      
  }
  const getUserRepo = async (name) => {
    const userRepo = await getUserList(name);
    
    if (!userRepo.message && name) {
      dispatch({ type: "user_repo_list", userRepoList: userRepo });
      getStarredRepoList(name);
    } else {
      dispatch({ type: "error", error: userRepo && userRepo.message });
    } 
  };

   const getStarredRepoList = async (name) => {
     const userStarredRepo = await getStarredList(name);
      if (!userStarredRepo.message && name) {
        dispatch({ type: "get_starred_repo", starredRepo: userStarredRepo });
      } else {
        dispatch({ type: "error", error: userStarredRepo && userStarredRepo.message });
      } 
     
   };

  const onFailure = (response) => console.error(response);
  const onSuccess = async (response) => {
    if (response && response.code) {
      const token = await getAcessToken(response.code);
      dispatch({ type: "get_access_token", token: token });
      await getUserData(token);
    }
  };

  return (
    <div>
      {!isRedirect && isEmpty(token) ? (
        <>
          <h2 className="d-flex justify-content-center mt-3">
            Login with GitHub
          </h2>
          <div className="d-flex justify-content-center mt-3">
            <GitHubLogin
              clientId={CLIENT_ID}
              onSuccess={onSuccess}
              onFailure={onFailure}
              redirectUri="http://localhost:3000"
            />
          </div>
        </>
      ) : (
        <NewContext.Provider value={{ state, dispatch }}>
          <Home clickOnLogout={logout} />
        </NewContext.Provider>
      )}
    </div>
  );
}

export default Login;