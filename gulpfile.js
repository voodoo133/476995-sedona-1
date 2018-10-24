"use strict";

/* Сборка CSS */
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");

/* Оптимизация графики */
var svgstore = require("gulp-svgstore");
var webp = require("gulp-webp");
var imagemin = require("gulp-imagemin");

/* Сжатие скриптов */ 
var minify = require('gulp-minify');

/* Вспомогательные модули */
var del = require("del");
var rename = require("gulp-rename");

/* Основа */
var gulp = require("gulp");
var server = require("browser-sync").create();

var images_for_sprite = [
  "source/img/icon-like.svg",
  "source/img/icon-video-replay.svg",
  "source/img/icon-video-subtitles.svg",
  "source/img/icon-video-fullscreen.svg",
  "source/img/icon-twitter.svg",
  "source/img/icon-facebook.svg",
  "source/img/icon-youtube.svg",
  "source/img/logo-htmlacademy.svg"
];

gulp.task("clean-build", function () {
  return del("build");
});

gulp.task("copy-files", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("make-css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("make-webp-images", function () {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest("source/img"));
});

gulp.task("optimize-images", function () {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("make-svg-sprite", function () {
  return gulp.src(images_for_sprite)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy-html", function () {
  return gulp.src([
      "source/*.html"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("minify-js", function () {
  return gulp.src([
      "source/js/*.js"
    ])
    .pipe(minify({
      ext: {
        min: ".min.js"
      }  
    }))
    .pipe(gulp.dest("build/js"));
});

gulp.task("make-build", gulp.series(
  "clean-build",
  "copy-files",
  "make-css",
  "make-svg-sprite",
  "copy-html",
  "minify-js"
));

gulp.task("run-server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("make-css"));
  gulp.watch(images_for_sprite, gulp.series("make-svg-sprite", "refresh-server"));
  gulp.watch("source/*.html", gulp.series("copy-html", "refresh-server"));
  gulp.watch("source/js/*.js", gulp.series("minify-js", "refresh-server"));
});

gulp.task("refresh-server", function (done) {
  server.reload();
  done();
});

gulp.task("start", gulp.series(
  "make-build",
  "run-server"
));
