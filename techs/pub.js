var utils = require('./utils');

module.exports = require('enb/lib/build-flow').create()
    .name('pub-js-i18n-include')
    .target('target', '?.{lang}.js')
    .defineRequiredOption('lang')
    .useSourceFilename('allLangTarget', '?.lang.all.js')
    .useSourceFilename('langTarget', '?.lang.{lang}.js')
    .useSourceFilename('bemhtml', '?.client.bemhtml.js')
    .useFileList('js')
    .builder(function(langPre, lang, bemhtmlFileName, sourceFiles) {

        var node = this.node;

        // получаем список клиентских BEMHTML файлов, которые подготовлены специальным таргетом
        // список всех BEMHTML файлов в сборке — node.requireSource(['common.files'])...`
        return node.requireSources([this.node.unmaskTargetName('?.bemhtml.files')]).spread(function(files) {
            return files.bySuffix.bemhtml;
        }).then(function(bemhtmlSourceFiles) {

            // в конце будет строка
            var output = [];

            // BEMHTML includes + compiled
            output.push(utils.wrap([
                // только комментарии со списком файлов, используемых в компиляции BEMHTML
                bemhtmlSourceFiles.map(function(file) {
                    return utils.comment(node.relativePath(file.fullname));
                }).join('\n'),
                // подключаем один скомпилированный файл
                utils.jsInclude(node.relativePath(bemhtmlFileName))
            ].join('\n'), 'BEMHTML'));

            // client/server JS
            output.push(utils.wrap(sourceFiles.map(function(file) {
                return utils.jsInclude(node.relativePath(file.fullname));
            }).join('\n'), 'JS'));

            // I18N core + one lang translate
            output.push(utils.wrap([
                utils.jsInclude(node.relativePath(langPre)),
                utils.jsInclude(node.relativePath(lang))
            ].join('\n'), 'I18N'));

            return output.join('\n');

        });

    })
    .createTech();
