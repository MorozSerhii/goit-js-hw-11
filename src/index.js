import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

const listEl = document.querySelector('.country-list');
const inputElement = document.querySelector('#search-box');
const cardContainerEl = document.querySelector('.country-info');
inputElement.addEventListener('input', debounce(dataSent, DEBOUNCE_DELAY));

function dataSent() {
  let name = inputElement.value;

  if (!name) {
    onClear();
    return;
  }

  fetchCountries(name)
    .then(data => {
      if (data.status === 404) {
        throw new Error(data.status);
      }

      if (data.length === 1) {
        let countryInfo = data.map(data => createCountryCard(data));
        listEl.innerHTML = '';
        return (cardContainerEl.innerHTML = countryInfo);
      }
      if (data.length <= 10) {
        let allCauntry = data.reduce(
          (markup, data) => createMarkup(data) + markup,
          ''
        );
        cardContainerEl.innerHTML = '';
        return (listEl.innerHTML = allCauntry);
      }

      Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    })
    .catch(onError);
  onClear();
}

function createMarkup({ name, flags }) {
  return `<li class="list-item" >
    <img src=${flags.svg} class="list-img" />
    <h2 class="article-title">${name.common}</h2>
    
  </li>
  `;
}

function createCountryCard({ name, capital, population, flags, languages }) {
  return `
  <div class="card-wraper">
    <img src=${flags.svg} class="list-img" />
    <h2 class="article-title">${name.common}</h2></div>
    <div class="list-container">
    <p><span>Capital: </span>${capital}</p>
    <p><span>Population: </span>${population}</p>
    <p><span>Languages: </span>${Object.values(languages)}</p>
  `;
}

function onError() {
  Notify.failure('Oops, there is no country with that name');
}

function onClear() {
  listEl.innerHTML = '';
  cardContainerEl.innerHTML = '';
}
