document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          sessionStorage.setItem("loggedIn", true);
          window.location.href = "/dashboard.html";
        } else {
          alert("Neplatné přihlašovací údaje.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
