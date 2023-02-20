import axios from 'axios';

export default class PixabayService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = '';
  }

  async getImages() {
    const url = `https://pixabay.com/api/`;

    try {
      const reqvestData = await axios.get(`${url}`, {
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

      this.page += 1;
      this.hits = reqvestData.data.totalHits;

      return reqvestData.data;
    } catch {
      console.error('щось пішло не так');
    }
  }
  get query() {
    return this.searchQuery;
  }

  set query(newqQuery) {
    this.searchQuery = newqQuery;
  }

  resetPage() {
    this.page = 1;
  }

  get hits() {
    return this.totalHits;
  }

  set hits(newHits) {
    this.totalHits = newHits;
  }
  resetHits() {
    this.totalHits = '';
  }
}
