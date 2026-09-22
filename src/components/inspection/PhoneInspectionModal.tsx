import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  X, 
  BookmarkCheck, 
  Wifi, 
  BatteryMedium, 
  ShieldCheck, 
  ShieldAlert, 
  MessageSquare, 
  Users, 
  ArrowLeft,
  Search,
  MoreVertical,
  CheckCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { EvidenceQuote, PlayerProfile } from '../../types';
import { CharacterIllustration } from '../CharacterIllustration';
import { sound } from '../../utils/sound';

interface PhoneInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordClue: (quote: EvidenceQuote) => void;
  isAlreadyRecorded: boolean;
  playerProfile: PlayerProfile;
  isReducedMotion?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'ryan' | 'seller' | 'noah' | 'alyssa';
  senderLabel: string;
  time: string;
  text: string;
  isKeyClue?: boolean;
  reflectionText: string;
}

interface ChatThread {
  id: string;
  title: string;
  subtitle: string;
  avatarText: string;
  avatarBg: string;
  messages: ChatMessage[];
}

const CHAT_THREADS: ChatThread[] = [
  {
    id: 'thread_seller',
    title: 'UNKNOWN SELLER',
    subtitle: 'Direct Message • Online',
    avatarText: '?',
    avatarBg: 'bg-slate-700 text-slate-300',
    messages: [
      {
        id: 'msg_seller_1',
        sender: 'seller',
        senderLabel: 'UNKNOWN SELLER',
        time: '18:20',
        text: 'Same as before.',
        reflectionText: '“A vague message from an unverified contact. It does not establish anything about this device.”'
      },
      {
        id: 'msg_ryan_1',
        sender: 'ryan',
        senderLabel: 'Ryan',
        time: '18:45',
        text: 'This one normal, right?',
        reflectionText: '“Ryan is asking for reassurance, not providing verification.”'
      },
      {
        id: 'msg_seller_2',
        sender: 'seller',
        senderLabel: 'UNKNOWN SELLER',
        time: '18:48',
        text: 'Yeah. Normal only.',
        reflectionText: '“The reply is confident, but confidence is not independent evidence.”'
      },
      {
        id: 'msg_ryan_2',
        sender: 'ryan',
        senderLabel: 'Ryan',
        time: '19:10',
        text: 'You checked?',
        reflectionText: '“Ryan asks the source to support the claim. The next reply matters.”'
      },
      {
        id: 'msg_seller_3',
        sender: 'seller',
        senderLabel: 'UNKNOWN SELLER',
        time: '19:11',
        text: 'Same as before. Trust me.',
        isKeyClue: true,
        reflectionText: '“The source answers with reassurance, not independent support. The message cannot establish what is inside.”'
      },
      {
        id: 'msg_ryan_3',
        sender: 'ryan',
        senderLabel: 'Ryan',
        time: '19:14',
        text: 'Okay. I trust you.',
        reflectionText: '“Ryan accepts the reassurance without gaining any independent information.”'
      },
      {
        id: 'msg_seller_4',
        sender: 'seller',
        senderLabel: 'UNKNOWN SELLER',
        time: '20:05',
        text: 'Seen.',
        reflectionText: '“Nothing in this message adds evidence about the contents.”'
      }
    ]
  },
  {
    id: 'thread_friends',
    title: 'Weekend Group Chat',
    subtitle: 'Noah, Alyssa, Ryan',
    avatarText: '👥',
    avatarBg: 'bg-indigo-900 text-indigo-300',
    messages: [
      {
        id: 'msg_noah_casual',
        sender: 'noah',
        senderLabel: 'Noah',
        time: '21:15',
        text: 'Yo Ryan, did you buy the tortilla chips and spicy salsa for later?',
        reflectionText: '“That’s just Noah checking on snacks. It doesn’t establish anything about the vape.”'
      },
      {
        id: 'msg_ryan_casual',
        sender: 'ryan',
        senderLabel: 'Ryan',
        time: '21:18',
        text: 'Yeah got two big bags and sour cream dip! Plus Noah your favourite soda.',
        reflectionText: '“That’s just Ryan being Ryan. Completely unrelated to product verification.”'
      },
      {
        id: 'msg_alyssa_casual',
        sender: 'alyssa',
        senderLabel: 'Alyssa',
        time: '21:40',
        text: 'Running 10 mins late guys, finishing up my lecture notes.',
        reflectionText: '“Ordinary social chat about timing. Nothing to do with the source chain.”'
      }
    ]
  }
];

export const PhoneInspectionModal: React.FC<PhoneInspectionModalProps> = ({
  isOpen,
  onClose,
  onRecordClue,
  isAlreadyRecorded,
  playerProfile,
  isReducedMotion = false
}) => {
  const [activeThreadId, setActiveThreadId] = useState<string>('thread_seller');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [currentThought, setCurrentThought] = useState<string>(
    'Ryan left his phone unlocked on the table with his messaging app open. Let’s scroll through his chat history.'
  );
  const [isKeyClueSelected, setIsKeyClueSelected] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentThread = CHAT_THREADS.find((t) => t.id === activeThreadId) || CHAT_THREADS[0];

  const handleSelectMessage = (msg: ChatMessage) => {
    sound.playPhoneMessageTap();
    setSelectedMessageId(msg.id);
    setCurrentThought(msg.reflectionText);
    setIsKeyClueSelected(!!msg.isKeyClue);
  };

  const handleRecordEvidenceClick = () => {
    if (isAlreadyRecorded) return;
    sound.playRecordClue();
    import('../../data/gameData').then(({ ALL_DISCOVERABLE_QUOTES }) => {
      const evidence = ALL_DISCOVERABLE_QUOTES['item_telegram_chat_log'];
      if (evidence) {
        onRecordClue(evidence);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        transition={{ duration: isReducedMotion ? 0.05 : 0.2 }}
        className="bg-slate-900 border-2 border-cyan-400 text-slate-100 rounded-xl max-w-xl w-full p-4 sm:p-5 shadow-2xl flex flex-col space-y-3 max-h-[95vh] overflow-y-auto"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-display font-black uppercase px-2 py-0.5 rounded bg-cyan-400 text-slate-950">
                  DIGITAL RECORD (PHONE)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Ryan's Unlocked Phone
                </span>
              </div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-100">
                Direct Messaging App History
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Phone"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Seller Chat vs Friends Group Chat) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-display">
          {CHAT_THREADS.map((thread) => (
            <button
              key={thread.id}
              onClick={() => {
                sound.playClick();
                setActiveThreadId(thread.id);
                setSelectedMessageId(null);
                setIsKeyClueSelected(false);
                setCurrentThought(`Viewing thread: ${thread.title}. Tap messages to inspect their relevance.`);
              }}
              className={`flex-1 py-1.5 px-2 rounded font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeThreadId === thread.id
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{thread.avatarText}</span>
              <span className="truncate">{thread.title}</span>
            </button>
          ))}
        </div>

        {/* HTML PHONE DEVICE FRAME */}
        <div className="w-full bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[340px] sm:h-[370px]">
          
          {/* Phone Status Bar (Time, Wifi, Battery) */}
          <div className="h-6 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="font-bold text-slate-200">23:04</span>
            <div className="w-16 h-3 bg-slate-950 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px]">5G</span>
              <Wifi className="w-3 h-3 text-slate-300" />
              <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* Messaging App Navigation Header */}
          <div className="bg-slate-900/95 border-b border-slate-800 px-3 py-2 flex items-center justify-between shadow">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${currentThread.avatarBg} flex items-center justify-center font-bold text-sm shadow shrink-0`}>
                {currentThread.avatarText}
              </div>
              <div>
                <div className="text-xs font-heading font-black text-slate-100 flex items-center gap-1.5">
                  <span>{currentThread.title}</span>
                  {activeThreadId === 'thread_seller' && (
                    <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-mono">
                      UNVERIFIED
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {currentThread.subtitle}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono">
              DirectChat
            </div>
          </div>

          {/* Scrollable Chat Message Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 text-xs">
            <div className="flex justify-center">
              <span className="text-[9px] bg-slate-800/80 text-slate-400 px-2.5 py-0.5 rounded-full font-mono border border-slate-700/60">
                Today &bull; End-to-End Chat
              </span>
            </div>

            {currentThread.messages.map((msg) => {
              const isMe = msg.sender === 'ryan';
              const isSelected = selectedMessageId === msg.id;

              return (
                <button
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`flex w-full flex-col ${isMe ? 'items-end' : 'items-start'} cursor-pointer group transition-all text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 rounded-xl`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-xl p-2.5 shadow transition-all ${
                      isSelected
                        ? msg.isKeyClue
                          ? 'bg-cyan-950 border-2 border-cyan-400 ring-2 ring-cyan-400/40'
                          : 'bg-slate-800 border-2 border-amber-400'
                        : isMe
                        ? 'bg-blue-600/90 text-white border border-blue-500/50 hover:border-blue-300'
                        : 'bg-slate-800/90 text-slate-100 border border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {!isMe && (
                      <div className="text-[9px] font-bold text-cyan-300 mb-0.5 font-mono flex items-center justify-between gap-2">
                        <span>{msg.senderLabel}</span>
                        {msg.isKeyClue && (
                          <span className="text-[8px] bg-cyan-400 text-slate-950 px-1 rounded font-black">
                            KEY EVIDENCE
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-xs leading-relaxed font-body">
                      {msg.text}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[8px] opacity-70 font-mono">
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-cyan-200" />}
                    </div>
                  </div>

                  {/* Tap prompt helper for unselected messages */}
                  {!isSelected && (
                    <span className="text-[8px] text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 px-1">
                      Click message to inspect
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Player Character Reflection Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-3 shadow-inner">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-cyan-400/50 shrink-0 mt-0.5">
            <CharacterIllustration
              characterId="player"
              playerGender={playerProfile.gender}
              expression={isKeyClueSelected ? 'skeptical' : 'neutral'}
              size="sm"
              className="w-8 h-8"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-black text-cyan-400">
                {playerProfile.name}'s Evaluation of Chat:
              </span>
              {isKeyClueSelected && (
                <span className="text-[10px] font-mono font-bold bg-cyan-400 text-slate-950 px-1.5 py-0.2 rounded">
                  CRITICAL DIGITAL PROOF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 font-body mt-0.5 leading-relaxed italic">
              {currentThought}
            </p>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-display uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer"
          >
            Finished Inspecting
          </button>

          {/* Active Record Clue Button (illuminates when player selects the critical reliance message) */}
          {isKeyClueSelected ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRecordEvidenceClick}
              disabled={isAlreadyRecorded}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-heading font-black text-xs uppercase tracking-wider rounded border border-white flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer disabled:bg-emerald-950 disabled:text-emerald-300 disabled:border-emerald-500 disabled:cursor-default"
            >
              <BookmarkCheck className="w-4 h-4 text-slate-950" />
              <span>{isAlreadyRecorded ? 'Recorded in Case File' : 'RECORD CLUE IN CASE FILE'}</span>
            </motion.button>
          ) : (
            <div className="text-[11px] text-slate-400 font-mono italic">
              Tap messages in the chat to analyze seller assurances...
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
