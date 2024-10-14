/* 
  Check list

    [ ] Pegar dados com o botão buscar
    [ ] Pegar os dados no servidor 
    [ ] Colocar o produto na tela
    [ ] Criar gráfico
*/

// Form
const searchForm = document.querySelector(".search-form");
const productlist = document.querySelector(".product-list");
const priceChart = document.querySelector(".price-charts");

let myChart

// pegando o input com o botão buscar
searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const inputValue = event.target[0].value;

  const data = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}&limit=1  0`
  );
  const products = await data.json();

  
  displayItems(products.results);
  updatePriceChart(products.results)
});

function displayItems(products) {
  console.log(products);
  productlist.innerHTML = products
    .map(
      (product) => `
          <div class="card">
            <img src="${product.thumbnail.replace(/\w\.jpg/gi,"W.jpg")}" alt="${product.title}">
            <h4>${product.title}</h4>
            <p class="product-price">${product.price.toLocaleString("pt-br", {style: "currency",currency: "BRL",})} </p>
            <p>${product.seller.nickname} </p>
          </div>
        `
    )
    .join("");
}

function updatePriceChart(products) {
  const ctx = priceChart.getContext("2d");

  // Verificar se já existe um gráfico e destruí-lo antes de criar um novo
  if (myChart) {
    myChart.destroy();
  }

  // Criação do gráfico
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: products.map((p) => p.title.substring(0, 20) + "..."),
      datasets: [
        {
          label: "Preço (R$)",
          data: products.map((p) => p.price),
          backgroundColor: "rgba(46, 204, 113, 0.6)",
          borderColor: "rgba(46, 204, 113, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "R$ " + value.toFixed(2);
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Comparação de Preços",
          font: {
            size: 18,
          },
        },
        // Adicionando um fundo branco ao gráfico
        background: {
          beforeDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.fillStyle = 'white';  // Cor de fundo branca
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          }
        }
      },
    },
  });
}
