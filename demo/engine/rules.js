import { appendEvent, reject } from './events.js';
import { createRng } from './rng.js';
import roomsData from '../data/rooms.json' with { type: 'json' };
import cardsData from '../data/cards.placeholder.json' with { type: 'json' };
import { resolveRulePreset } from './presets.js';

const rooms = Object.fromEntries(roomsData.rooms.map(r => [r.id, r]));
const roomIds = roomsData.rooms.map(r => r.id);
const catalog = { assailant: cardsData.assailant, violet: cardsData.violet };
const copy = value => structuredClone(value);
const other = side => side === 'assailant' ? 'violet' : 'assailant';
const terminal = state => Boolean(state.terminal);
const key = (a,b) => [a,b].sort().join('|');
const adjacent = (a,b) => Boolean(rooms[a]?.doors.includes(b));
const locked = (s,a,b) => (s.lockedDoors[key(a,b)] || 0) >= s.round;

function shuffle(items, rng) {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) { const j=rng.int(i+1); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
function draw(s, side) {
  if (!s.decks[side].length && s.discards[side].length) {
    s.decks[side]=shuffle(s.discards[side],s._rng); s.discards[side]=[];
    appendEvent(s,'deck_reshuffled',{side,count:s.decks[side].length});
  }
  const card=s.decks[side].shift(); if(card) s.hands[side].push(card);
}
function drawTurn(s, side) {
  draw(s,side);
  while(s.hands[side].length>3) {
    const card=s.hands[side].shift(); s.discards[side].push(card);
    appendEvent(s,'card_discarded',{side,cardId:card,reason:'hand_limit'});
  }
}
function advance(s) {
  const ended=s.activeSide, next=other(ended);
  while(s.hands[ended].length>3) s.discards[ended].push(s.hands[ended].shift());
  if(ended==='violet') s.round++;
  s.activeSide=next; s.actionsLeft=2;
  if(next==='assailant') {
    if(s.quietStepsUntilAssailantTurn && s.round>=s.quietStepsUntilAssailantTurn) s.quietStepsUntilAssailantTurn=0;
    if(s.scanHidden && s.round>=s.hideUntilRound) s.scanHidden=false;
  }
  if(next==='violet') for(const [door,expiry] of Object.entries(s.lockedDoors)) if(expiry<=s.round) delete s.lockedDoors[door];
  drawTurn(s,next);
  appendEvent(s,'turn_started',{side:next,round:s.round,actions:2});
}
function spend(s,n=1){s.actionsLeft-=n;}
function rejectAction(s,action,reason){return reject(s,action,reason);}
function move(s,side,to,{free=false}={}) {
  const from=s.positions[side];
  if(!roomIds.includes(to)) return {ok:false,reason:'unknown_room'};
  if(!adjacent(from,to)) return {ok:false,reason:'room_not_connected'};
  if(locked(s,from,to)) return {ok:false,reason:'door_locked'};
  const slowed=side==='assailant'&&s.graveDirt>0;
  const cost=slowed?2:(free?0:1);
  if((!free||slowed)&&s.actionsLeft<cost) return {ok:false,reason:'not_enough_actions'};
  if(slowed) s.graveDirt=0;
  s.positions[side]=to;
  if(side==='assailant') {
    s.roomHistory.push(to); if(s.roomHistory.length>8)s.roomHistory.shift();
    for(const sigil of [...s.sigils]) if(sigil.room===to) {
      if(s.smokeCharges>0) {s.smokeCharges--;appendEvent(s,'sigil_cancelled',{room:to,reason:'smoke'});}
      else {s.revealedRoom=to;s.revealedRooms.push(to);s.sigils=s.sigils.filter(x=>x.id!==sigil.id);appendEvent(s,'sigil_triggered',{room:to,sigilId:sigil.id,revealed:true});}
    }
  }
  if(!free||slowed) spend(s,cost);
  appendEvent(s,'moved',{side,from,to,cost});
  return {ok:true};
}
function search(s,side) {
  if(side!=='assailant')return {ok:false,reason:'only_assailant_searches'};
  const room=s.positions.assailant;
  const file=Object.entries(s.files).find(([id,r])=>r===room&&!s.foundFiles.includes(id));
  const modifier=s.lockPick;s.lockPick=0;
  const roll=s._rng.d6(),total=roll+modifier,target=s.ruleSettings.searchTarget,success=total>=target;
  spend(s);
  appendEvent(s,'search_roll',{side,room,roll,modifier,total,target,success,fileId:file?.[0]||null});
  if(success&&file){s.foundFiles.push(file[0]);appendEvent(s,'file_found',{fileId:file[0],room});}
  else if(success)appendEvent(s,'search_empty',{room});
  return {ok:true,outcome:{roll,modifier,total,target,success}};
}
function burn(s,side) {
  if(side!=='assailant')return {ok:false,reason:'only_assailant_burns_files'};
  if(s.positions.assailant!=='incinerator')return {ok:false,reason:'not_at_incinerator'};
  if(s.foundFiles.length!==3)return {ok:false,reason:'all_files_required'};
  spend(s);s.burned=true;s.exitUnlocked=true;appendEvent(s,'files_burned',{count:3,exitUnlocked:true});return {ok:true};
}
function escape(s,side) {
  if(side!=='assailant')return {ok:false,reason:'only_assailant_escapes'};
  if(s.positions.assailant!=='exit-vestibule')return {ok:false,reason:'not_at_exit'};
  if(!s.exitUnlocked)return {ok:false,reason:'exit_locked'};
  spend(s);s.terminal={result:'escaped'};appendEvent(s,'terminal',s.terminal);return {ok:true};
}
function sigil(s,side) {
  if(side!=='violet')return {ok:false,reason:'only_violet_sets_sigils'};
  if(s.sigils.length>=3)return {ok:false,reason:'sigil_limit_reached'};
  const room=s.positions.violet;if(s.sigils.some(x=>x.room===room))return {ok:false,reason:'sigil_already_in_room'};
  spend(s);s.sigils.push({id:s.nextSigilId++,room});appendEvent(s,'sigil_set',{room,count:s.sigils.length});return {ok:true};
}
function scan(s,side) {
  if(side!=='violet')return {ok:false,reason:'only_violet_scans'};
  spend(s);
  const hidden=s.scanHidden&&s.round<=s.hideUntilRound;
  const target=s.positions.assailant,here=s.positions.violet;
  const visible=!hidden&&(target===here||adjacent(here,target));
  const result=hidden?'obscured':visible?'nearby':'not_nearby';
  appendEvent(s,'scan',{room:here,result,revealedRoom:null});
  return {ok:true,outcome:{result,revealedRoom:null}};
}
function catchAssailant(s,side) {
  if(side!=='violet')return {ok:false,reason:'only_violet_catches'};
  if(s.positions.violet!==s.positions.assailant)return {ok:false,reason:'not_same_room'};
  if(s.round<=s.invulnerableThroughVioletTurn)return {ok:false,reason:'assailant_temporarily_uncatchable'};
  const target=s.quietStepsUntilAssailantTurn?6:s.ruleSettings.catchTarget,modifier=s.steadyHand;s.steadyHand=0;
  const roll=s._rng.d6(),total=roll+modifier,success=total>=target;
  spend(s);appendEvent(s,'catch_roll',{roll,modifier,total,target,success});
  if(success){
    s.strikes++;
    if(s.strikes>=s.ruleSettings.strikesToCapture){s.positions.assailant='autopsy-room';s.terminal={result:'captured',location:'autopsy-room'};appendEvent(s,'terminal',s.terminal);}
    else {
      s.invulnerableThroughVioletTurn=s.round;
      const exits=rooms[s.positions.assailant].doors.filter(r=>!locked(s,s.positions.assailant,r));
      if(exits.length){const to=exits[s._rng.int(exits.length)],from=s.positions.assailant;s.positions.assailant=to;s.roomHistory.push(to);appendEvent(s,'forced_move',{from,to,reason:'strike',cost:0});}
      appendEvent(s,'strike',{strikes:s.strikes,forcedMove:true});
    }
  }
  return {ok:true,outcome:{roll,modifier,total,target,success,strikes:s.strikes}};
}
function play(s,side,id,target) {
  if(!id||!s.hands[side].includes(id))return {ok:false,reason:'card_not_in_hand'};
  const card=catalog[side].find(c=>c.id===id);if(!card)return {ok:false,reason:'unknown_card'};
  const e=card.effect;let freeMove=false,freeAction=false;
  if(e==='shortcut'||e==='patrol'){const r=move(s,side,target,{free:true});if(!r.ok)return r;freeMove=true;}
  else if(e==='lock_pick'&&side==='assailant'){if(s.actionsLeft<2)return{ok:false,reason:'lock_pick_needs_action_for_search'};s.lockPick=1;}
  else if(e==='quiet_steps'&&side==='assailant'){s.quietStepsUntilAssailantTurn=s.round+1;}
  else if(e==='smoke'&&side==='assailant'){s.smokeCharges++;}
  else if(e==='hide'&&side==='assailant'){s.scanHidden=true;s.hideUntilRound=s.round+1;}
  else if(e==='second_wind'&&side==='assailant'){s.strikes=Math.max(0,s.strikes-1);}
  else if(e==='canvas'&&side==='violet'){
    if(s.sigils.length>=3||s.sigils.some(x=>x.room===s.positions.violet))return {ok:false,reason:'sigil_limit_or_duplicate'};
    s.sigils.push({id:s.nextSigilId++,room:s.positions.violet});freeAction=true;
  } else if(e==='grave_dirt'&&side==='violet'){s.graveDirt++;}
  else if(e==='luminol'&&side==='violet'){const hist=s.roomHistory.slice(-2);s.revealedRooms.push(...hist);s.revealedRoom=hist.at(-1)||null;}
  else if(e==='spotlight'&&side==='violet'){s.revealedRoom=s.positions.assailant;s.revealedRooms.push(s.revealedRoom);}
  else if(e==='steady_hand'&&side==='violet'){s.steadyHand++;}
  else if(e==='lockdown'&&side==='violet'){
    if(!target||!target.includes('|'))return {ok:false,reason:'lockdown_requires_door_key'};
    const [a,b]=target.split('|');if(!adjacent(a,b))return {ok:false,reason:'door_does_not_exist'};
    s.lockedDoors[key(a,b)]=s.round+1;
  } else return {ok:false,reason:'card_effect_not_available_to_side'};
  s.hands[side]=s.hands[side].filter(x=>x!==id);s.discards[side].push(id);
  if(!freeMove&&!freeAction)spend(s);
  appendEvent(s,'card_played',{side,cardId:id,name:card.name,effect:e,target:target||null,freeMove,freeAction});
  return {ok:true};
}
export function createGame({seed=1,rng=null,preset='tuned'}={}) {
  const random=rng||createRng(seed),decks={},ruleSettings=resolveRulePreset(preset);
  for(const side of ['assailant','violet'])decks[side]=shuffle(catalog[side].map(c=>c.id),random);
  const s={status:'Proposal',source:'ChatGPT Prototype Handoff dated 2026-10-11; review rules only',
    preset:ruleSettings.id,ruleSettings,
    round:1,activeSide:'assailant',actionsLeft:2,terminal:null,
    positions:{assailant:roomsData.starts.assailant,violet:roomsData.starts.violet},
    roomHistory:[roomsData.starts.assailant],
    files:{'case-file-1':'forensics-office','case-file-2':'records-lockers','case-file-3':'evidence-storage'},
    foundFiles:[],burned:false,exitUnlocked:false,strikes:0,invulnerableThroughVioletTurn:0,
    decks,discards:{assailant:[],violet:[]},hands:{assailant:[],violet:[]},
    sigils:[],nextSigilId:1,revealedRoom:null,revealedRooms:[],scanHidden:false,hideUntilRound:0,smokeCharges:0,
    quietStepsUntilAssailantTurn:0,steadyHand:0,lockPick:0,graveDirt:0,lockedDoors:{},events:[],_rng:random};
  for(const side of ['assailant','violet'])for(let i=0;i<3;i++)draw(s,side);
  appendEvent(s,'game_started',{seed,status:'Proposal'});return s;
}
export function act(s,side,action) {
  const input=copy(action);
  if(terminal(s))return rejectAction(s,input.type,'game_is_terminal');
  if(side!==s.activeSide)return rejectAction(s,input.type,'not_your_turn');
  if(input.type!=='end_turn'&&s.actionsLeft<1)return rejectAction(s,input.type,'no_actions_left');
  let result;
  switch(input.type){
    case 'move':result=move(s,side,input.to);break;
    case 'search':result=search(s,side);break;
    case 'burn':result=burn(s,side);break;
    case 'exit':result=escape(s,side);break;
    case 'sigil':result=sigil(s,side);break;
    case 'scan':result=scan(s,side);break;
    case 'catch':result=catchAssailant(s,side);break;
    case 'play':result=play(s,side,input.cardId,input.target);break;
    case 'concede':s.terminal={result:'conceded',concededBy:side};appendEvent(s,'terminal',s.terminal);return {ok:true,state:s};
    case 'end_turn':appendEvent(s,'turn_ended',{side});advance(s);return {ok:true,state:s};
    default:return rejectAction(s,input.type||'unknown','unknown_action');
  }
  if(!result?.ok)return rejectAction(s,input.type,result?.reason||'illegal_action');
  if(!terminal(s)&&s.actionsLeft<=0)advance(s);
  return {ok:true,state:s,outcome:result.outcome};
}
export function publicState(s,viewer) {
  const {_rng,...data}=s,out=copy(data);
  if(viewer==='violet'){
    out.events=out.events.filter(e=>!(e.type==='moved'&&e.side==='assailant')&&!(e.type==='search_roll'&&e.side==='assailant')&&e.type!=='search_empty'&&e.type!=='file_found');
    out.positions.assailant=s.revealedRoom;out.assailantPositionKnown=s.revealedRoom!==null;
    out.hands.assailant=[];out.decks.assailant=[];out.discards.assailant=[];
    out.roomHistory=s.revealedRooms.slice(-2);
  } else out.assailantPositionKnown=true;
  return out;
}
export function legalDestinations(s,side){return rooms[s.positions[side]].doors.filter(r=>!locked(s,s.positions[side],r));}
export function roomList(){return copy(roomsData.rooms);}
export function cardList(side){return copy(catalog[side]);}
export function cloneGameState(s){const {_rng,...data}=s;return copy(data);}
