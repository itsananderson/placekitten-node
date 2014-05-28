var fs = require('fs'),
    http = require('http'),
    extend = require('extend'),
    q = require('q');

var DefaultOptions = {
    urlBase: 'http://placekitten.com/',
    directory: '.'
};

module.exports = function(size, options) {
    options = extend(DefaultOptions, options || {});

    var deferred = q.defer();

    if (size === undefined || size === '') {
        deferred.reject('Error: size not specified');
        return deferred.promise;
    }

    if ('\\' !== options.directory[options.directory.length-1]
        && '/' !== options.directory[options.directory.length-1]) {
        options.directory += '/';
    }

    if (-1 === size.indexOf('/') && -1 == size.indexOf('x')) {
        size += '/' + size;
    }
    var fileName = size.replace('/', 'x') + '.jpg';
    var filePath = options.directory + fileName;

    fs.exists(options.directory, function(exists) {
        if (!exists) {
            deferred.reject('Error: directory ' + options.directory + ' does not exist');
            return deferred.promise;
        }

        var file = fs.createWriteStream(filePath);

        var responseHandler = function(response) {
            if (response.headers.location) {
                // Attach an empty listener so stream will finish
                response.on('data', function() {});

                http.get(response.headers.location, responseHandler);
            } else {
                response.pipe(file);
                file.on('finish', function () {
                    file.close(function () {
                        deferred.resolve(filePath);
                    });
                });
            }
        };

        http.get(options.urlBase + size, responseHandler);
    });

    return deferred.promise;
};
