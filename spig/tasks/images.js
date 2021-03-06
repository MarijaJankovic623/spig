"use strict";

const os          = require("os");
const gulp        = require('gulp');
const parallel    = require("concurrent-transform");
const rename      = require("gulp-rename");
const imageResize = require('gulp-image-resize');
const SpigConfig = require('../spig-config');

// creates a set of resize tasks at defined image widths

let resizeImageTasks = [];
const site = SpigConfig.site();

site.resizeImageSizes.forEach(function(size) {
  let resizeImageTask = 'resize_' + size;
  gulp.task(resizeImageTask, function(done) {
    gulp.src(site.srcDir + site.dirImages + '/*')
    .pipe(parallel(
      imageResize({ width : size }),
      os.cpus().length
    ))
    .pipe(rename(function (path) { path.basename += "-" + size; }))
    .pipe(gulp.dest(site.outDir + site.dirImages));
    done();
  });
  resizeImageTasks.push(resizeImageTask);
});


// Copy core images to the dist folder and resize all preview images

gulp.task('images', gulp.parallel(resizeImageTasks, function copyOriginalImages(done) {
  gulp.src(site.srcDir + site.dirImages + '/*')
    .pipe(gulp.dest(site.outDir + site.dirImages));
    done();
}));
