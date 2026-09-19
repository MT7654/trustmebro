import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  RotateCcw, 
  Eye, 
  BookmarkCheck, 
  X, 
  Package, 
  Sparkles, 
  AlertCircle, 
  ShieldAlert, 
  Check, 
  Lock, 
  Unlock,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { EvidenceQuote, PlayerProfile } from '../../types';
import { CharacterIllustration } from '../CharacterIllustration';
import { sound } from '../../utils/sound';

interface BoxAndPodInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordClue: (quote: EvidenceQuote) => void;
  isAlreadyRecorded: boolean;
  playerProfile: PlayerProfile;
  isReducedMotion?: boolean;
}

type InspectionTarget = 'box' | 'pod';

interface BoxAngle {
  id: string;
  name: string;
  description: string;
}

const BOX_ANGLES: BoxAngle[] = [
  { id: 'front', name: 'Front Face', description: 'Glossy packaging with stylized fruit graphics' },
  { id: 'side_left', name: 'Left Panel', description: 'Flavor designation & nicotine strength label' },
  { id: 'back', name: 'Back Panel', description: 'Ingredients, warnings & regulatory info' },
  { id: 'side_right', name: 'Right Panel', description: 'Brand series slogan & cosmetic badges' },
  { id: 'bottom', name: 'Base / Bottom', description: 'Barcode & generic packaging icons' }
];

const POD_ANGLES: BoxAngle[] = [
  { id: 'pod_front', name: 'Chamber Front', description: 'Translucent reservoir & e-liquid window' },
  { id: 'pod_tip', name: 'Mouthpiece', description: 'Silicone hygiene plug & air channel' },
  { id: 'pod_base', name: 'Connector Base', description: 'Magnetic coil contacts & airflow hole' },
  { id: 'pod_side', name: 'Side Profile', description: 'Fill scale & plastic casing seam' }
];

export const BoxAndPodInspectionModal: React.FC<BoxAndPodInspectionModalProps> = ({
  isOpen,
  onClose,
  onRecordClue,
  isAlreadyRecorded,
  playerProfile,
  isReducedMotion = false
}) => {
  const [target, setTarget] = useState<InspectionTarget>('box');
  const [boxAngleIndex, setBoxAngleIndex] = useState<number>(0);
  const [podAngleIndex, setPodAngleIndex] = useState<number>(0);
  const [isSealBroken, setIsSealBroken] = useState<boolean>(false);
  const [isLidOpen, setIsLidOpen] = useState<boolean>(false);
  const [examinedParts, setExaminedParts] = useState<Set<string>>(new Set());
  const [currentThought, setCurrentThought] = useState<string>(
    'A glossy, commercial-looking box on the table. Let me examine all angles carefully.'
  );
  const [activeMeaningfulClue, setActiveMeaningfulClue] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handlePrevAngle();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleNextAngle();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, target, boxAngleIndex, podAngleIndex]);

  if (!isOpen) return null;

  const currentBoxAngle = BOX_ANGLES[boxAngleIndex];
  const currentPodAngle = POD_ANGLES[podAngleIndex];

  const handleNextAngle = () => {
    sound.playBoxRotate();
    if (target === 'box') {
      setBoxAngleIndex((prev) => (prev + 1) % BOX_ANGLES.length);
    } else {
      setPodAngleIndex((prev) => (prev + 1) % POD_ANGLES.length);
    }
  };

  const handlePrevAngle = () => {
    sound.playBoxRotate();
    if (target === 'box') {
      setBoxAngleIndex((prev) => (prev - 1 + BOX_ANGLES.length) % BOX_ANGLES.length);
    } else {
      setPodAngleIndex((prev) => (prev - 1 + POD_ANGLES.length) % POD_ANGLES.length);
    }
  };

  // Drag handling for 2.5D tactile feel
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartXRef.current;
    if (diff > 45) {
      handlePrevAngle();
      dragStartXRef.current = e.clientX;
    } else if (diff < -45) {
      handleNextAngle();
      dragStartXRef.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      dragStartXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const diff = e.touches[0].clientX - dragStartXRef.current;
      if (diff > 40) {
        handlePrevAngle();
        dragStartXRef.current = e.touches[0].clientX;
      } else if (diff < -40) {
        handleNextAngle();
        dragStartXRef.current = e.touches[0].clientX;
      }
    }
  };

  const markExamined = (partId: string) => {
    sound.playClick();
    setExaminedParts((prev) => new Set([...prev, partId]));
  };

  // Click on specific interactive zones on the 2.5D object
  const handleInspectZone = (zoneId: string) => {
    markExamined(zoneId);

    switch (zoneId) {
      case 'box_front_art':
        setActiveMeaningfulClue(false);
        setCurrentThought('“Nice graphic design and glossy holographic foil, but decorative branding doesn\'t tell me what chemical liquid is actually inside.”');
        break;

      case 'box_flavor_tag':
        setActiveMeaningfulClue(false);
        setCurrentThought('“It says \'Sweet Peach 3% Extract\'. A printed flavor name is easy to print on any box—it doesn\'t independently verify safety or composition.”');
        break;

      case 'box_tamper_seal':
        sound.playPaperSlide();
        setIsSealBroken(true);
        setActiveMeaningfulClue(false);
        setCurrentThought('“The silver sticker reads \'Quality Guaranteed\', but it\'s a generic off-the-shelf sticker that was peeled and restuck. It doesn\'t guarantee the original contents weren\'t swapped.”');
        break;

      case 'box_open_lid':
        sound.playBoxOpen();
        setIsLidOpen(true);
        setActiveMeaningfulClue(false);
        setCurrentThought('“The box opens easily. Inside is a clear plastic vape pod in a torn foil blister. I can inspect the cartridge itself now!”');
        break;

      case 'box_back_blank_panel':
        sound.playBlip();
        setActiveMeaningfulClue(true);
        setCurrentThought('“Look at the compliance panel: the Batch Serial, Manufacturer License, and Lab Verification QR code boxes are completely blank placeholders! Zero verifiable records exist for this product.”');
        break;

      case 'box_bottom_barcode':
        setActiveMeaningfulClue(false);
        setCurrentThought('“Standard placeholder barcode with no manufacturer lookup registry. Purely cosmetic packaging.”');
        break;

      case 'pod_chamber_liquid':
        setActiveMeaningfulClue(false);
        setCurrentThought('“Clear plastic reservoir with light amber liquid. Its ordinary appearance cannot establish what the liquid contains or whether it is safe.”');
        break;

      case 'pod_tip_plug':
        setActiveMeaningfulClue(false);
        setCurrentThought('“Standard silicone hygiene tip. Clean looking, but cosmetic hygiene proves nothing about the liquid inside.”');
        break;

      case 'pod_base_contacts':
        sound.playBlip();
        setActiveMeaningfulClue(true);
        setCurrentThought('“The underside has generic brass contact pins with no laser-etched serial or batch identifier. It’s an unverified refillable cartridge.”');
        break;

      case 'pod_side_scale':
        setActiveMeaningfulClue(false);
        setCurrentThought('“2.0ml fill scale markers printed along the plastic seam. Standard hardware.”');
        break;

      default:
        setActiveMeaningfulClue(false);
        setCurrentThought('“Carefully inspecting the surface... nothing conclusive here.”');
    }
  };

  const handleRecordClueClick = () => {
    sound.playRecordClue();
    import('../../data/gameData').then(({ ALL_DISCOVERABLE_QUOTES }) => {
      const evidenceKey = target === 'box' ? 'item_inspected_box' : 'item_unmarked_foil_pod';
      const evidence = ALL_DISCOVERABLE_QUOTES[evidenceKey] || ALL_DISCOVERABLE_QUOTES['item_inspected_box'];
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
        className="bg-slate-900 border-2 border-amber-400 text-slate-100 rounded-xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl flex flex-col space-y-3 max-h-[95vh] overflow-y-auto"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-display font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  PHYSICAL INSPECTION (2.5D)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {target === 'box' ? `Box View: ${currentBoxAngle.name}` : `Pod View: ${currentPodAngle.name}`}
                </span>
              </div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-100">
                {target === 'box' ? 'Vape Packaging Box' : 'Unboxed Cartridge Pod'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Inspection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Switcher (Box vs Pod) */}
        <div className="flex items-center justify-between bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-display">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sound.playClick();
                setTarget('box');
              }}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                target === 'box'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📦 Outer Box ({boxAngleIndex + 1}/{BOX_ANGLES.length})
            </button>
            <button
              onClick={() => {
                if (!isLidOpen) {
                  sound.playClick();
                  setCurrentThought('“The box is still sealed. I need to break the seal and open the lid before inspecting the pod inside.”');
                  return;
                }
                sound.playClick();
                setTarget('pod');
              }}
              className={`px-3 py-1.5 rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                target === 'pod'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : isLidOpen
                  ? 'text-slate-300 hover:text-white bg-slate-900 border border-slate-700'
                  : 'text-slate-500 opacity-60'
              }`}
            >
              {isLidOpen ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Cartridge Pod ({isLidOpen ? 'Available' : 'Sealed Inside'})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden sm:block pr-2">
            Drag left/right or use &larr; &rarr; keys
          </div>
        </div>

        {/* Main 2.5D Interactive Inspection Canvas */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-700 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing group shadow-inner"
          style={{ perspective: 1000 }}
        >
          {/* Subtle Ambient Radial Lighting for 2.5D Depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.12),transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/60 blur-md rounded-full pointer-events-none" />

          {/* Quick Rotation Buttons on Left and Right Sides */}
          <button
            onClick={handlePrevAngle}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            title="Rotate Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextAngle}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            title="Rotate Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Top Seal / Open Box Interactive Control Overlay on top of canvas */}
          {target === 'box' && (
            <div className="absolute top-2.5 z-20 flex items-center gap-2">
              {!isSealBroken ? (
                <button
                  onClick={() => handleInspectZone('box_tamper_seal')}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/80 rounded text-[11px] font-display font-bold text-amber-300 flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <Lock className="w-3 h-3" />
                  <span>Click to Inspect Seal Sticker</span>
                </button>
              ) : !isLidOpen ? (
                <button
                  onClick={() => handleInspectZone('box_open_lid')}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black rounded text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Open Box Lid</span>
                </button>
              ) : (
                <div className="px-2.5 py-0.5 bg-slate-800/90 border border-slate-700 rounded text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Box Unlocked &bull; Pod Available</span>
                </div>
              )}
            </div>
          )}

          {/* 2.5D ILLUSTRATED OBJECT RENDERER */}
          <AnimatePresence mode="wait">
            {target === 'box' ? (
              /* --- 2.5D BOX VIEWS --- */
              <motion.div
                key={`box_${currentBoxAngle.id}`}
                initial={isReducedMotion ? { opacity: 1, rotateY: 0, scale: 1 } : { opacity: 0, rotateY: 25, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={isReducedMotion ? { opacity: 1, rotateY: 0, scale: 1 } : { opacity: 0, rotateY: -25, scale: 0.95 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="relative w-44 sm:w-52 h-48 sm:h-56 select-none"
              >
                {/* 3D Box Container with layered shadows */}
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-950 border-2 border-amber-400/60 p-3 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Subtle edge highlight for 2.5D sheen */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-200/50 to-transparent pointer-events-none" />
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-200/30 via-transparent to-black pointer-events-none" />

                  {/* Top Seal visual status */}
                  <div className="flex justify-between items-center border-b border-slate-700/80 pb-1 text-[9px] font-mono text-slate-400">
                    <span className="uppercase">MODEL: PEACH-V2</span>
                    <span className={isSealBroken ? 'text-emerald-400' : 'text-amber-400'}>
                      {isSealBroken ? 'SEAL BROKEN' : 'SEAL INTACT'}
                    </span>
                  </div>

                  {/* VIEW 0: FRONT FACE */}
                  {currentBoxAngle.id === 'front' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-1">
                      {/* Interactive Zone 1: Front Artwork */}
                      <button
                        onClick={() => handleInspectZone('box_front_art')}
                        className={`w-full p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer group ${
                          examinedParts.has('box_front_art')
                            ? 'bg-slate-900/60 border-slate-700'
                            : 'bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border-amber-400/80 hover:border-amber-300'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-pink-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                          <span className="text-xl">🍑</span>
                        </div>
                        <span className="text-[11px] font-heading font-black text-amber-200 mt-1 uppercase tracking-wider">
                          PEACH NECTAR V2
                        </span>
                        <span className="text-[9px] text-slate-300 font-mono">
                          {examinedParts.has('box_front_art') ? '✓ Artwork Inspected' : '🔍 Click to Inspect Design'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* VIEW 1: SIDE LEFT PANEL */}
                  {currentBoxAngle.id === 'side_left' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-1">
                      {/* Interactive Zone 2: Flavor Tag */}
                      <button
                        onClick={() => handleInspectZone('box_flavor_tag')}
                        className={`w-full p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          examinedParts.has('box_flavor_tag')
                            ? 'bg-slate-900/60 border-slate-700'
                            : 'bg-amber-950/40 border-amber-400/80 hover:border-amber-300'
                        }`}
                      >
                        <div className="px-2 py-1 bg-amber-400 text-slate-950 rounded text-[10px] font-display font-black uppercase tracking-wider">
                          SWEET PEACH 3%
                        </div>
                        <div className="text-[9px] text-slate-300 mt-1.5 text-center">
                          “Formulated with sweet peach flavorings”
                        </div>
                        <span className="text-[9px] text-amber-300/80 font-mono mt-1">
                          {examinedParts.has('box_flavor_tag') ? '✓ Label Inspected' : '🔍 Click to Inspect Flavour Text'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* VIEW 2: BACK PANEL (MEANINGFUL CLUE) */}
                  {currentBoxAngle.id === 'back' && (
                    <div className="flex-1 flex flex-col justify-center space-y-1.5 py-1">
                      {/* Interactive Zone 3: Missing Batch Panel */}
                      <button
                        onClick={() => handleInspectZone('box_back_blank_panel')}
                        className={`w-full p-2 rounded-lg border flex flex-col items-start transition-all cursor-pointer ${
                          examinedParts.has('box_back_blank_panel')
                            ? 'bg-slate-900/90 border-amber-400 ring-1 ring-amber-400/50'
                            : 'bg-amber-950/50 border-amber-400/80 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full text-[9px] font-mono text-slate-400 border-b border-slate-700 pb-0.5">
                          <span className="font-bold text-amber-300">REGULATORY INFO</span>
                          <span className="text-red-400 font-bold">[BLANK]</span>
                        </div>
                        <div className="text-[9px] text-slate-300 font-mono space-y-0.5 mt-1 w-full text-left">
                          <div>BATCH ID: <span className="text-amber-400/80 font-bold">________________</span></div>
                          <div>MFG LIC: <span className="text-amber-400/80 font-bold">________________</span></div>
                          <div>LAB QR: <span className="text-amber-400/80 font-bold">[EMPTY BOX]</span></div>
                        </div>
                        <span className="text-[8px] text-amber-300 font-mono mt-1 w-full text-center bg-slate-950/80 py-0.5 rounded">
                          {examinedParts.has('box_back_blank_panel') ? '⭐ Significant Clue Found!' : '🔍 Click to Inspect Compliance Serial'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* VIEW 3: SIDE RIGHT PANEL */}
                  {currentBoxAngle.id === 'side_right' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-1">
                      <div className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-slate-700 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-heading font-black text-slate-200 uppercase tracking-widest">
                          SERIES BLEND 02
                        </span>
                        <div className="text-[9px] text-slate-400 text-center mt-1">
                          “Crafted for smooth daily experience”
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 4: BOTTOM PANEL */}
                  {currentBoxAngle.id === 'bottom' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-1">
                      <button
                        onClick={() => handleInspectZone('box_bottom_barcode')}
                        className={`w-full p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          examinedParts.has('box_bottom_barcode')
                            ? 'bg-slate-900/60 border-slate-700'
                            : 'bg-slate-900/90 border-slate-600 hover:border-amber-400'
                        }`}
                      >
                        <div className="font-mono text-[9px] tracking-widest text-slate-400">
                          ||| | |||| | ||| ||
                        </div>
                        <div className="text-[8px] font-mono text-slate-500 mt-0.5">
                          0 12345 67890 5
                        </div>
                        <span className="text-[8px] text-slate-400 font-mono mt-1">
                          {examinedParts.has('box_bottom_barcode') ? '✓ Barcode Checked' : '🔍 Click to Inspect Barcode'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Bottom Angle Indicator Dots */}
                  <div className="flex justify-center items-center gap-1.5 pt-1 border-t border-slate-800">
                    {BOX_ANGLES.map((angle, idx) => (
                      <button
                        key={angle.id}
                        onClick={() => {
                          sound.playClick();
                          setBoxAngleIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          idx === boxAngleIndex
                            ? 'bg-amber-400 scale-125'
                            : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                        title={angle.name}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* --- 2.5D CARTRIDGE POD VIEWS --- */
              <motion.div
                key={`pod_${currentPodAngle.id}`}
                initial={isReducedMotion ? { opacity: 1, rotateY: 0, scale: 1 } : { opacity: 0, rotateY: 25, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={isReducedMotion ? { opacity: 1, rotateY: 0, scale: 1 } : { opacity: 0, rotateY: -25, scale: 0.95 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="relative w-36 sm:w-44 h-48 sm:h-56 select-none"
              >
                {/* 2.5D Pod Chassis */}
                <div className="w-full h-full rounded-t-2xl rounded-b-lg bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border-2 border-cyan-400/60 p-2.5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Mouthpiece Tip Top */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleInspectZone('pod_tip_plug')}
                      className="w-14 h-4 bg-slate-900 border border-slate-600 rounded-t-lg hover:border-cyan-400 transition-colors cursor-pointer flex items-center justify-center"
                      title="Inspect Mouthpiece"
                    >
                      <div className="w-4 h-1 bg-cyan-400/40 rounded-full" />
                    </button>
                  </div>

                  {/* POD VIEW 0: CHAMBER FRONT */}
                  {currentPodAngle.id === 'pod_front' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 py-1">
                      <button
                        onClick={() => handleInspectZone('pod_chamber_liquid')}
                        className={`w-full p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          examinedParts.has('pod_chamber_liquid')
                            ? 'bg-slate-900/60 border-slate-700'
                            : 'bg-amber-500/15 border-cyan-400/80 hover:border-cyan-300'
                        }`}
                      >
                        <div className="w-16 h-12 rounded bg-gradient-to-b from-amber-400/40 via-amber-500/30 to-amber-600/50 border border-amber-300/40 flex items-center justify-center relative overflow-hidden shadow-inner">
                          <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-white/40 blur-[0.5px]" />
                          <span className="text-[9px] font-mono text-amber-200 font-bold">2.0 mL</span>
                        </div>
                        <span className="text-[9px] text-cyan-300 font-mono mt-1">
                          {examinedParts.has('pod_chamber_liquid') ? '✓ Liquid Chamber Checked' : '🔍 Click to Inspect Chamber'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* POD VIEW 1: MOUTHPIECE */}
                  {currentPodAngle.id === 'pod_tip' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 py-1">
                      <button
                        onClick={() => handleInspectZone('pod_tip_plug')}
                        className="w-full p-2.5 rounded-lg bg-slate-900/80 border border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400"
                      >
                        <span className="text-[10px] font-display font-bold text-slate-200">
                          Mouthpiece Hygiene Cap
                        </span>
                        <div className="text-[9px] text-slate-400 mt-1">
                          Standard molded silicone
                        </div>
                      </button>
                    </div>
                  )}

                  {/* POD VIEW 2: BASE CONTACTS (MEANINGFUL CLUE) */}
                  {currentPodAngle.id === 'pod_base' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 py-1">
                      <button
                        onClick={() => handleInspectZone('pod_base_contacts')}
                        className={`w-full p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          examinedParts.has('pod_base_contacts')
                            ? 'bg-slate-900/90 border-cyan-400 ring-1 ring-cyan-400/50'
                            : 'bg-cyan-950/40 border-cyan-400/80 hover:border-cyan-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 py-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-200 shadow" />
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-200 shadow" />
                        </div>
                        <div className="text-[9px] font-mono text-slate-300 text-center mt-1">
                          Unmarked brass contacts &bull; No serial
                        </div>
                        <span className="text-[8px] text-cyan-300 font-mono mt-1 bg-slate-950/80 px-2 py-0.5 rounded">
                          {examinedParts.has('pod_base_contacts') ? '⭐ Significant Clue Found!' : '🔍 Click to Inspect Underside'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* POD VIEW 3: SIDE PROFILE */}
                  {currentPodAngle.id === 'pod_side' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 py-1">
                      <button
                        onClick={() => handleInspectZone('pod_side_scale')}
                        className="w-full p-2 rounded-lg bg-slate-900/80 border border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400"
                      >
                        <span className="text-[10px] font-display font-bold text-slate-200">
                          Plastic Seam & Scale
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          Standard ultrasonic weld
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Bottom Pod Angle Dots */}
                  <div className="flex justify-center items-center gap-1.5 pt-1 border-t border-slate-800">
                    {POD_ANGLES.map((angle, idx) => (
                      <button
                        key={angle.id}
                        onClick={() => {
                          sound.playClick();
                          setPodAngleIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          idx === podAngleIndex
                            ? 'bg-cyan-400 scale-125'
                            : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                        title={angle.name}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Character Thought & Observation Bubble */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-3 shadow-inner">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-amber-400/50 shrink-0 mt-0.5">
            <CharacterIllustration
              characterId="player"
              playerGender={playerProfile.gender}
              expression={activeMeaningfulClue ? 'skeptical' : 'neutral'}
              size="sm"
              className="w-8 h-8"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-black text-amber-400">
                {playerProfile.name}'s Inspection Thought:
              </span>
              {activeMeaningfulClue && (
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
                  KEY OBSERVATION
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

          {/* Active Record Clue Button (illuminates when player examines a meaningful clue) */}
          {activeMeaningfulClue ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRecordClueClick}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-black text-xs uppercase tracking-wider rounded border border-white flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-slate-950" />
              <span>{isAlreadyRecorded ? 'Update Clue in Case File' : 'RECORD CLUE IN CASE FILE'}</span>
            </motion.button>
          ) : (
            <div className="text-[11px] text-slate-400 font-mono italic">
              Explore faces to identify verifiable markings...
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
