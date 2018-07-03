
module.exports = function(grunt) {

    // define constants
    let sUser = grunt.option('user');
    let sPwd = grunt.option('pwd');

    let sonarHostUrl = grunt.option('sonar.host.url') || 'http://localhost:9000';
    let sonarLogin = grunt.option('sonar.login');
    let sonarPassword = grunt.option('sonar.password');
    let sonarProjectKey = grunt.option('sonar.projectKey');
    let sonarBranch = grunt.option('sonar.branch');
    let sonarAnalysisMode = grunt.option('sonar.analysis.mode');
    let sonarExclusions = grunt.option('sonar.javascript.exclusions');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dir: {
            webapp: 'webapp',
            dist: 'dist',
            bower_components: 'bower_components'
        },

        connect: {
            options: {
                port: 8080,
                hostname: '*'
            },
            src: {},
            dist: {}
        },

        openui5_connect: {
            options: {
                resources: [
                    '<%= dir.bower_components %>/openui5-sap.ui.core/resources',
                    '<%= dir.bower_components %>/openui5-sap.m/resources',
                    '<%= dir.bower_components %>/openui5-sap.ui.layout/resources',
                    '<%= dir.bower_components %>/openui5-themelib_sap_belize/resources'
                ]
            },
            src: {
                options: {
                    appresources: '<%= dir.webapp %>'
                }
            },
            dist: {
                options: {
                    appresources: '<%= dir.dist %>'
                }
            }
        },

        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: '<%= dir.webapp %>',
                        prefix: 'todo'
                    },
                    dest: '<%= dir.dist %>'
                },
                components: true
            }
        },

        clean: {
            dist: '<%= dir.dist %>/'
        },

        copy: {
            dist: {
                files: [ {
                    expand: true,
                    cwd: '<%= dir.webapp %>',
                    src: [
                        '**'
                    ],
                    dest: '<%= dir.dist %>'
                } ]
            }
        },

        eslint: {
            options: {
                configFile: '.eslintrc.json',
            },
            target: ['webapp/controller/*.js']
        },

        nwabap_ui5uploader: {
            options: {
                conn: {
                    server: 'http://sabvbsl2.sab-sap.os.itelligence.de:8000',
                },
                auth: {
                    user: sUser,
                    pwd: sPwd,
                }
            },
            upload_build: {
                options: {
                    ui5: {
                        package: 'ZDB_ANTRD_PRF',
                        bspcontainer: 'ZDB_APRF_APP',
                        bspcontainer_text: 'SAPUI5 Application: ZDBUI5_DEMO_APP',
                        transportno: 'BSGK900064'
                    },
                    resources: {
                        // the source which will be transported
                        cwd: 'dist',
                        src: '**/*.*'
                    }
                }
            }
        },

        sonarRunner: {
            analysis: {
                options: {
                    debug: true,
                    // separator: '\n',
                    sonar: {
                        host: {
                            url: sonarHostUrl
                        },
                        login: sonarLogin,
                        password: sonarPassword,
                        sources: ['webapp'].join(','),
                        projectKey: sonarProjectKey,
                        branch: sonarBranch,
                        projectName: '<%= pkg.name %>',
                        projectVersion: '<%= pkg.version %>',
                        language: 'js',
                        sourceEncoding: 'UTF-8',
                        javascript: {
                            exclusions: sonarExclusions
                        },
                        analysis: {
                            mode: sonarAnalysisMode
                        },
                        issuesReport: {
                            json: {
                                enable: true
                            }
                        },
                        report: {
                            export: {
                                path: 'sonar-report.json'
                            }
                        }
                    }
                }
            }
        }
    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-openui5');
    grunt.loadNpmTasks('grunt-nwabap-ui5uploader');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('@sabdd/grunt-sonar-runner');


    // Server task
    grunt.registerTask('serve', function(target) {
        grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
    });

    // Linting task
    grunt.registerTask('standard', ['standard']);

    //deploy task
    grunt.registerTask('deploy', ['nwabap_ui5uploader']);

    // Build task
    grunt.registerTask('build', ['copy']);

    //Eslint task
    grunt.registerTask('lint', ['eslint']);

    //Eslint task
    grunt.registerTask('sonar', ['sonarRunner']);

    // Default task
    grunt.registerTask('default', [
        'eslint',
        'clean',
        'build',
        'serve:dist'
    ]);
};
