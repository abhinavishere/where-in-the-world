const countriesContainer = document.querySelector(".countries");
const inputCountry = document.querySelector(".input__text");
const countryForm = document.querySelector(".input__form");
const regionMenu = document.querySelector(".dropdown__menu");
const dropDown = document.querySelector(".dropdown");
const detailsPage = document.querySelector(".details");
const main = document.querySelector(".main");
const backBtn = document.querySelector(".back");

// https://restcountries.eu/rest/v2/region/{region} //? For region
// https://restcountries.eu/rest/v2/alpha/{code} //? Code
// https://restcountries.eu/rest/v2/name/{name} //?By Name

// Render Country Article
const renderCountryArticle = function (country) {
  const countryHTML = `<article class="country">
    <div class="country__img">
        <img
        src="${country.flag}"
        alt="${country.name} Flag"
        class="country__img--flag"
        />
    </div>
    <div class="country__desc">
        <h3 class="country__name">${country.name}</h3>
        <p class="country__population country__detail">
        Population:
        <span class="country__population--count">${(
          country.population / 1000000
        ).toFixed(2)}M</span>
        </p>
        <p class="country__region country__detail">
        Region:
        <span class="country__region--name">${country.region}</span>
        </p>
        <p class="country__capital country__detail">
        Capital:
        <span class="country__capital--name">${country.capital}</span>
        </p>
    </div>
</article>`;

  countriesContainer.insertAdjacentHTML("beforeend", countryHTML);
};

// const getNeighbour = async function(country){
//   c
// }

//? Render Countries Details Page
const renderCountryDetails = function (country, neighbours) {
  // const neighbourArray = ["IND", "US", "GB"];
  const countryHTML = `
  <div class="details__flag">
    <img
      src="${country.flag}"
      alt="${country.name} Flag"
      class="details__flag--img"
    />
  </div>
  
  <div class="details__body">
    
    <h3 class="details__title">${country.name}</h3>
   
    <div class="details__items">
      
      <div class="details__info">
        <p>Native Name: <span class="details__param">${
          country.nativeName
        }</span></p>
        <p>Population: <span class="details__param">${(
          country.population / 1000000
        ).toFixed(2)}M</span></p>
        <p>Region: <span class="details__param">${country.region}</span></p>
        <p>
          Sub Region: <span class="details__param">${country.subregion}</span>
        </p>
        <p>Capital: <span class="details__param">${country.capital}</span></p>
      </div>
     
      <div class="details__info">
        <p>Top Level Domain: <span class="details__param">${
          country.topLevelDomain[0]
        }</span></p>
        <p>
          Currencies: <span class="details__param">${
            country.currencies[0].name
          }</span>
        </p>
        <p>
          Language: <span class="details__param">${
            country.languages[0].name
          }</span>
        </p>
      </div>
    </div>
    <div class="details__borders">
    <p>
      Border Countries:
  
      <span class="details__borders--item">${country.borders[0]}</span>
      <span class="details__borders--item">${country.borders[1]}</span>
      
    </p>
  </div>
    
  </div>
`;

  //?<span class="details__borders--item">Sri Lanka</span>

  detailsPage.insertAdjacentHTML("beforeend", countryHTML);
};

// Borders

// Render Error Message
const renderError = function (msg) {
  const errorHTML = `<h2 class="error__block">Something went wrong ${msg}</h2>`;
  countriesContainer.insertAdjacentHTML("beforeend", errorHTML);
};

const getCountryByName = async function (country) {
  try {
    const res = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
    if (!res.ok) throw new Error(`Country not found (${res.status})`);
    // console.log(res);
    const [data] = await res.json();
    console.log(data);
    const neighbours = data.borders.splice(0, 2);
    renderCountryDetails(data, neighbours);
  } catch (error) {
    console.error(error);
    renderError(error.message);
  }
};

// getCountryByName("sri");

// Get country by code
const getCountryByCode = async function (country) {
  try {
    const res = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${country}`
    );
    // console.log(res);
    if (!res.ok) throw new Error(`Country not found (${res.status})`);
    const countryData = await res.json();
    return countryData.name;
  } catch (error) {
    console.error(error);
    renderError(error.message);
  }
};
// const list = [];
// const getNeighbour = function (alphaCode) {
//   const name = getCountryByCode(alphaCode).then((data) => console.log(data));
//   // console.log(name);
//   return name
// };
// getNeighbour("IN");
// const neighbourArray = ["IND", "US", "GB"];
// neighbourArray.forEach((n) => getNeighbour(n));

// getCountry("bharat");

// const countriesToDisplay = ["IND", "US", "LK", "GB", "PT", "PK", "SG", "RU"];

// const homePage = function () {
//   countriesToDisplay.forEach((country) => getCountryByCode(country));
// };

// homePage();

// Get Countries by Region
const getCountryByRegion = async function (region) {
  try {
    const response = await fetch(
      `https://restcountries.eu/rest/v2/region/${region}`
    );
    const data = await response.json();
    data.forEach((country) => renderCountryArticle(country));
  } catch (error) {
    console.error(error);
  }
};

//? Event Listeners
//* Select by region
regionMenu.addEventListener("click", function (e) {
  e.preventDefault();
  countriesContainer.innerHTML = "";
  // Guard clause
  if (!e.target.classList.contains("dropdown__item--link")) return;
  const region = e.target.dataset.region;
  //   console.log(region);
  getCountryByRegion(region);
});

//* Select by Name
countryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  detailsPage.innerHTML = "";
  countriesContainer.innerHTML = "";
  const name = inputCountry.value.toLowerCase();
  // getCountry(name); //? Old functionality
  getCountryByName(name);
  inputCountry.value = "";
  inputCountry.blur();
  countryForm.classList.add("hidden");
  dropDown.classList.add("hidden");
  backBtn.classList.remove("hidden");
});

backBtn.addEventListener("click", function () {
  detailsPage.remove();
  // homePage();
  countryForm.classList.remove("hidden");
  dropDown.classList.remove("hidden");
  backBtn.classList.add("hidden");
});
