'use strict';

// Variabili con riferimenti Dipendenze
var gulp            = require('gulp');
var rename          = require('gulp-rename');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');     // https://www.npmjs.com/package/gulp-autoprefixer -> npm install --save-dev gulp-autoprefixer
var sourcemaps      = require('gulp-sourcemaps');       // https://www.npmjs.com/package/gulp-sourcemaps -> npm install --save-dev gulp-sourcemaps
var browserify      = require('browserify');            // https://www.npmjs.com/package/browserify -> npm install --save-dev browserify
var babelify        = require('babelify');              // https://www.npmjs.com/package/babelify -> npm install --save-dev babelify
var source          = require('vinyl-source-stream');   // https://www.npmjs.com/package/vinyl-source-stream -> npm install --save-dev vinyl-source-stream
var buffer          = require('vinyl-buffer');          // https://www.npmjs.com/package/vinyl-buffer -> npm install --save-dev vinyl-buffer
var uglify          = require('gulp-uglify');           // https://www.npmjs.com/package/gulp-uglify -> npm install --save-dev gulp-uglify
var browsersync     = require('browser-sync').create(); // https://www.npmjs.com/package/browser-sync -> npm install browser-sync --save-dev

var styleSRC    = 'src/scss/style.scss'; // Path dei File Sorgente [DEV]
var styleDIST   = './dist/css/'; // Path dei File Distribuzione [Pubblicazione]
var styleWatch  = 'src/scss/**/*.scss'; // Stringa formato Glob ogni folder e file, comprese le sottocartelle

// var jsSRC   = 'src/js/script.js'; // Path dell script JavaScript Sorgente [DEV]
// FIX Script Javascript Sorgente
var jsFolderSRC = 'src/js/';
var jsSRC       = 'script.js';
var jsDIST      = './dist/js/'; // Path dei File Distribuzione [Pubblicazione]
var jsWatch     = 'src/js/**/*.js'; // Stringa formato Glob
var jsFILES     = [jsSRC]; // array file

// init Browser-sync
gulp.task('browser-sync', function() {
    browsersync.init({
        proxy: "http://localhost:8080/gulp-test/gulp-from-scratch" // Cartella Principale rinominata, era 'browsersync'
    });
});

// Task Compilazione SASS in CSS
// Lezione 4
// URL: https://www.youtube.com/watch?v=T86q-CnBw98&index=4&list=PLriKzYyLb28lp0z-OMB5EYh0OHaKe91RV
gulp.task('style', function(){
    //console.log('esecuzione del task \'style\'');
    gulp.src( styleSRC )
        .pipe( sourcemaps.init() )
        .pipe( sass({
            errorLogToConsole: true,
            outputStyle: 'compressed' // Minify CSS gulp-sass option
        }) )
        .on( 'error', console.error.bind( console ) )
        .pipe( autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // Utilizza 'gulp-rename' per aggiunge il suffiso (suffix) 'min' prima dell'estensione del file (extname), es. style.min.css
        // https://www.npmjs.com/package/rename -> npm install --save-dev gulp-rename
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( sourcemaps.write('./') )
        .pipe( gulp.dest( styleDIST ) ); 
});

// Task JS
gulp.task('js', function(){
    //console.log('esecuzione del task \'js\'');
    /*gulp.src( jsSRC )
        .pipe( rename( { 
            prefix: "dist.",
            basename: 'javascript' } ) )
        .pipe( gulp.dest( jsDIST ) );*/

    // The map() array method creates a new array with the results of calling a function for every array element.
    // .map() cicla tutti gli elementi dell'array ed esegue per ognuno la funzione di callback
    // w3chools reference -> https://www.w3schools.com/jsref/jsref_map.asp
    jsFILES.map(function ( eachfile ){ // eachfile è l'elemento corrente dell'array
            // Browserify - will recursively analyze all the require() calls in your app in order to build a bundle (confezionare) you can serve up to the browser in a single <script> tag.
            return browserify({
                entries: [jsFolderSRC + eachfile]
            })
            // [transpiller] transform babelify [env version] (Convert ES6 to Regular JavaScript)
            // https://www.npmjs.com/package/babelify -> npm install --save-dev babelify
            // Installare altre 2 Dipendenze di Babelify:
            // npm install --save-dev babel-core
            // npm install --save-dev babel-preset-env
            // [Attenzione] Modificare anche il file package.json
            // Converte ES6 > Regular JavaScript Vanilla
            .transform( babelify, { presets: ['env'] } )
            .bundle()
            // source da inserire all'inizio dello stream (come primo pipe)
            .pipe( source( eachfile ) )
            .pipe( rename( { extname: '.min.js' } ) )
            // Trattiene in un Buffer lo stream
            .pipe( buffer() )
            // gulp-sourcemaps -> To load existing source maps, pass the option loadMaps: true to sourcemaps.init()
            .pipe ( sourcemaps.init( { loadMaps: true } ) )
                // Minify JavaScript
                .pipe( uglify() )
            // l'argomento passato specifica la Base Root
            .pipe( sourcemaps.write('./') )
            .pipe( gulp.dest( jsDIST ) );

    });

    // Browserify Package (gestisce import dei moduli)
    
    // bundle
    // source
    // rename .min
    // buffer
    // init sourcemaps
    // uglify
    // write sourcemaps
    // dist
});

// Indicare i TASK in ordine di esecuzione (vengono prima eseguito nell'ordine i task 'browser-sync', style' poi 'js')
// Ed infine viene eseguito la callback function del task di default
gulp.task('default', ['browser-sync','style','js'], function(){ //'browser-sync',
    //console.log('esecuzione del task \'default\'');
});

// Il task 'watch'
// Esegue prima il task 'default' e poi la callback function del task 'watch'
// resta in ascolto sui percorsi indicati
// ed esegue il task relativo in caso di modifiche
// e ricarica tutti browser in ascolto sulla porta 3000 o che usano il proxy indicato in browsersync.init
gulp.task('watch', ['default'], function(){
    gulp.watch( styleWatch, ['style'] );
    gulp.watch( jsWatch, ['js'] );
    
    //gulp.watch( ['dist/css/**/*','dist/js/**/*','*.html','*.php'], browsersync.reload );
    gulp.watch( [styleWatch, jsWatch, '*.html', '*.php'], browsersync.reload );
});