const ALL_ATTRIBUTES = [
  "General Knowledge/Understanding",
  "Physical Strength",
  "Reliability",
  "Conscientiousness",
  "Stamina",
  "Safety",
  "Technical Knowledge",
  "Heights",
  "Experience",
  "Attitude/Social Abilities",
  "Customer Service",
  "Math",
  "Confidence",
  "Initiative",
  "Work Ethic",
];

async function displayFeaturedTradesman() {
  const featuredSection = document.querySelector(".featured-tradesmen");
  if (!featuredSection) return;

  try {
    console.log("Fetching all tradesmen...");
    const { data, error } = await window.supabase.from("tradesmen").select("*");

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (data && data.length > 0) {
      // Select a random tradesman from the data array
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomTradesman = data[randomIndex];

      console.log("Random tradesman data:", randomTradesman);

      featuredSection.innerHTML = `
        <h2>Featured Tradesman</h2>
        <div class="card">
          <div class="person-info">
            <h3 class="person-name">${randomTradesman.name}</h3>
            <p class="overall">Overall: <span id="overall-rating">${calculateOverallRating(
              randomTradesman.attributes
            )}</span></p>
            <p class="specializations">${randomTradesman.specializations.join(
              ", "
            )}</p>
            <p class="location">${randomTradesman.location}</p>
          </div>
          <div class="person-box">
            <div class="attributes-grid">
              ${generateAttributesHTML(randomTradesman.attributes)}
            </div>
          </div>
        </div>
      `;
    } else {
      featuredSection.innerHTML = "<p>No tradesmen available.</p>";
    }
  } catch (error) {
    console.error("Error fetching tradesmen:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    featuredSection.innerHTML = "<p>Error loading featured tradesman.</p>";
  }
}

function generateAttributesHTML(attributes) {
  return ALL_ATTRIBUTES.map((attr) => {
    const value = attributes[attr] !== undefined ? attributes[attr] : "N/A";
    return `
      <div class="attribute">
        <span class="attribute-name">${attr}</span>
        <span class="attribute-rating">${value}</span>
      </div>
    `;
  }).join("");
}

function calculateOverallRating(attributes) {
  const values = Object.values(attributes).filter(
    (value) => typeof value === "number"
  );
  if (values.length === 0) return "N/A";
  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length
  );
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".featured-tradesmen")) {
    displayFeaturedTradesman();
  }
  if (document.getElementById("add-tradesman-btn")) {
    setupAddTradesmanForm();
  }
});

function setupAddTradesmanForm() {
  const addTradesmanBtn = document.getElementById("add-tradesman-btn");
  const addTradesmanPopup = document.getElementById("add-tradesman-popup");
  const addTradesmanForm = document.getElementById("add-tradesman-form");
  const overlay = document.getElementById("overlay");
  const successPopup = document.getElementById("success-popup");
  const okButton = document.getElementById("ok-button");

  function showPopup(popupId) {
    document.getElementById(popupId).style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.body.classList.add("popup-open");
  }

  function hidePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.body.classList.remove("popup-open");
  }

  addTradesmanBtn.addEventListener("click", () => {
    showPopup("add-tradesman-popup");
    populateAttributeInputs();
  });

  addTradesmanForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(addTradesmanForm);
    const newTradesman = {
      name: formData.get("name"),
      location: formData.get("location"),
      specializations: formData
        .get("specializations")
        .split(",")
        .map((s) => s.trim()),
      attributes: {},
    };

    ALL_ATTRIBUTES.forEach((attr) => {
      const value = formData.get(attr);
      if (value !== "") {
        const numValue = parseInt(value);
        newTradesman.attributes[attr] = isNaN(numValue) ? "N/A" : numValue;
      } else {
        newTradesman.attributes[attr] = "N/A";
      }
    });

    try {
      const { data, error } = await window.supabase
        .from("tradesmen")
        .insert([newTradesman]);

      if (error) throw error;

      addTradesmanForm.reset();
      hidePopup("add-tradesman-popup");
      showPopup("success-popup");
    } catch (error) {
      console.error("Error adding tradesman:", error);
      alert("Failed to add tradesman. Please try again.");
    }
  });

  okButton.addEventListener("click", () => {
    hidePopup("success-popup");
    displayFeaturedTradesman(); // Refresh the featured tradesman
  });

  overlay.addEventListener("click", () => {
    hidePopup("add-tradesman-popup");
    hidePopup("success-popup");
  });
}

function populateAttributeInputs() {
  const attributesContainer = document.getElementById("attributes-container");
  attributesContainer.innerHTML = ALL_ATTRIBUTES.map(
    (attr) => `
    <div class="attribute-input">
      <label for="${attr}">${attr}:</label>
      <input type="number" id="${attr}" name="${attr}" min="0" max="100">
    </div>
  `
  ).join("");
}

window.ALL_ATTRIBUTES = ALL_ATTRIBUTES;
