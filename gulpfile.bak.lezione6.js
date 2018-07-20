'use strict';

// Variabili con riferimenti Dipendenze
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browsersync = require('browser-sync');

var styleSRC = 'src/scss/style.scss'; // Path dei File Sorgente [DEV]
var styleDIST = './dist/css/'; // Path dei File Distribuzione [Pubblicazione]
var styleWatch = 'src/scss/**/*.scss'; // Stringa formato Glob ogni folder e file, comprese le sottocartelle

var jsSRC = 'src/js/script.js'; // Path dei File Sorgente [DEV]
var jsDIST = './dist/js/'; // Path dei File Distribuzione [Pubblicazione]
var jsWatch = 'src/js/**/*.js'; // Stringa formato Glob

// init Browser-sync
gulp.task('browser-sync', function() {
    browsersync.init({
        proxy: "http://localhost:8080/gulp-test/browsersync"
    });
});

// Task Compilazione SASS in CSS
// Lezione 4
// URL: https://www.youtube.com/watch?v=T86q-CnBw98&index=4&list=PLriKzYyLb28lp0z-OMB5EYh0OHaKe91RV
gulp.task('style', function(){
    console.log('esecuzione del task \'style\'');
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
        .pipe( rename( { suffix: '.min' } ) ) // Utilizza 'gulp-rename' per aggiunge il suffiso 'min' prima dell'estensione del file, es. style.min.css
        .pipe( sourcemaps.write('./') )
        .pipe( gulp.dest( styleDIST ) ); 
});

// Task JS
gulp.task('js', function(){
    console.log('esecuzione del task \'js\'');
    gulp.src( jsSRC )
        .pipe( rename( { 
            prefix: "dist.",
            basename: 'javascript' } ) )
        .pipe( gulp.dest( jsDIST ) );
});

// Indicare i TASK in ordine di esecuzione (vengono prima eseguito nell'ordine i task 'browser-sync', style' poi 'js')
// Ed infine viene eseguito la callback function del task di default
gulp.task('default', ['browser-sync','style','js'], function(){ // 'browser-sync',
    console.log('esecuzione del task \'default\'');
});

// Il task 'watch'
// Esegue prima il task 'default' e poi tramite la callback function
// resta in ascolto sui percorsi indicati
// ed esegue il task relativo in caso di modifiche
// e ricarica tutti browser in ascolto sulla porta 3000 o che usano il proxy indicato in browsersync.init
gulp.task('watch', ['default'], function(){
    gulp.watch( styleWatch, ['style'] );
    gulp.watch( jsWatch, ['js'] );
    
    //gulp.watch( ['dist/css/**/*','dist/js/**/*','*.html','*.php'], browsersync.reload );
    gulp.watch( [styleWatch,jsWatch,'*.html','*.php'], browsersync.reload );
});