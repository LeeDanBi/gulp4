'use strict';

import gulp from 'gulp';
import DIR, { PATH } from './Dir';
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
import sass from 'gulp-sass';

let cache = new Cache();

let hello = (done) => {
    console.log('hello');
    done();
};

gulp.task('world', gulp.series(hello, (done)=>{
    console.log('world');
    done();
}));

let clean = (done) => {
    console.log('clean');
    del.sync([PATH.DIR.DEST]);
    done();
};

let html = (done) => {
    console.log(PATH.SRC.HTML);
    gulp.src(PATH.SRC.HTML)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(PATH.DEST.HTML));
    done();
};

let images = (done) => {
    console.log(PATH.SRC.IMAGES);
    gulp.src(PATH.SRC.IMAGES)
        .pipe(imagemin())
        .pipe(gulp.dest(PATH.DEST.IMAGES));
    done();
};

let js = (done) => {
    gulp.src(PATH.SRC.JS)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(PATH.DEST.JS));
    done();
};

/* babel */
let babelSet = (done) =>{
    gulp.src(PATH.SRC.SERVER)
        .pipe(cache.filter())
        .pipe(babel({
            presets:['es2015']
        }))
        .pipe(cache.cache())
        .pipe(gulp.dest(PATH.DEST.SERVER));
    done();
};

/* watch 작성 */
let watch = (done) => {
    gulp.watch(PATH.SRC.JS, webpackSet),
    gulp.watch(PATH.SRC.IMAGES, images);
    gulp.watch(PATH.SRC.JS, js);
    gulp.watch(PATH.SRC.SCSS, css);
    gulp.watch(PATH.SRC.CSS, css);
    gulp.watch(PATH.SRC.HTML, html);
    gulp.watch(PATH.SRC.SERVER, babelSet);
    done();
};

let start = (done) => {
    nodemon({
        script: PATH.DEST.SERVER + '/main.js' ,
        watch: PATH.DEST.SERVER
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
};

// let css = (done) => {
//     console.log(PATH.SRC.CSS);
//     gulp.src(PATH.SRC.CSS)
//         .pipe(cleanCSS({compatibility: 'ie8'}))
//         .pipe(gulp.dest(PATH.DEST.CSS));
//     done();
// };

gulp.task('css:sass', () => {
    console.log( 'sass in' );
    return new Promise( resolve => {
        gulp.src( `${PATH.DIR.SRC}/scss/*.scss` )
            .pipe( cache.filter() ) //이미 캐시에 있는 파일을 필터링하는 스트림을 만듭니다.
            .pipe( sass() ) // 불러운 scss 파일들을 sass 모듈로 컴파일 합니다.
            .pipe( cache.cache() ) // 캐시 파일에 스트림 파일을 캐시
            .pipe( gulp.dest(`${ PATH.DIR.SRC }/css`) ); // 완성된 scss파일을 css 폴더로 옮김
        resolve();
    });
});

gulp.task( 'css:css', () => {
    console.log( 'css in' );
    return new Promise( resolve => {
        gulp.src( PATH.SRC.CSS )
            .pipe( cache.filter() )
            .pipe(cleanCSS({ compatibility: 'ie8' }))
            .pipe( cache.cache() )
            .pipe( gulp.dest( `${ PATH.DEST.CSS }` ) );
        resolve();
    });
});

const css = gulp.series('css:sass', 'css:css');

gulp.task('babel', babelSet);
//let mkdest = gulp.task('mk', gulp.parallel(css, html, images));
gulp.task('default', gulp.series(clean, webpackSet, images, css, js, html, watch, start, browserSyncSet));


gulp.task('dir', (done)=>{
    console.log( PATH.SRC.JS );
    done();
});
