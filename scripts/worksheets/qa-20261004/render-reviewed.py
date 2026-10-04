from pathlib import Path
import importlib.util,json,sys
D=Path(__file__).resolve().parent
output=Path(sys.argv[1]).resolve()
if output.exists():raise SystemExit('Refusing existing output directory')
output.mkdir(parents=True)
spec=importlib.util.spec_from_file_location('reviewed_renderer',D/'renderer.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
cat=json.loads((D.parents[2]/'src/lib/worksheets/catalogue.json').read_text());jobs=[]
for f in sorted((D/'content').glob('*.json')):
 t=json.loads(f.read_text());meta=next(x for x in cat if x['grade']==t['grade'] and x['subject']==t['subject'] and x['topicId']==t['sourceId']);meta={**meta,'worksheetId':meta['id']}
 html=output/(meta['id']+'.html');html.write_text('<!doctype html><html lang="de-CH"><meta charset="utf-8"><title>'+m.esc(meta['title'])+'</title><style>'+m.CSS+'</style><body>'+m.render(t,meta,False)+m.render(t,meta,True)+'</body></html>')
 jobs.append({'id':meta['id'],'html':str(html),'pupil':str(output/meta['files']['worksheet']['path']),'solution':str(output/meta['files']['solution']['path'])})
for f in sorted((D/'legacy-html').rglob('*.html')):
 relative=f.relative_to(D/'legacy-html');grade=int(relative.parts[0]);subject=relative.parts[1];topic=f.stem
 meta=next(x for x in cat if x['grade']==grade and x['subject']==subject and x['topicId']==topic)
 html=output/(meta['id']+'.html');html.write_text(f.read_text())
 jobs.append({'id':meta['id'],'html':str(html),'pupil':str(output/meta['files']['worksheet']['path']),'solution':str(output/meta['files']['solution']['path'])})
(output/'jobs.json').write_text(json.dumps(jobs,indent=2));print(len(jobs),'reviewed HTML pairs')
