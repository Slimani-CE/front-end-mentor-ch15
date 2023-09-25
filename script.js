// ********** VARIABLES ********** //
let filtredCountries = null;
let COUNTRIES = fetch("data.json")
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((data) => {
    COUNTRIES = data;
    filtredCountries = COUNTRIES;
    // Initialize the view
    displayCountries();
  });

let countriesEls = document.querySelector(".container .countries");
let noCountryEl = document.querySelector(".container .not-found");
let loadMoreEl = document.querySelector(".container .footer .load-more-btn");
let detailsEl = document.querySelector(".details-container .details-body");
let detailsContainer = document.querySelector(".details-container");
let container = document.querySelector(".container");
let xMark = document.querySelector(
  "body > div.container > div.header > div.search-div > i"
);

let countriesToDisplay = 20;
let currentIndex = 0;
let checkedRegion = "all";

// ********** EVENT LISTENERS ********** //
let searchInput = document.getElementById("search-input");
searchInput.addEventListener("keyup", searchCountry);
let menuItems = document.querySelectorAll(
  ".container .header .filter-div .drop-down ul li"
);

// ********** HTML VIEW FUNCTION ********** //
function toggleCountryMenu(el) {
  el.parentNode.classList.toggle("open");
}

function checkRegion(el) {
  if (el.classList.contains("checked")) {
    // Uncheck the checked region
    el.classList.remove("checked");
    // change the checkedRegion value to 'all'
    checkedRegion = "all";
  } else {
    // Remove check value from all items
    menuItems.forEach((item) => {
      item.classList.remove("checked");
    });

    // Add check to current item
    el.classList.add("checked");

    // Change value of checkedRegion
    checkedRegion = el.dataset.region;
  }
  searchCountry();
}

function toggleThemeBtn() {
  let checkedTheme = "";
  let btns = document.querySelectorAll("header .theme-btn");
  btns.forEach((btn) => {
    btn.classList.toggle("hidden");
    if (btn.classList.contains("hidden")) checkedTheme = btn.dataset.theme;
  });
  document.body.setAttribute("class", checkedTheme);
}

function closeDetails() {
  detailsContainer.classList.add("hidden");
  container.classList.remove("hidden");
}

function clearSearch() {
  searchInput.value = "";
  resetCountries();
  searchCountry();
}

// **********LOGIC FUNCTION ********** //
function displayCountries() {
  if (filtredCountries.length == 0) {
    resetCountries();
    return;
  } else {
    noCountryEl.classList.add("hidden");
    loadMoreEl.classList.remove("hidden");
    for (
      ;
      currentIndex < countriesToDisplay &&
      currentIndex < filtredCountries.length;
      currentIndex++
    ) {
      country = filtredCountries[currentIndex];
      countriesEls.innerHTML += `
    <div class="country" onclick="showDetails(${currentIndex})">
        <div class="flag">
            <img src="${country.flags.png}" alt="${country.name} Flag">
        </div>
        <div class="details">
            <h2 class="country-name">${country.name}</h2>
            <div>Population: <span>${country.population}</span></div>
            <div>Region: <span>${country.region}</span></div>
            <div>Capital: <span>${country.capital}</span></div>
        </div>
    </div>`;
    }
  }
}

function loadMoreCountries() {
  countriesToDisplay += 10;
  displayCountries();
}

function resetCountries() {
  filtredCountries = COUNTRIES;
  noCountryEl.classList.remove("hidden");
  loadMoreEl.classList.add("hidden");
  countriesEls.innerHTML = "";
}

function searchCountry() {
  if (searchInput.value.length != 0) xMark.classList.remove("hidden");
  else xMark.classList.add("hidden");
  // Empty the country list
  resetCountries();
  // Init the indexing variables (currentIndex and countriesToDisplay)
  currentIndex = 0;
  countriesToDisplay = 20;
  // Get the query
  let query = searchInput.value;

  // Loop over the COUNTRIES Variable and cunstruct a new filtered list
  filtredCountries = COUNTRIES.filter(({ name, nativeName, region }) => {
    let details = name + nativeName;
    return (
      details.toLowerCase().includes(query.toLowerCase()) &&
      (checkedRegion.toLowerCase() === region.toLowerCase() ||
        checkedRegion.toLowerCase() === "all")
    );
  });
  console.log(filtredCountries.length);
  displayCountries();
}

function showDetails(index) {
  let country = filtredCountries[index];
  detailsEl.innerHTML = `
  <img src="${country.flags.png}" alt="${country.name} Flag">
  <div class="content">
      <h2 class="name col-span-2">${country.name}</h2>
      <div>Native Name: <span>${country.nativeName}</span></div>
      <div>Top Level Domain: <span>${country.topLevelDomain}</span></div>
      <div>Population: <span>${country.population}</span></div>
      <div>Currencies: <span>${country.currencies
        .map(({ name }) => name)
        .join(", ")}</span></div>
      <div>Region: <span>${country.region}</span></div>
      <div>Languages: <span>${country.languages
        .map(({ name }) => name)
        .join(", ")}</span></div>
      <div class="col-span-2">Sub Region: <span>${
        country.subregion
      }</span></div>
      <div class="col-span-2">Capital: <span>${country.capital}</span></div>
      <div class="border-countries col-span-2"><span class="border-countries-title">Border Countries:</span> ${country.borders
        .map((border) => `<span>${border}</span>`)
        .join("")}</div>
      `;

  detailsContainer.classList.remove("hidden");
  container.classList.add("hidden");
}
