// Asegúrate de que este script se ejecute después de que el DOM se haya cargado.
document.addEventListener("DOMContentLoaded", () => {
  // Obtén el elemento del título del producto y el contenedor del producto
  const productTitle = document.getElementById("product-title");
  const productContainer = document.getElementById("product-container");
  const addToCartButton = document.getElementById("add-to-cart-btn");

  // Extrae el ID del producto de la URL actual
  const url = window.location.href;
  const productId = url.substring(url.lastIndexOf("/") + 1);

  addToCartButton.addEventListener("click", () => {
    fetch(
      `http://localhost:8080/api/carts/cart/653360e2c3e730f42eadf726/product/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: 1 }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Product added to cart:", data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });

  // Realiza una solicitud fetch al servidor para obtener la información del producto
  fetch(`http://localhost:8080/api/products/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Actualiza el título y el contenido del producto con los datos recibidos
      productTitle.textContent = `Product: ${data.product._id}`;
      const productInfo = document.createElement("div");
      productInfo.innerHTML = `
            <img src="${data.product.thumbnail}" alt="${data.product.title}" />
            <h3>${data.product.title}</h3>
            <p>${data.product.description}</p>
            <p>Price: ${data.product.price}</p>
        `;
      productContainer.appendChild(productInfo);
    })
    .catch((error) => {
      console.log("Error:", error);
      // En caso de error, muestra un mensaje de error en lugar de los detalles del producto
      productTitle.textContent = "Product Details Not Found";
    });
});
