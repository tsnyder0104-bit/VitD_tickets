const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbzp--NwIowUJiZp43pW0pgvDkDiIF8v4wD06ZTh5egqlKtnKCaVFP-cAWIHApCs8Tyimw/exec";

// -------------------- STATE --------------------
let data = [];
const capacity = 40;

// -------------------- DATA --------------------
async function loadData() {
  try {
    const res = await fetch(WEB_APP_URL);
    data = await res.json();
  } catch (err) {
    console.error(err);
    alert("Unable to load event data.");
  }
}

// -------------------- SUBMIT EVENT --------------------
async function submitEvent(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = document.getElementById("submitButton");
  submitButton.disabled = true;
  submitButton.style = `
  cursor: not-allowed;
    `;
  submitButton.value = "Submitting...";

  const formData = {
    date: form.date.value,
    fname: form.fname.value,
    lname: form.lname.value,
    quantity: form.quantity.value
  };

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(formData)
    });

    const result = await res.json();
    if (result.success) {
      refreshApp();
      alert(
        "Your seats have been reserved. Simply check in with your name when you arrive."
      );

      const selected = document.getElementById("dateSelect").value;
      form.reset();
      document.getElementById("dateSelect").value = selected;
    }
  } catch (err) {
    console.error(err);
    alert("Unable to reserve seats.");
  } finally {
    submitButton.disabled = false;
    submitButton.style = `
  cursor: pointer;
    `;
    submitButton.value = "Reserve Space";
  }
}

// -------------------- VIEW RENDER --------------------
function displayInfo(key) {
  const signupForm = document.getElementById("signupForm");

  const match = data.find((item) => item.date === key);
  if (!match) return;

  const space = capacity - match.reserved;

  document.getElementById("psize").max = space;

  document.getElementById("details").textContent = `Space Remaining: ${space}`;
}

// -------------------- REFRESH PIPELINE --------------------
function refreshEvent() {
  const select = document.getElementById("dateSelect");

  if (!select.value && select.options.length > 0) {
    select.selectedIndex = 0;
  }

  displayInfo(select.value);
}

async function refreshApp() {
  await loadData();
  refreshEvent();
}

// -------------------- INIT --------------------
async function init() {
  await loadData();
  refreshEvent();

  document
    .getElementById("dateSelect")
    .addEventListener("change", refreshEvent);

  document.getElementById("signupForm").addEventListener("submit", submitEvent);
}

init();
