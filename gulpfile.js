var gulp = require('gulp')

//CSS
var cleanCSS = require('gulp-clean-css')
var postcss = require('gulp-postcss')
var sourcemaps = require('gulp-sourcemaps')
var concat = require("gulp-concat")

//Browser refresh
var browserSync = require('browser-sync').create()

//Images
var imagemin = require('gulp-imagemin')

//Github pages
var ghpages = require("gh-pages")

gulp.task("css", function() {
    return gulp.src([
        "src/css/reset.css",
        "src/css/typography.css",
        "src/css/app.css"
    ])
        .pipe(sourcemaps.init())
        .pipe(
            postcss([
                require("autoprefixer"),
                require("postcss-preset-env")({
                    stage: 1,
                    browsers: ["IE 11","last 2 versions"]
                })
            ])
        )
        .pipe(concat("app.css"))
        .pipe(
            cleanCSS({
                compatibiliity: 'ie8'
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream())
})

gulp.task("html", function() {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
})

gulp.task("fonts", function(){
    return gulp.src("src/fonts/*")
        .pipe(gulp.dest("dist/fonts"))
})

gulp.task("images", function(){
    return gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))
})

gulp.task("watch", function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    })
    gulp.watch("src/*.html", gulp.series('html')).on("change", browserSync.reload)
    gulp.watch("src/css/*", gulp.series('css'))
    gulp.watch("src/fonts/*", gulp.series('fonts'))
    gulp.watch("src/img/*", gulp.series('images'))
})

gulp.task("deploy", function() {
    ghpages.publish('dist')
})

gulp.task('default', gulp.series('html','css','fonts','images','watch'));