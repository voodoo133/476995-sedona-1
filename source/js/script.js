var body = document.body;

if (body.classList.contains('no-js')) body.classList.remove('no-js');

var control_menu = document.querySelector('.page-header__control-menu');
var menu = document.querySelector('.main-nav');

control_menu.onclick = function (e) {
  e.preventDefault();

  control_menu.classList.toggle('page-header__control-menu--close');
  menu.classList.toggle('main-nav--opened');
}

svg4everybody();
