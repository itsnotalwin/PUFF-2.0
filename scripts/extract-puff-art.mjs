import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function readModule(file) {
  const source = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    fileName: file
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(js, { module: mod, exports: mod.exports, Math }, { filename: file });
  return mod.exports;
}

const art = readModule('src/lib/bud.ts').generateBud(7);
const glyphs = readModule('src/components/puffPaths.ts').PUFF_LOGO.glyphs;
fs.writeFileSync('/tmp/puff-vector-source.json', JSON.stringify({ art, glyphs }));
console.log('Original site artwork extracted: ' + glyphs.length + ' script glyphs');
