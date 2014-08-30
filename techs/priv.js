var utils = require('./utils');

module.exports = require('enb/lib/build-flow').create()
    .name('priv-js-include')
    .target('target', '?.priv.js')
    .useSourceListFilenames('langTargets', [])
    .useSourceFilename('bemhtml', '?.bemhtml.js')
    .useFileList(['priv.js', 'bemhtml'])
    .builder(function(langFilenames, bemhtmlFilename, sourceFiles) {

        var node = this.node,
            sources = utils.splitSources(sourceFiles);

        sources.bemhtml = sources.bemhtml.map(function(file) {
            // только комментарии со списком файлов, используемых в компиляции BEMHTML
            return utils.comment(node.relativePath(file.fullname));
        });

        sources.js = sources.js.map(function(file) {
            return utils.jsInclude(node.relativePath(file.fullname));
        });

        // в конце будет строка
        var output = [];

        // I18N core + all translates
        output.push(utils.wrap(langFilenames.map(function(file) {
            return utils.jsInclude(file);
        }).join('\n'), 'I18N'));

        // @TODO: разобраться нужно ли
        output.push('if (typeof exports !== "undefined" && typeof blocks !== "undefined") { exports.blocks = blocks; }');

        // BEMHTML includes + compiled
        output.push(
            utils.wrap([
                sources.bemhtml.join('\n'),
                utils.jsInclude(node.relativePath(bemhtmlFilename))
            ].join('\n'),
            'BEMHTML')
        );

        // server JS
        output.push(utils.wrap(sources.js.join('\n'), 'PRIV'));

        // в конце файла должен быть перевод строки!
        return output.join('\n') + '\n';

    })
    .createTech();
