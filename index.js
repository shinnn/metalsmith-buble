'use strict';

const path = require('path');
const util = require('util');

const buble = require('buble');
const sourceMapToComment = require('source-map-to-comment');
const toFastProperties = require('to-fast-properties');

module.exports = function metalsmithBuble(options) {
	options = Object.assign({sourceMap: false}, options);

	if (typeof options.sourceMap !== 'boolean' && options.sourceMap !== 'inline') {
		throw new TypeError(`\`sourceMap\` option must be true, false or 'inline', but got ${
			util.inspect(options.sourceMap)
		}.`);
	}

	return function metalsmithBublePlugin(files, metalsmith) {
		Object.keys(files).forEach(originalFilename => {
			const ext = path.extname(originalFilename).toLowerCase();
			if (ext !== '.js' && ext !== '.jsx') {
				return;
			}

			const filename = originalFilename.replace(/\.jsx$/i, '.js');

			if (originalFilename !== filename) {
				files[filename] = files[originalFilename];
				delete files[originalFilename];
				toFastProperties(files);
			}

			const result = buble.transform(files[filename].contents.toString(), Object.assign({}, options, {
				source: path.join(metalsmith.directory(), metalsmith.source(), originalFilename),
				file: path.join(metalsmith.directory(), metalsmith.destination(), filename)
			}));

			if (options.sourceMap === true) {
				const sourcemapPath = `${filename}.map`;
				files[sourcemapPath] = {
					contents: new Buffer(JSON.stringify(result.map))
				};

				result.code += `\n//# sourceMappingURL=${
					path.relative(path.dirname(filename), sourcemapPath).replace(/\\/g, '/')
				}\n`;
			} else if (options.sourceMap === 'inline') {
				result.code += `\n${sourceMapToComment(result.map)}`;
			}

			files[filename].contents = new Buffer(result.code);
		});
	};
};
