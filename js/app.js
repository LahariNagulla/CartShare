const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");

const homeSection = document.getElementById("homeSection");
const roomSection = document.getElementById("roomSection");
const cartSection = document.getElementById("cartSection");

const roomTitle = document.getElementById("roomTitle");
const userName = document.getElementById("userName");
const roomCode = document.getElementById("roomCode");
const enterRoomBtn = document.getElementById("enterRoomBtn");
const roomMessage = document.getElementById("roomMessage");

const displayRoomCode = document.getElementById("displayRoomCode");
const displayUserName = document.getElementById("displayUserName");

const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const itemQuantity = document.getElementById("itemQuantity");
const addItemBtn = document.getElementById("addItemBtn");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const activityLog = document.getElementById("activityLog");
const printReceiptBtn = document.getElementById("printReceiptBtn");

let currentRoom = "";
let currentUser = "";


/* =========================
   CREATE ROOM
========================= */

createRoomBtn.addEventListener("click", () => {

    roomTitle.textContent = "Create Your Room";

    roomSection.classList.remove("hidden");
    homeSection.classList.add("hidden");

    roomCode.value = generateRoomCode();
    roomCode.readOnly = true;

    roomMessage.textContent =
        "Your room code has been generated.";

});


/* =========================
   JOIN ROOM
========================= */

joinRoomBtn.addEventListener("click", () => {

    roomTitle.textContent = "Join a Room";

    roomSection.classList.remove("hidden");
    homeSection.classList.add("hidden");

    roomCode.value = "";
    roomCode.readOnly = false;

    roomMessage.textContent =
        "Enter the room code shared by your group.";

});


/* =========================
   GENERATE ROOM CODE
========================= */

function generateRoomCode() {

    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

}


/* =========================
   ENTER ROOM
========================= */

enterRoomBtn.addEventListener("click", () => {

    const name = userName.value.trim();
    const code = roomCode.value.trim().toUpperCase();

    if (name === "") {

        roomMessage.textContent =
            "Please enter your name.";

        userName.focus();

        return;
    }

    if (code === "") {

        roomMessage.textContent =
            "Please enter a room code.";

        roomCode.focus();

        return;
    }

    currentUser = name;
    currentRoom = code;

    localStorage.setItem(
        "cartShareUser",
        currentUser
    );

    localStorage.setItem(
        "cartShareRoom",
        currentRoom
    );

    displayRoomCode.textContent = currentRoom;
    displayUserName.textContent = currentUser;

    roomSection.classList.add("hidden");
    cartSection.classList.remove("hidden");

    loadCart();
    loadActivity();

});


/* =========================
   STORAGE KEYS
========================= */

function getCartKey() {

    return `cartShareCart_${currentRoom}`;

}


function getActivityKey() {

    return `cartShareActivity_${currentRoom}`;

}


/* =========================
   LOAD CART
========================= */

function loadCart() {

    const savedCart =
        localStorage.getItem(getCartKey());

    const cart =
        savedCart
            ? JSON.parse(savedCart)
            : [];

    displayCart(cart);

}


/* =========================
   DISPLAY CART
========================= */

function displayCart(cart) {

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-activity">
                🛍️ Nothing here yet. Add your first item!
            </p>
        `;

        cartTotal.textContent = "0.00";

        return;
    }

    cart.forEach((item, index) => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);

        total += itemTotal;

        const itemDiv =
            document.createElement("div");

        itemDiv.className = "cart-item";

        itemDiv.innerHTML = `
            <div class="cart-item-info">

                <h4>
                    ${escapeHTML(item.name)}
                </h4>

                <p>
                    ₹${Number(item.price).toFixed(2)}
                    × ${item.quantity}
                </p>

            </div>

            <div class="cart-item-total">
                ₹${itemTotal.toFixed(2)}
            </div>

            <button onclick="removeItem(${index})">
                Remove
            </button>
        `;

        cartItems.appendChild(itemDiv);

    });

    cartTotal.textContent =
        total.toFixed(2);

}


/* =========================
   ADD ITEM
========================= */

addItemBtn.addEventListener(
    "click",
    addItem
);


function addItem() {

    const name =
        itemName.value.trim();

    const price =
        Number(itemPrice.value);

    const quantity =
        Number(itemQuantity.value);


    if (name === "") {

        alert(
            "Please enter an item name."
        );

        itemName.focus();

        return;
    }


    if (price <= 0) {

        alert(
            "Please enter a valid price."
        );

        itemPrice.focus();

        return;
    }


    if (quantity <= 0) {

        alert(
            "Please enter a valid quantity."
        );

        itemQuantity.focus();

        return;
    }


    const savedCart =
        localStorage.getItem(
            getCartKey()
        );

    const cart =
        savedCart
            ? JSON.parse(savedCart)
            : [];


    cart.push({

        name: name,

        price: price,

        quantity: quantity

    });


    localStorage.setItem(
        getCartKey(),
        JSON.stringify(cart)
    );


    addActivity(
        `${currentUser} added ${name} to the shared cart.`
    );


    displayCart(cart);


    itemName.value = "";

    itemPrice.value = "";

    itemQuantity.value = "1";

}


/* =========================
   QUICK ADD
========================= */

function quickAdd(name) {

    itemName.value = name;

    itemName.focus();

}


/* =========================
   MORE ITEMS
========================= */

function toggleMoreItems() {

    const moreItems =
        document.getElementById("moreItems");

    const moreButton =
        document.querySelector(".more-btn");


    if (!moreItems || !moreButton) {

        return;

    }


    if (
        moreItems.classList.contains("hidden")
    ) {

        moreItems.classList.remove(
            "hidden"
        );

        moreButton.textContent =
            "− Less";

        moreButton.classList.add(
            "active"
        );

    } else {

        moreItems.classList.add(
            "hidden"
        );

        moreButton.textContent =
            "+ More";

        moreButton.classList.remove(
            "active"
        );

    }

}


/* =========================
   REMOVE ITEM
========================= */

function removeItem(index) {

    const savedCart =
        localStorage.getItem(
            getCartKey()
        );

    const cart =
        savedCart
            ? JSON.parse(savedCart)
            : [];


    if (!cart[index]) {

        return;

    }


    const removedItem =
        cart[index].name;


    cart.splice(index, 1);


    localStorage.setItem(
        getCartKey(),
        JSON.stringify(cart)
    );


    addActivity(
        `${currentUser} removed ${removedItem} from the shared cart.`
    );


    displayCart(cart);

}


/* =========================
   ADD ACTIVITY
========================= */

function addActivity(message) {

    const savedActivity =
        localStorage.getItem(
            getActivityKey()
        );

    const activities =
        savedActivity
            ? JSON.parse(savedActivity)
            : [];


    activities.push({

        message: message,

        time: new Date().toLocaleString()

    });


    localStorage.setItem(
        getActivityKey(),
        JSON.stringify(activities)
    );


    displayActivity(activities);

}


/* =========================
   LOAD ACTIVITY
========================= */

function loadActivity() {

    const savedActivity =
        localStorage.getItem(
            getActivityKey()
        );

    const activities =
        savedActivity
            ? JSON.parse(savedActivity)
            : [];


    displayActivity(activities);

}


/* =========================
   DISPLAY ACTIVITY
========================= */

function displayActivity(activities) {

    activityLog.innerHTML = "";


    if (activities.length === 0) {

        activityLog.innerHTML = `
            <p class="empty-activity">
                No activity yet.
            </p>
        `;

        return;

    }


    activities
        .slice()
        .reverse()
        .forEach(activity => {

            const div =
                document.createElement("div");

            div.className =
                "activity-item";


            div.innerHTML = `
                ${escapeHTML(activity.message)}

                <span class="activity-time">
                    ${escapeHTML(activity.time)}
                </span>
            `;


            activityLog.appendChild(div);

        });

}


/* =========================
   REAL-TIME TAB SYNC
========================= */

window.addEventListener(
    "storage",
    event => {

        if (!currentRoom) {

            return;

        }


        if (
            event.key ===
            getCartKey()
        ) {

            loadCart();

        }


        if (
            event.key ===
            getActivityKey()
        ) {

            loadActivity();

        }

    }
);


/* =========================
   PRINT RECEIPT
========================= */

printReceiptBtn.addEventListener(
    "click",
    () => {

        window.print();

    }
);


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}