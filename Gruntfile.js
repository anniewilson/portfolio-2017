module.exports = function (grunt) {

  // Load grunt-* tasks automatically from package.json deps
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Build Styles
    sass: {
      options: {
        includePaths: [
          'node_modules/normalize.css'
        ]
      },
      dist: {
        files: { 'dist/css/style.css': 'assets/css/style.scss' }
      }
    },

    // CSS post
    postcss: {
      options: {
        map: {
          inline: false,
        },
        processors: [
          require('postcss-import')(),
          require('autoprefixer')({
            firefox: 45,
            ie: 10,
            browsers: ['last 2 versions', 'safari >= 7']
          }), // add vendor prefixes
          require('postcss-pxtorem')({
            replace: false,
            mediaQuery: false,
            minPixelValue: 0,
            selectorBlackList: [':before',':after',':selection',':backdrop',':marker'],
          }),
          require('cssnano')(), // minify the result
        ]
      },
      dist: {
        src: 'dist/css/style.css',
        dest: 'dist/css/style.min.css'
      }
    },

    // Minify js
    uglify: {
      my_target: {
        files: {
          'contents/js/all.min.js': ['assets/js/**/*.js']
        }
      }
    },

    // Watch task
    watch: {
      css: {
        files: ['assets/css/**/*.scss'],
        tasks: ['build:styles', 'copy:css']
      },
      svg: {
        files: ['assets/svg/**/*'],
        tasks: ['build:svg']
      },
      javascript: {
        files: ['assets/js/**/*'],
        tasks: ['uglify']
      },
    },

    // Copy task
    copy: {
      css: {
        expand: true,
        cwd: 'dist/css',
        // only copy minified files
        src: ['**/*.min.css','**/*.min.css.map'],
        dest: 'contents/css',
      }
    },

    // Clean build directory for fresh build files
    clean: {
      build: ['build/']
    },

    // Cache bust css and js
    cacheBust: {
      taskName: {
        options: {
          baseDir: 'build/',
          deleteOriginals: true,
          assets: ['js/**.js','css/**.css']
        },
        src: ['build/**/*.html']
      }
    },
    
    // Minify svg files
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/svg/',
          src: ['*.svg'],
          dest: 'assets/svg/'
        }]
      },
      options: {
        plugins: [
          { removeAttrs: {attrs: '(stroke|fill)'} },
          { removeViewBox: false },   // don't remove the viewbox atribute from the SVG
          { removeEmptyAttrs: false } // don't remove Empty Attributes from the SVG
        ]
      }
    },

    // Create svg stylesheet
    svgstore: {
      options: {
        prefix: 'icon--',
      },
      default: {
        files: {
          'contents/images/svg-defs.svg': ['assets/svg/*.svg']
        }
      }
    }

  });

  grunt.registerTask('build:styles', ['sass', 'postcss']);
  grunt.registerTask('build:svg', ['svgmin', 'svgstore']);
  grunt.registerTask('default', ['uglify', 'build:svg', 'build:styles', 'copy', 'watch']);
  grunt.registerTask('dist:clean', ['clean']);
  grunt.registerTask('dist:bust', ['cacheBust']);
};
