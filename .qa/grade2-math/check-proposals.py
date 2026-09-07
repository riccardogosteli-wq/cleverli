import json,pathlib,re,ast,operator,math
p=pathlib.Path('.qa/grade2-math');raw=json.load(open(p/'proposed-patches.json'));rows=[r for r in map(json.loads,open(p/'baseline-de.jsonl')) if r['grade']==2 and r['subject']=='math'];failures=[];arithmetic=0;rounding=0;hintHits=[]
def calc(s):
 s=s.strip().replace('×','*').replace('·','*').replace('−','-').replace('÷','/').replace(',','.')
 if not re.fullmatch(r'[0-9+*/(). \-]+',s) or '..' in s:raise ValueError()
 def walk(n):
  if isinstance(n,ast.Constant) and isinstance(n.value,(int,float)):return n.value
  if isinstance(n,ast.BinOp) and type(n.op) in [ast.Add,ast.Sub,ast.Mult,ast.Div]:return {ast.Add:operator.add,ast.Sub:operator.sub,ast.Mult:operator.mul,ast.Div:operator.truediv}[type(n.op)](walk(n.left),walk(n.right))
  if isinstance(n,ast.UnaryOp) and isinstance(n.op,ast.USub):return -walk(n.operand)
  raise ValueError()
 return walk(ast.parse(s,mode='eval').body)
for r in rows:
 e={**r['content'],**raw['patches'].get(r['content']['id'],{})};q=e['question'];a=e['answer']
 if e['type']=='multiple-choice':
  if e['options'].count(a)!=1 or len(set(e['options']))!=len(e['options']):failures.append((e['id'],'invalid MC options'))
 if len(e['hints'])!=2:failures.append((e['id'],'hint count'))
 if 'ß' in json.dumps(e,ensure_ascii=False):failures.append((e['id'],'non-Swiss spelling'))
 if e['type']=='memory' and len({x['label'] for x in e['pairs']})!=len(e['pairs']):failures.append((e['id'],'ambiguous memory labels'))
 if re.search(r'Runde \d+ auf (volle )?Zehner',q):
  n=int(re.search(r'Runde (\d+)',q)[1]);expected=math.floor((n+5)/10)*10
  if a!=str(expected):failures.append((e['id'],'rounding',expected,a))
  rounding+=1
 if ':' not in q and '...' not in q and '…' not in q:
  qq=q.replace('___',a).replace('=?','='+a).replace('= ?', '='+a).rstrip('? .')
  m=re.fullmatch(r'([\d.,+×·−÷*/() \-]+)=([\d.,+×·−÷*/() \-]+)',qq.strip())
  if m:
   try:
    left,right=calc(m[1]),calc(m[2]);arithmetic+=1
    if abs(left-right)>1e-8:failures.append((e['id'],'arithmetic',left,right,q,a))
   except (ValueError,SyntaxError,ZeroDivisionError):pass
 for h in e['hints']:
  if re.search(r'(?<![\w\d])'+re.escape(a.lower())+r'(?![\w\d])',h.lower()):hintHits.append((e['id'],a,h))
print('Arithmetic',arithmetic,'rounding',rounding,'failures',failures,'literal-answer-hints',hintHits)
(p/'proposal-check.json').write_text(json.dumps({'arithmetic':arithmetic,'rounding':rounding,'failures':failures,'literalAnswerHints':hintHits},ensure_ascii=False,indent=2));assert not failures
