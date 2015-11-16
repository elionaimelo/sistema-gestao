module.exports = function( grunt ) {

// Load all tasks
require('load-grunt-tasks')(grunt);

// Paths
var PathConfig = {
  dev: 'dev/',
  dist: 'dist/'
};

// Set scripts
var scripts = [
// Set the scripts here
];

// Grunt config
grunt.initConfig({

  // Config path
  config: PathConfig,

  // Clean files
  clean: {
    dist: {
      src: ['dist/']
    }
  },

  // Copy files
  copy: {
    dist: {
      files: [
        {
          expand: true,
          dot: true,
          cwd: 'dev/',
          src: [
            '**',
            '*.{md,txt,htaccess}',
            '!assets/css/**',
            '!assets/less/**',
            '!assets/img/.{png,jpg,gif,jpeg}',
            '!assets/js/scripts/**',
          ],
          dest: 'dist/'
        }
      ]
    }
  },

  // Less
  less: {
    dist: {
      options: {
        compress: true
      },
      files: {
        '<%= config.dist %>assets/css/style.css': '<%= config.dev %>assets/less/style.less'
      }
    },
    dev: {
      files: {
        '<%= config.dev %>assets/css/style.css': '<%= config.dev %>assets/less/style.less'
      }
    }
  },

  // Uglify
  uglify: {
    options: {
       mangle : false
     },
    dist: {
      files : {
        '<%= config.dist %>assets/js/scripts.min.js': scripts
      }
    },
    dev: {
      options: {
        beautify : true
      },
      files : {
        '<%= config.dev %>assets/js/scripts.min.js': scripts
      }
    }
  },

  //JShint
  jshint: {
    files: [
      '<%= config.dev %>assets/js/**/*.js'
    ]
  },

  // ImageMin
  imagemin: {
   dist: {
     options: {
       optimizationLevel: 3
     },
     files: [{
       expand: true,
       cwd: '<%= config.dev %>assets/',
       src: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
       dest: '<%= config.dist %>assets/',
     }],
   }
  },

  // HTMLmin
  htmlmin: {
    dist: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      files: [{
        expand: true,
        cwd: '<%= config.dist %>',
        src: ['*.html','**/*.html'],
        dest: '<%= config.dist %>',
      }],
    }
  },

  // Watch
  watch : {
    options: {
      debounceDelay: 500,
    },
    less: {
      files : [
      '<%= config.dev %>**/*.less'
      ],
      tasks : ['less:dev']
    },
    js: {
      files : [
      '<%= config.dev %>**/site/*.js',
      'Gruntfile.js'
      ],
      tasks : ['uglify:dev']
    }
  },

  php: {
        dist: {
            options: {
                hostname: '127.0.0.1',
                port: 9000,
                base: '<%= config.dev %>', // Project root
                keepalive: false,
                open: false
            }
        }
  },

  // Sync
  browserSync: {
        dist: {
            bsFiles: {
                src: [
                  '<%= config.dev %>**/*.css',
                  '<%= config.dev %>**/*.jpg',
                  '<%= config.dev %>**/*.png',
                  '<%= config.dev %>**/*.js',
                  '<%= config.dev %>*.html',
                  '<%= config.dev %>*.php'
                ]
            },
            options: {
                proxy: '<%= php.dist.options.hostname %>:<%= php.dist.options.port %>',
                watchTask: true,
                notify: true,
                open: true,
                logLevel: 'silent',
                ghostMode: {
                    clicks: true,
                    scroll: true,
                    links: true,
                    forms: true
                }
            }
        }
    },

});

// JsLint
grunt.registerTask( 'test', ['jshint'] );

// Build
grunt.registerTask( 'build', [ 'clean', 'copy:dist', 'less:dist', 'uglify:dist', 'imagemin:dist', 'htmlmin:dist' ] );

// Watch
grunt.registerTask( 'w', ['php', 'browserSync', 'watch' ] );

};
