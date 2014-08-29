module.exports = {
    jsInclude: function(filename) {
        return '/*borschik:include:' + filename + '*/';
    },
    cssInclude: function(filename) {
        return '@import url(' + filename + ')';
    },
    comment: function(filename) {
        return '// ' + filename;
    },
    wrap: function(str, name) {
        return [
            '// ' + name,
            str,
            '// !' + name
        ].join('\n');
    },
    splitSources: function(sources) {

        var bemhtml = [],
            js = [];

        sources.forEach(function(file) {
            if (file.suffix === 'bemhtml') {
                bemhtml.push(file);
            } else {
                js.push(file);
            }
        });

        return {
            bemhtml: bemhtml,
            js: js
        }

    }
};
