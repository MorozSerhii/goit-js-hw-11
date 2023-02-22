import './css/styles.css';
import PixabayService from './api-pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

const inputElement = document.querySelector('input');
const imageContainer = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const animationContainer = document.querySelector('.wrapper');

const pixabayService = new PixabayService();

const lightBox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', pullMarkup);
inputElement.addEventListener('input', event => {
  if (event.target.value === '') {
    onClear();
    pixabayService.resetPage();
    return;
  }
});
let totalHits = '';

async function pullMarkup(e) {
  e.preventDefault();
  onClear();
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notify.failure('Hey! enter a search query !');

    return;
  }
  animationContainer.classList.remove('is-hidden');

  pixabayService.query = searchQuery;
  pixabayService.resetPage();

  const response = await pixabayService.getImages();

  if (response.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
  }
  totalHits = await response.totalHits;
  setTimeout(() => {
    pushMarkup(response.hits);
  }, 500);
  setTimeout(() => {
    animationContainer.classList.add('is-hidden');
  }, 500);
  setTimeout(() => {
    lightBox.refresh();
  }, 500);

  notiflix(totalHits);
}

function pushMarkup(response) {
  let allImages = response.reduce(
    (markup, response) => createMarkup(response) + markup,
    ''
  );

  imageContainer.insertAdjacentHTML('beforeend', allImages);
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  
  
  <a class="gallery__item" href="${largeImageURL}">
  <div class="photo-card">
  <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item"> 
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item"> 
      <b>Views: ${views}</b>
    </p>
    <p class="info-item"> 
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>
</a>
  `;
}

function notiflix(value) {
  if (value === 0) {
    return;
  }

  Notify.success(`'Hooray! We found ${value} images'`);
}

function onClear() {
  imageContainer.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;
  if (position >= threshold) {
    try {
      if (Math.ceil(totalHits / 40) === pixabayService.page) {
        setTimeout(() => {
          Notify.failure(
            'happy end, no more images to load. Please enter a different search query'
          );
        }, 300);

        window.removeEventListener(
          'scroll',
          debounce(checkPosition, DEBOUNCE_DELAY)
        );
        return;
      }
      pixabayService.incrementPage();
      const response = await pixabayService.getImages();
      pushMarkup(response.hits);
      lightBox.refresh();
      smoothScroll();
    } catch {
      return;
    }
  }
}
let DEBOUNCE_DELAY = 300;
window.addEventListener('scroll', debounce(checkPosition, DEBOUNCE_DELAY));
