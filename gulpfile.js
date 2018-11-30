'use strict';

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  iconfont = require('gulp-iconfont'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  cleanCSS = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  rimraf = require('rimraf'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  runTimestamp = Math.round(Date.now() / 1000),
  browserify = require('browserify'),
  babel = require('babelify'),
  vinylSourceStream = require('vinyl-source-stream'),
  es = require('event-stream');

var path = {
 build: { //Тут мы укажем куда складывать готовые после сборки файлы
  html: 'build/',
  js: 'build/assets/js/',
  css: 'build/assets/css/',
  img: 'build/assets/img/',
  fonts: 'build/assets/fonts/',
  libs: 'build/libs/',
  fonticon: 'build/assets/fonts/'
 },
 src: { //Пути откуда брать исходники
  html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
  js: 'src/assets/js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
  style: 'src/assets/sass/**/*.sass',
  img: 'src/assets/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
  fonts: 'src/assets/fonts/**/*.*',
  libs: 'src/libs/**/*.*',
  fonticon: 'src/assets/img/icons/*.svg'
 },
 watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
  html: 'src/**/*.html',
  js: 'src/assets/js/**/*.js',
  style: 'src/assets/sass/**/*.sass',
  fonticon: 'src/assets/img/icons/*.svg',
  fonts: 'src/assets/fonts/**/*.*'
 },
 clean: './build'
};

var config = {
 server: {
  baseDir: './build'
 },
 tunnel: true,
 host: 'localhost',
 port: 3000,
 logPrefix: 'Frontend'
};

gulp.task('html:build', function() {
 gulp.src(path.src.html) //Выберем файлы по нужному пути
   .pipe(rigger()) //Прогоним через rigger
   .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
   .pipe(browserSync.reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('fonticon:build', function() {
 gulp.src(path.src.fonticon).pipe(iconfont({
  fontName: 'iconFont',
  prependUnicode: true,
  formats: ['ttf', 'eot', 'woff', 'svg'],
  normalize: true,
  fontWeight: '300',
  fontHeight: 1001,
  fixedWidth: false,
  centerHorizontally: false
 })).on('glyphs', function(glyphs, options) {
  // CSS templating, e.g.
  console.log(glyphs, options);
 }).pipe(gulp.dest(path.build.fonticon));
});

gulp.task('js:build', () =>
  gulp.src(path.src.js)

  // .pipe(uglify()) //Сожмем наш js
    .pipe(gulp.dest(path.build.js)).pipe(reload({stream: true}))
);

gulp.task('browserify', function() {
 var files = [
  'common.js'
 ];
 var tasks = files.map(function(entry) {
  return browserify({
   entries: ['src/assets/js/' + entry],
   debug: true
  }).transform(babel).bundle()

  // .pipe(notify("Found file: <%= file.relative %>!"))

    .pipe(vinylSourceStream(entry))
    // .pipe($.rename({
    //     extname: '.bundle.js'
    // }))
    .pipe(gulp.dest(path.build.js)).pipe(browserSync.stream({once: true}));
 });
 return es.merge.apply(null, tasks);
});

gulp.task('image:build', function() {
 gulp.src(path.src.img) //Выберем наши картинки
   .pipe(imagemin({ //Сожмем их
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()],
    interlaced: true
   })).pipe(gulp.dest(path.build.img)) //И бросим в build
   .pipe(reload({stream: true}));
});

gulp.task('style:build', function() {
 gulp.src(path.src.style) //Выберем наш main.scss
   .pipe(sourcemaps.init()) //То же самое что и с js
   .pipe(sass()) //Скомпилируем
   .pipe(prefixer()) //Добавим вендорные префиксы
   .pipe(cleanCSS()).pipe(sourcemaps.write()).pipe(gulp.dest(path.build.css)) //И в build
   .pipe(reload({stream: true}));
});

gulp.task('libs:build', function() {
 gulp.src(path.src.libs).pipe(gulp.dest(path.build.libs));
});

gulp.task('fonts:build', function() {
 gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
});

gulp.task('build', [
 'html:build',
 'js:build',
 'browserify',
 'style:build',
 'fonts:build',
 'image:build',
 'libs:build',
 'fonticon:build'
]);

gulp.task('watch', function() {
 watch([path.watch.html], function(event, cb) {
  gulp.start('html:build');
 });
 watch([path.watch.fonticon], function(event, cb) {
  gulp.start('fonticon:build');
 });
 watch([path.watch.js], function(event, cb) {
  gulp.start('js:build');
 });
 watch([path.watch.style], function(event, cb) {
  gulp.start('style:build');
 });
 watch([path.watch.js], function(event, cb) {
  gulp.start('browserify');
 });
 watch([path.watch.img], function(event, cb) {
  gulp.start('image:build');
 });
 watch([path.watch.fonts], function(event, cb) {
  gulp.start('fonts:build');
 });
});

gulp.task('webserver', function() {
 browserSync(config);
});

gulp.task('clean', function(cb) {
 rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);