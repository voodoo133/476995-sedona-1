var body = document.body;

if (body.classList.contains('no-js')) body.classList.remove('no-js');

var button_menu_open = document.querySelector('.page-header__open-menu');
var button_menu_close = document.querySelector('.main-nav__close-menu');
var menu = document.querySelector('.main-nav');

button_menu_open.onclick = function (e) {
  e.preventDefault();
  menu.classList.add('main-nav--opened');
}

button_menu_close.onclick = function (e) {
  e.preventDefault();
  menu.classList.remove('main-nav--opened');
}