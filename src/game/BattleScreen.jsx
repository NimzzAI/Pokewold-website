import { useState, useEffect } from 'react';
import { sound } from './soundEffects.js';
import { getTypeEffectiveness } from '../utils/typeChart.js';
import TypeBadge from '../components/TypeBadge.jsx';

export default function BattleScreen({
  playerPokemon,
  enemyPokemon,
  isTrainerBattle = false,
  trainerName = '',
  playerParty = [],
  bag = [],
  onUpdateParty,
  onUpdateBag,
  onVictory,
  onDefeat,
  onRun,
  onCatch
}) {
  // Current active player pokemon
  const [activePokemon, setActivePokemon] = useState(playerPokemon);
  const [enemy, setEnemy] = useState(enemyPokemon);

  // Battle Menu Modes: 'MAIN' | 'MOVES' | 'BAG' | 'PARTY'
  const [menuMode, setMenuMode] = useState('MAIN');

  // Turn tracking: 'PLAYER_INPUT' | 'ANIMATING' | 'ENEMY_TURN' | 'ENDED'
  const [turnState, setTurnState] = useState('PLAYER_INPUT');

  // Narrative Message in the bottom dialog box
  const [dialogue, setDialogue] = useState(
    isTrainerBattle
      ? `${trainerName} menantangmu bertarung! ${enemyPokemon.displayName} dikirim ke arena!`
      : `Pokémon liar ${enemyPokemon.displayName} muncul!`
  );

  // Animations
  const [playerAnim, setPlayerAnim] = useState('');
  const [enemyAnim, setEnemyAnim] = useState('');
  const [pokeballThrowing, setPokeballThrowing] = useState(false);
  const [pokeballShakes, setPokeballShakes] = useState(0);

  // Play battle intro sound
  useEffect(() => {
    sound.playBattleIntro();
  }, []);

  // Update active pokemon if playerPokemon changes
  useEffect(() => {
    setActivePokemon(playerPokemon);
  }, [playerPokemon]);

  // Handle Player choosing a move
  const handleSelectMove = (move) => {
    if (turnState !== 'PLAYER_INPUT' || activePokemon.currentHp <= 0) return;

    setMenuMode('MAIN');
    setTurnState('ANIMATING');

    // 1. Play attack sound & animation
    sound.playAttack(move.type);
    setPlayerAnim('animate-attack-right');
    setDialogue(`${activePokemon.displayName} menggunakan ${move.name}!`);

    setTimeout(() => {
      setPlayerAnim('');

      // 2. Calculate Damage
      const damageCalc = calculateDamage(activePokemon, enemy, move);

      // Hit effect
      if (damageCalc.damage > 0) {
        sound.playHit(damageCalc.multiplier >= 2);
        setEnemyAnim('animate-shake animate-damage-flash');
        setTimeout(() => setEnemyAnim(''), 400);
      }

      const nextEnemyHp = Math.max(0, enemy.currentHp - damageCalc.damage);
      setEnemy(prev => ({ ...prev, currentHp: nextEnemyHp }));

      // Effectiveness text
      let effectText = '';
      if (damageCalc.multiplier >= 2) effectText = ' Serangan sangat efektif!';
      else if (damageCalc.multiplier <= 0.5 && damageCalc.multiplier > 0) effectText = ' Serangan kurang efektif...';
      else if (damageCalc.multiplier === 0) effectText = ' Tidak ada pengaruh sama sekali!';
      if (damageCalc.isCrit) effectText += ' Serangan Kritis!';

      setDialogue(`${activePokemon.displayName} melancarkan ${move.name}!${effectText}`);

      // 3. Check if enemy fainted
      setTimeout(() => {
        if (nextEnemyHp <= 0) {
          handleEnemyFaint();
        } else {
          // Proceed to Enemy Turn
          setTurnState('ENEMY_TURN');
          setTimeout(() => {
            executeEnemyTurn(nextEnemyHp);
          }, 1200);
        }
      }, 1000);
    }, 400);
  };

  // AI Enemy Turn Execution
  const executeEnemyTurn = (currentEnemyHp) => {
    if (currentEnemyHp <= 0) return;

    // Pick an enemy move
    const moves = enemy.moves && enemy.moves.length > 0
      ? enemy.moves
      : [{ name: 'Tackle', type: 'normal', power: 40 }];
    const move = moves[Math.floor(Math.random() * moves.length)];

    sound.playAttack(move.type);
    setEnemyAnim('animate-attack-left');
    setDialogue(`${enemy.displayName} musuh menggunakan ${move.name}!`);

    setTimeout(() => {
      setEnemyAnim('');
      const damageCalc = calculateDamage(enemy, activePokemon, move);

      if (damageCalc.damage > 0) {
        sound.playHit(damageCalc.multiplier >= 2);
        setPlayerAnim('animate-shake animate-damage-flash');
        setTimeout(() => setPlayerAnim(''), 400);
      }

      const nextPlayerHp = Math.max(0, activePokemon.currentHp - damageCalc.damage);
      const updatedActive = { ...activePokemon, currentHp: nextPlayerHp };
      setActivePokemon(updatedActive);

      // Update in party
      if (onUpdateParty) {
        onUpdateParty(updatedActive);
      }

      let effectText = '';
      if (damageCalc.multiplier >= 2) effectText = ' Serangan sangat efektif!';
      else if (damageCalc.multiplier <= 0.5 && damageCalc.multiplier > 0) effectText = ' Serangan kurang efektif...';
      if (damageCalc.isCrit) effectText += ' Kritis!';

      setDialogue(`${enemy.displayName} musuh menggunakan ${move.name}!${effectText}`);

      setTimeout(() => {
        if (nextPlayerHp <= 0) {
          handlePlayerFaint();
        } else {
          setTurnState('PLAYER_INPUT');
          setDialogue(`Apa yang akan dilakukan ${activePokemon.displayName}?`);
        }
      }, 1000);
    }, 400);
  };

  // Enemy Fainted
  const handleEnemyFaint = () => {
    sound.playFaint();
    setDialogue(`${enemy.displayName} musuh tumbang!`);

    setTimeout(() => {
      sound.playVictory();

      // Calculate EXP gained
      const expGained = Math.floor(enemy.level * 18 + 12);
      const prizeMoney = isTrainerBattle ? (enemy.level * 50 + 80) : 0;

      let nextExp = activePokemon.exp + expGained;
      let nextLevel = activePokemon.level;
      let leveledUp = false;

      if (nextExp >= activePokemon.maxExp) {
        nextLevel += 1;
        nextExp = nextExp - activePokemon.maxExp;
        leveledUp = true;
      }

      const updatedPokemon = {
        ...activePokemon,
        level: nextLevel,
        exp: nextExp,
        maxExp: nextLevel * 20
      };

      setActivePokemon(updatedPokemon);
      if (onUpdateParty) {
        onUpdateParty(updatedPokemon);
      }

      const victoryMsg = leveledUp
        ? `${activePokemon.displayName} memperoleh ${expGained} EXP dan naik ke Level ${nextLevel}! 🎉`
        : `${activePokemon.displayName} memperoleh ${expGained} EXP!`;

      setDialogue(victoryMsg);

      setTimeout(() => {
        if (onVictory) {
          onVictory({ expGained, prizeMoney, leveledUp, newLevel: nextLevel });
        }
      }, 1800);
    }, 1000);
  };

  // Player Pokémon Fainted
  const handlePlayerFaint = () => {
    sound.playFaint();
    setDialogue(`${activePokemon.displayName} pingsan!`);

    setTimeout(() => {
      // Check if player has other healthy Pokémon in party
      const healthyOther = playerParty.find(p => p.id !== activePokemon.id && p.currentHp > 0);
      if (healthyOther) {
        setDialogue(`Ganti Pokémon berikutnya untuk melanjutkan pertarungan!`);
        setMenuMode('PARTY');
      } else {
        setDialogue(`Seluruh Pokémon-mu telah pingsan! Kamu bergegas kembali ke Pokémon Center...`);
        setTimeout(() => {
          if (onDefeat) onDefeat();
        }, 2000);
      }
    }, 1200);
  };

  // Run attempt
  const handleRun = () => {
    if (isTrainerBattle) {
      sound.playBump();
      setDialogue('Kamu tidak bisa lari dari pertarungan Pelatih!');
      setTimeout(() => {
        setDialogue(`Apa yang akan dilakukan ${activePokemon.displayName}?`);
      }, 1000);
      return;
    }

    sound.playSelect();
    setDialogue('Berhasil melarikan diri dengan selamat!');
    setTimeout(() => {
      if (onRun) onRun();
    }, 800);
  };

  // Throw Poké Ball
  const handleUseItem = (item) => {
    if (item.id === 'pokeball') {
      if (isTrainerBattle) {
        sound.playBump();
        setDialogue('Jangan mencuri Pokémon milik pelatih lain!');
        setTimeout(() => setMenuMode('MAIN'), 1000);
        return;
      }

      // Consume 1 ball
      if (onUpdateBag) {
        onUpdateBag('pokeball', -1);
      }

      setMenuMode('MAIN');
      setTurnState('ANIMATING');
      setPokeballThrowing(true);
      sound.playSelect();
      setDialogue(`Red melempar Poké Ball!`);

      // Catch rate calculation: lower HP = higher catch chance
      const hpPct = enemy.currentHp / enemy.maxHp;
      const catchThreshold = 0.85 - (hpPct * 0.5); // 35% at full HP, 85% at low HP

      setTimeout(() => {
        setPokeballShakes(1);
        sound.playBump();
        setTimeout(() => {
          setPokeballShakes(2);
          sound.playBump();
          setTimeout(() => {
            const isCaught = Math.random() < catchThreshold;
            if (isCaught) {
              setPokeballShakes(3);
              sound.playCatch();
              setDialogue(`Gotcha! ${enemy.displayName} berhasil ditangkap! 🔴⚪`);
              setTimeout(() => {
                if (onCatch) {
                  onCatch(enemy);
                }
              }, 1800);
            } else {
              setPokeballThrowing(false);
              setPokeballShakes(0);
              sound.playBump();
              setDialogue(`Aduh! ${enemy.displayName} berhasil melepaskan diri dari Poké Ball!`);
              setTimeout(() => {
                setTurnState('ENEMY_TURN');
                executeEnemyTurn(enemy.currentHp);
              }, 1200);
            }
          }, 600);
        }, 600);
      }, 700);

    } else if (item.id === 'potion' || item.id === 'super_potion') {
      // Heal active pokemon
      const healAmt = item.healAmount || 20;
      const newHp = Math.min(activePokemon.maxHp, activePokemon.currentHp + healAmt);
      const updated = { ...activePokemon, currentHp: newHp };
      setActivePokemon(updated);
      if (onUpdateParty) onUpdateParty(updated);
      if (onUpdateBag) onUpdateBag(item.id, -1);

      sound.playSelect();
      setMenuMode('MAIN');
      setDialogue(`${item.name} digunakan! ${activePokemon.displayName} memulihkan ${healAmt} HP.`);

      setTimeout(() => {
        setTurnState('ENEMY_TURN');
        executeEnemyTurn(enemy.currentHp);
      }, 1200);
    }
  };

  // Switch Active Pokémon
  const handleSwitchPokemon = (target) => {
    if (target.currentHp <= 0) {
      sound.playBump();
      setDialogue(`${target.displayName} tidak memiliki sisa HP untuk bertarung!`);
      return;
    }
    sound.playSelect();
    setActivePokemon(target);
    setMenuMode('MAIN');
    setDialogue(`Kembali ${activePokemon.displayName}! Maju, ${target.displayName}!`);

    setTimeout(() => {
      setTurnState('ENEMY_TURN');
      executeEnemyTurn(enemy.currentHp);
    }, 1000);
  };

  // Helper damage formula
  function calculateDamage(attacker, defender, move) {
    if (!move.power) return { damage: 0, multiplier: 1, isCrit: false };

    const isSpecial = move.category === 'special';
    const atk = isSpecial ? attacker.stats.specialAttack : attacker.stats.attack;
    const def = isSpecial ? defender.stats.specialDefense : defender.stats.defense;

    const { multiplier } = getTypeEffectiveness(move.type, defender.types);
    const isSTAB = attacker.types.includes(move.type.toLowerCase()) ? 1.5 : 1;
    const isCrit = Math.random() < 0.08;
    const critMult = isCrit ? 1.5 : 1;
    const variance = 0.85 + Math.random() * 0.15;

    const baseDmg = (((2 * attacker.level / 5 + 2) * move.power * (atk / def)) / 50 + 2);
    const finalDmg = Math.max(1, Math.floor(baseDmg * multiplier * isSTAB * critMult * variance));

    return { damage: finalDmg, multiplier, isCrit };
  }

  // HP Percentages & Colors
  const enemyHpPct = Math.round((enemy.currentHp / enemy.maxHp) * 100);
  const playerHpPct = Math.round((activePokemon.currentHp / activePokemon.maxHp) * 100);

  const getHpBarColor = (pct) => {
    if (pct > 50) return 'bg-emerald-500';
    if (pct > 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none animate-battle-intro">
      {/* Handheld Battle Screen Chassis (Classic 4:3 Frame) */}
      <div className="w-full bg-slate-900 border-4 border-slate-950 rounded-2xl p-4 shadow-2xl space-y-4">

        {/* 1. TOP HALF: ENEMY ZONE (Top Left) */}
        <div className="flex items-start justify-between min-h-[140px] px-2 pt-2">
          {/* Enemy Status Box */}
          <div className="w-56 bg-slate-950/90 border-2 border-slate-700 rounded-lg p-2.5 font-pixel shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs text-white">
              <span className="font-bold truncate max-w-[120px]">{enemy.displayName}</span>
              <span className="text-[10px] text-amber-400">Lv{enemy.level}</span>
            </div>
            <div className="flex gap-1 py-0.5">
              {enemy.types.map(t => (
                <TypeBadge key={t} type={t} size="xs" />
              ))}
            </div>
            {/* HP Bar */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[9px] font-bold text-amber-400">HP</span>
              <div className="flex-1 h-2.5 bg-slate-800 rounded-full border border-slate-600 p-0.5 overflow-hidden">
                <div
                  className={`h-full ${getHpBarColor(enemyHpPct)} rounded-full transition-all duration-500`}
                  style={{ width: `${enemyHpPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Enemy Sprite or Poké Ball Shake */}
          <div className={`relative w-36 h-36 flex items-center justify-center ${enemyAnim}`}>
            {pokeballThrowing ? (
              <div className={`text-4xl transition-transform ${pokeballShakes % 2 === 1 ? '-rotate-12' : 'rotate-12'}`}>
                🔴
              </div>
            ) : (
              <img
                src={enemy.sprites.front}
                alt={enemy.displayName}
                className="max-h-32 object-contain pixel-art drop-shadow-lg"
              />
            )}
          </div>
        </div>

        {/* 2. BOTTOM HALF: PLAYER ZONE (Bottom Right) */}
        <div className="flex items-end justify-between min-h-[140px] px-2 pb-2">
          {/* Player Sprite (Back or Front) */}
          <div className={`w-36 h-36 flex items-center justify-center ${playerAnim}`}>
            <img
              src={activePokemon.sprites.back || activePokemon.sprites.front}
              alt={activePokemon.displayName}
              className="max-h-32 object-contain pixel-art drop-shadow-lg"
            />
          </div>

          {/* Player Status Box */}
          <div className="w-60 bg-slate-950/90 border-2 border-slate-700 rounded-lg p-2.5 font-pixel shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs text-white">
              <span className="font-bold truncate max-w-[130px]">{activePokemon.displayName}</span>
              <span className="text-[10px] text-amber-400">Lv{activePokemon.level}</span>
            </div>
            <div className="flex gap-1 py-0.5">
              {activePokemon.types.map(t => (
                <TypeBadge key={t} type={t} size="xs" />
              ))}
            </div>
            {/* HP Bar & Numbers */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[9px] font-bold text-amber-400">HP</span>
              <div className="flex-1 h-2.5 bg-slate-800 rounded-full border border-slate-600 p-0.5 overflow-hidden">
                <div
                  className={`h-full ${getHpBarColor(playerHpPct)} rounded-full transition-all duration-500`}
                  style={{ width: `${playerHpPct}%` }}
                />
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-300 font-mono">
              {activePokemon.currentHp} / {activePokemon.maxHp}
            </div>
          </div>
        </div>

        {/* 3. BATTLE CONTROL & DIALOGUE WINDOW */}
        <div className="border-4 border-slate-800 bg-slate-950 rounded-xl p-3 min-h-[130px] flex flex-col justify-between">
          {/* Narrative Dialogue Box */}
          <div className="font-pixel text-[11px] sm:text-xs text-white leading-relaxed p-1">
            {dialogue}
          </div>

          {/* 4-Way Command Palette */}
          {menuMode === 'MAIN' && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
              <button
                disabled={turnState !== 'PLAYER_INPUT'}
                onClick={() => {
                  sound.playSelect();
                  setMenuMode('MOVES');
                }}
                className="rpg-btn py-2 px-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg"
              >
                FIGHT ⚔️
              </button>
              <button
                disabled={turnState !== 'PLAYER_INPUT'}
                onClick={() => {
                  sound.playSelect();
                  setMenuMode('BAG');
                }}
                className="rpg-btn py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg"
              >
                BAG 🎒
              </button>
              <button
                disabled={turnState !== 'PLAYER_INPUT'}
                onClick={() => {
                  sound.playSelect();
                  setMenuMode('PARTY');
                }}
                className="rpg-btn py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg"
              >
                POKÉMON 🟢
              </button>
              <button
                disabled={turnState !== 'PLAYER_INPUT'}
                onClick={handleRun}
                className="rpg-btn py-2 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg"
              >
                RUN 🏃
              </button>
            </div>
          )}

          {/* MOVES SELECTION */}
          {menuMode === 'MOVES' && (
            <div className="mt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {activePokemon.moves?.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectMove(m)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left font-pixel text-[10px] text-white flex flex-col justify-between"
                  >
                    <span className="font-bold truncate">{m.name}</span>
                    <div className="flex justify-between items-center text-[8px] text-slate-400 mt-1">
                      <span className="uppercase">{m.type}</span>
                      <span>PWR:{m.power || '-'}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  sound.playSelect();
                  setMenuMode('MAIN');
                }}
                className="text-[10px] font-pixel text-slate-400 hover:text-white pt-1"
              >
                ← KEMBALI
              </button>
            </div>
          )}

          {/* BAG / ITEMS */}
          {menuMode === 'BAG' && (
            <div className="mt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                {bag.filter(b => b.count > 0).map((it) => (
                  <button
                    key={it.id}
                    onClick={() => handleUseItem(it)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 font-pixel text-[10px] text-white flex justify-between items-center"
                  >
                    <span>{it.name}</span>
                    <span className="text-amber-400 font-bold">x{it.count}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  sound.playSelect();
                  setMenuMode('MAIN');
                }}
                className="text-[10px] font-pixel text-slate-400 hover:text-white pt-1"
              >
                ← KEMBALI
              </button>
            </div>
          )}

          {/* PARTY SWAP */}
          {menuMode === 'PARTY' && (
            <div className="mt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                {playerParty.map((pk) => {
                  const isCurrent = pk.id === activePokemon.id;
                  const isFainted = pk.currentHp <= 0;
                  return (
                    <button
                      key={pk.id}
                      disabled={isCurrent || isFainted}
                      onClick={() => handleSwitchPokemon(pk)}
                      className={`p-2 rounded-lg border font-pixel text-[9px] flex justify-between items-center ${
                        isCurrent
                          ? 'bg-red-950/40 border-red-500 text-red-300'
                          : isFainted
                          ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                      }`}
                    >
                      <span className="truncate">{pk.displayName}</span>
                      <span>HP: {pk.currentHp}/{pk.maxHp}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  sound.playSelect();
                  setMenuMode('MAIN');
                }}
                className="text-[10px] font-pixel text-slate-400 hover:text-white pt-1"
              >
                ← KEMBALI
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
