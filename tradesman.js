console.log("tradesman.js loaded");

async function fetchTradesmanDetails() {
  const tradesmanDetails = document.getElementById("tradesman-details");
  if (!tradesmanDetails) {
    console.error("Tradesman details element not found");
    return;
  }

  // Get the tradesman ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const tradesmanId = parseInt(urlParams.get("id"));

  if (!tradesmanId) {
    console.error("No tradesman ID found in URL");
    tradesmanDetails.innerHTML = "<p>No tradesman specified.</p>";
    return;
  }

  try {
    // Use the global supabase object
    const { data: tradesman, error } = await window.supabase
      .from("tradesmen")
      .select("*")
      .eq("id", tradesmanId)
      .single();

    if (error) throw error;

    if (tradesman) {
      // Use the global ALL_ATTRIBUTES
      tradesmanDetails.innerHTML = `
        <div class="card">
          <h2>${tradesman.name}</h2>
          <p>Location: ${tradesman.location}</p>
          <p>Specializations: ${tradesman.specializations.join(", ")}</p>
          <p>Overall Rating: <span id="overall-rating"></span></p>
          <div class="attributes-grid">
            ${window.ALL_ATTRIBUTES.map(
              (attr) => `
              <div class="attribute">
                <span class="attribute-name">${attr}</span>
                <span class="attribute-rating">${
                  tradesman.attributes[attr] || "N/A"
                }</span>
              </div>
            `
            ).join("")}
          </div>
        </div>
      `;

      // Calculate overall rating
      const attributes = Object.values(tradesman.attributes).filter(
        (value) => typeof value === "number"
      );
      const average =
        attributes.length > 0
          ? Math.round(attributes.reduce((a, b) => a + b) / attributes.length)
          : "N/A";
      document.getElementById("overall-rating").textContent = average;
    } else {
      tradesmanDetails.innerHTML = "<p>Tradesman not found.</p>";
    }
  } catch (err) {
    console.error("Error fetching tradesman:", err);
    tradesmanDetails.innerHTML = "<p>Error loading tradesman details.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tradesman-details")) {
    fetchTradesmanDetails();
  }
});
