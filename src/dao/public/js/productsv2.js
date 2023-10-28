// Asegúrate de que este script se ejecute después de que el DOM se haya cargado.
document.addEventListener("DOMContentLoaded", () => {
  // Obtén los elementos de los botones "Next" y "Prev"
  const nextButton = document.getElementById("next-btn");
  const prevButton = document.getElementById("prev-btn");
  const productList = document.getElementById("product-list");

  // URL de la API para obtener productos paginados
  const apiUrl = "http://localhost:8080/api/products/products";
  let currentPage = 1;

  // Función para cargar la lista de productos
  async function loadProductList(page) {
    try {
      const response = await fetch(`${apiUrl}?page=${page}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const products = data.products;

      // Limpia la lista de productos actual
      productList.innerHTML = "";

      // Recorre la lista de productos y crea elementos para cada uno
      products.forEach((product) => {
        const productItem = document.createElement("li");
        productItem.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" />
            <p>${product.title}</p>
            <p>${product.price}</p>
            <p>${product.description}</p>
            <button type="submit"><a href="/products/${product._id}">See more</a></button>
          `;
        productList.appendChild(productItem);
      });
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  // Agrega eventos de clic a los botones "Next" y "Prev"
  nextButton.addEventListener("click", () => {
    currentPage++;
    loadProductList(currentPage);
  });

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadProductList(currentPage);
    }
  });

  // Llama a la función para cargar la lista de productos al cargar la página
  loadProductList(currentPage);
});
