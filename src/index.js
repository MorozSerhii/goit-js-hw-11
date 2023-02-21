import './css/styles.css';
import PixabayService from './api-pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

const inputElement = document.querySelector('input');
const imageContainer = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');

const pixabayService = new PixabayService();

const lightBox = new SimpleLightbox('.gallery a');
form.addEventListener('submit', pullMarkup);
loadBtn.addEventListener('click', loadMore);
inputElement.addEventListener('input', event => {
  if (event.target.value === '') {
    onClear();
    loadBtn.classList.add('is-hidden');
    pixabayService.resetPage();
    return;
  }
});

async function pullMarkup(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notify.failure('Hey! enter a search query dude!');

    return;
  }
  pixabayService.query = searchQuery;
  const response = await pixabayService.getImages();

  if (response.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
  }
  loadBtn.classList.remove('is-hidden');

  const totalHits = await response.totalHits;
  onClear();
  pixabayService.resetPage();
  pushMarkup(response.hits);
  lightBox.refresh();
  notiflix(totalHits);
}

function pushMarkup(response) {
  let allImages = response.reduce(
    (markup, response) => createMarkup(response) + markup,
    ''
  );

  imageContainer.insertAdjacentHTML('beforeend', allImages);
}

async function loadMore(e) {
  e.preventDefault();
  pixabayService.incrementPage();
  const response = await pixabayService.getImages();
  const totalHits = await response.totalHits;
  if (Math.ceil(totalHits / 40) === pixabayService.page) {
    Notify.failure(
      'happy end, no more images to load. Please enter a different search query'
    );
    loadBtn.classList.add('is-hidden');
    return;
  }
  pushMarkup(response.hits);
  smoothScroll();
  lightBox.refresh();
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
    console.log(`position`);
    pixabayService.incrementPage();
    const response = await pixabayService.getImages();
    const totalHits = await response.totalHits;
    if (Math.ceil(totalHits / 40) === pixabayService.page) {
      Notify.failure(
        'happy end, no more images to load. Please enter a different search query'
      );
      loadBtn.classList.add('is-hidden');
      return;
    }
    pushMarkup(response.hits);
    smoothScroll();
    lightBox.refresh();
  }
}
let DEBOUNCE_DELAY = 200;
window.addEventListener('scroll', debounce(checkPosition, DEBOUNCE_DELAY));
