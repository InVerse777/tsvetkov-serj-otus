// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("authbtn").addEventListener("click")
//   });

async function sendAuthReq() {
  const usrInp = document.getElementById("floatingInput");
  const pswInp = document.getElementById("floatingPassword");
  const commentx = document.getElementById("commentx");
  const rawResponse = await fetch("login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: usrInp.value, password: pswInp.value }),
  });
  console.log(rawResponse.status);
  if (rawResponse.status === 200) {
    document.cookie = rawResponse.cookie;
    window.location.assign('/courses');
    // const token = (await rawResponse.json()).token;
    // sessionStorage.setItem('token', token);
  } else {
    commentx.innerText = "Error logging in!!!";
    usrInp.value = "";
    pswInp.value = "";
  }
  //         const content = await rawResponse.json();
  //         console.log(content);

  //  sessionStorage.setItem('user', JSON.stringify(content));
  // var obj = JSON.parse(sessionStorage.user);
}
