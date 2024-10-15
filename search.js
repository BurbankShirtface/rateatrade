document.addEventListener("DOMContentLoaded", function () {
  const findTradesmanBtn = document.getElementById("find-tradesman-btn");
  const searchContainer = document.getElementById("search-container");
  const tradesmanSearch = document.getElementById("tradesman-search");
  const searchResults = document.getElementById("search-results");

  findTradesmanBtn.addEventListener("click", function (e) {
    e.preventDefault();
    searchContainer.style.display = "block";
    tradesmanSearch.focus();
  });

  tradesmanSearch.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const matchingTradesmen = dummyTradesmen.filter((tradesman) =>
      tradesman.name.toLowerCase().includes(searchTerm)
    );

    displayResults(matchingTradesmen);
  });

  function displayResults(results) {
    searchResults.innerHTML = "";
    results.forEach((tradesman) => {
      const li = document.createElement("li");
      li.textContent = tradesman.name;
      li.addEventListener("click", function () {
        window.location.href = `tradesman.html?id=${tradesman.id}`;
      });
      searchResults.appendChild(li);
    });
  }
});
