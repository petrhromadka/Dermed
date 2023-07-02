function getPosts() {
  fetch("/posts")
    .then((response) => response.json())
    .then((posts) => {
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";

      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className =
          "bg-black p-5 m-5 border border-red-500 rounded text-black";

        const titleElement = document.createElement("h2");
        titleElement.className = "text-xl";
        titleElement.innerText = post.title;

        const dateElement = document.createElement("h3");
        dateElement.className = "text-lg";
        dateElement.innerText = post.date;

        const contentElement = document.createElement("p");
        contentElement.className = "mt-4";
        contentElement.innerText = post.content;

        postElement.appendChild(titleElement);
        postElement.appendChild(dateElement);
        postElement.appendChild(contentElement);

        if (checkLoggedIn()) {
          const deleteButton = document.createElement("button");
          deleteButton.innerText = "Smazat";
          deleteButton.className =
            "px-4 py-2 mt-5 border rounded text-black cursor-pointer ml-6";

          deleteButton.addEventListener("click", () => {
            deletePost(post.id);
          });

          postElement.appendChild(deleteButton);
        }

        postsContainer.appendChild(postElement);
      });
    });
}

function checkLoggedIn() {
  return Boolean(sessionStorage.getItem("loggedIn"));
}

document
  .getElementById("postForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var postDate = document.getElementById("postDate").value;
    var postTitle = document.getElementById("postTitle").value;
    var postContent = document.getElementById("postContent").value;

    fetch("/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: postDate,
        title: postTitle,
        content: postContent,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          getPosts();
        } else {
          alert("Nepodařilo se přidat příspěvek.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

function deletePost(id) {
  fetch("/post/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        getPosts();
      } else {
        alert("Nepodařilo se smazat příspěvek.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

getPosts();
