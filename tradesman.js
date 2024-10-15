document.addEventListener("DOMContentLoaded", function () {
  const tradesmanDetails = document.getElementById("tradesman-details");

  // Get the tradesman ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const tradesmanId = parseInt(urlParams.get("id"));

  // Load tradesmen from localStorage or use the default dummy data
  const tradesmen =
    JSON.parse(localStorage.getItem("tradesmen")) || window.dummyTradesmen;

  // Find the tradesman with the matching ID
  const tradesman = tradesmen.find((t) => t.id === tradesmanId);

  if (tradesman) {
    tradesmanDetails.innerHTML = `
            <div class="card">
                <div class="person-info">
                    <h3 class="person-name">${tradesman.name}</h3>
                    <p class="overall">Overall: <span id="overall-rating"></span></p>
                    <p class="specializations">
                        Specializations: ${tradesman.specializations.join(", ")}
                    </p>
                    <p class="location">Location: ${tradesman.location}</p>
                </div>
                <div class="person-box">
                    <div class="attributes-grid">
                        ${Object.entries(tradesman.attributes)
                          .map(
                            ([name, value]) => `
                            <div class="attribute">
                                <span class="attribute-name">${name}</span>
                                <span class="attribute-rating">${value}</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `;

    // Calculate overall rating
    const attributes = Object.values(tradesman.attributes);
    const average = Math.round(
      attributes.reduce((a, b) => a + b) / attributes.length
    );
    document.getElementById("overall-rating").textContent = average;
  } else {
    tradesmanDetails.innerHTML = "<p>Tradesman not found.</p>";
  }
});
