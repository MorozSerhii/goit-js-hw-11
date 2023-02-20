import './css/styles.css';
import PixabayService from './api-pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputElement = document.querySelector('input');
const imageContainer = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');

const pixabayService = new PixabayService();
inputElement.addEventListener('input', e => {
  if (e.target.value === '') {
    loadBtn.classList.add('is-hidden');

    imageContainer.innerHTML = '';
  }
});
function pullMarkUp() {
  pixabayService.getImages().then(response => {
    if (!response) {
      return;
    } else if (response.hits.length < 40) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results🥲🥲🥲"
      );
      loadBtn.classList.add('is-hidden');
    } else if (response.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );

      return;
    } else if (response.hits.length > 0) {
      loadBtn.classList.remove('is-hidden');
    }

    let allImages = response.hits.reduce(
      (markup, response) => createMarkup(response) + markup,
      ''
    );
    return (imageContainer.innerHTML = allImages);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  if (inputElement.value === '') {
    return;
  }

  pixabayService.query = inputElement.value;
  pullMarkUp();
  Notify.failure(` "Hooray! We found ${pixabayService.hits} images"`);
  pixabayService.resetHits();
  pixabayService.resetPage();
});

loadBtn.addEventListener('click', e => {
  e.preventDefault();

  pullMarkUp();
});

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
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
</div>`;
}
