const socket = io();

document.querySelector("#register").addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const photo = document.querySelector("#photo").value;
    const userData = { name, email, password, photo }
    socket.emit("new user", userData)

})

socket.on("update user", (data) => {
    const usersHtml = data
      .map(user => `<div>${user.name} - ${user.email}</div>`)
      .join("");
    document.querySelector("#update").innerHTML = usersHtml;
})