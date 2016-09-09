/*global module:false*/
var pkgJson = require('./package.json');
var version = pkgJson.version;
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    "bower-install-simple": {
        options: {
            cwd: "static",
            command: "install" 
        },
        "prod": {
            options: {
                production: true
            }
        }
    },      
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    useminPrepare: {
        html: ['index.html'],
        options: {
            src: 'static',
            dest: 'static'
        }
    },
    usemin: {
        html: ['index.html'],
        options: {
            assetDirs: ["static/js","static/css"],
            blockReplacements: {
                css: function(block){
                    return '<link rel="stylesheet" href="static/'+ block.dest + '"/>';
                },
                js: function(block){
                    return '<script type="text/javascript" src="static/'+ block.dest + '"></script>';
                }
            }
        }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-bower-install-simple');  
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  // Build task.
  grunt.registerTask('build', ['bower-install-simple', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'filerev', 'usemin']);

};

