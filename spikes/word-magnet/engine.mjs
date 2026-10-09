export const GRADE_LABELS=['','Buchstaben','Silben','Lautgruppen und Umlaute','Zusammengesetzte Wörter','Wörter verwandeln','Knifflige Schreibweisen'];
export const BANK={
1:[['MAUS',['M','A','U','S'],'🐭'],['HUND',['H','U','N','D'],'🐶'],['HAUS',['H','A','U','S'],'🏠'],['BALL',['B','A','L','L'],'⚽'],['BAUM',['B','A','U','M'],'🌳'],['FISCH',['F','I','S','C','H'],'🐟']],
2:[['Blume',['Blu','me'],'🌷'],['Hase',['Ha','se'],'🐰'],['Sonne',['Son','ne'],'☀️'],['Lampe',['Lam','pe'],'💡'],['Wolke',['Wol','ke'],'☁️'],['Rose',['Ro','se'],'🌹']],
3:[['Bäume',['B','äu','m','e'],'🌳'],['Füsse',['F','ü','ss','e'],'👣'],['Schule',['Sch','u','l','e'],'🏫'],['spielen',['sp','ie','l','en'],'🎲'],['Freunde',['Fr','eu','n','de'],'🧑‍🤝‍🧑'],['Käfer',['K','ä','f','er'],'🐞']],
4:[['Regenschirm',['Regen','schirm'],'☂️'],['Sonnenblume',['Sonnen','blume'],'🌻'],['Fussball',['Fuss','ball'],'⚽'],['Haustür',['Haus','tür'],'🚪'],['Schneemann',['Schnee','mann'],'⛄'],['Zahnbürste',['Zahn','bürste'],'🪥']],
5:[['lesbar',['les','bar'],'📖'],['unlesbar',['un','les','bar'],'📖'],['freundlich',['freund','lich'],'😊'],['unfreundlich',['un','freund','lich'],'😠'],['glücklich',['glück','lich'],'🍀'],['unglücklich',['un','glück','lich'],'🌧️']],
6:[['Rhythmus',['Rh','y','th','mus'],'🥁'],['Schifffahrt',['Schiff','fahrt'],'🚢'],['Interesse',['Inter','esse'],'🔎'],['verlässlich',['ver','läss','lich'],'🤝'],['Adresse',['A','d','r','e','ss','e'],'📮'],['nämlich',['n','ä','m','lich'],'💬']]
};
export function rng(seed=1){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
export function mission(grade,round){if(!Number.isInteger(grade)||grade<1||grade>6)throw Error('Invalid grade');const row=BANK[grade][round%BANK[grade].length];return{grade,word:row[0],parts:[...row[1]],picture:row[2]};}
export function tilesFor(m,r=Math.random){const candidates=[...new Set(BANK[m.grade].flatMap(row=>row[1]))].filter(x=>!m.parts.includes(x));const bad=candidates.slice(0,2);const data=[...m.parts,...bad].map((text,id)=>({id,text,collected:false}));for(let i=data.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[data[i],data[j]]=[data[j],data[i]];}return data.map((t,i)=>({...t,x:[.22,.51,.8][i%3],y:[.3,.52,.74][Math.floor(i/3)],phase:r()*6.28}));}
export function collect(m,index,tile){if(tile.collected)return{index,outcome:'already'};if(tile.text!==m.parts[index])return{index,outcome:'wrong'};return{index:index+1,outcome:index+1===m.parts.length?'word':'part'};}
export function wordComplete(m,index){return index===m.parts.length;}
