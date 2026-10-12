(function(root){
  'use strict';
  const key='mgt4001.mastered.v1';
  const normalize=s=>String(s??'').normalize('NFKC').toLocaleLowerCase().replace(/[\s·/–—]+/g,' ').trim();
  const Core={
    search(weeks,query){
      const q=normalize(query);if(!q)return [];
      const terms=q.split(' ');
      return weeks.flatMap(w=>w.nodes.map(n=>{
        const title=normalize(n.title+' '+n.en);
        const body=normalize([title,n.summary,n.explanation,...(n.bullets??[])].join(' '));
        const score=terms.every(t=>body.includes(t))?(title.includes(q)?100:terms.filter(t=>title.includes(t)).length*15+1):0;
        return {...n,weekId:w.id,weekTitle:w.title,score};
      })).filter(n=>n.score>0).sort((a,b)=>b.score-a.score);
    },
    readProgress(storage,validIds){try{const values=JSON.parse(storage?.getItem(key)??'[]');return Array.isArray(values)?[...new Set(values.filter(v=>validIds.includes(v)))]:[];}catch{return []; }},
    writeProgress(storage,ids){try{storage.setItem(key,JSON.stringify([...new Set(ids)]));return true;}catch{return false;}},
    quizStats(questions,answers){const answered=questions.filter(q=>Object.hasOwn(answers,q.id));const wrong=answered.filter(q=>answers[q.id]!==q.answer);return {total:questions.length,answered:answered.length,correct:answered.length-wrong.length,wrongIds:wrong.map(q=>q.id)};},
    normalize
  };
  if(typeof module==='object'&&module.exports)module.exports=Core;else root.KnowledgeCore=Core;
})(typeof window==='object'?window:globalThis);
