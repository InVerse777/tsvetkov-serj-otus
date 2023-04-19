function publishComment(lesson_id) {
  const ct = document.getElementById("commentText").value;
  fetch(`/comment/${lesson_id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({

      commentText: ct,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      const myModalEl = document.getElementById("commentModal");
      var modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();
      document.getElementById("commentText").value = "";
      window.location.reload();
    });
}

function revokeAccess(course_id, userName) {
  fetch(`/course/access/${course_id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      userName: userName,
    }),
  })
    .then((response) => response.json())
    .then((response) => window.location.reload());
}
function grantAccess(course_id) {
  const un = document.getElementById("username").value;
  console.log(`Username:${un}`);
  fetch(`/course/access/${course_id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: un,
    }),
  })
    .then((response) => response.json())
    .then((response) => window.location.reload());
}

function publishCourse() {
  const ct = document.getElementById("courseTitle").value;
  const cd = document.getElementById("courseDescription").value;
  fetch("/course", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseTitle: ct,
      courseDescription: cd,
    }),
  })
    .then((response) => response.json())
    .then((response) => window.location.assign(`/course/${response.id}`));
}
function removeCourse(id) {
  fetch(`/course/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((response) => document.getElementById(id).remove())
    .catch((err) => console.log(`Wow, something went wrong, error:${err}`));
}
function removeLesson(id) {
  fetch(`/lesson/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((response) => document.getElementById(id).remove())
    .catch((err) => console.log(`Wow, something went wrong, error:${err}`));
}
function editCourse(id) {
  const ct = document.getElementById("courseTitle").value;
  const cd = document.getElementById("courseDescription").value;
  fetch(`/course/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseTitle: ct,
      courseDescription: cd,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      const myModalEl = document.getElementById("editCourseModal");
      var modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();
      document.getElementById("ttl").innerText = ct;
      document.getElementById("dsc").innerText = cd;
    });
}
function addResource(lesson_id) {
  const vt = document.getElementById("fnltype").value;
  const lnk = document.getElementById("rslink").value;
  const desc = document.getElementById("fileDescription").value;
  fetch(`/resource/${lesson_id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fnltype: vt,
      fileDescription: desc,
      rLink: lnk,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      const myModalEl = document.getElementById("addResourceModal");
      var modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();
      document.getElementById("fnltype").value = "";
      document.getElementById("rslink").value = "";
      document.getElementById("fileDescription").value = "";
      window.location.reload();
    });
}
function addLesson(id) {
  const lt = document.getElementById("lessonTitle").value;
  const ld = document.getElementById("lessonDescription").value;
  course_id = fetch(`/lesson/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "lessonTitle": lt,
      "lessonDescription": ld,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      window.location.reload();
    });
}
