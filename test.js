'use strict';

const Metalsmith = require('metalsmith');
const buble = require('.');
const test = require('tape');

test('metalsmith-buble', t => {
  t.plan(11);

  new Metalsmith('.')
  .use(buble())
  .run({
    'source.js': {contents: Buffer.from('() => 1')},
    'non-js.txt': {contents: Buffer.from('Hi')}
  }, (err, files) => {
    t.strictEqual(err, null, 'should be used as a metalsmith plugin.');
    t.strictEqual(
      String(files['source.js'].contents),
      '(function() { return 1; })',
      'should transform JavaScript files.'
    );
    t.strictEqual(
      String(files['non-js.txt'].contents),
      'Hi',
      'should not transform non-JavaScript files.'
    );
  });

  new Metalsmith('.')
  .use(buble({sourceMap: true}))
  .run({
    'dir/source.jsx': {contents: Buffer.from('<div />')}
  }, (err, files) => {
    t.strictEqual(err, null, 'should support JSX.');
    t.strictEqual(
      String(files['dir/source.js'].contents),
      'React.createElement( \'div\', null )\n//# sourceMappingURL=source.js.map\n',
      'should append a URL to the bottom of code when `sourceMap` option is true.'
    );
    t.strictEqual(
      String(files['dir/source.js.map'].contents),
      JSON.stringify({
        version: 3,
        file: 'source.js',
        sources: ['../../src/dir/source.jsx'],
        sourcesContent: ['<div />'],
        names: [],
        mappings: 'AAAA,qBAAC,CAAA,GAAG,OAAA'
      }),
      'should create a source map file.'
    );
    t.notOk(Object.keys(files).includes('dir/source.jsx'), 'should rename .jsx file to .js.');
  });

  new Metalsmith('.')
  .use(buble({
    target: {firefox: 43},
    transforms: {arrow: true},
    sourceMap: 'inline'
  }))
  .run({'☺️.js': {contents: Buffer.from('let x = y => `z`')}}, (err, files) => {
    t.strictEqual(err, null, 'should support non-ASCII filename.');
    t.strictEqual(
      String(files['☺️.js'].contents),
      `var x = function (y) { return \`z\`; }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoi4pi677iPLmpzIiwic291cmNlcyI6WyIuLi9zcmMv4pi677iPLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCB4ID0geSA9PiBgemAiXSwibmFtZXMiOlsibGV0Il0sIm1hcHBpbmdzIjoiQUFBQUEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFBLENBQUMsQ0FBQSxDQUFDLEFBQUcsU0FBQSxDQUFDLENBQUMsQ0FBQyJ9`,
      'should support `target` and `transforms` options.'
    );
  });

  new Metalsmith('.')
  .use(buble({sourceMap: false}))
  .run({'FOO.JS': {contents: Buffer.from('1=a')}}, err => {
    t.ok(err instanceof SyntaxError, 'should fail when Buble cannot transpile the code.');
  });

  t.throws(
    () => buble({sourceMap: [1, 2, 3]}),
    /^TypeError.* `sourceMap` option must be true, false or 'inline', but got \[ 1, 2, 3 ]\./,
    'should throw a type error when it takes an invalid `sourceMap` option value.'
  );
});
