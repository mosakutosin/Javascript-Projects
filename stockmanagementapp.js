<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Supermarket Daily Sales Tracker</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }

    h1, h2 {
      text-align: center;
      color: #333;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 10px;
      text-align: center;
    }

    th {
      background-color: #007BFF;
      color: white;
    }

    td {
      background-color: #fff;
    }

    .btn {
      padding: 5px 10px;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn:hover {
      background-color: #0056b3;
    }

    input[type="number"] {
      width: 60px;
      padding: 5px;
      text-align: center;
      margin: 0 5px;
    }

    #total {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>Supermarket Daily Sales Tracker</h1>
  
  <h2>Products</h2>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Stock</th>
        <th>Price (#)</th>
        <th>Quantity to Buy</th>
      </tr>
    </thead>
    <tbody id="productTable">
      <!-- Products will be dynamically populated -->
    </tbody>
  </table>
  <div id="total">Total: #0.00</div>
  <button class="btn" onclick="checkout()">Checkout</button>

  <h2>Daily Sales</h2>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Quantity Sold</th>
        <th>Total Price (#)</th>
      </tr>
    </thead>
    <tbody id="salesTable">
      <!-- Sales will be dynamically populated -->
    </tbody>
  </table>

  <script>
    const products = [
      { name: "Apples", stock: 120, price: 300, minStock: 10 },
      { name: "Bananas", stock: 70, price: 1500, minStock: 10 },
      { name: "Milk", stock: 500, price: 200, minStock: 10 },
    ];

    let salesLog = JSON.parse(localStorage.getItem('salesLog')) || [];

    const productTable = document.getElementById("productTable");
    const salesTable = document.getElementById("salesTable");
    const totalDiv = document.getElementById("total");

    // Render products in the table
    function renderProducts() {
      productTable.innerHTML = "";
      products.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.stock}</td>
          <td>${product.price.toFixed(2)}</td>
          <td>
            <input type="number" id="quantity-${index}" min="0" max="${product.stock}" value="0">
          </td>
        `;
        productTable.appendChild(row);
      });
    }

    // Render sales log
    function renderSales() {
      salesTable.innerHTML = "";
      salesLog.forEach(sale => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${sale.product}</td>
          <td>${sale.quantity}</td>
          <td>${sale.total.toFixed(2)}</td>
        `;
        salesTable.appendChild(row);
      });
    }

    // Handle checkout process
    function checkout() {
      let total = 0;
      const today = new Date().toISOString().slice(0, 10);

      products.forEach((product, index) => {
        const quantityInput = document.getElementById(`quantity-${index}`);
        const quantity = parseInt(quantityInput.value) || 0;

        if (quantity > 0) {
          if (quantity > product.stock) {
            alert(`Not enough stock for ${product.name}!`);
          } else {
            const totalPrice = quantity * product.price;
            total += totalPrice;

            // Update stock
            product.stock -= quantity;

            // Log sale
            salesLog.push({
              date: today,
              product: product.name,
              quantity: quantity,
              total: totalPrice
            });

            if (product.stock <= product.minStock) {
              alert(`Warning: ${product.name} stock is low!`);
            }
          }
        }
      });

      // Save sales log to localStorage
      localStorage.setItem('salesLog', JSON.stringify(salesLog));

      // Update total and re-render
      totalDiv.textContent = `Total: $${total.toFixed(2)}`;
      renderProducts();
      renderSales();
    }

    // Initial render
    renderProducts();
    renderSales();
  </script>
</body>
</html>
