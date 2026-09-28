import { useState, useEffect, useRef, useCallback } from 'react';
import { ALL_MAPS, getMapById } from './maps/index.js';
import { TILE_SIZE, TILES, SOLID_TILES, DIRECTIONS, INITIAL_GAME_STATE } from './constants.js';
import { sound } from './soundEffects.js';
import { getPokemonData, createPokemonInstance } from '../services/pokeapi.js';

import WorldCanvas from './WorldCanvas.jsx';
import BattleScreen from './BattleScreen.jsx';
import DialogueBox from './DialogueBox.jsx';
import StarterSelectModal from './StarterSelectModal.jsx';
import ShopModal from './ShopModal.jsx';
import GameMenu from './GameMenu.jsx';
import TouchControls from './TouchControls.jsx';

export default function GameEngine() {
  // Game Modes: 'OVERWORLD' | 'BATTLE' | 'DIALOGUE'
  const [gameMode, setGameMode] = useState('OVERWORLD');

  // Master Saved Game State
  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem('pokeworld_save');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_GAME_STATE;
  });

  // Current Map Data
  const currentMap = getMapById(gameState.currentMap);

  // Player position & movement
  const [playerPos, setPlayerPos] = useState(gameState.playerPos);
  const [playerDirection, setPlayerDirection] = useState(gameState.playerDirection || 'down');
  const [isMoving, setIsMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);

  // Active Dialogue State
  const [activeDialogue, setActiveDialogue] = useState(null); // { speaker: string, lines: string[], onFinish: () => void }

  // Active Modals
  const [showStarterModal, setShowStarterModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showGameMenu, setShowGameMenu] = useState(false);

  // Active Battle State
  const [battleData, setBattleData] = useState(null); // { enemyPokemon, isTrainer, trainerName, trainerId }

  // Save game to localStorage
  const saveGame = useCallback(() => {
    const stateToSave = {
      ...gameState,
      playerPos,
      playerDirection
    };
    try {
      localStorage.setItem('pokeworld_save', JSON.stringify(stateToSave));
    } catch {}
  }, [gameState, playerPos, playerDirection]);

  // Handle Walking & Collision
  const tryMove = useCallback((dir) => {
    if (gameMode !== 'OVERWORLD' || isMoving || activeDialogue || showStarterModal || showShopModal || showGameMenu) {
      return;
    }

    setPlayerDirection(dir);
    sound.init();

    // Determine target delta
    let dx = 0;
    let dy = 0;
    if (dir === 'up') dy = -1;
    if (dir === 'down') dy = 1;
    if (dir === 'left') dx = -1;
    if (dir === 'right') dx = 1;

    const targetX = playerPos.x + dx;
    const targetY = playerPos.y + dy;

    // 1. Boundary check
    if (targetX < 0 || targetX >= currentMap.width || targetY < 0 || targetY >= currentMap.height) {
      sound.playBump();
      return;
    }

    // 2. Tile Solid Check
    const targetTile = currentMap.tiles[targetY]?.[targetX] ?? TILES.GRASS;
    if (SOLID_TILES.has(targetTile)) {
      sound.playBump();
      return;
    }

    // 3. Building Wall Check (doors are walkable)
    if (currentMap.buildings) {
      for (const b of currentMap.buildings) {
        if (targetX >= b.x && targetX < b.x + b.width && targetY >= b.y && targetY < b.y + b.height) {
          // If not the door tile, block
          if (!(targetX === b.doorX && targetY === b.doorY)) {
            sound.playBump();
            return;
          }
        }
      }
    }

    // 4. NPC Solid Check
    if (currentMap.npcs) {
      const npcHit = currentMap.npcs.find(n => n.x === targetX && n.y === targetY);
      if (npcHit) {
        sound.playBump();
        return;
      }
    }

    // Move is valid! Animate step
    setIsMoving(true);
    setWalkFrame(prev => (prev + 1) % 4);

    setTimeout(() => {
      setPlayerPos({ x: targetX, y: targetY });
      setIsMoving(false);

      // Check Warps / Doors after stepping onto the tile
      checkWarps(targetX, targetY);

      // Check Wild Encounters (Tall Grass or Caves)
      checkWildEncounter(targetTile);
    }, 120);

  }, [gameMode, isMoving, activeDialogue, showStarterModal, showShopModal, showGameMenu, playerPos, currentMap]);

  // Check Warps / Doors
  const checkWarps = (x, y) => {
    // 1. Check building doors
    if (currentMap.buildings) {
      for (const b of currentMap.buildings) {
        if (x === b.doorX && y === b.doorY) {
          sound.playSelect();
          setGameState(prev => ({
            ...prev,
            currentMap: b.warpTo.map,
            playerPos: { x: b.warpTo.x, y: b.warpTo.y },
            prevMap: currentMap.id,
            prevPos: { x: b.doorX, y: b.doorY + 1 }
          }));
          setPlayerPos({ x: b.warpTo.x, y: b.warpTo.y });
          setPlayerDirection('up');
          return;
        }
      }
    }

    // 2. Check map edge warps
    if (currentMap.warps) {
      for (const w of currentMap.warps) {
        if (w.x === x && w.y === y) {
          sound.playSelect();
          if (w.targetReturnToPrev && gameState.prevMap) {
            setGameState(prev => ({
              ...prev,
              currentMap: prev.prevMap,
              playerPos: prev.prevPos || { x: 4, y: 8 }
            }));
            setPlayerPos(gameState.prevPos || { x: 4, y: 8 });
            setPlayerDirection('down');
          } else if (w.targetMap) {
            setGameState(prev => ({
              ...prev,
              currentMap: w.targetMap,
              playerPos: { x: w.targetX, y: w.targetY }
            }));
            setPlayerPos({ x: w.targetX, y: w.targetY });
          }
          return;
        }
      }
    }
  };

  // Check Wild Pokémon Encounter
  const checkWildEncounter = async (tile) => {
    if (gameState.party.length === 0) return; // Cannot encounter before getting starter

    const isGrass = tile === TILES.TALL_GRASS;
    const isCaveFloor = currentMap.isCave && tile === TILES.CAVE_FLOOR;

    if (!isGrass && !isCaveFloor) return;

    // ~12% encounter chance per step
    const roll = Math.random();
    if (roll < 0.12 && currentMap.wildEncounters && currentMap.wildEncounters.length > 0) {
      const pool = currentMap.wildEncounters;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      const level = Math.floor(Math.random() * (pick.maxLevel - pick.minLevel + 1)) + pick.minLevel;

      try {
        const pkmnData = await getPokemonData(pick.pokemonId);
        const enemyInstance = createPokemonInstance(pkmnData, level);

        setBattleData({
          enemyPokemon: enemyInstance,
          isTrainer: false,
          trainerName: ''
        });
        setGameMode('BATTLE');
      } catch (err) {
        console.error('Failed to initiate wild battle', err);
      }
    }
  };

  // Interact Action (A / Space / Enter)
  const handleInteract = () => {
    sound.init();

    if (activeDialogue) {
      // Advance dialogue handled by DialogueBox component
      return;
    }

    if (gameMode !== 'OVERWORLD') return;

    // Determine target tile in front of player
    let tx = playerPos.x;
    let ty = playerPos.y;
    if (playerDirection === 'up') ty -= 1;
    if (playerDirection === 'down') ty += 1;
    if (playerDirection === 'left') tx -= 1;
    if (playerDirection === 'right') tx += 1;

    // 1. Check NPC interaction
    if (currentMap.npcs) {
      const npc = currentMap.npcs.find(n => n.x === tx && n.y === ty);
      if (npc) {
        sound.playSelect();

        // If Nurse Joy
        if (npc.isNurse) {
          sound.playHeal();
          // Heal all pokemon in party
          const healedParty = gameState.party.map(p => ({ ...p, currentHp: p.maxHp }));
          setGameState(prev => ({ ...prev, party: healedParty }));
          setActiveDialogue({
            speaker: npc.name,
            lines: [
              'Selamat datang di Pokémon Center!',
              'Tim Pokémon-mu telah kami pulihkan hingga penuh energi dan siap bertualang kembali! 💖'
            ]
          });
          return;
        }

        // If Poké Mart Clerk
        if (npc.isShopClerk) {
          setShowShopModal(true);
          return;
        }

        // If Mom
        if (npc.isHealer) {
          sound.playHeal();
          const healedParty = gameState.party.map(p => ({ ...p, currentHp: p.maxHp }));
          setGameState(prev => ({ ...prev, party: healedParty }));
          setActiveDialogue({
            speaker: npc.name,
            lines: npc.dialogue
          });
          return;
        }

        // If Trainer (Joey, Sammy, Dwayne, Brock)
        if (npc.isTrainer) {
          const isAlreadyDefeated = gameState.defeatedTrainers.includes(npc.trainerId);
          if (isAlreadyDefeated) {
            setActiveDialogue({
              speaker: npc.name,
              lines: npc.postBattleDialogue || ['Pertarungan kita tadi sungguh berkesan!']
            });
            return;
          }

          // Trigger Trainer Battle!
          setActiveDialogue({
            speaker: npc.name,
            lines: npc.preBattleDialogue,
            onFinish: async () => {
              try {
                const firstOpponent = npc.party[0];
                const data = await getPokemonData(firstOpponent.pokemonId);
                const instance = createPokemonInstance(data, firstOpponent.level);

                setBattleData({
                  enemyPokemon: instance,
                  isTrainer: true,
                  trainerName: npc.name,
                  trainerId: npc.trainerId,
                  isGymLeader: npc.isGymLeader,
                  prizeMoney: npc.prizeMoney || 200
                });
                setGameMode('BATTLE');
              } catch (err) {
                console.error('Failed to start trainer battle', err);
              }
            }
          });
          return;
        }

        // Standard NPC dialogue
        setActiveDialogue({
          speaker: npc.name,
          lines: npc.dialogue
        });
        return;
      }
    }

    // 2. Check Starter Table (in Oak's Lab)
    if (currentMap.starterTable) {
      const nearTable = currentMap.starterTable.starters.some(
        st => Math.abs(st.x - tx) <= 1 && Math.abs(st.y - ty) <= 1
      );
      if (nearTable) {
        if (!gameState.hasStarter) {
          sound.playSelect();
          setShowStarterModal(true);
        } else {
          setActiveDialogue({
            speaker: 'Prof. Oak',
            lines: ['Kamu sudah memilih starter terbaikmu! Rawatlah dengan penuh kasih sayang.']
          });
        }
        return;
      }
    }

    // 3. Check Signs
    if (currentMap.signs) {
      const sign = currentMap.signs.find(s => s.x === tx && s.y === ty);
      if (sign) {
        sound.playSelect();
        setActiveDialogue({
          speaker: 'Papan Tanda',
          lines: sign.text
        });
        return;
      }
    }
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 's', 'a', 'd', ' '].includes(key)) {
        e.preventDefault();
      }

      if (key === 'arrowup' || key === 'w') {
        tryMove('up');
      } else if (key === 'arrowdown' || key === 's') {
        tryMove('down');
      } else if (key === 'arrowleft' || key === 'a') {
        tryMove('left');
      } else if (key === 'arrowright' || key === 'd') {
        tryMove('right');
      } else if (key === ' ' || key === 'enter') {
        handleInteract();
      } else if (key === 'escape' || key === 'm') {
        setShowGameMenu(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tryMove, handleInteract]);

  // Starter Picked
  const handleSelectStarter = async (starterMeta) => {
    setShowStarterModal(false);
    try {
      const data = await getPokemonData(starterMeta.id);
      const starterInstance = createPokemonInstance(data, 5);

      setGameState(prev => ({
        ...prev,
        hasStarter: true,
        party: [starterInstance],
        storyStep: 1,
        questTitle: 'Jelajahi Route 1',
        questDesc: 'Latih starter Pokémon-mu di semak Route 1 dan kalahkan Youngster Joey.'
      }));

      setActiveDialogue({
        speaker: 'Prof. Oak',
        lines: [
          `Selamat! ${starterInstance.displayName} kini menjadi pasangan Pokémon pertamamu!`,
          'Bawalah ia menjelajah Route 1 di utara kota, lewati Emerald Forest & Rockfall Cave, lalu tantang Gym di Oakhaven City!'
        ]
      });

      saveGame();
    } catch (err) {
      console.error('Failed to grant starter', err);
    }
  };

  // Battle Handlers
  const handleBattleVictory = ({ expGained, prizeMoney }) => {
    const isGymLeader = battleData?.isGymLeader;
    const trainerId = battleData?.trainerId;

    setGameState(prev => {
      let updatedDefeated = prev.defeatedTrainers;
      let updatedBadges = prev.badges;
      let updatedStory = prev.storyStep;
      let questT = prev.questTitle;
      let questD = prev.questDesc;

      if (trainerId && !updatedDefeated.includes(trainerId)) {
        updatedDefeated = [...updatedDefeated, trainerId];
      }

      if (isGymLeader && !updatedBadges.includes('Boulder Badge')) {
        updatedBadges = [...updatedBadges, 'Boulder Badge'];
        updatedStory = 4;
        questT = 'Juara Oakhaven Gym!';
        questD = 'Kamu berhasil mengalahkan Brock dan mendapatkan Boulder Badge!';
      }

      return {
        ...prev,
        money: prev.money + (prizeMoney || 0),
        defeatedTrainers: updatedDefeated,
        badges: updatedBadges,
        storyStep: updatedStory,
        questTitle: questT,
        questDesc: questD
      };
    });

    setBattleData(null);
    setGameMode('OVERWORLD');
    saveGame();
  };

  const handleBattleDefeat = () => {
    // Heal party and teleport to starter town Center
    const healedParty = gameState.party.map(p => ({ ...p, currentHp: p.maxHp }));
    setGameState(prev => ({
      ...prev,
      party: healedParty,
      currentMap: 'starterTown',
      playerPos: { x: 4, y: 13 }
    }));
    setPlayerPos({ x: 4, y: 13 });
    setPlayerDirection('down');
    setBattleData(null);
    setGameMode('OVERWORLD');
    sound.playHeal();
  };

  const handleCatchPokemon = (caughtPokemon) => {
    sound.playCatch();
    setGameState(prev => {
      let updatedParty = [...prev.party];
      if (updatedParty.length < 6) {
        updatedParty.push(caughtPokemon);
      }
      return {
        ...prev,
        party: updatedParty
      };
    });
    setBattleData(null);
    setGameMode('OVERWORLD');
    saveGame();
  };

  // Update Party from Battle
  const handleUpdateParty = (updatedActive) => {
    setGameState(prev => {
      const idx = prev.party.findIndex(p => p.id === updatedActive.id);
      if (idx !== -1) {
        const next = [...prev.party];
        next[idx] = updatedActive;
        return { ...prev, party: next };
      }
      return prev;
    });
  };

  // Update Bag (consume or add items)
  const handleUpdateBag = (itemId, countDelta) => {
    setGameState(prev => {
      const nextBag = prev.bag.map(it => {
        if (it.id === itemId) {
          return { ...it, count: Math.max(0, it.count + countDelta) };
        }
        return it;
      });
      return { ...prev, bag: nextBag };
    });
  };

  // Buy item from Mart
  const handleBuyItem = (item) => {
    setGameState(prev => {
      const nextBag = [...prev.bag];
      const existing = nextBag.find(b => b.id === item.id);
      if (existing) {
        existing.count += 1;
      } else {
        nextBag.push({ id: item.id, name: item.name, count: 1, desc: item.desc });
      }
      return {
        ...prev,
        money: prev.money - item.price,
        bag: nextBag
      };
    });
  };

  // Switch Active Lead Pokémon in Party
  const handleSwitchPokemonLead = (targetIndex) => {
    setGameState(prev => {
      const party = [...prev.party];
      const temp = party[0];
      party[0] = party[targetIndex];
      party[targetIndex] = temp;
      return { ...prev, party };
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Top Retro HUD Bar */}
      <div className="w-full max-w-xl bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-2 mb-2 flex items-center justify-between shadow-md font-pixel text-xs text-white">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 font-bold">{currentMap.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-[10px]">${gameState.money}</span>
          <button
            onClick={() => {
              sound.playSelect();
              setShowGameMenu(true);
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[9px] text-slate-200"
          >
            MENU ☰
          </button>
        </div>
      </div>

      {/* Main Game Screen Viewport */}
      {gameMode === 'OVERWORLD' && (
        <div className="relative w-full max-w-xl flex flex-col items-center">
          <WorldCanvas
            map={currentMap}
            playerPos={playerPos}
            playerDirection={playerDirection}
            isMoving={isMoving}
            walkFrame={walkFrame}
            onInteract={handleInteract}
          />

          {/* Quest Banner Indicator */}
          <div className="w-full mt-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-between text-[9px] font-pixel text-slate-300">
            <span className="text-amber-400">MISI: {gameState.questTitle}</span>
            <span className="text-slate-500">A / Spasi: Bicara</span>
          </div>

          {/* Dialogue Box */}
          {activeDialogue && (
            <DialogueBox
              speaker={activeDialogue.speaker}
              lines={activeDialogue.lines}
              onComplete={() => {
                const cb = activeDialogue.onFinish;
                setActiveDialogue(null);
                cb?.();
              }}
            />
          )}
        </div>
      )}

      {/* Battle Screen */}
      {gameMode === 'BATTLE' && battleData && (
        <BattleScreen
          playerPokemon={gameState.party[0]}
          enemyPokemon={battleData.enemyPokemon}
          isTrainerBattle={battleData.isTrainer}
          trainerName={battleData.trainerName}
          playerParty={gameState.party}
          bag={gameState.bag}
          onUpdateParty={handleUpdateParty}
          onUpdateBag={handleUpdateBag}
          onVictory={handleBattleVictory}
          onDefeat={handleBattleDefeat}
          onRun={() => {
            setBattleData(null);
            setGameMode('OVERWORLD');
          }}
          onCatch={handleCatchPokemon}
        />
      )}

      {/* Virtual D-Pad & Handheld Buttons for Mobile & Desktop */}
      {gameMode === 'OVERWORLD' && (
        <TouchControls
          onDirectionPress={tryMove}
          onActionA={handleInteract}
          onActionB={() => {
            if (activeDialogue) setActiveDialogue(null);
          }}
          onMenuToggle={() => setShowGameMenu(prev => !prev)}
        />
      )}

      {/* Modals */}
      {showStarterModal && (
        <StarterSelectModal
          onSelectStarter={handleSelectStarter}
          onClose={() => setShowStarterModal(false)}
        />
      )}

      {showShopModal && (
        <ShopModal
          money={gameState.money}
          onBuy={handleBuyItem}
          onClose={() => setShowShopModal(false)}
        />
      )}

      {showGameMenu && (
        <GameMenu
          gameState={gameState}
          onSave={saveGame}
          onClose={() => setShowGameMenu(false)}
          onSwitchPokemonLead={handleSwitchPokemonLead}
        />
      )}
    </div>
  );
}
