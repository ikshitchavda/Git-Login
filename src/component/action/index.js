import { isEmpty } from "lodash";

const myHeaders = new Headers();
const formData = new FormData();

const CLIENT_ID = "22f71f00213e8ab8d23e";
const CLIENT_SECRET = "e2ba2d6a34a24c990417703ddbdd3fcb302fb972";

export const getAcessToken = async(code) => {
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
          const token = data.split("=")[1].split("&")[0];
          localStorage.setItem("token", token);
        return token;
      }).catch((error) => console.log("error", error));
      
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
       .then(result => result)
       .catch((error) => console.log("error", error));
   }
};

export const getUserList = async(name) => {
  return await fetch(`https://api.github.com/users/${name}/repos`)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));
};

export const getStarredList = async (name) => {
    return fetch(`https://api.github.com/users/${name}/starred`)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));  
  
}

export const searchBox = async (searchVal, logUserName) => {
  // return fetch(`https://api.github.com/repos/${searchVal}`)
  return fetch(`https://api.github.com/search/repositories?q=${searchVal}&per_page=25`)
        .then((response) => response.json())
        .then((result) => result)
        .catch((error) => console.log("error", error));
};

export const addStarredRepo = async (author, repo, token) => {
  if (isEmpty(token)) token = localStorage.getItem("token");
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

    return await fetch(`https://api.github.com/user/starred/${author}/${repo}`, {
        method: 'PUT',
        headers: myHeaders,
      })
    // .then(response => response.status === 204 ? setTimeout(() => { window.location.reload() }, 2000)  : response.json())
    // .then(response => response.status === 204 ? setTimeout(() => { getStarredList }, 2000)  : response.json())
    .then(result => result)
    .catch((error) => console.log("error", error));
};

export const removeStarredRepo = async (author, repo, token) => {
  if (isEmpty(token)) token = localStorage.getItem('token');
  
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

  return await fetch(`https://api.github.com/user/starred/${author}/${repo}`, {
    method: "DELETE",
    headers: myHeaders,
  })
    // .then(response => response.status === 204 ? setTimeout(() => { window.location.reload() }, 2000)  : response.json())
    .then(response => response)
    .catch((error) => console.log("error", error));
};



