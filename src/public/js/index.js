console.log("Probando cliente...");
const socket = io();

const chat = document.getElementById("chat");
const form = document.getElementById("chatForm");
const chatMessage = document.getElementById("chatMessage");

form.onsubmit = (e) => {
  e.preventDefault();

  const messageData = {
    name: user.first_name,
    email: user.email,
    message: chatMessage.value,
  };

  // Realizar una solicitud POST al servidor
  fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify(messageData),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error al enviar el mensaje:", error);
    });

  // Enviar el mensaje al servidor
  socket.emit("new-message", messageData);

  // Limpiar el campo de entrada después de enviar el mensaje
  chatMessage.value = "";
};

// Recibir los mensajes del servidor
socket.on("messages", (messages) => {
  chat.innerHTML = messages
    .map((message) => {
      return `<div>
                <strong style="color: blue;">${message.name}</strong>
                <span style="color: green;">${message.message}</span>
              </div>`;
    })
    .join(" ");
});
