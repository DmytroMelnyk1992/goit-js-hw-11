import Notiflix from 'notiflix';

import { CreateImageCard } from './js/photo-card.js';
import { SearchPhoto } from './js/request';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  body: document.querySelector('body'),
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  more: document.querySelector('.load-more'),
  keyword: document.querySelector('.keyword'),
};
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
document.querySelector('html').style.cssText = `scroll-behavior: smooth;`;

const searchPhoto = new SearchPhoto(40);
const onSearch = async evt => {
  evt.preventDefault();
  searchPhoto.page = 1;
  searchPhoto.query = evt.currentTarget.elements.searchQuery.value.trim();

  if (searchPhoto.query === '') {
    clearContent();
    refs.keyword.textContent = '';
    refs.form.reset();
    refs.more.classList.add('is-hidden');
    Notiflix.Notify.failure('Please, fill out the search form');
    return;
  }
  try {
    const data = await searchPhoto.fetchPictures();
    if (data.hits.length === 0) {
      clearContent();
      refs.keyword.textContent = searchPhoto.query;
      refs.form.reset();
      refs.more.classList.add('is-hidden');
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      clearContent();
      refs.keyword.textContent = searchPhoto.query;
      refs.form.reset();
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      refs.gallery.insertAdjacentHTML('beforeend', CreateImageCard(data.hits));
      lightbox.refresh();
      // console.log(data.hits.length);
      // console.log(searchPhoto.perPage);
      if (searchPhoto.perPage <= data.hits.length) {
        refs.more.classList.remove('is-hidden');
      }
    }
  } catch {
    console.log('error');
  }
};

refs.form.addEventListener('submit', onSearch);

const searchMore = async () => {
  searchPhoto.page += 1;
  try {
    const data = await searchPhoto.fetchPictures();
    const totalPages = Math.ceil(data.totalHits / searchPhoto.perPage);
    refs.gallery.insertAdjacentHTML('beforeend', CreateImageCard(data.hits));
    lightbox.refresh();
    console.log(data.hits.length);
    console.log(serchPhoto.page);
    console.log(totalPages);
    if (searchPhoto.page === totalPages) {
      refs.more.classList.add('is-hidden');
    }
  } catch {
    console.log('error');
  }
};
refs.more.addEventListener('click', searchMore);

const clearContent = () => {
  refs.gallery.innerHTML = '';
};
