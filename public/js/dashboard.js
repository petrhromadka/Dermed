function checkLoggedIn() {
  // Kontrola stavu přihlášení uživatele
  return Boolean(sessionStorage.getItem("loggedIn"));
}

function showDashboardContent() {
  const dashboardContent = document.getElementById("dashboardContent");
  dashboardContent.classList.remove("hidden");
}

// Kontrola stavu přihlášení a zobrazení/skrytí obsahu
fetch("/check-auth").then((response) => {
  if (response.ok) {
    showDashboardContent();
  } else {
    window.location.href = "/login.html";
  }
});
