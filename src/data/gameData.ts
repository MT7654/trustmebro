import { Character, EvidenceQuote, PinnedClaim, TestimonyStep, GameEnding, EndingType, FinalResponseOption, InvestigationHotspot } from '../types';

export const INITIAL_CHARACTERS: Record<string, Character> = {
  ryan: {
    id: 'ryan',
    name: 'Ryan',
    role: 'The Host',
    avatarColor: 'from-amber-500 to-red-600',
    badge: 'HOLDING THE VAPE',
    currentExpression: 'smiling',
    initialStatement: `"Normal only. Not Kpod. Noah backed it, Alyssa is chill, and my seller is verified. That's three separate confirmations."`,
    statusText: 'Holding the sealed device out while the room waits for your reaction.'
  },
  alyssa: {
    id: 'alyssa',
    name: 'Alyssa',
    role: 'The First-Hand Witness',
    avatarColor: 'from-pink-500 to-purple-600',
    badge: 'TRIED IT 10 MINS AGO',
    currentExpression: 'neutral',
    initialStatement: `"I thought Ryan checked this one himself. Tastes like peach iced tea, see?"`,
    statusText: 'Slouching comfortably on the couch, sipping an iced green tea.'
  },
  noah: {
    id: 'noah',
    name: 'Noah',
    role: 'The Sensible Friend',
    avatarColor: 'from-cyan-500 to-blue-600',
    badge: 'SITTING NEXT TO RYAN',
    currentExpression: 'neutral',
    initialStatement: `"Alyssa checked what was inside, and Ryan knows the seller. It's fine, bro."`,
    statusText: 'Leaning back with arms crossed, nodding along with calm confidence.'
  }
};

export const INITIAL_PINNED_CLAIMS: PinnedClaim[] = [
  {
    id: 'claim_ryan_appearance',
    speakerId: 'ryan',
    speakerName: 'Ryan',
    title: "Gate 1: The Normal Appearance",
    originalText: `Ryan: "The sealed box and ordinary-looking device prove that it's normal."`,
    keyWordOriginal: 'LOOKS NORMAL',
    keyWordCorrected: 'CONTENTS UNKNOWN',
    fullCorrectedText: `Ryan: "The device looks normal, but the CONTENTS ARE COMPLETELY UNKNOWN."`,
    isCorrected: false,
    targetQuoteIds: ['item_inspected_box', 'item_unmarked_foil_pod'],
    targetQuoteId: 'item_inspected_box',
    description: 'Ryan argues that the glossy packaging and standard hardware appearance prove the liquid inside is safe and ordinary.',
    mismatchReplies: {
      quote_alyssa_only_tried: `Ryan shakes his head: "Alyssa took two hits, sure, but look at the packaging! It's factory-sealed and looks totally standard."`,
      quote_ryan_trusted_seller: `Ryan blinks: "What the seller told me is one thing, but look at the physical pod on the table—it looks like any regular vape you buy anywhere!"`,
      item_telegram_chat_log: `Ryan says: "My chat with the seller doesn't change how clean the hardware looks. Look at the box on the table!"`,
      quote_noah_relied_ryan: `Ryan smiles: "Noah's backing is nice, but I'm talking about the hardware in front of us. It looks 100% normal."`,
    },
    breakthroughDialogue: [
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“The box looks commercial, but its seal is sliced and its verification fields are blank. Appearance cannot tell us what is inside.”`
      },
      {
        speaker: 'Noah',
        characterId: 'noah',
        expression: 'alarmed',
        text: `“So looking normal is not the same as being verified?”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'neutral',
        text: `“Exactly. Packaging can be copied. The contents remain unknown, so the safe choice is not to use it.”`
      }
    ]
  },
  {
    id: 'claim_noah_alyssa',
    speakerId: 'noah',
    speakerName: 'Noah',
    title: "Gate 2: Noah's Endorsement of Alyssa",
    originalText: `Noah: "Alyssa checked what was inside."`,
    keyWordOriginal: 'ALYSSA CHECKED',
    keyWordCorrected: 'ALYSSA TRIED',
    fullCorrectedText: `Noah: "Alyssa TRIED what was inside (never inspected it)."` ,
    isCorrected: false,
    targetQuoteIds: ['quote_alyssa_only_tried'],
    targetQuoteId: 'quote_alyssa_only_tried',
    description: 'Noah claims Alyssa verified the chemical contents of the vape before vaping.',
    mismatchReplies: {
      item_inspected_box: `Noah looks at the box: "We already know the box is unmarked, but Alyssa took a hit and said it's peach. How does the box prove she didn't check it?"`,
      item_unmarked_foil_pod: `Noah looks at the pod: "Sure, the cartridge is unlabelled, but Alyssa took a hit. How does the hardware prove she didn't check it?"`,
      quote_ryan_trusted_seller: `Noah frowns: "Wait, I wasn't talking about Ryan or his dealer. I was talking about Alyssa taking a puff right in front of us."`,
      item_telegram_chat_log: `Noah blinks: "I don't know who Ryan messages. I just saw Alyssa take a puff."`,
      quote_noah_relied_ryan: `Noah crosses his arms: "Yeah, I trust Ryan. But I brought up Alyssa checking it, not who I trust. That doesn't disprove what I said about her."`,
    },
    breakthroughDialogue: [
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Noah, Alyssa did not check it. She only tried it after trusting Ryan.”`
      },
      {
        speaker: 'Alyssa',
        characterId: 'alyssa',
        expression: 'worried',
        text: `“I never tested anything. Taking a puff exposed me to it; it did not verify it.”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Feeling fine right away cannot prove safety. Trying is not testing.”`
      }
    ]
  },
  {
    id: 'claim_alyssa_ryan',
    speakerId: 'alyssa',
    speakerName: 'Alyssa',
    title: "Gate 3: Alyssa's Assumption About Ryan",
    originalText: `Alyssa: "I thought Ryan checked this one himself."`,
    keyWordOriginal: 'RYAN CHECKED',
    keyWordCorrected: 'RYAN TRUSTED THE SELLER',
    fullCorrectedText: `Alyssa: "I assumed RYAN TRUSTED THE SELLER, but he checked nothing."`,
    isCorrected: false,
    targetQuoteIds: ['item_telegram_chat_log', 'quote_ryan_trusted_seller'],
    targetQuoteId: 'item_telegram_chat_log',
    description: 'Alyssa assumed Ryan personally verified the pod before offering it around.',
    mismatchReplies: {
      quote_alyssa_only_tried: `Alyssa tilts her head: "Yeah, I know I only tried it. But that's because I assumed Ryan actually inspected the hardware first."`,
      item_inspected_box: `Alyssa looks at the box: "I saw the torn packaging, but I assumed Ryan got it verified from his supplier. Does the box prove Ryan didn't check it?"`,
      item_unmarked_foil_pod: `Alyssa looks at the pod: "I saw the unlabelled plastic, but I assumed Ryan checked it. Does the hardware prove what Ryan did?"`,
      quote_noah_relied_ryan: `Alyssa looks puzzled: "Noah trusting Ryan is sweet, but that doesn't tell me whether Ryan actually checked this cartridge."`,
    },
    breakthroughDialogue: [
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Alyssa, Ryan did not test this device. His only support is the seller's own message.”`
      },
      {
        speaker: 'Ryan',
        characterId: 'ryan',
        expression: 'defensive',
        text: `“I asked, but all I got was reassurance. No test, no independent record.”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“A seller repeating their own claim is not independent verification. Confidence changed hands; evidence never did.”`
      }
    ]
  },
  {
    id: 'claim_ryan_confirmations',
    speakerId: 'ryan',
    speakerName: 'Ryan',
    title: "Final Gate: Ryan's 'Three Confirmations'",
    originalText: `Ryan: "That's three separate confirmations."`,
    keyWordOriginal: 'THREE CHECKS',
    keyWordCorrected: 'ONE CLAIM',
    fullCorrectedText: `Ryan: "ONE CLAIM echoed across three trusting friends."`,
    isCorrected: false,
    targetQuoteIds: ['quote_noah_relied_ryan', 'quote_alyssa_only_tried', 'quote_ryan_trusted_seller', 'item_telegram_chat_log'],
    targetQuoteId: 'quote_noah_relied_ryan',
    description: 'Ryan argues that Noah, Alyssa, and his seller each provided separate proof, equaling three independent verifications of safety.',
    mismatchReplies: {
      item_inspected_box: `Ryan says: "The box being unmarked was already cleared up, but Noah and Alyssa both backed me up. That's still three people!"`,
      item_unmarked_foil_pod: `Ryan waves his hand: "The pod hardware doesn't change that Noah, Alyssa, and my seller all said it's good!"`,
      quote_alyssa_only_tried: `Ryan waves his hand: "So what if Alyssa just tried it? Noah's still chill with it and my seller is verified! That's three separate confirmations, bro!"`,
      quote_ryan_trusted_seller: `Ryan says: "Yeah, I trusted my seller. But Alyssa took two puffs and Noah backed me. That's still three people saying it's fine!"`,
      item_telegram_chat_log: `Ryan frowns: "Sure, that chat is vague, but Noah, Alyssa, and the seller all vouched for it—that's three separate checks!"`,
      quote_noah_relied_ryan: `Ryan shrugs: "Noah's my bro, of course he backs me! But that's still three people in this room saying it's safe!"`
    },
    breakthroughDialogue: [
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Noah relied on you. Alyssa relied on you. You relied on one unknown seller. Three voices collapse into one unverified claim.”`
      },
      {
        speaker: 'Noah',
        characterId: 'noah',
        expression: 'shocked',
        text: `“I only repeated Ryan's confidence. I never added proof of my own.”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'neutral',
        text: `“Nobody here can verify what is inside. We do not need to guess the contents to refuse the risk: don't use it, and help the group step back.”`
      }
    ]
  }
];

export const ALL_DISCOVERABLE_QUOTES: Record<string, EvidenceQuote> = {
  item_inspected_box: {
    id: 'item_inspected_box',
    speakerId: 'player',
    speakerName: 'Physical Box Inspection',
    category: 'physical',
    title: 'Packaging Box (Sealed Aesthetic)',
    thumbnailType: 'box',
    neutralDescription: 'Commercial-style peach packaging box with sliced tamper seal. The regulatory, batch serial number, and laboratory QR panels on the back are completely blank placeholders.',
    quote: '“Glossy commercial peach packaging with a sliced tamper seal. The regulatory compliance and batch serial panels on the reverse side are completely blank, containing zero laboratory test verifications.”',
    context: 'Physical box inspected and examined on Ryan’s coffee table.',
    contradictsClaimId: 'claim_ryan_appearance',
    tag: 'PHYSICAL EVIDENCE (PACKAGING)',
    itemDetails: 'The box features decorative branding but lacks manufacturing license, batch code, or laboratory verification.'
  },
  item_unmarked_foil_pod: {
    id: 'item_unmarked_foil_pod',
    speakerId: 'player',
    speakerName: 'Physical Cartridge Inspection',
    category: 'physical',
    title: 'Unmarked Pod Exterior',
    thumbnailType: 'pod',
    neutralDescription: 'An unmarked pod exterior with no traceable batch or verification marking. Its appearance cannot establish what it contains.',
    quote: '“The pod exterior has no traceable batch or verification marking. Hardware appearance cannot establish its contents or safety.”',
    context: 'Physical cartridge pod inspected on the coffee table.',
    contradictsClaimId: 'claim_ryan_appearance',
    tag: 'PHYSICAL EVIDENCE (HARDWARE)',
    itemDetails: 'The exterior provides no independently verifiable information about the contents.'
  },
  item_telegram_chat_log: {
    id: 'item_telegram_chat_log',
    speakerId: 'ryan',
    speakerName: 'Digital Record',
    category: 'digital',
    title: 'Message Log with UNKNOWN SELLER',
    thumbnailType: 'phone',
    neutralDescription: 'A message thread on Ryan\'s phone. Ryan asked whether this specific device was checked; the unknown seller replied with reassurance but no independent support.',
    quote: '“Ryan asked whether this specific device had been checked. The UNKNOWN SELLER replied: \'Normal only. Same as before. Trust me.\' No independent support was provided.”',
    context: 'Screen examined on Ryan’s phone on the table.',
    contradictsClaimId: 'claim_alyssa_ryan',
    tag: 'DIGITAL RECORD (UNVERIFIED CHAT)',
    itemDetails: 'Ryan asked for safety verification, but received only casual text reassurance without verification documents.'
  },
  quote_alyssa_only_tried: {
    id: 'quote_alyssa_only_tried',
    speakerId: 'alyssa',
    speakerName: 'Alyssa',
    category: 'verbal',
    title: `Alyssa's Witness Account`,
    thumbnailType: 'alyssa',
    neutralDescription: 'Alyssa took two puffs assuming Ryan verified the vape. She confirms she never inspected, tested, or chemically checked the pod contents.',
    quote: `“I didn't check what was inside. I only tried it. Ryan handed it to me, so I assumed it was safe.”`,
    context: `Revealed when questioning Alyssa on whether she inspected the cartridge before taking a puff.`,
    contradictsClaimId: 'claim_noah_alyssa',
    tag: `VERBAL TESTIMONY (CONTRADICTS NOAH)`,
    itemDetails: 'Alyssa equated taking two puffs with verifying safety, relying completely on Ryan.'
  },
  quote_ryan_trusted_seller: {
    id: 'quote_ryan_trusted_seller',
    speakerId: 'ryan',
    speakerName: 'Ryan',
    category: 'verbal',
    title: `Ryan's Source Admission`,
    thumbnailType: 'ryan',
    neutralDescription: 'Ryan admitted he received no test sheet or batch verification from the seller and relied purely on chat reassurance.',
    quote: `“I went by what the seller told me in chat. He showed me nothing verifying this particular vape batch.”`,
    context: `Revealed when asking Ryan on what specific tests or certificates his seller provided.`,
    contradictsClaimId: 'claim_alyssa_ryan',
    tag: `VERBAL TESTIMONY (CONTRADICTS ALYSSA)`,
    itemDetails: 'Ryan admits he checked zero test results and relied solely on an anonymous seller.'
  },
  quote_noah_relied_ryan: {
    id: 'quote_noah_relied_ryan',
    speakerId: 'noah',
    speakerName: 'Noah',
    category: 'verbal',
    title: `Noah's Statement of Reliance`,
    thumbnailType: 'noah',
    neutralDescription: 'Noah does not vape and assumed safety based on friendship and social trust in Ryan, with zero firsthand knowledge.',
    quote: `“I don't vape. I'm backing Ryan because I trust his judgment, not because I know the chemistry.”`,
    context: `Revealed when questioning Noah on whether he has any firsthand knowledge.`,
    contradictsClaimId: '',
    tag: `VERBAL TESTIMONY (RELIANCE LINK)`,
    itemDetails: 'Noah’s calm assurance is borrowed credibility—he is simply echoing his trust in Ryan.'
  },
  quote_telegram_anonymous: {
    id: 'quote_telegram_anonymous',
    speakerId: 'ryan',
    speakerName: 'Ryan',
    category: 'verbal',
    title: `The Unknown Source`,
    thumbnailType: 'ryan',
    neutralDescription: 'Ryan confirmed that the person behind the assurance could not be independently verified.',
    quote: `“I only know the contact as UNKNOWN SELLER. The account gave me reassurance, not evidence.”`,
    context: `Revealed when pressing Ryan on his supplier's true identity and packaging.`,
    contradictsClaimId: '',
    tag: `DEPENDENCY: RYAN → UNKNOWN SELLER`
  }
};

export const INVESTIGATION_HOTSPOTS: InvestigationHotspot[] = [
  {
    id: 'vape_box',
    title: 'Illustrated Packaging Box on Table',
    category: 'physical',
    label: 'Inspect Illustrated Box',
    shortDesc: 'A glossy peach packaging box on the glass table. Inspect its seals, branding, and compliance panel.',
    evidenceId: 'item_inspected_box',
    isInspected: false,
    x: 44,
    y: 74
  },
  {
    id: 'vape_pod',
    title: 'Vape Cartridge Pod on Table',
    category: 'physical',
    label: 'Examine Vape Cartridge',
    shortDesc: 'A sleek translucent peach vape cartridge. Examine the e-liquid reservoir, mouthpiece, and base contacts.',
    evidenceId: 'item_unmarked_foil_pod',
    isInspected: false,
    x: 54,
    y: 72
  },
  {
    id: 'telegram_phone',
    title: 'Ryan’s Phone: Messages with Unknown Seller',
    category: 'digital',
    label: 'Ask Ryan to Show Messages',
    shortDesc: 'Ryan\'s unlocked phone showing a short exchange with an unknown seller.',
    evidenceId: 'item_telegram_chat_log',
    isInspected: false,
    x: 34,
    y: 68
  },
  {
    id: 'talk_noah',
    title: 'Noah (Sitting in Armchair)',
    category: 'verbal',
    label: 'Speak to Noah',
    shortDesc: 'Noah looks calm and supportive. Ask why he believes the pod is safe.',
    evidenceId: 'quote_noah_relied_ryan',
    isInspected: false,
    x: 22,
    y: 38
  },
  {
    id: 'talk_alyssa',
    title: 'Alyssa (On the Sofa)',
    category: 'verbal',
    label: 'Speak to Alyssa',
    shortDesc: 'Alyssa took two puffs 10 minutes ago. Ask if she checked what was inside.',
    evidenceId: 'quote_alyssa_only_tried',
    isInspected: false,
    x: 78,
    y: 38
  },
  {
    id: 'talk_ryan',
    title: 'Ryan (The Host)',
    category: 'verbal',
    label: 'Ask Ryan About Supplier',
    shortDesc: 'Ryan is holding the device out with an easy grin. Ask what verification his seller gave him.',
    evidenceId: 'quote_ryan_trusted_seller',
    isInspected: false,
    x: 50,
    y: 35
  }
];


export const INITIAL_QUOTES: EvidenceQuote[] = [];

export const TESTIMONY_STEPS: Record<string, TestimonyStep> = {
  noah: {
    id: 'testimony_noah',
    characterId: 'noah',
    statement: `“Alyssa checked what was inside, and Ryan knows the seller. If it was sketchy, Ryan wouldn't bring it to the gathering.”`,
    subtext: `Noah looks calm and rational. As the cautious friend, his reassurance gives everyone false comfort.`,
    inquiries: [
      {
        id: 'inq_noah_1',
        label: `“Noah, did you actually see Alyssa test or inspect the vape liquid?”`,
        speakerResponse: `Noah blinks: “Well, she took two hits and laughed! She said 'tastes like peach iced tea'. That sounds checked to me, right? Why would she puff if she didn't know?”`,
        speakerExpression: 'skeptical',
        internalThought: `Noah equated 'taking a puff without dying instantly' with 'checking what was inside'. That's a huge conflation.`,
        tensionChange: 5
      },
      {
        id: 'inq_noah_2',
        label: `“Do you even vape yourself, Noah? How do you know the seller is legit?”`,
        speakerResponse: `Noah shrugs: “Me? Nah bro, I do track, I don't vape. But Ryan's my close bro. I'm backing Ryan because I trust his judgment, not because I know the chemistry.”`,
        speakerExpression: 'neutral',
        internalThought: `CRITICAL ADMISSION! Noah admits: "I don't vape. I'm backing Ryan because I trust his judgment." Noah relied entirely on Ryan!`,
        grantsQuote: ALL_DISCOVERABLE_QUOTES.quote_noah_relied_ryan,
        tensionChange: 10
      },
      {
        id: 'inq_noah_3',
        label: `“Noah, if Alyssa didn't check, who in this room actually verified it?”`,
        speakerResponse: `Noah crosses his arms defensively: “Hey, don't ask me! Ask Alyssa! She's sitting right there on the couch.”`,
        speakerExpression: 'defensive',
        internalThought: `He is pointing directly at Alyssa. Let's press Alyssa for her exact account!`,
        tensionChange: 10
      }
    ]
  },
  alyssa: {
    id: 'testimony_alyssa',
    characterId: 'alyssa',
    statement: `“I thought Ryan checked this one himself. I took two hits 10 minutes ago, tastes like peach iced tea. I'm fine, see?”`,
    subtext: `Alyssa is smiling, but you notice her speech slowing down slightly. She slumps into the armrest.`,
    inquiries: [
      {
        id: 'inq_alyssa_1',
        label: `“Alyssa, did you actually inspect what was inside before you took that puff?”`,
        speakerResponse: `Alyssa looks surprised: “Check what? I didn't check what was inside. I only tried it. Ryan handed it to me, so I assumed it was safe. Why would Ryan hand me something weird?”`,
        speakerExpression: 'worried',
        internalThought: `BINGO! Alyssa explicitly stated: "I didn't check what was inside. I only tried it. Ryan handed it to me, so I assumed it was safe." This completely shatters Noah's claim and proves Alyssa relied on Ryan!`,
        grantsQuote: ALL_DISCOVERABLE_QUOTES.quote_alyssa_only_tried,
        tensionChange: 10
      },
      {
        id: 'inq_alyssa_2',
        label: `“Why did you assume Ryan checked this particular cartridge?”`,
        speakerResponse: `Alyssa says: “Ryan had this confident look on his face. He said 'clean batch, trust me bro'. So I naturally thought he inspected it or knew the manufacturer.”`,
        speakerExpression: 'neutral',
        internalThought: `Alyssa based her decision entirely on Ryan's confident posture, not on any verifiable facts.`,
        tensionChange: 5
      },
      {
        id: 'inq_alyssa_3',
        label: `“Did feeling fine right away prove what was inside?”`,
        speakerResponse: `Alyssa pauses: “No. It only proves I didn't notice anything obvious in that moment. I still never checked what was inside.”`,
        speakerExpression: 'worried',
        internalThought: `Her immediate experience cannot verify the contents or safety of the device.`,
        tensionChange: 5
      }
    ]
  },
  ryan: {
    id: 'testimony_ryan',
    characterId: 'ryan',
    statement: `“Normal only. Not Kpod. Noah backed it, Alyssa is chill, and my seller is verified. That's three separate confirmations!”`,
    subtext: `Ryan is holding the peach pod forward. He genuinely believes he's offering a safe treat, pointing to his friends as living proof.`,
    inquiries: [
      {
        id: 'inq_ryan_1',
        label: `“Ryan, did the seller show you any lab report or verify THIS specific batch?”`,
        speakerResponse: `Ryan frowns, scratching his neck: “Lab report? Bro, who asks for lab reports for vapes? I went by what the seller told me. He showed me nothing verifying this particular vape, but he wrote 'clean grade' in the chat!”`,
        speakerExpression: 'defensive',
        internalThought: `CRITICAL ADMISSION! Ryan admits: "I went by what the seller told me. He showed me nothing verifying this particular vape." That refutes Alyssa's belief that Ryan checked it!`,
        grantsQuote: ALL_DISCOVERABLE_QUOTES.quote_ryan_trusted_seller,
        tensionChange: 15
      },
      {
        id: 'inq_ryan_2',
        label: `“Could you independently verify the person behind that assurance?”`,
        speakerResponse: `Ryan looks away: “No. I only knew the account as UNKNOWN SELLER. I had no independent way to check who was behind it.”`,
        speakerExpression: 'defensive',
        internalThought: `Ryan relied on a source he could not independently verify.`,
        grantsQuote: ALL_DISCOVERABLE_QUOTES.quote_telegram_anonymous,
        tensionChange: 20
      },
      {
        id: 'inq_ryan_3',
        label: `“How can you call this 'three confirmations' when Noah and Alyssa were just following you?”`,
        speakerResponse: `Ryan insists: “Come on, that's three separate confirmations! Noah's cool with it, Alyssa took a puff and is chill, and my seller is verified. That's three separate people!”`,
        speakerExpression: 'skeptical',
        internalThought: `Ryan is conflating three people repeating each other with three independent tests. If we build the dependency map, we can prove it's one single unknown source!`,
        tensionChange: 10
      }
    ]
  }
};

export const FINAL_RESPONSE_OPTIONS: FinalResponseOption[] = [
  {
    id: 'BREAK_THE_CHAIN',
    promptText: '“None of us can verify what is inside. Repeating one seller’s claim does not make it safe. I’m not using it—and we should all step back.”',
    subtext: 'Refuse calmly, expose the single unverified origin, and help the group disengage without attacking Ryan.',
    leadsToTitle: 'Break the Chain'
  },
  {
    id: 'FALSE_CONSENSUS',
    promptText: 'Ask Ryan to check with the same seller again.',
    subtext: 'Seek re-confirmation from the exact unverified source whose credibility is in question.',
    leadsToTitle: 'False Consensus'
  },
  {
    id: 'THE_GUESS',
    promptText: 'Declare that the vape definitely contains drugs.',
    subtext: 'State with absolute certainty that it is laced, despite lack of forensic proof.',
    leadsToTitle: 'The Guess'
  },
  {
    id: 'THE_NEXT_VOICE',
    promptText: 'Accept it because Alyssa appeared fine or because everyone else seems confident.',
    subtext: 'Yield to the room\'s apparent comfort and take a puff since nothing happened to Alyssa.',
    leadsToTitle: 'The Next Voice'
  }
];

export const GAME_ENDINGS: Record<EndingType, GameEnding> = {
  BREAK_THE_CHAIN: {
    type: 'BREAK_THE_CHAIN',
    title: 'BREAK THE CHAIN',
    subtitle: 'You explained that everyone repeated the same seller\'s word, stopping the unverified cycle.',
    badge: 'CHAIN DISMANTLED',
    badgeColor: 'bg-emerald-500 text-black',
    narrativeText: `You keep your voice calm.

“Noah relied on Ryan. Alyssa relied on Ryan. Ryan relied on one anonymous seller. That is not three checks—it is one unverified claim repeated around the room. None of us knows what is inside, and appearance or immediate effects cannot prove safety.”

The room goes quiet. Noah admits he only trusted Ryan. Alyssa slides the device away: “Taking a puff did not verify anything.”

Ryan’s posture softens. “You’re right. I took the message at face value. Let’s put it away.”

The device goes back into Ryan's bag, unused. Its contents remain unknown. You challenged the chain without attacking your friends, and the pressure ends here.`,
    extendedSourceChain: {
      seller: 'Unknown Seller (unverified source)',
      ryan: 'Ryan (Offered pod based on seller text)',
      group: 'Noah & Alyssa (Echoed confidence without checking)',
      player: 'You (Exposed the circular chain with calm logic)',
      nextFriend: 'Chain Interrupted (Pod put away, cycle stopped)'
    },
    educationalDebrief: {
      psychologicalPrinciple: "Dismantling Pluralistic Ignorance & Information Cascades",
      realWorldContext: "Under Singapore law, all vapes are prohibited and unregulated. In black-market supply chains, neither buyers nor street peddlers possess chemical testing capability. What peers call 'clean' is simply unverified assurance.",
      actionableTakeaway: "Separate your friend from the source. By pointing out that three confident voices were actually one unverified stranger, you remove peer pressure without putting your friends on the defensive."
    }
  },

  FALSE_CONSENSUS: {
    type: 'FALSE_CONSENSUS',
    title: 'FALSE CONSENSUS',
    subtitle: 'You tried to verify safety by asking the unverified seller to confirm their own claim.',
    badge: 'CIRCULAR VALIDATION',
    badgeColor: 'bg-orange-500 text-white',
    narrativeText: `You ask Ryan to check with the same unknown seller again.

Another confident reply arrives, but it adds no independent evidence. The group hears repetition as confirmation and relaxes.

The device is still unverified and its contents remain unknown. Re-asking the original source does not create a second check; it only strengthens the same unsupported claim.`,
    extendedSourceChain: {
      seller: 'Unknown Seller (Vouches for their own unverified claim)',
      ryan: 'Ryan (Takes seller\'s repeated text as double proof)',
      group: 'Noah & Alyssa (Relieved by the fake second confirmation)',
      player: 'You (Trapped in circular confirmation bias)',
      nextFriend: 'Reinforced Loop (Group feels falsely bulletproof)'
    },
    educationalDebrief: {
      psychologicalPrinciple: "Confirmation Bias & Conflicted Sources",
      realWorldContext: "Asking an illicit distributor if their illegal product is safe is meaningless. Sellers in unregulated markets face no inspection, licensing, or accountability. Re-asking the source produces repetition, not verification.",
      actionableTakeaway: "Verification must be independent. Asking an unverified source to vouch for itself is just circular trust with extra steps."
    }
  },

  THE_GUESS: {
    type: 'THE_GUESS',
    title: 'THE GUESS',
    subtitle: 'You claimed certainty without proof, giving the group an easy way to dismiss your warning.',
    badge: 'EASY DISMISSAL',
    badgeColor: 'bg-amber-600 text-white',
    narrativeText: `You claim to know exactly what the device contains.

Ryan challenges you to prove it. You cannot—and the room uses that overclaim to dismiss the concern entirely.

You never needed to identify the substance. The accurate message was stronger: nobody can verify what is inside, and appearance or immediate effects cannot establish safety. Uncertainty is already enough reason to refuse.`,
    extendedSourceChain: {
      seller: 'Unknown Seller (unverified source)',
      ryan: 'Ryan (Dismisses your warning as hysteria)',
      group: 'Noah & Alyssa (Point to Alyssa\'s lack of symptoms as proof)',
      player: 'You (Discredited by making an unprovable leap)',
      nextFriend: 'Unresolved Hazard (Group dismisses all future safety cautions)'
    },
    educationalDebrief: {
      psychologicalPrinciple: "Overclaiming & Counter-Evidence Vulnerability",
      realWorldContext: "When an argument relies on an extreme, unverified claim ('it definitely contains drugs'), opponents only need one visible counter-example ('Alyssa looks fine') to discredit your entire warning.",
      actionableTakeaway: "Stick to what is incontrovertibly true: nobody tested it, nobody knows, and illicit supply is inherently unverifiable. You don't need to guess the worst-case scenario to prove the process is unsafe."
    }
  },

  THE_NEXT_VOICE: {
    type: 'THE_NEXT_VOICE',
    title: 'THE NEXT VOICE',
    subtitle: 'You acted against what the evidence told you, then heard your choice become someone else’s reassurance.',
    badge: 'THE UNBROKEN CHAIN',
    badgeColor: 'bg-rose-700 text-white',
    narrativeText: `You look at the sliced seal, the blank verification fields and the chain you just mapped. The doubt is no longer vague. You understand that nobody in the room can verify what is inside.

Then you accept it anyway.

The choice sits badly because it contradicts your own judgment. Later, another friend says, “But you tried one and said it seemed fine.” Your private compromise has become public reassurance.

You correct the record: “I shouldn’t have called it fine. I still don’t know what was inside. Don’t use what happened to me as proof.” The contents remain unknown; the responsibility is to stop passing uncertainty forward.`,
    extendedSourceChain: {
      seller: 'Unknown Seller (unverified source)',
      ryan: 'Ryan (Offered pod based on text message)',
      group: 'Noah & Alyssa (Echoed confidence without checking)',
      player: 'You (Acted against the evidence, then corrected the record)',
      nextFriend: 'A later friend hears your repair: experience is not proof'
    },
    educationalDebrief: {
      psychologicalPrinciple: "Social Contagion & The Reassurance Trap",
      realWorldContext: "Surviving an unregulated encounter does not prove safety. But peers routinely interpret 'my friend tried it and was fine' as scientific endorsement, perpetuating the illusion of safety down an endless chain.",
      actionableTakeaway: "If you have ever called an unknown device 'fine', repair the message directly: you still do not know what was inside, and your experience must not be used as proof."
    }
  }
};
