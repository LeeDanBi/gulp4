// Dir.js
let DIR = {
    SRC : 'src' , // 작업을 진행할 폴더명
    DEST : 'dist' , // 작업된 파일들을 컴파일하여 정리해두는 폴더
    PORT : 8005 , // 서버가 실행될 포트 번호
};

// Object를 만들 때 상위 JavaScript는 마지막 값의 끝에 콤파( , )가 있어도 오류를 뱉지 않는다.

module.exports = {
    PATH : {
        DIR : DIR , // 위에 생성한 DIR 변수를 대입하였습니다.
        SRC : {
            JS : `${ DIR.SRC }/js/**/*.js` ,
            CSS : `${ DIR.SRC }/css/*.css` ,
            SCSS : `${ DIR.SRC }/scss/**/*.scss` ,
            HTML : `${ DIR.SRC }/**/*.html` ,
            IMAGES : `${ DIR.SRC }/images/*` ,
            SERVER : `server/**/*.js` ,
        } ,
        DEST : {
            JS : `${ DIR.DEST }/js` ,
            CSS : `${ DIR.DEST }/css` ,
            HTML : `${ DIR.DEST }/` ,
            IMAGES : `${ DIR.DEST }/images` ,
            SERVER : `app` ,
        }
    }
};



`const DIR = {
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
};`;
