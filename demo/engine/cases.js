import casesData from '../data/cases.json' with { type: 'json' };
import { appendEvent } from './events.js';

export const EVIDENCE_STATUSES = Object.freeze(['observed_fact','witness_claim','inference','contradiction','unresolved']);
const clone = value => structuredClone(value);
export function createCasebook() {
  const item=clone(casesData.cases[0]);
  item.decisions=[];
  return {status:'Proposal',source:casesData.source,case:item,empathyUsed:false,ledger:null,events:[]};
}
export function confirmation(casebook) {
  const evidence=casebook.case.evidence;
  const facts=evidence.filter(e=>e.status==='observed_fact'&&e.provenance!=='tainted'&&(!e.residue||e.corroborated===true));
  const sources=new Set(facts.map(e=>e.source_id));
  const openContradictions=evidence.filter(e=>e.status==='contradiction'&&e.open!==false);
  const result=openContradictions.length?'contradicted':facts.length>=3&&sources.size>=2?'confirmed':'insufficient';
  return {result,factCount:facts.length,independentSources:sources.size,openContradictions:openContradictions.length};
}
export function addEvidence(casebook,evidence) {
  if(!EVIDENCE_STATUSES.includes(evidence.status))throw new Error('Unknown evidence status');
  casebook.case.evidence.push({...clone(evidence),status_label:evidence.status_label||'Proposal'});
}
export function useEmpathyLens(casebook) {
  if(casebook.empathyUsed)return {ok:false,reason:'empathy_lens_already_used'};
  casebook.empathyUsed=true;
  const hint={id:'E-EMP-'+(casebook.events.length+1),label:'[PLACEHOLDER — not canon] Empathy Lens hint',status:'inference',source_id:'VIOLET',source_label:'[PLACEHOLDER — not canon] Violet\'s reading',tag:'empathic',provenance:'clean',residue:false,open:false,status_label:'Proposal'};
  casebook.case.evidence.push(hint);
  casebook.events.push({seq:casebook.events.length+1,type:'empathy_lens_used',evidenceId:hint.id,status:'Proposal'});
  return {ok:true,evidence:clone(hint)};
}
export function closeContradiction(casebook,evidenceId) {
  const evidence=casebook.case.evidence.find(e=>e.id===evidenceId&&e.status==='contradiction');
  if(!evidence)return {ok:false,reason:'contradiction_not_found'};
  evidence.open=false;
  casebook.events.push({seq:casebook.events.length+1,type:'contradiction_closed',evidenceId,status:'Proposal'});
  return {ok:true};
}
export function attemptVerdict(casebook,decisionText='[PLACEHOLDER — not canon] Attempted case action') {
  const gate=confirmation(casebook);
  if(gate.result!=='confirmed') {
    casebook.events.push({seq:casebook.events.length+1,type:'action_rejected',reason:'case_'+gate.result,gate:clone(gate),status:'Proposal'});
    return {ok:false,reason:'case_'+gate.result,gate};
  }
  const decision={text:decisionText,gate:'confirmed',empathicInferenceUsed:casebook.case.evidence.some(e=>e.status==='inference'&&e.tag==='empathic'),status:'Proposal'};
  casebook.case.decisions.push(decision);
  casebook.events.push({seq:casebook.events.length+1,type:'case_action_accepted',decision:clone(decision)});
  return {ok:true,decision:clone(decision)};
}
export function buildVerdictLedger(casebook) {
  const evidence=casebook.case.evidence;
  const ledger={
    status:'Proposal',
    known:evidence.filter(e=>e.status==='observed_fact'),
    witnessClaims:evidence.filter(e=>e.status==='witness_claim'),
    inferred:evidence.filter(e=>e.status==='inference'),
    contradictions:evidence.filter(e=>e.status==='contradiction'),
    unresolved:evidence.filter(e=>e.status==='unresolved'||(e.residue&&e.corroborated!==true)),
    decisions:casebook.case.decisions.map(d=>({...d,empathicInferenceFlag:d.empathicInferenceUsed})),
    confirmation:confirmation(casebook)
  };
  casebook.ledger=clone(ledger);
  return ledger;
}
export function publicCasebook(casebook) { return clone(casebook); }
