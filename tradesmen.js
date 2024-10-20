console.log("tradesmen.js loaded");

async function fetchTradesmen() {
  const tradesmenList = document.getElementById("tradesmen-list");
  if (!tradesmenList) {
    console.log("Tradesmen list element not found");
    return;
  }

  // Fetch tradesmen from Supabase
  // Use the global supabase object
  const { data: tradesmen, error } = await window.supabase
    .from("tradesmen")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching tradesmen:", error);
    return;
  }

  // Populate the list
  tradesmen.forEach((tradesman) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `tradesman.html?id=${tradesman.id}`;
    a.textContent = tradesman.name;
    li.appendChild(a);
    tradesmenList.appendChild(li);
  });
}

async function fetchTradesmanDetails() {
  const tradesmanDetails = document.getElementById("tradesman-details");
  if (!tradesmanDetails) {
    console.log("Tradesman details element not found");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const tradesmanId = urlParams.get("id");

  if (!tradesmanId) {
    console.error("No tradesman ID found in URL");
    tradesmanDetails.innerHTML = "<p>No tradesman specified.</p>";
    return;
  }

  // Fetch tradesman details from Supabase
  // Use the global supabase object
  const { data: tradesman, error } = await window.supabase
    .from("tradesmen")
    .select("*")
    .eq("id", tradesmanId)
    .single();

  if (error) {
    console.error("Error fetching tradesman details:", error);
    tradesmanDetails.innerHTML = "<p>Error loading tradesman details.</p>";
    return;
  }

  if (tradesman) {
    tradesmanDetails.innerHTML = `
      <h2>${tradesman.name}</h2>
      <p>Specializations: ${tradesman.specializations.join(", ")}</p>
      <p>Location: ${tradesman.location}</p>
    `;
  } else {
    tradesmanDetails.innerHTML = "<p>Tradesman not found.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tradesmen-list")) {
    fetchTradesmen();
  }
  if (document.getElementById("tradesman-details")) {
    fetchTradesmanDetails();
  }
});
