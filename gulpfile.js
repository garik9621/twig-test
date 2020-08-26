'use-strict'

const {src, dest, series, watch} = require('gulp')
const twig = require('gulp-twig')
const browserSync = require('browser-sync').create()
const del = require('del')
const sass = require('gulp-sass')
const data = require('gulp-data')
const fs = require('fs')
const path = require('path')
//const babel = require('gulp-babel')

const sourcePaths = {
	pages: 'source/html/*.html',
	twig: 'source/html/twig/index.twig',
	scss: 'source/scss/styles.scss',
	data: 'source/data/'
}

const buildPaths = {
	pages: 'build/pages',
	css: 'build/css',
	js: 'build/js'
}

const buildTwigPage = function() {
	return src(sourcePaths.twig)
		.pipe(data(file => {
			return JSON.parse(fs.readFileSync((sourcePaths.data + path.basename(file.path) + '.json')))
		}))
		.pipe(twig())
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