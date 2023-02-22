import axios from 'axios';

export default class PixabayService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImages() {
    const url = 'https://pixabay.com/api/';
    try {
      const reqvestData = await axios.get(url, {
        params: {
          key: '33676510-60d9800a173eb3eec07b521d4',
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: this.page,
        },
      });

      return reqvestData.data;
    } catch {
      return;
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newqQuery) {
    this.searchQuery = newqQuery;
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
