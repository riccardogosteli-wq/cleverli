const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const forbidden = new RegExp('[' + String.fromCodePoint(223, 7838) + ']', 'u');
function decode(s) { return s.replace(/&szlig;|&#0*223;|&#x0*df;/gi, String.fromCodePoint(223)).replace(/&#0*7838;|&#x0*1e9e;/gi, String.fromCodePoint(7838)); }
function inspect(name, text) { const out = []; const add = (value, pos) => { if (forbidden.test(decode(value)))
    out.push({ file: name, line: text.slice(0, pos).split(String.fromCharCode(10)).length, text: value.slice(0, 160) }); }; if (/[.](?:tsx?|jsx?|mjs|cjs|json)$/.test(name)) {
    const kind = name.endsWith('.json') ? ts.ScriptKind.JSON : name.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const source = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, kind);
    const visit = n => { if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n) || ts.isJsxText(n))
        add(n.text, n.pos); ts.forEachChild(n, visit); };
    visit(source);
}
else
    add(text, 0); return out; }
function scan(root) { let files = 0; const findings = []; function walk(dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory())
        walk(p);
    else if (/[.](?:tsx?|jsx?|mjs|cjs|json|svg|html|xml|txt|md|csv|yaml|yml)$/.test(p)) {
        files++;
        findings.push(...inspect(p, fs.readFileSync(p, 'utf8')));
    }
} } for (const dir of ['src', 'public'])
    if (fs.existsSync(path.join(root, dir)))
        walk(path.join(root, dir)); return { files, findings }; }
module.exports = { inspect, scan };
if (require.main === module) {
    const result = scan(process.cwd());
    console.log(JSON.stringify(result, null, 2));
    if (result.findings.length)
        process.exitCode = 1;
}
