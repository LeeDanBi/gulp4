'use strict';

import gulp from 'gulp';
// import DIR, {PATH} from './Dir';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import del from 'del';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';
import webpack from 'gulp-webpack';
import webpackConfig from './webpack.config.js';
import browserSync from 'browser-sync';
import Cache from 'gulp-file-cache';

let cache = new Cache();

let hello = (done) => {
    console.log('hello');
    done();
};

gulp.task('world', gulp.series(hello, (done)=>{
    console.log('world');
    done();
}));

const DIR = {
    SRC : 'src',
    DEST : 'dist'
};

const SRC = {
    JS: DIR.SRC + '/js/*.js',
    CSS: DIR.SRC + '/css/*.css',
    HTML: DIR.SRC + '/*.html',
    IMAGES: DIR.SRC + '/images/*',
    SERVER: 'server/**/*.js'
};

const DEST = {
    JS: DIR.DEST + '/js',
    CSS: DIR.DEST + '/css',
    HTML: DIR.DEST + '/',
    IMAGES: DIR.DEST + '/images',
    SERVER: 'app'
};

let clean = (done) => {
    console.log('clean');
    del.sync([DIR.DEST]);
    done();
};

let css = (done) => {
    console.log(SRC.CSS);
    gulp.src(SRC.CSS)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(DEST.CSS));
    done();
};

let html = (done) => {
    console.log(SRC.HTML);
    gulp.src(SRC.HTML)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(DEST.HTML));
    done();
};

let images = (done) => {
    console.log(SRC.IMAGES);
    gulp.src(SRC.IMAGES)
        .pipe(imagemin())
        .pipe(gulp.dest(DEST.IMAGES));
    done();
};

let js = (done) => {
    gulp.src(SRC.JS)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(DEST.JS));
    done();
};

/* babel */
let babelSet = (done) =>{
    gulp.src(SRC.SERVER)
        .pipe(cache.filter())
        .pipe(babel({
            presets:['es2015']
        }))
        .pipe(cache.cache())
        .pipe(gulp.dest(DEST.SERVER));
    done();
};

/* watch 작성 */
let watch = (done) => {
    gulp.watch(SRC.JS, webpackSet),
    gulp.watch(SRC.IMAGES, images);
    gulp.watch(SRC.JS, js);
    gulp.watch(SRC.CSS, css);
    gulp.watch(SRC.HTML, html);
    gulp.watch(SRC.SERVER, babelSet);
    done();
};

let start = (done) => {
    nodemon({
        script : DEST.SERVER + '/main.js' ,
        watch : DEST.SERVER
    });
    done();
}

let webpackSet = (done) => {
    gulp.src('src/js/*.js')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('dist/js'));
    done();
};

let browserSyncSet = (done) => {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files : ["dist/**/*"],
        port : 7000
    });
    done();
}

gulp.task('babel', babelSet);
//let mkdest = gulp.task('mk', gulp.parallel(css, html, images));
gulp.task('default', gulp.series(clean, webpackSet, images, css, js, html, watch, start, browserSyncSet));
