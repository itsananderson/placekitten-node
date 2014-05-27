var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    q = require('q');

var urlBase = 'http://placekitten.com/';

module.exports = function placekitten(size, directory) {
    var deferred = q.defer();

    if (size === undefined || size === '') {
        deferred.reject('Error: size not specified');
        return;
    }

    if (directory === undefined || directory === '') {
        deferred.reject('Error: directory not specified');
        return;
    }

    // Trailing slash the directory
    if ('\\' !== directory[directory.length-1] && '/' !== directory[directory.length-1]) {
        directory += '/';
    }

    if (-1 === size.indexOf('/')) {
        size += '/' + size;
    }
    var fileName = size.replace('/', 'x') + '.jpg';
    var filePath = directory + fileName;

    fs.exists(directory, function(exists) {
        if (!exists) {
            deferred.reject('Error: directory ' + directory + ' does not exist');
            return false;
        }

        var file = fs.createWriteStream(filePath);

        var responseHandler = function(response) {
            if (response.headers.location) {
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

        http.get(urlBase + size, responseHandler);
    });

    return deferred.promise;
};