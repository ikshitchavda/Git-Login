import React, { useReducer }   from 'react';
import { initialState, reducer } from "../store";

import GitHubLogin  from 'react-github-login';
import { getAcessToken } from "../action";
import { useHistory } from "react-router-dom";

const CLIENT_ID = "22f71f00213e8ab8d23e";

function Login() {
  let history = useHistory();

  const [state, dispatch] = useReducer(reducer, initialState);

  const onFailure = (response) => console.error(response);
  const onSuccess = async (response) => {
    if (response && response.code) {
      const token = await getAcessToken(response.code);
      dispatch({ type: "get_access_token", token: token });
      history.push("/home");
    }
  };

  return (
    <div>
        <>
          <h2 className="d-flex justify-content-center mt-3">
            Login with GitHub
          </h2>
          <div className="d-flex justify-content-center mt-3">
            <GitHubLogin
              clientId={CLIENT_ID}
              onSuccess={onSuccess}
              onFailure={onFailure}
              scope={"repo admin gist user write read delete workflow"}
              redirectUri="http://localhost:3000"
            />
          </div>
        </>
    </div>
  );
}

export default Login;