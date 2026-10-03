/* =========================================
   HOMEPINT FRONTEND DEMO
========================================= */


/* =========================================
   DEMO LOCAL STORAGE
========================================= */

let orders = JSON.parse(
  localStorage.getItem("homeprint_orders") || "[]"
);


/* =========================================
   NAVIGATION
========================================= */

function scrollToOrder() {

  document
    .getElementById("order")
    .scrollIntoView({
      behavior: "smooth"
    });

}


function scrollToHow() {

  document
    .getElementById("how")
    .scrollIntoView({
      behavior: "smooth"
    });

}


function showOperator() {

  document
    .getElementById("customerPage")
    .style.display = "none";

  document
    .getElementById("operatorPage")
    .style.display = "block";

  updateDashboard();

  window.scrollTo(0, 0);

}


function showCustomer() {

  document
    .getElementById("operatorPage")
    .style.display = "none";

  document
    .getElementById("customerPage")
    .style.display = "block";

  window.scrollTo(0, 0);

}


/* =========================================
   FILE UPLOAD
========================================= */

function fileSelected() {

  const file =
    document
      .getElementById("file")
      .files[0];

  const fileName =
    document.getElementById("fileName");


  if (!file) {

    fileName.innerText =
      "No file selected";

    return;

  }


  fileName.innerText =
    file.name;

}


/* =========================================
   PRICE CALCULATION
========================================= */

function calculatePrice() {

  const pages =
    Number(
      document.getElementById("pages").value
    ) || 0;


  const copies =
    Number(
      document.getElementById("copies").value
    ) || 1;


  const printType =
    document
      .querySelector(
        'input[name="printType"]:checked'
      )
      .value;


  const lamination =
    Number(
      document.getElementById("lamination").value
    );


  const fulfilment =
    document
      .querySelector(
        'input[name="fulfilment"]:checked'
      )
      .value;


  let pricePerPage = 1;


  if (printType === "color") {

    pricePerPage = 5;

  }


  const printing =
    pages *
    copies *
    pricePerPage;


  const laminationCost =
    lamination * 10;


  const delivery =
    fulfilment === "delivery"
      ? 20
      : 0;


  const total =
    printing +
    laminationCost +
    delivery;


  document
    .getElementById("printingPrice")
    .innerText =
    "₹" + printing;


  document
    .getElementById("laminationPrice")
    .innerText =
    "₹" + laminationCost;


  document
    .getElementById("deliveryPrice")
    .innerText =
    "₹" + delivery;


  document
    .getElementById("totalPrice")
    .innerText =
    "₹" + total;


  return {

    printing,

    laminationCost,

    delivery,

    total

  };

}


/* =========================================
   PLACE ORDER
========================================= */

function placeOrder() {

  const file =
    document
      .getElementById("file")
      .files[0];


  const name =
    document
      .getElementById("customerName")
      .value
      .trim();


  const phone =
    document
      .getElementById("phone")
      .value
      .trim();


  if (!file) {

    alert(
      "Please select a document first."
    );

    return;

  }


  if (!name || !phone) {

    alert(
      "Please enter your name and phone number."
    );

    return;

  }


  const price =
    calculatePrice();


  const orderNumber =
    "HP" +
    Math.floor(
      1000 +
      Math.random() * 9000
    );


  const order = {

    id: Date.now(),

    orderNumber,

    customer: name,

    phone,

    fileName: file.name,

    pages:
      Number(
        document.getElementById("pages").value
      ),

    copies:
      Number(
        document.getElementById("copies").value
      ),

    printType:
      document
        .querySelector(
          'input[name="printType"]:checked'
        )
        .value,

    side:
      document
        .querySelector(
          'input[name="side"]:checked'
        )
        .value,

    lamination:
      Number(
        document.getElementById("lamination").value
      ),

    fulfilment:
      document
        .querySelector(
          'input[name="fulfilment"]:checked'
        )
        .value,

    total:
      price.total,

    status:
      "New",

    createdAt:
      new Date().toISOString()

  };


  orders.unshift(order);


  localStorage.setItem(
    "homeprint_orders",
    JSON.stringify(orders)
  );


  document
    .getElementById("newOrderNumber")
    .innerText =
    orderNumber;


  document
    .getElementById("successModal")
    .style.display =
    "grid";


  updateDashboard();

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

  document
    .getElementById("successModal")
    .style.display =
    "none";

}


/* =========================================
   TRACK ORDER
========================================= */

function trackOrder() {

  const number =
    document
      .getElementById("trackingNumber")
      .value
      .trim()
      .toUpperCase();


  const result =
    document
      .getElementById("trackingResult");


  const order =
    orders.find(
      order =>
        order.orderNumber === number
    );


  result.style.display =
    "block";


  if (!order) {

    document
      .getElementById("trackedFile")
      .innerText =
      "Order not found";


    document
      .getElementById("trackedDetails")
      .innerText =
      "Please check your order number.";


    document
      .getElementById("trackedStatus")
      .innerText =
      "NOT FOUND";


    return;

  }


  document
    .getElementById("trackedFile")
    .innerText =
    order.fileName;


  document
    .getElementById("trackedDetails")
    .innerText =

    `${order.pages} pages • ` +

    `${order.printType === "bw"
      ? "B&W"
      : "Colour"} • ` +

    `₹${order.total}`;


  document
    .getElementById("trackedStatus")
    .innerText =
    order.status.toUpperCase();

}


/* =========================================
   OPERATOR DASHBOARD
========================================= */

function updateDashboard() {

  const newOrders =
    orders.filter(
      order =>
        order.status === "New"
    ).length;


  const printingOrders =
    orders.filter(
      order =>
        order.status === "Printing"
    ).length;


  const readyOrders =
    orders.filter(
      order =>
        order.status === "Ready"
    ).length;


  const revenue =
    orders.reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );


  document
    .getElementById("newOrders")
    .innerText =
    newOrders;


  document
    .getElementById("printingOrders")
    .innerText =
    printingOrders;


  document
    .getElementById("readyOrders")
    .innerText =
    readyOrders;


  document
    .getElementById("todayRevenue")
    .innerText =
    "₹" + revenue;


  document
    .getElementById("orderCount")
    .innerText =
    `${orders.length} orders`;


  renderOrders();

}


/* =========================================
   RENDER ORDERS
========================================= */

function renderOrders() {

  const container =
    document.getElementById("ordersList");


  if (orders.length === 0) {

    container.innerHTML = `

      <div class="empty-orders">

        <div>📭</div>

        <h3>
          No orders yet
        </h3>

        <p>
          New customer orders will appear here.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    orders
      .map(order => `

        <div class="order-card">

          <div>

            <div class="order-id">
              ${order.orderNumber}
            </div>

            <div class="order-file">
              ${order.customer}
            </div>

          </div>


          <div>

            <strong>
              ${order.fileName}
            </strong>

            <div class="order-file">

              ${order.pages} pages ×
              ${order.copies} copy/copies

              •

              ${
                order.printType === "bw"
                  ? "B&W"
                  : "Colour"
              }

              •

              ${
                order.side === "single"
                  ? "Single"
                  : "Double"
              }

            </div>

            <div class="order-file">

              ${
                order.lamination > 0
                  ? "🛡️ Lamination × " +
                    order.lamination
                  : "No lamination"
              }

              •

              ${
                order.fulfilment === "delivery"
                  ? "🚚 Delivery"
                  : "🏠 Pickup"
              }

            </div>

          </div>


          <div>

            <strong>
              ₹${order.total}
            </strong>

            <br>

            <span
              class="
                order-status
                ${getStatusClass(order.status)}
              ">

              ${order.status}

            </span>

          </div>


          <div>

            ${getActionButton(order)}

          </div>

        </div>

      `)
      .join("");

}


/* =========================================
   STATUS CLASS
========================================= */

function getStatusClass(status) {

  if (status === "New")
    return "new";


  if (status === "Printing")
    return "printing";


  if (status === "Ready")
    return "ready";


  return "completed";

}


/* =========================================
   OPERATOR ACTION
========================================= */

function getActionButton(order) {

  if (order.status === "New") {

    return `

      <button
        class="order-action"
        onclick="
          changeStatus(
            ${order.id},
            'Printing'
          )
        ">

        ▶ Start Printing

      </button>

    `;

  }


  if (order.status === "Printing") {

    return `

      <button
        class="order-action"
        onclick="
          changeStatus(
            ${order.id},
            'Ready'
          )
        ">

        ✓ Mark Ready

      </button>

    `;

  }


  if (order.status === "Ready") {

    return `

      <button
        class="order-action"
        onclick="
          changeStatus(
            ${order.id},
            'Completed'
          )
        ">

        ✓ Complete

      </button>

    `;

  }


  return `
    <span class="muted">
      Completed
    </span>
  `;

}


/* =========================================
   CHANGE STATUS
========================================= */

function changeStatus(
  id,
  status
) {

  const order =
    orders.find(
      order =>
        order.id === id
    );


  if (!order)
    return;


  order.status =
    status;


  localStorage.setItem(
    "homeprint_orders",
    JSON.stringify(orders)
  );


  updateDashboard();

}


/* =========================================
   INITIALIZE
========================================= */

calculatePrice();
