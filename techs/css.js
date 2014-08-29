var utils = require('./utils');

module.exports = require('enb/techs/css').buildFlow()
    .name('css-include')
    .builder(function (files) {
        var node = this.node;
        return files.map(function (file) {
            return utils.cssInclude(node.relativePath(file.fullname));
        }).join('\n');
    })
    .createTech();
