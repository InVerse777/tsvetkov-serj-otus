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
  if (rawResponse.status === 200) {
    document.cookie = rawResponse.cookie;
    window.location.assign("/courses");
  } else {
    commentx.innerText = "Error logging in!!!";
    usrInp.value = "";
    pswInp.value = "";
  }
}
