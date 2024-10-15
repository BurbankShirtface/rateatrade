document.addEventListener("DOMContentLoaded", function () {
  const tradesmenList = document.getElementById("tradesmen-list");

  // Load tradesmen from localStorage or use the default dummy data
  const tradesmen =
    JSON.parse(localStorage.getItem("tradesmen")) || window.dummyTradesmen;

  // Sort tradesmen alphabetically by name
  tradesmen.sort((a, b) => a.name.localeCompare(b.name));

  // Populate the list
  tradesmen.forEach((tradesman) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `tradesman.html?id=${tradesman.id}`;
    a.textContent = tradesman.name;
    li.appendChild(a);
    tradesmenList.appendChild(li);
  });
});
