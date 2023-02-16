import './css/styles.css';
import getImages from './API';

const inputElement = document.querySelector('input');
const imageContainer = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

inputElement.addEventListener('input', reqvestData);
let allImages = [];

function reqvestData() {
  let search = inputElement.value;

  if (search === '') {
    return;
  }

  getImages(search).then(response => {
    let searchQuery = response.data.hits;
    console.log(searchQuery);

    return (allImages = searchQuery.reduce(
      (markup, searchQuery) => createMarkup(searchQuery) + markup,
      ''
    ));
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  imageContainer.innerHTML = allImages;
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
