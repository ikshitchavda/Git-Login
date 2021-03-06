import { isEmpty } from "lodash";
import { toast } from "react-toastify";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

export const getAcessToken = async (code) => {
  const myHeaders = new Headers();
  const formData = new FormData();

  myHeaders.append("Access-Control-Allow-Origin", "*");
  myHeaders.append("Content-Type", "application/json");

  formData.append("client_id", CLIENT_ID);
  formData.append("client_secret", CLIENT_SECRET);
  formData.append("code", code);

  let requestOptions = {
    method: "POST",
    body: formData,
  };

  return fetch("https://github.com/login/oauth/access_token", requestOptions)
      .then((response) => response.text())
    .then(data => {
          localStorage.setItem("token", data.split("=")[1].split("&")[0]);
          const token = data.split("=")[1].split("&")[0];
          console.log("getAcessToken -> token", token);
         return token;
    }).catch(error => toast.error(error));
      
}

export const getUser = async(token) => {
   if (token) {
     var myHeaders = new Headers();
     myHeaders.append("Authorization", `Bearer ${token}`);
     

     var requestOptions = {
       method: "GET",
       headers: myHeaders,
     };

    return await fetch("https://api.github.com/user", requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => toast.error(error));
   }
};

export const getUserList = async(name) => {
  return await fetch(`https://api.github.com/users/${name}/repos`)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => toast.error(error));
};

export const getStarredList = async (name) => {
    return fetch(`https://api.github.com/users/${name}/starred`)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => toast.error(error));  
  
}

export const searchBox = async (searchVal, logUserName) => {
  return fetch(`https://api.github.com/search/repositories?q=${searchVal}&per_page=25`)
        .then((response) => response.json())
        .then((result) => result)
        .catch(error => toast.error(error));
};

export const addStarredRepo = async (author, repo, token) => {
  if (isEmpty(token)) token = localStorage.getItem("token");
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

    return await fetch(`https://api.github.com/user/starred/${author}/${repo}`, {
        method: 'PUT',
        headers: myHeaders,
      })
    .then(result => result)
    .catch(error => toast.error(error));
};

export const removeStarredRepo = async (author, repo, token) => {
  if (isEmpty(token)) token = localStorage.getItem('token');
  
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

  return await fetch(`https://api.github.com/user/starred/${author}/${repo}`, {
    method: "DELETE",
    headers: myHeaders,
  })
    .then(response => response)
    .catch(error => toast.error(error));
};



