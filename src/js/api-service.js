import axios from 'axios';

export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.quantityPerPage = 40;
  }

  fetchcImages() {
    const url = `https://pixabay.com/api/?&key=22641637-7351131587a9af45879174884&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.quantityPerPage}&page=${this.page}`;

    return axios
      .get(url)
      .then(response => response.data)
      .then(({ totalHits, hits }) => {
        this.page += 1;

        return { totalHits, hits };
      });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
