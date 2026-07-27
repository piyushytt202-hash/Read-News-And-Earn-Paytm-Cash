const newsContainer = document.getElementById("newsContainer");
const coinEl = document.getElementById("coins");
const walletEl = document.getElementById("walletCoins");

let coins = Number(localStorage.getItem("coins")) || 0;

updateWallet();

loadNews();

async function loadNews(keyword = "india") {
    newsContainer.innerHTML =
        "<div class='loading'>Loading news...</div>";

    try {
        const res = await fetch(
            `/.netlify/functions/news?q=${encodeURIComponent(keyword)}`
        );

        const data = await res.json();

        if (!data.articles || data.articles.length === 0) {
            newsContainer.innerHTML =
                "<div class='loading'>No news found.</div>";
            return;
        }

        displayNews(data.articles);

    } catch (e) {
        newsContainer.innerHTML =
            "<div class='loading'>Unable to load news.</div>";
        console.error(e);
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
