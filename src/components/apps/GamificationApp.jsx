import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Zap, 
  Sparkles, 
  Gift, 
  ShieldCheck, 
  Plus, 
  Clock, 
  Code, 
  Dumbbell,
  CheckCircle2,
  Lock,
  ShoppingBag
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { calculateLevelInfo, triggerConfetti } from '../../services/gamification';
import soundService from '../../services/sound';

export default function GamificationApp() {
  const { state, setRewards, setWeeklyBoss, setDailyQuests, awardXP, unlockAchievement } = useOS();
  const [activeTab, setActiveTab] = useState('boss'); // 'boss' | 'quests' | 'shop' | 'achievements'

  const levelInfo = calculateLevelInfo(state.profile.totalXP, state.levelTiers);

  // Toggle Weekly Boss Requirement
  const handleToggleBossReq = (reqId) => {
    setWeeklyBoss((prev) => {
      const updatedReqs = prev.requirements.map((r) =>
        r.id === reqId ? { ...r, completed: !r.completed } : r
      );

      const completedCount = updatedReqs.filter((r) => r.completed).length;
      const percentDone = (completedCount / updatedReqs.length) * 100;
      const newHP = Math.max(0, 100 - percentDone);

      if (newHP === 0) {
        awardXP(prev.bonusXP || 800, `Conquered Weekly Boss: ${prev.name}!`);
        unlockAchievement('boss_slayer');
        triggerConfetti(120);
        soundService.playLevelUp();
        alert(`🎉 VICTORY! You have slayed ${prev.name} and claimed +${prev.bonusXP} XP!`);
      }

      return {
        ...prev,
        hpCurrent: newHP,
        requirements: updatedReqs
      };
    });
  };

  // Toggle Daily Quest
  const handleToggleQuest = (questId) => {
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const nextState = !q.completed;
          if (nextState) {
            awardXP(q.xp || 100, `Completed Daily Quest: ${q.text}`);
            triggerConfetti(60);
          }
          return { ...q, completed: nextState };
        }
        return q;
      })
    );
  };

  // Redeem Reward Shop Item
  const handleRedeemReward = (reward) => {
    if (state.profile.totalXP < reward.xpCost) {
      alert(`Insufficient XP! You need ${reward.xpCost} XP (You currently have ${state.profile.totalXP} XP). Keep conquering daily habits and goals!`);
      return;
    }

    if (confirm(`Redeem "${reward.name}" for ${reward.xpCost} XP? You earned this guilt-free break!`)) {
      awardXP(-reward.xpCost, `Redeemed Reward: ${reward.name}`);
      triggerConfetti(90);
      soundService.playAchievement();
      alert(`🎁 Reward Claimed! Enjoy your ${reward.name}!`);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Gamification & Character Progression</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Turn your college grind into an RPG character progression loop. Complete habits, conquer bosses, unlock loot.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('boss')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'boss' ? 'bg-amber-500 text-black font-bold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Weekly Boss</span>
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quests' ? 'bg-amber-500 text-black font-bold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Quests</span>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'shop' ? 'bg-amber-500 text-black font-bold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Reward Shop</span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'achievements' ? 'bg-amber-500 text-black font-bold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Achievements</span>
          </button>
        </div>
      </div>

      {/* 1. WEEKLY BOSS BATTLE VIEW */}
      {activeTab === 'boss' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-red-950/40 via-purple-950/30 to-black border border-red-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded border border-red-500/30 font-bold">
                  EPIC WEEKLY RAID BOSS
                </span>
                <h3 className="text-2xl font-black text-white">{state.weeklyBoss.name}</h3>
                <p className="text-xs text-os-text-muted">{state.weeklyBoss.subtitle}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-amber-400 font-mono font-bold block mb-1">
                  VICTORY BOUNTY
                </span>
                <span className="text-2xl font-black font-mono text-white">
                  +{state.weeklyBoss.bonusXP} XP
                </span>
              </div>
            </div>

            {/* Boss HP Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-red-400">Boss Health: {state.weeklyBoss.hpCurrent}% HP</span>
                <span className="text-os-text-muted">
                  {state.weeklyBoss.hpCurrent === 0 ? "🏆 BOSS DEFEATED" : "FIGHT IN PROGRESS"}
                </span>
              </div>
              <div className="w-full h-3.5 bg-black/60 rounded-full overflow-hidden border border-red-500/30">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${state.weeklyBoss.hpCurrent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Boss Battle Directives */}
          <div className="glass-panel p-5 border border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase text-white font-mono">
              Boss Battle Weekly Directives (Click to Check Off)
            </h4>

            <div className="space-y-3">
              {state.weeklyBoss.requirements.map((req) => (
                <div
                  key={req.id}
                  onClick={() => handleToggleBossReq(req.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    req.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-os-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                      req.completed ? 'bg-emerald-500 border-emerald-400 text-black font-bold' : 'border-white/30 bg-black/20'
                    }`}>
                      {req.completed && '✓'}
                    </div>
                    <span className={`text-xs font-bold ${req.completed ? 'line-through opacity-80' : ''}`}>
                      {req.text}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-semibold text-amber-400">
                    -{req.weight}% Boss HP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. DAILY QUESTS VIEW */}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase text-white font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Today's Daily Quests</span>
            </h4>

            <div className="space-y-3">
              {state.dailyQuests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => handleToggleQuest(quest.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    quest.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-os-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                      quest.completed ? 'bg-emerald-500 border-emerald-400 text-black font-bold' : 'border-white/30 bg-black/20'
                    }`}>
                      {quest.completed && '✓'}
                    </div>
                    <span className={`text-xs font-bold ${quest.completed ? 'line-through opacity-80' : ''}`}>
                      {quest.text}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{quest.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. REWARD SHOP VIEW */}
      {activeTab === 'shop' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 bg-gradient-to-r from-amber-950/30 to-slate-900/60 border border-amber-500/20 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase text-amber-300 font-mono">Available XP Balance</h4>
              <div className="text-2xl font-black font-mono text-white mt-0.5">
                {state.profile.totalXP} <span className="text-xs font-normal text-os-text-muted">XP to spend</span>
              </div>
            </div>
            <span className="text-xs text-os-text-muted">Spend XP on guilt-free lifestyle rewards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.rewards.map((reward) => (
              <div key={reward.id} className="glass-panel p-5 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{reward.name}</span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {reward.xpCost} XP
                    </span>
                  </div>
                  <p className="text-xs text-os-text-muted leading-relaxed">{reward.description}</p>
                </div>

                <button
                  onClick={() => handleRedeemReward(reward)}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
                >
                  Redeem Reward (-{reward.xpCost} XP)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ACHIEVEMENTS VIEW */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-xl border transition-all flex items-start gap-4 ${
                ach.unlocked
                  ? 'glass-panel border-amber-500/30 bg-amber-950/10'
                  : 'bg-white/5 border-white/5 opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                ach.unlocked ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-black/40 border-white/10 text-os-text-muted'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                  <span className="text-[10px] font-mono text-amber-400">+{ach.xpReward} XP</span>
                </div>
                <p className="text-xs text-os-text-muted mt-1">{ach.description}</p>
                <div className="text-[10px] font-mono text-os-text-muted mt-2">
                  {ach.unlocked ? `Unlocked: ${new Date(ach.unlockedAt || Date.now()).toLocaleDateString()}` : 'Locked (Complete requirement)'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
