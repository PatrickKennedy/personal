// Modularized tasks for a better SoC
var fs = require('fs')

    , gulp        = require('gulp')
    , gulpif      = require('gulp-if')
    , gutil       = require('gulp-util')

    , connect     = require('gulp-connect')
    , concat      = require('gulp-concat')
    , del         = require('del')
    , jshint      = require('gulp-jshint')
    , jsh_stylish = require('jshint-stylish')
    , sequence    = require('run-sequence')
    , series      = require('stream-series')
    , tap         = require('gulp-tap')

    , jade        = require('gulp-jade')
    , markdown    = require('gulp-markdown')
    , ng_htmlify  = require('gulp-angular-htmlify')
    , ng_annotate = require('gulp-ng-annotate')
    , ng_cache    = require('gulp-angular-templatecache')

    , sass        = require('gulp-sass')
    , minify_js   = require('gulp-uglify')
    , minify_css  = require('gulp-minify-css')
    , minify_html = require('gulp-minify-html')

    , config      = require('./gulp.config')
    , pkg         = require('./package.json')
    ;

var final_js = [], final_css = [];

gulp.task('index', function index(done, all) {
  return gulp.src(`${config.paths.src}/jade/index.jade`)
    .pipe(jade())
    .pipe(gulp.dest(`${config.paths.dev}`))
    ;
});

/*
 * Script Related Tasks
 *
 * Gather, lint, concatinate, and, optionally, minify scripts
 */

function gather_vendor_scripts(){
  return gulp.src(config.paths.vendor.scripts);
};

function gather_app_scripts(){
  return gulp.src(config.paths.app.scripts)
    .pipe(ng_annotate())
    ;
};

function gather_templates() {
  return gulp.src(config.paths.app.templates)
    .pipe(gulpif(/[.]jade$/, jade()))
    .pipe(gulpif(/[.]md|markdown$/, markdown()))
    .pipe(ng_htmlify())
    .pipe(ng_cache(
      `${pkg.name}.templates.js`,
      {
        standalone: true,
        module: `${pkg.name}.templates`,
        transformUrl: function(url) {
          return url.replace('.tpl', '').replace('html', 'jade');
        }
      }
    ))
    ;
};

function lint_scripts() {
  return gather_app_scripts()
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter(jsh_stylish))
    ;
};

gulp.task('lint', function (){ lint_scripts(); });

function concat_scripts(_concat) {
  return series(
    gather_vendor_scripts(),
    gather_app_scripts(),
    gather_templates()
  )
    .pipe(gulpif(_concat, concat("app.js")))
    ;
}

function build_scripts(dest, minify, concat){
  dest = typeof dest !== 'undefined' ? dest : config.paths.build;
  minify = typeof minify !== 'undefined' ? minify : false;
  concat = typeof concat !== 'undefined' ? concat : false;

  return concat_scripts(concat)
    .pipe(gulpif(minify, minify_js()))
    .pipe(gulp.dest(`${dest}/js/`))
    .pipe(tap(function(file, t){
      if(final_js.indexOf(file.relative) < 0) final_js.push(file.relative);
    }))
    .pipe(connect.reload())
    ;

};

gulp.task('scripts', ['lint'], function(){ return build_scripts(); });
gulp.task('scripts:release', function(){
  return build_scripts(config.paths.release, false, true);
});

/*
 * Stylesheet Related Tasks
 *
 * Gather, concatinate, and, optionally, minify scripts
 */

function gather_styles() {
  return gulp.src(config.paths.app.styles)
    .pipe(gulpif(/[.]scss|sass$/,
      sass({
        sourcemap: false,
        unixNewlines: true,
        style: 'nested',
        debugInfo: false,
        quiet: false,
        lineNumbers: true,
        bundleExec: true,
        loadPath: config.paths.vendor.sass,
        includePaths: [
          require("node-bourbon").includePaths,
          require("bourbon-neat").includePaths,
        ],
      })
      .on('error', gutil.log)
    ))
    ;
}

function gather_vendor_styles() {
  return gulp.src(config.paths.vendor.styles);
}

function concat_styles(_concat) {
  return series(
    gather_vendor_styles(),
    gather_styles()
  )
    .pipe(gulpif(_concat, concat("main.css")))
    ;
}

function build_styles(dest, minify){
  dest = typeof dest !== 'undefined' ? dest : config.paths.build;
  minify = typeof minify !== 'undefined' ? minify : false;

  return concat_styles()
    .pipe(gulpif(minify, minify_css()))
    .pipe(gulp.dest(`${dest}/css`))
    .pipe(tap(function(file, t){
      if(final_css.indexOf(file.relative) < 0) final_css.push(file.relative);
    }))
    .pipe(connect.reload())
    ;
};

gulp.task('styles', function(){ return build_styles(config.paths.build); });
gulp.task('styles:release', function(){
  return build_styles(config.paths.release);
});

/*
 * Root Page Related Tasks
 *
 * Root pages are the containers for templates. They exist as stand-alone files.
 * They can be written in html, jade, or markdown.
 */

function gather_pages(dest) {
  return gulp.src(config.paths.app.pages)
    .pipe(gulpif(/[.]jade$/, jade({
        pretty: true,
        locals: {
          styles: final_css,
          scripts: final_js,
        }
      })
    ))
    .pipe(gulpif(/[.]md|markdown$/, markdown()))
    .pipe(ng_htmlify())
    ;
};

function build_pages(dest, minify){
  dest = typeof dest !== 'undefined' ? dest : config.paths.build;
  minify = typeof minify !== 'undefined' ? minify : false;

  return gather_pages(dest)
    .pipe(gulpif(minify, minify_html()))
    .pipe(gulp.dest(`${dest}/`))
    .pipe(connect.reload())
   ;
};

gulp.task('pages', function(){ return build_pages() });
gulp.task('pages:release', function(){
  return build_pages(config.paths.release);
});


/*
 * Demo Related Tasks
 *
 * Gather, lint, concatinate, and, optionally, minify scripts
 */

function gather_demo_scripts(demo){
  var paths = config.paths.demos[demo].scripts.map(function(file) {
    return `demo/${demo}/${file}`;
  });
  return gulp.src(paths);
};

function concat_demo_scripts(demo, _concat) {
  return gather_demo_scripts(demo)
    .pipe(gulpif(_concat, concat(`${demo}/${demo}.js`)))
    ;
}

function gather_demo_styles(demo) {
  var paths = config.paths.demos[demo].styles.map(function(file) {
    return `demo/${demo}/${file}`;
  });
  return gulp.src(paths)
    .pipe(gulpif(/[.]scss|sass$/,
      sass({
        sourcemap: false,
        unixNewlines: true,
        style: 'nested',
        debugInfo: false,
        quiet: false,
        lineNumbers: true,
        bundleExec: true,
        loadPath: config.paths.vendor.sass,
      })
      .on('error', gutil.log)
    ))
    ;
}

function concat_demo_styles(demo, _concat) {
  return gather_demo_styles(demo)
    .pipe(gulpif(_concat, concat(`${demo}/${demo}.css`)))
    ;
}

function build_demos(dest, minify, concat){
  dest = typeof dest !== 'undefined' ? dest : config.paths.build;
  minify = typeof minify !== 'undefined' ? minify : false;
  concat = typeof concat !== 'undefined' ? concat : false;

  var demos = config.paths.demos
      streams = [];

  for (var demo in demos) {
    if (demos.hasOwnProperty(demo)) {
      streams.push(series(
        concat_demo_scripts(demo, concat),
        concat_demo_styles(demo, concat)
      ));
    }
  }

  return series(streams)
    .pipe(gulp.dest(`${dest}/demo/`))
    ;
};

gulp.task('demos', function(){
  return build_demos(config.paths.build, false, true);
});
gulp.task('demos:release', function(){
  return build_demos(config.paths.release, false, true);
});


/*
 * Image Tasks
 *
 * Gather and compress images
 */

function build_images(dest){
  dest = typeof dest !== 'undefined' ? dest : config.paths.build;

  return gulp.src(config.paths.app.images)
    .pipe(gulp.dest(`${dest}/img/`))
    .pipe(connect.reload())
   ;
};

gulp.task('images', function(){ return build_images() });
gulp.task('images:release', function(){
  return build_images(config.paths.release);
});


/*
 * Static Content Tasks
 *
 * Gather and move static files
 */

function build_static(dest){
  dest = typeof dest !== 'undefined' ? dest : config.paths.build;

  return gulp.src(config.paths.app.static)
    .pipe(gulp.dest(`${dest}/static/`))
    .pipe(connect.reload())
   ;
};

gulp.task('static', function(){ return build_static() });
gulp.task('static:release', function(){
  return build_static(config.paths.release);
});


/*
 * Watch for changes and process the files in the relevant tasks
 */

gulp.task('watch', function(){
  var paths = config.paths
  gulp.watch(
    [
      paths.app.scripts,
      paths.app.templates,
      paths.vendor.scripts
    ],
    ['scripts']
  )
  gulp.watch(
    [
      paths.app.styles,
    ],
    ['styles']
  )
  gulp.watch(
    [
      paths.app.pages,
    ],
    ['pages']
  )
  gulp.watch(
    [
      'demos/**/*.{js, css}',
    ],
    ['demos']
  )
});


/*
 * Clean Build/Release directories
 */

function clean_grep(path) {
  return [
    path,
    path + "/**/*",
  ]
}
gulp.task('clean:build', function(cb){
  return del(clean_grep(config.paths.build), cb);
});

gulp.task('clean:release', function(cb){
  return del(clean_grep(config.paths.release), cb);
});


/*
 * Run a local server for testing builds
 */

gulp.task('server', function server() {
  connect.server({
    root: config.paths.build,
    port: config.connect_port || 8080,
    livereload: true,
  });
});


/*
 * Run a lightweight server for deployment
 */

gulp.task('server:deploy', function server(cb) {
  return connect.server({
    root: config.paths.release,
    port: 80
  });
});



gulp.task('build', function(cb){
  sequence(
    "clean:build",
    [
     "scripts",
     "styles",
    ],
    "pages",
    "demos",
    "images",
    "static",
    cb
  );
});

gulp.task('release', function(cb){
  sequence(
    "clean:release",
    [
     "scripts:release",
     "styles:release",
    ],
    "pages:release",
    "demos:release",
    "images:release",
    "static:release",
    cb
  );
});

gulp.task('deploy', function(cb){
  sequence(
    "release",
    "server:deploy",
    cb
  );
});

gulp.task('default', ["clean:build"], function(cb){
  sequence(
    "build",
    [
     "server",
     "watch",
    ],
    cb
  );
});


// gulp-devtools
// https://github.com/niki4810/gulp-devtools
module.exports = gulp;
