'use-strict'

const {src, dest, series, watch} = require('gulp')
const twig = require('gulp-twig')
const browserSync = require('browser-sync').create()
const del = require('del')
const sass = require('gulp-sass')
//const babel = require('gulp-babel')

const twigData = {
	nav: [
		{link: '#1', name: 'Ссылка 1'},
		{link: '#2', name: 'Ссылка 2'},
		{link: '#3', name: 'Ссылка 3'},
		{link: '#4', name: 'Ссылка 4'},
	],
	posts: [
		{
			title: 'Заголовок блока',
			link: '#link1',
			img: '',
			text: 'зимут прекрасно решает радиант. Вселенная достаточно огромна, чтобы Южный Треугольник ничтожно перечеркивает астероидный Юпитер. У планет-гигантов нет твёрдой поверхности, таким образом узел вызывает сарос, в таком случае эксцентриситеты и наклоны орбит возрастают. '
		}
	]
}

const sourcePaths = {
	pages: 'source/html/*.html',
	twig: 'source/html/twig/index.twig',
	scss: 'source/scss/styles.scss'
}

const buildPaths = {
	pages: 'build/pages',
	css: 'build/css',
	js: 'build/js'
}

const buildTwigPage = function() {
	return src(sourcePaths.twig)
		.pipe(twig({
			data: twigData,
			useFileContents: true
		}))
		.pipe(dest(buildPaths.pages))
}

const buildPage = function(){
	return src(sourcePaths.pages)
			.pipe(dest(buildPaths.pages))
}

const buildStyles = function() {
	return src(sourcePaths.scss)
		.pipe(sass())
		.pipe(dest(buildPaths.css))
		.pipe(browserSync.stream())
}

const buildJs = function() {

}

const watcher = function(done){
	watch(['source/html/twig/**/*.twig'], series(buildTwigPage, reload))
	watch(['source/html/*.html'], series(buildPage, reload))
	watch(['source/scss/*.scss'], buildStyles)
	done()
}

const clean = function() {
	return del(['./build'])
}

function runServer (done) {
	browserSync.init({
		server: {
			baseDir: ['./', './build/pages/'],
			logLevel: 'debug',
		},
		ghostMode: false,
	});
	done();
}

function reload (done) {
	browserSync.reload();
	done();
}

exports.default = series(clean, buildStyles, buildPage, buildTwigPage, runServer, watcher)