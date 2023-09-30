console.log("Probando cliente desde Real Time Products...");
const socket = io();

// DOM elements
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const code = document.getElementById("code");
  const price = document.getElementById("price");
  const category = document.getElementById("category");
  const thumbnail = document.getElementById("thumbnail");
  const table = document.getElementById("table");
  const tbody = document.getElementById("tbody");

  // funciones
  const renderProducts = (data) => {
    const html = data
      .map(
        (product) => `
            <tr>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.code}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td>${product.thumbnail}</td>
            </tr>
            `
      )
      .join(" ");
    tbody.innerHTML = html;
  };

  // events
  form.onsubmit = (e) => {
    e.preventDefault();
    const product = {
      title: title.value,
      description: description.value,
      code: code.value,
      price: price.value,
      category: category.value,
      thumbnail: thumbnail.value,
    };
    socket.emit("new-product", product);
    form.reset();
  };

  // listen events
  socket.on("new-product-list", (data) => {
    console.log("Nueva lista de productos recibida!");
    renderProducts(data);
  });
});
