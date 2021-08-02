// -- ИМПОРТ
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import card from '../hbs/card.hbs';
import PicturesApiService from './api-service';

// -- ЭЛЕМЕНТЫ
const divEl = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const formEl = document.querySelector('.search-form');

// -- ЭКЗЕМПЛЯРЫ КЛАССОВ PicturesApiService и SimpleLightbox
const picturesApiService = new PicturesApiService();
const gallery = new SimpleLightbox('.gallery a');

// -- СОБЫТИЯ
formEl.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onRequestImages);

// -- ГЛОБАЛЬНАЯ ПЕРЕМЕННАЯ ДЛЯ ПОДСЧЕТА
// -- КОЛИЧЕСТВА ЗАГРУЖЕННЫХ И ОТРИСОВАННЫХ КАРТИНОК
let totalRenderPictures = 0;

// -- ЗАПРОС ПРИ SUBMIT ФОРМЫ
function onSearch(e) {
  e.preventDefault();
  btnLoadMore.classList.add('is-hidden');

  clearContainer();
  picturesApiService.query = e.currentTarget.elements.query.value.trim();
  if (picturesApiService.query === '') {
    return;
  }
  totalRenderPictures = 0;
  picturesApiService.resetPage();
  onRequestImages();
}

// -- ЗАПРОС ЗА ИЗОБРАЖЕНИЯМИ
function onRequestImages() {
  picturesApiService.fetchcImages().then(onRenderPictures).catch(onError);
}

// -- РЕНДЕР ИЗОБРАЖЕНИЙ
function onRenderPictures({ totalHits, hits }) {
  if (hits.length === 0) {
    btnLoadMore.classList.add('is-hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    return;
  }

  totalRenderPictures += hits.length;

  if (totalRenderPictures === totalHits) {
    btnLoadMore.classList.add('is-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }

  divEl.insertAdjacentHTML('beforeend', card(hits));
  gallery.refresh();
  btnLoadMore.classList.remove('is-hidden');
  Notiflix.Notify.success(`Hooray! We found ${totalRenderPictures} images out of ${totalHits}.`);
}

// -- БЛОК ОШИБКИ
function onError() {
  Notiflix.Notify.failure('Oops, pls, try again');
}

// -- ОЧИСТКА КОНТЕЙНЕРА
function clearContainer() {
  divEl.innerHTML = '';
}
