const SMART_LINK = "https://omg10.com/4/11436609";

let adClicks = Number(localStorage.getItem("adClicks")) || 0;

function showSmartLink() {
    adClicks++;
    localStorage.setItem("adClicks", adClicks);

    // Show SmartLink every 3rd user interaction
    if (adClicks % 3 === 0) {
        window.open(SMART_LINK, "_blank");
    }
}const newsContainer = document.getElementById("newsContainer");
const coinEl = document.getElementById("coins");
const walletEl = document.getElementById("walletCoins");

let coins = Number(localStorage.getItem("coins")) || 0;

updateWallet();
loadNews();

async function loadNews(keyword = "india") {

    newsContainer.innerHTML =
        "<div class='loading'>Loading latest news...</div>";

    try {

        const response = await fetch(
            `/.netlify/functions/news?q=${encodeURIComponent(keyword)}`
        );

        if (!response.ok) {
            throw new Error("Server Error: " + response.status);
        }

        const data = await response.json();

        console.log(data);

        if (!data || !Array.isArray(data.articles)) {
            throw new Error("Invalid API Response");
        }

        if (data.articles.length === 0) {
            newsContainer.innerHTML =
                "<div class='loading'>No News Found.</div>";
            return;
        }

        displayNews(data.articles);

    } catch (error) {

        console.error(error);

        newsContainer.innerHTML = `
        <div class="loading">
            ${error.message}
        </div>
        `;
    }

}

function displayNews(articles) {

    newsContainer.innerHTML = "";

    articles.forEach(article => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/600x350?text=News'}">

            <div class="content">

                <h3>${article.title || "No Title"}</h3>

                <p>${article.description || "No description available."}</p>

                <button class="read-btn">
                    Read & Earn
                </button>

            </div>
        `;

        card.querySelector(".read-btn").addEventListener("click", () => {
            startReading(article.url);
        });

        newsContainer.appendChild(card);

    });

}

function searchNews() {
showSmartLink();
    const keyword = document
        .getElementById("search")
        .value
        .trim();

    if (!keyword) return;

    loadNews(keyword);

}

function category(name) {
   showSmartLink();
    loadNews(name);
}

const SMART_LINK = "https://omg10.com/4/11436609";

function startReading(newsUrl) {

    showSmartLink();

window.open(newsUrl, "_blank");// Open Monetag SmartLink in a new tab
    window.open(SMART_LINK, "_blank");

    // Open the news article after a short delay
    setTimeout(() => {
        window.open(newsUrl, "_blank");
    }, 500);

    alert("Read for 20 seconds to earn 1 coin.");

    setTimeout(() => {

        coins++;

        localStorage.setItem("coins", coins);

        updateWallet();

        alert("🎉 You earned 1 coin!");

    }, 20000);
}

function updateWallet() {

    coinEl.textContent = coins;
    walletEl.textContent = coins;

}

document.getElementById("withdrawBtn").addEventListener("click", () => {

    if (coins < 50) {
        alert("Minimum withdrawal is 50 coins.");
        return;
    }

    const upi = prompt("Enter your UPI ID");

    if (!upi) return;

    alert(`Withdrawal Request Submitted\n\nUPI: ${upi}\nCoins: ${coins}`);

    coins = 0;

    localStorage.setItem("coins", coins);

    updateWallet();

});function displayNews(articles) {

    newsContainer.innerHTML = "";

    articles.forEach(article => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/600x350?text=News'}">

            <div class="content">

                <h3>${article.title}</h3>

                <p>${article.description || ""}</p>

                <button class="read-btn">
                    Read & Earn
                </button>

            </div>
        `;

        card.querySelector(".read-btn").onclick = () => {
            startReading(article.url);
        };

        newsContainer.appendChild(card);

    });

}

function searchNews() {

    const keyword = document
        .getElementById("search")
        .value
        .trim();

    if (keyword === "") return;

    loadNews(keyword);

}

function category(name) {
    loadNews(name);
}

function startReading(url) {

    window.open(url, "_blank");

    alert("Read the article for 20 seconds to earn 1 coin.");

    setTimeout(() => {

        coins += 1;

        localStorage.setItem("coins", coins);

        updateWallet();

        alert("🎉 You earned 1 coin!");

    }, 20000);

}

function updateWallet() {

    coinEl.textContent = coins;

    walletEl.textContent = coins;

}

document
.getElementById("withdrawBtn")
.addEventListener("click", () => {

    if (coins < 50) {

        alert("Minimum withdrawal is 50 coins.");

        return;

    }

    const upi = prompt("Enter your UPI ID");

    if (!upi) return;

    alert(
        "Withdrawal request submitted.\n\nUPI: " +
        upi +
        "\nCoins: " +
        coins
    );

    coins = 0;

    localStorage.setItem("coins", coins);

    updateWallet();

});
