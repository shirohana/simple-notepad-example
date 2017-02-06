const fs = require('fs');
const gulp = require('gulp');

const config = Object.assign({}, require('./config.defaults.js'), require('./config.js'));

const client = (() => {

  const paths = {
    index: __dirname + '/src/client/index.html',
    dest: __dirname + '/dist/client'
  };

  function initCompiler() {
    const gutil = require('gulp-util');
    const webpack = require('webpack');
    const configs = Object.assign({}, require('./webpack.config.js'), config.webpack);
    const compiler = webpack(configs);

    function task(err, stats, callback) {
      if (err) throw new gutil.PluginError('webpack:build', err);
      gutil.log('[webpack:build]', stats.toString({ chunks: false, colors: true }));
      callback();
    }

    function run(callback) {
      compiler.run((err, stats) => task(err, stats, callback));
    }

    function watch(opts, callback) {
      compiler.plugin('compile', function() {
        gutil.log('[webpack:watch]', 'File has been changed. Start compiling...');
      });
      compiler.watch(opts, (err, stats) => task(err, stats, callback));
    }

    return { run, watch, instance: compiler };
  }

  function build(finish) {
    copyHtml();
    initCompiler().run(finish);
  }

  var bs;

  function watch(neverFinish) {
    bs = require('browser-sync').create();
    const compiler = initCompiler();

    bs.init({ port: config.dev.BROWSER_SYNC_PORT });

    gulp.watch(paths.index, () => copyHtml().pipe(bs.stream()) );

    compiler.watch({
      aggergateTimeout: 300,
      poll: true
    }, bs.reload);
  }

  function clear() {
    return require('del')(paths.dest);
  }

  function rebuild(finish) {
    clear().then(build(finish));
  }

  function copyHtml() {
    return gulp.src(paths.index)
        .pipe(gulp.dest(paths.dest));
  }

  return { build, clear, rebuild, watch, getBrowserSync: () => bs };

})();

const server = (function() {

  const paths = {
    index: __dirname + '/dist/server/app.js',
    src: __dirname + '/src/server',
    dest: __dirname + '/dist/server',
    watches: __dirname + '/src/server/**/*.ts'
  };

  function initCompiler(onetime) {
    if (onetime === undefined) onetime = false;

    const gutil = require('gulp-util');
    const cache = require('gulp-cached');
    const typescript = require('gulp-typescript').createProject(__dirname + '/tsconfig.json');

    var bindings = [];

    function build() {
      var stream = gulp.src(paths.watches)
          .pipe(!onetime ? cache('server-ts') : gutil.noop())
          .pipe(typescript())
          .pipe(gulp.dest(paths.dest));

      for (var binding of bindings)
        stream.on(binding.event, binding.callback);

      return stream;
    }

    function on(event, callback) {
      bindings.push({ event, callback });
    }

    return { build, on };
  }

  function initNodemon() {
    const server = require('gulp-nodemon')({
      script: paths.index,
      ext: 'js',
      env: { 'NODE_ENV': 'development' },
      watch: false,
      stdout: false
    });

    server.on('readable', function() {
      this.stdout.pipe(fs.createWriteStream(config.dev.APP_LOG_PATH, {flags: 'a'}));
      this.stderr.pipe(process.stderr);
    });

    function on(event, callback) {
      server.on(event, callback);
    }

    function restart() {
      server.emit('restart');
    }

    return { restart, on, instance: server };
  }

  function build() {
    return initCompiler(true).build();
  }

  function watch(neverFinish) {
    const del = require('del');
    const path = require('path');
    const gutil = require('gulp-util');

    const compiler = initCompiler();
    const nodemon = initNodemon();

    compiler.on('end', nodemon.restart);
    nodemon.on('start', function() {
      var bs = client.getBrowserSync();
      if (bs !== undefined)
        setTimeout(() => bs.reload(), 500);
    });

    const watcher = require('gulp-watch')(paths.watches, compiler.build);

    watcher.on('unlink', function(filepath) {
      var destFilename = gutil.replaceExtension(path.relative(paths.src, filepath), '.js');
      return del(path.join(paths.dest, destFilename));
    });

    watcher.on('change', function(filepath) {
      var relativePath = path.relative(paths.src, filepath);
      gutil.log('[server:watch]', `File ${relativePath} has been changed. Start building...`);
    })
  }

  function watchOffline(neverFinish) {

  }

  function clear() {
    return require('del')(paths.dest);
  }

  function rebuild(finish) {
    clear().then(build().on('end', finish));
  }

  return { build, watch, clear, rebuild };

})();

gulp.task('build:server', server.build);
gulp.task('build:client', client.build);
gulp.task('build', ['build:server', 'build:client']);

gulp.task('clear:server', server.clear);
gulp.task('clear:client', client.clear);
gulp.task('clear', ['clear:server', 'clear:client']);

gulp.task('rebuild:client', client.rebuild);
gulp.task('rebuild:server', server.rebuild);
gulp.task('rebuild', ['rebuild:server', 'rebuild:client']);

gulp.task('watch:client', client.watch);
gulp.task('watch:server', server.watch);
// gulp.task('watch:server:offline', server.watchOffline);
gulp.task('watch', ['watch:server', 'watch:client']);

gulp.task('start:mongod', function(callback) {
  const spawn = require('child_process').spawn;
  var mongod = spawn('mongod', [`--dbpath=${__dirname}/data`, '--nojournal', '--rest']);
  mongod.stdout.pipe(process.stdout);
});

gulp.task('stop:mongod', function(callback) {
  require('child_process').exec('killall mongod');
  callback();
});

gulp.task('start:server', function(callback) {
  const spawn = require('child_process').spawn;
  var server = spawn('node',  ['./dist/server/app.js']);
  server.stdout.pipe(process.stdout);
});
