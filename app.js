document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  const findTradesmanBtn = document.getElementById("find-tradesman-btn");
  const searchOptions = document.getElementById("search-options");
  const searchByLocation = document.getElementById("search-by-location");
  const searchByName = document.getElementById("search-by-name");
  const searchContainer = document.getElementById("search-container");
  const tradesmanSearch = document.getElementById("tradesman-search");
  const searchResults = document.getElementById("search-results");

  console.log("Elements found:", {
    findTradesmanBtn,
    searchOptions,
    searchByLocation,
    searchByName,
    searchContainer,
    tradesmanSearch,
    searchResults,
  });

  let searchMode = "name"; // Default search mode

  // Load tradesmen from localStorage or use the default dummy data
  window.dummyTradesmen =
    JSON.parse(localStorage.getItem("tradesmen")) || window.dummyTradesmen;

  // Display random tradesman (Featured Tradesman)
  console.log("Attempting to display random tradesman");
  displayRandomTradesman();

  findTradesmanBtn.addEventListener("click", function (e) {
    console.log("Find Tradesman button clicked");
    e.preventDefault();
    searchOptions.style.display =
      searchOptions.style.display === "none" ? "flex" : "none";
    searchContainer.style.display = "none";
    searchResults.innerHTML = "";
    tradesmanSearch.value = "";
  });

  searchByLocation.addEventListener("click", function () {
    console.log("Search by Location clicked");
    searchMode = "location";
    tradesmanSearch.placeholder = "Search by location...";
    searchContainer.style.display = "block";
    tradesmanSearch.focus();
  });

  searchByName.addEventListener("click", function () {
    console.log("Search by Name clicked");
    searchMode = "name";
    tradesmanSearch.placeholder = "Search by name...";
    searchContainer.style.display = "block";
    tradesmanSearch.focus();
  });

  tradesmanSearch.addEventListener("input", function () {
    console.log("Search input changed:", this.value);
    const tradesmen =
      JSON.parse(localStorage.getItem("tradesmen")) || window.dummyTradesmen;
    const searchTerm = this.value.toLowerCase();
    let matchingTradesmen;

    if (searchMode === "location") {
      matchingTradesmen = tradesmen.filter((tradesman) =>
        tradesman.location.toLowerCase().includes(searchTerm)
      );
    } else {
      matchingTradesmen = tradesmen.filter((tradesman) =>
        tradesman.name.toLowerCase().includes(searchTerm)
      );
    }

    displayResults(matchingTradesmen);
  });

  function displayResults(results) {
    searchResults.innerHTML = "";
    const isMobile = window.innerWidth <= 768;
    results.forEach((tradesman) => {
      const li = document.createElement("li");
      if (isMobile) {
        li.textContent = tradesman.name;
      } else {
        li.textContent =
          searchMode === "location"
            ? `${tradesman.name} (${tradesman.location})`
            : tradesman.name;
      }
      li.addEventListener("click", function () {
        window.location.href = `tradesman.html?id=${tradesman.id}`;
      });
      searchResults.appendChild(li);
    });
  }

  // Close search results when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !searchContainer.contains(event.target) &&
      event.target !== findTradesmanBtn &&
      !searchOptions.contains(event.target)
    ) {
      console.log("Clicked outside search area");
      searchResults.innerHTML = "";
      tradesmanSearch.value = "";
      searchContainer.style.display = "none";
      searchOptions.style.display = "none";
    }
  });

  // Function to display a random featured tradesman
  function displayRandomTradesman() {
    const tradesmen =
      JSON.parse(localStorage.getItem("tradesmen")) || window.dummyTradesmen;
    const randomIndex = Math.floor(Math.random() * tradesmen.length);
    const randomTradesman = tradesmen[randomIndex];

    // Check if elements exist before updating them
    const nameElement = document.querySelector(".person-name");
    const specializationsElement = document.querySelector(".specializations");
    const locationElement = document.querySelector(".location");
    const attributesGrid = document.querySelector(".attributes-grid");
    const overallRatingElement = document.getElementById("overall-rating");

    if (nameElement) nameElement.textContent = randomTradesman.name;
    if (specializationsElement)
      specializationsElement.textContent = `Specializations: ${randomTradesman.specializations.join(
        ", "
      )}`;
    if (locationElement)
      locationElement.textContent = `Location: ${randomTradesman.location}`;

    if (attributesGrid) {
      attributesGrid.innerHTML = "";

      for (const [attribute, value] of Object.entries(
        randomTradesman.attributes
      )) {
        const attributeDiv = document.createElement("div");
        attributeDiv.className = "attribute";
        attributeDiv.innerHTML = `
          <span class="attribute-name">${attribute}</span>
          <span class="attribute-rating">${value}</span>
        `;
        attributesGrid.appendChild(attributeDiv);
      }
    } else {
      console.error("Attributes grid element not found");
    }

    // Calculate and update overall rating
    if (overallRatingElement) {
      const attributes = Object.values(randomTradesman.attributes);
      const average = Math.round(
        attributes.reduce((a, b) => a + b) / attributes.length
      );
      overallRatingElement.textContent = average;
    } else {
      console.error("Overall rating element not found");
    }
  }

  const addTradesmanBtn = document.getElementById("add-tradesman-btn");
  const addTradesmanPopup = document.getElementById("add-tradesman-popup");
  const addTradesmanForm = document.getElementById("add-tradesman-form");
  const successPopup = document.getElementById("success-popup");
  const okButton = document.getElementById("ok-button");
  const attributesContainer = document.getElementById("attributes-container");

  addTradesmanBtn.addEventListener("click", function (e) {
    e.preventDefault();
    addTradesmanPopup.style.display = "flex";
    populateAttributesForm();
  });

  function populateAttributesForm() {
    attributesContainer.innerHTML = "";
    const sampleAttributes = window.dummyTradesmen[0].attributes;
    for (const attribute in sampleAttributes) {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.max = "100";
      input.id = `attr-${attribute.toLowerCase().replace(/\s+/g, "-")}`;
      input.placeholder = attribute;
      input.required = true;
      attributesContainer.appendChild(input);
    }
  }

  addTradesmanForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newTradesman = {
      id: window.dummyTradesmen.length + 1,
      name: document.getElementById("new-name").value,
      location: document.getElementById("new-location").value,
      specializations: document
        .getElementById("new-specializations")
        .value.split(",")
        .map((s) => s.trim()),
      attributes: {},
    };

    const sampleAttributes = window.dummyTradesmen[0].attributes;
    for (const attribute in sampleAttributes) {
      const inputId = `attr-${attribute.toLowerCase().replace(/\s+/g, "-")}`;
      newTradesman.attributes[attribute] = parseInt(
        document.getElementById(inputId).value
      );
    }

    // Load current tradesmen from localStorage
    const tradesmen =
      JSON.parse(localStorage.getItem("tradesmen")) || window.dummyTradesmen;

    // Add new tradesman
    tradesmen.push(newTradesman);

    // Save updated tradesmen array to localStorage
    localStorage.setItem("tradesmen", JSON.stringify(tradesmen));

    addTradesmanPopup.style.display = "none";
    successPopup.style.display = "flex";
  });

  okButton.addEventListener("click", function () {
    successPopup.style.display = "none";
    addTradesmanForm.reset();
  });

  // Close popups when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === addTradesmanPopup) {
      addTradesmanPopup.style.display = "none";
    }
    if (event.target === successPopup) {
      successPopup.style.display = "none";
    }
  });

  // Initialize localStorage with dummy data if it's empty
  if (!localStorage.getItem("tradesmen")) {
    localStorage.setItem("tradesmen", JSON.stringify(window.dummyTradesmen));
  }
});
