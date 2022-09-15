import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/';

export class SearchPhoto {
  #API_KEY = '29957887-029d3d055d44cfd1872980aa9';

  constructor(perPage) {
    this.page = 1;
    this.query = null;
    this.perPage = perPage;
  }

  async fetchPictures() {
    axios.defaults.params = {
      key: this.#API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
      page: this.page,
    };

    const response = await axios.get(`api/`);
    const data = await response.data;
    return data;
  }
}
