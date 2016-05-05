module.exports = {
  paths: {
    build: 'build',
    release: 'release',
    app: {
      scripts: ['app/scripts/app.js', 'app/scripts/**/*.js'],
      styles:   'app/styles/**/*.{sass,css}',
      pages:    ['app/jade/*.{html,jade,md,markdown}', '!app/jade/*.tpl.*'],
      templates:'app/jade/*.tpl.{html,jade,md,markdown}',
      images:   'app/images/**/*.{png,jpg,jpeg,gif}',
      static:   'app/static/**/*.*',
    },
    vendor: {
      scripts: [
        'vendor/angular/angular.js',
        'vendor/angular-route/angular-route.js',
        'vendor/angular-load/angular-load.js',
      ],
      styles: [
        'vendor/normalize-css/normalize.css',
      ],
      fonts: [

      ],
    },
    demos: {
      'list-maker-betterer': {
        scripts: [
          'ich.min.js',
          'jquery-1.9.1.min.js',
          'objects.js',
          'list-maker-betterer.js',
        ],
        styles: [
          'github-buttons.css',
          'list-maker-betterer.css',
        ]
      },
      'context-free': {
        scripts: [
          'context-free.js',
          'logic.js',
          'scripts.js',
        ],
        styles: [
          'context-free.css',
        ]
      }
    }
  },
  jshint: {
    lookup: false, // Look for a .jshint file
    curly: true,
    immed: true,
    newcap: true,
    noarg: true,
    sub: true,
    boss: true,
    eqnull: true,
    laxcomma: true,
    "-W070": false, // Trailing Semicolon
    "-W116": false, // Bracketless If-statements
  }
};
