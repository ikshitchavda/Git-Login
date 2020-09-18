import React, { useEffect, useState } from 'react';

import GitHubLogin  from 'react-github-login';
import Home         from './home';
import NewContext   from './context';
import { isEmpty }  from 'lodash';

const CLIENT_ID     = "22f71f00213e8ab8d23e";
const REDIRECT_URI  = "http://localhost:3000/home";
const CLIENT_SECRET = "e2ba2d6a34a24c990417703ddbdd3fcb302fb972";


function Login() {
  
  const [gitUserData, setGitUserData] = useState({});
  const [isRedirect, setIsRedirect] = useState(false);
 
  const logout = () => setIsRedirect(!isRedirect);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isEmpty(token)) getUser(token);
  },[]);

  const onFailure = response => console.error(response);

  const onSuccess = async (response) => {
    if (response && response.code) {
      let myHeaders = new Headers();
      myHeaders.append('Access-Control-Allow-Origin', '*');
      myHeaders.append('Content-Type', 'application/json');

      let formdata = new FormData();
      formdata.append("client_id", CLIENT_ID);
      formdata.append("client_secret", CLIENT_SECRET);
      formdata.append("code", response.code);
      
      let requestOptions = {
        method: "POST",
        body: formdata,
        // mode: 'no-cors'
        // headers: myHeaders,
      };
      
      fetch('https://github.com/login/oauth/access_token', requestOptions)
        .then(response => response.text())
        .then(data => {
          localStorage.setItem("token", data.split("=")[1].split("&")[0]);
          getUser(data.split("=")[1].split("&")[0])
        })
        .catch(error => console.log('error', error));
    }
  };
  
  const getUser = async (token) => {
    if (token) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };

     await fetch("https://api.github.com/user", requestOptions)
        .then(response => response.json())
        .then(result => {
         if(result && result.login) {
           setGitUserData(result);
           setIsRedirect(!isRedirect);
          } 
        })
        .catch(error => console.log('error', error));
    }
  }
  const token = localStorage.getItem('token');

  return (
    <div>
      {!isRedirect && isEmpty(token) ? (
        <>
          <h2 className="d-flex justify-content-center mt-3">Login with GitHub</h2>
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
        <NewContext.Provider value={!isEmpty(gitUserData) ? gitUserData : {}}>
          <Home clickOnLogout={logout} />
        </NewContext.Provider>
      )}
    </div>
  );
}

export default Login;