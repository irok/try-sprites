var gulp        = require('gulp');
var gulp$       = require('gulp-load-plugins')();
var merge       = require('merge-stream');
var path        = require('path');
var postcss     = require('postcss');
var sprites     = require('postcss-sprites').default;
var updateRule  = require('postcss-sprites').updateRule;

var spriteDirs = [
    'sample',
    'browser'
];

gulp.task('default', ['build:scss-with-postcss', 'build:scss-with-spritesmith']);

/**
 * postcss-sprites を使った例
 */
gulp.task('build:scss-with-postcss', function() {
    return gulp.src('scss/postcss-sprites.scss')
        .pipe(gulp$.sass({
            outputStyle: 'expanded'
        }))
        .pipe(gulp$.postcss([
            sprites({
                stylesheetPath: 'css/',
                spritePath: 'images/',
                filterBy: function(image) {
                    var dirNames = spriteDirs.join('|');
                    if (image.url.match('images/(?:'+dirNames+')'))
                        return Promise.resolve();
                    return Promise.reject();
                },
                groupBy: function(image) {
                    return Promise.resolve(image.url.match(/images\/([^\/]+)\//)[1]);
                },
                hooks: {
                    onUpdateRule: function(rule, token, image) {
                        updateRule(rule, token, image);

                        ['width', 'height'].forEach(function(prop) {
                            rule.insertAfter(rule.last, postcss.decl({
                                prop: prop,
                                value: image.coords[prop] + 'px'
                            }));
                        });
                    },
                    onSaveSpritesheet: function(opts, groups) {
                        return path.join(opts.spritePath, 'postsprite-' + groups.join('.') + '.png');
                    }
                }
            })
        ]))
        .pipe(gulp.dest('css/'));
})

/**
 * gulp.spritesmith を使った例
 */
gulp.task('build:scss-with-spritesmith', ['create:sprite'], function() {
    return gulp.src('scss/gulp.spritesmith.scss')
        .pipe(gulp$.sass({
            outputStyle: 'expanded'
        }))
        .pipe(gulp.dest('css/'));
})

gulp.task('create:sprite', function() {
    return merge(spriteDirs.map(function(name) {
        var spriteData = gulp.src('images/'+name+'/*.png')
            .pipe(gulp$.spritesmith({
                imgName: 'spritesmith-'+name+'.png',
                cssName: '_spritesmith-'+name+'.scss',
                imgPath: '../images/spritesmith-'+name+'.png',
                cssVarMap: function(sprite) {
                    sprite.name = name+'-'+sprite.name;
                }
            }));

        return merge(
            spriteData.img.pipe(gulp.dest('images/')),
            spriteData.css.pipe(gulp.dest('scss/'))
        );
    }));
});
