'use strict';
(() => {
 const root=document.querySelector('#grad-student-task');
 if(!root)return;
 const el=id=>root.querySelector('#'+id);
 const fields=[...root.querySelectorAll('[data-micro-step]')];
 const names=['notice','verify','action','reflect'];
 const answers=['entrance','scope','boundary','unknown'];
 const hints=[
 'Stay with what is visible: the notice names an entrance and a time window. A motive or whole-venue closure is not established.',
 'Compare the full wording with the crop. The notice keeps the session open but does not guarantee safety.',
 'Choose an action that preserves consent and your own options, without confronting or exposing someone.',
 'A full notice can clarify access without explaining another person’s motive or every present condition.'
 ];
 const titles=['Notice','Verify the source','Choose an action','Reflect'];
 let step=0,sourceRead=false,completions=0;
 el('micro-interaction').hidden=false;
 el('micro-source-open').addEventListener('click',()=>{
  const open=el('micro-source').hidden;
  el('micro-source').hidden=!open;
  el('micro-source-open').setAttribute('aria-expanded',String(open));
  el('micro-source-open').textContent=open?'Hide the full source':'Read the full source';
  if(open)sourceRead=true;
 });
 function reset(){
  step=0;sourceRead=false;el('micro-form').reset();
  fields.forEach((f,i)=>f.hidden=i!==0);
  el('micro-form').hidden=false;el('micro-result').hidden=true;
  el('micro-source').hidden=true;el('micro-source-open').setAttribute('aria-expanded','false');
  el('micro-source-open').textContent='Read the full source';
  el('micro-progress').textContent='Step 1 of 4 · Notice';
  el('micro-feedback').textContent='';
  el('micro-reflection').value='';el('micro-useful').value='';el('micro-barrier').value='';
  el('micro-summary-text').hidden=true;el('micro-summary-text').textContent='';
  fields[0].querySelector('input').focus();
 }
 el('micro-form').addEventListener('submit',event=>{
  event.preventDefault();
  const choice=root.querySelector('input[name="'+names[step]+'"]:checked');
  if(!choice){el('micro-feedback').textContent='Choose an answer to continue. You can retry without penalty.';return}
  if(step===1&&!sourceRead){el('micro-feedback').textContent='Read Source B before deciding what it supports.';el('micro-source-open').focus();return}
  if(choice.value!==answers[step]){el('micro-feedback').textContent=hints[step]+' Try again; there is no penalty.';return}
  el('micro-feedback').textContent='';fields[step].hidden=true;step++;
  if(step===4){
   completions++;el('micro-form').hidden=true;el('micro-result').hidden=false;
   el('micro-progress').textContent='4 of 4 steps complete';
   el('micro-count').textContent=completions+' completed attempt'+(completions===1?'':'s')+' in this page session. Attempts are not distinct people, retention or project-wide results.';
   el('micro-result-title').focus();return;
  }
  fields[step].hidden=false;el('micro-progress').textContent='Step '+(step+1)+' of 4 · '+titles[step];
  fields[step].querySelector('input').focus();
 });
 el('micro-reset').addEventListener('click',reset);
 el('micro-repeat').addEventListener('click',reset);
 el('micro-summary').addEventListener('click',()=>{
  const text=el('micro-summary-text');text.hidden=false;
  text.textContent='Grad Student micro-task feedback\nTask: entrance-notice-v1\nCompleted: yes (self-reported from this page)\nUsefulness: '+(el('micro-useful').value||'Not provided')+'\nBarrier: '+(el('micro-barrier').value||'Not provided')+'\nPrivate reflection excluded. No response has been submitted.';
  text.focus();
 });
})();
