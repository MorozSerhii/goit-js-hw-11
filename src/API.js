import axios from 'axios';

const url = `https://pixabay.com/api/`;

function getImages(searchQuery) {
  return axios.get(`${url}`, {
    params: {
      key: '33676510-60d9800a173eb3eec07b521d4',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  });
}

export default getImages;
