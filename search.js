// Remove the import statement
// console.log("tradesman.js loaded");

document.addEventListener("DOMContentLoaded", async function () {
  const findTradesmanBtn = document.getElementById("find-tradesman-btn");
  const searchContainer = document.getElementById("search-container");
  const tradesmanSearch = document.getElementById("tradesman-search");
  const searchResults = document.getElementById("search-results");

  if (findTradesmanBtn && searchContainer && tradesmanSearch) {
    findTradesmanBtn.addEventListener("click", function (e) {
      e.preventDefault();
      searchContainer.style.display = "block";
      tradesmanSearch.focus();
    });

    // Hide search bar when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !searchContainer.contains(e.target) &&
        e.target !== findTradesmanBtn
      ) {
        searchContainer.style.display = "none";
        searchResults.innerHTML = ""; // Clear search results
      }
    });

    // Prevent the search container from closing when clicking inside it
    searchContainer.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    tradesmanSearch.addEventListener("input", async function () {
      const searchTerm = this.value.toLowerCase();

      // Use the global supabase object
      const { data: matchingTradesmen, error } = await window.supabase
        .from("tradesmen")
        .select("id, name, location")
        .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
        .order("name");

      if (error) {
        console.error("Error searching tradesmen:", error);
        return;
      }

      displayResults(matchingTradesmen);
    });

    function displayResults(results) {
      searchResults.innerHTML = "";
      results.forEach((tradesman) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="tradesman-name">${tradesman.name}</span>
          <span class="tradesman-location">${tradesman.location}</span>
        `;
        li.addEventListener("click", function () {
          window.location.href = `tradesman.html?id=${tradesman.id}`;
        });
        searchResults.appendChild(li);
      });
    }

    // Fetch tradesmen from Supabase
    // Use the global supabase object
    const { data: tradesmen, error } = await window.supabase
      .from("tradesmen")
      .select("*")
      .order("name", { ascending: true });

    // ... rest of your code
  }
});
