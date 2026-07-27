// ===============================
// Read News & Earn - Part 1
// ===============================

// ===== Monetag SmartLink =====
const SMART_LINK = "https://omg10.com/4/11436609";

let adClicks = Number(localStorage.getItem("adClicks")) || 0;

function showSmartLink() {
    adClicks++;
    localStorage.setItem("adClicks", adClicks);

    // Open SmartLink every 3rd click
    if (adClicks % 3 === 0) {
        window.open(SMART_LINK, "_blank");
    }
}

// ===== DOM =====
const newsContainer = document.getElementById("newsContainer");
const coinEl = document.getElementById("coins");
const walletEl = document.getElementById("walletCoins");

// ===== Wallet =====
let coins = Number(localStorage.getItem("coins")) || 0;

updateWallet();

// Load first news
loadNews();

// ===============================
// Load News
// ===============================
async function loadNews(keyword = "india") {

    newsContainer.innerHTML =
    "<div class='loading'>Loading Latest News...</div>";

    try {

        const response = await fetch(
            `/.netlify/functions/news?q=${encodeURIComponent(keyword)}`
        );

        if (!response.ok)
            throw new Error("Server Error");

        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {

            newsContainer.innerHTML =
            "<div class='loading'>No News Found</div>";

            return;

        }

        displayNews(data.articles);

    }
    catch (error) {

        console.error(error);

        newsContainer.innerHTML = `
        <div class="loading">

            Unable to load news.

            <br><br>

            <button onclick="loadNews()">

            Retry

            </button>

        </div>`;

    }

}

// ===============================
// Display News
// ===============================
function displayNews(articles) {

    newsContainer.innerHTML = "";

    articles.forEach(article => {

        const image =
        article.image ||
        "https://via.placeholder.com/600x350?text=News";

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

        <img src="${image}">

        <div class="content">

        <h3>${article.title}</h3>

        <p>${article.description || ""}</p>

        <button class="read-btn">

        Read & Earn

        </button>

        </div>

        `;

        card
        .querySelector(".read-btn")
        .addEventListener("click", () => {

            startReading(article.url);

        });

        newsContainer.appendChild(card);

    });

}

// ===============================
// Search
// ===============================
function searchNews() {

    showSmartLink();

    const keyword =
    document
    .getElementById("search")
    .value
    .trim();

    if (!keyword) return;

    loadNews(keyword);

}

// ===============================
// Category
// ===============================
function category(name) {

    showSmartLink();

    loadNews(name);

}// ===============================
// Read & Earn
// ===============================
function startReading(newsUrl) {

    // Show SmartLink occasionally
    showSmartLink();

    // Open article
    window.open(newsUrl, "_blank");

    // Prevent duplicate rewards
    const key = "reward_" + btoa(newsUrl);

    if (localStorage.getItem(key)) {
        alert("You already earned from this article.");
        return;
    }

    let seconds = 20;

    const timer = setInterval(() => {

        seconds--;

        console.log("Reward in:", seconds);

        if (seconds <= 0) {

            clearInterval(timer);

            localStorage.setItem(key, "1");

            coins++;

            localStorage.setItem("coins", coins);

            updateWallet();

            alert("🎉 Congratulations!\n\nYou earned 1 coin.");

        }

    }, 1000);

}

// ===============================
// Wallet
// ===============================
function updateWallet() {

    if (coinEl)
        coinEl.textContent = coins;

    if (walletEl)
        walletEl.textContent = coins;

}

// ===============================
// Withdraw
// ===============================
const withdrawBtn = document.getElementById("withdrawBtn");

if (withdrawBtn) {

withdrawBtn.addEventListener("click", () => {

    showSmartLink();

    if (coins < 50) {

        alert("Minimum withdrawal is 50 coins.");

        return;

    }

    const upi = prompt("Enter your UPI ID");

    if (!upi) return;

    alert(
`Withdrawal Request Submitted

UPI ID:
${upi}

Coins:
${coins}`
    );

    coins = 0;

    localStorage.setItem("coins", coins);

    updateWallet();

});

}

// ===============================
// Auto Refresh News Every 5 Minutes
// ===============================
setInterval(() => {

    loadNews();

}, 300000);

// ===============================
// End of Script
// ===============================
