import { Character, EvidenceQuote, PinnedClaim, TestimonyStep, GameEnding, EndingType, FinalResponseOption, InvestigationHotspot } from '../types';

export const INITIAL_CHARACTERS: Record<string, Character> = {
  ryan: {
    id: 'ryan',
    name: 'Ryan',
    role: 'The Host & Supplier',
    avatarColor: 'from-amber-500 to-red-600',
    badge: 'HOLDING THE VAPE',
    currentExpression: 'smiling',
    initialStatement: `"Normal only. Not Kpod. Noah backed it, Alyssa is chill, and my seller is verified. That's three separate confirmations."`,
    statusText: 'Holding out a sleek pastel peach vape pod towards you with an easy grin.'
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
      card_one_origin_three_voices: `Ryan scratches his head: "That source map is about who talked to whom, but how does that address whether the physical vape looks legit?"`
    },
    breakthroughDialogue: [
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Hold on, Ryan! You're pointing to the glossy box and sleek plastic pod, saying it 'looks normal'. But look at what physical inspection actually revealed!”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“The tamper seal was already sliced, the compliance serial box is completely blank, and there is zero laboratory batch verification on the cartridge!”`
      },
      {
        speaker: 'Noah',
        characterId: 'noah',
        expression: 'alarmed',
        text: `“Wait... so anyone could buy generic empty cartridges and fill them with unverified liquids?”`
      },
      {
        speaker: 'Ryan',
        characterId: 'ryan',
        expression: 'shocked',
        text: `“Whoa... I honestly just thought because the box had pretty pastel printing and plastic foil, it was a real factory brand. I never checked the batch serial panel...”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'neutral',
        text: `“Exactly. Standard hardware appearance tells us nothing about the chemical liquid inside. The contents remain completely unknown.”`
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
      item_telegram_chat_log: `Noah blinks: "Telegram? Bro, I don't know what app Ryan uses. I just saw Alyssa puff it."`,
      quote_noah_relied_ryan: `Noah crosses his arms: "Yeah, I trust Ryan. But I brought up Alyssa checking it, not who I trust. That doesn't disprove what I said about her."`,
      card_one_origin_three_voices: `Noah scratches his head: "That map makes sense for the whole room, but it doesn't address what I said about Alyssa checking it."`
    },
    breakthroughDialogue: [
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Hold on, Noah! You just told us Alyssa 'checked what was inside.' But look at what Alyssa actually said!”`
      },
      {
        speaker: 'Alyssa',
        characterId: 'alyssa',
        expression: 'worried',
        text: `“Wait... Noah, why did you say I checked it? I didn't test the liquid! Ryan handed it to me and said it was sweet peach, so I just took two puffs!”`
      },
      {
        speaker: 'Noah',
        characterId: 'noah',
        expression: 'shocked',
        text: `“Wait, you didn't check?! I thought because you took a hit and said 'it's fine', you actually knew what was in the cartridge!”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“See? Alyssa never 'checked' the chemical contents. She only TRIED it because she assumed Ryan verified it!”`
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
      card_one_origin_three_voices: `Alyssa murmurs: "The map shows the whole room, but I want to know what Ryan actually inspected himself."`
    },
    breakthroughDialogue: [
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Alyssa, you said you felt safe because you thought Ryan checked this pod himself. But look at Ryan's direct messages with the seller!”`
      },
      {
        speaker: 'Ryan',
        characterId: 'ryan',
        expression: 'defensive',
        text: `“Look, guys... I asked him if the batch was tested, and he just texted back: '100% normal bro trust me'. He showed me no lab test or chemical sheet at all!”`
      },
      {
        speaker: 'Alyssa',
        characterId: 'alyssa',
        expression: 'shocked',
        text: `“Wait... Ryan?! You didn't check anything at all?! You just took a text message from a stranger on Telegram?!”`
      },
      {
        speaker: 'Noah',
        characterId: 'noah',
        expression: 'alarmed',
        text: `“Hold on... so Alyssa trusted Ryan, and Ryan only trusted what an unknown seller typed in a chat?!”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Exactly. Alyssa didn't verify anything because she trusted Ryan. And Ryan verified nothing because he trusted the seller!”`
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
    targetQuoteIds: ['card_one_origin_three_voices'],
    targetQuoteId: 'card_one_origin_three_voices',
    description: 'Ryan argues that Noah, Alyssa, and his seller each provided separate proof, equaling three independent verifications of safety.',
    mismatchReplies: {
      item_inspected_box: `Ryan says: "The box being unmarked was already cleared up, but Noah and Alyssa both backed me up. That's still three people!"`,
      item_unmarked_foil_pod: `Ryan waves his hand: "The pod hardware doesn't change that Noah, Alyssa, and my seller all said it's good!"`,
      quote_alyssa_only_tried: `Ryan waves his hand: "So what if Alyssa just tried it? Noah's still chill with it and my seller is verified! That's three separate confirmations, bro!"`,
      quote_ryan_trusted_seller: `Ryan says: "Yeah, I trusted my seller. But Alyssa took two puffs and Noah backed me. That's still three people saying it's fine!"`,
      item_telegram_chat_log: `Ryan frowns: "Sure, Telegram chat, but Noah, Alyssa, and my guy all vouch for it—that's three separate checks!"`,
      quote_noah_relied_ryan: `Ryan shrugs: "Noah's my bro, of course he backs me! But that's still three people in this room saying it's safe!"`
    },
    breakthroughDialogue: [
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Ryan, you keep arguing: 'That's three separate confirmations.' But look at the completed source map!”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'skeptical',
        text: `“Noah relied on you. Alyssa relied on you. And you relied on an unknown seller on Telegram. THREE CHECKS collapse into ONE UNKNOWN CLAIM!”`
      },
      {
        speaker: 'Noah',
        characterId: 'noah',
        expression: 'shocked',
        text: `“Wait... he's totally right! I only backed it because I trusted Ryan. Alyssa only tried it because she trusted Ryan. None of us added a single piece of independent proof!”`
      },
      {
        speaker: 'Alyssa',
        characterId: 'alyssa',
        expression: 'worried',
        text: `“And Ryan only trusted a stranger's chat message! That's not three separate confirmations... that's just Ryan passing along what an unknown seller told him!”`
      },
      {
        speaker: 'Ryan',
        characterId: 'ryan',
        expression: 'defensive',
        text: `“Wait... guys, don't look at me like that! I wasn't trying to trick anyone! I swear I thought I was bringing something chill for all of us. I didn't think about it like that... I thought 'my guy' was legit...”`
      },
      {
        speaker: 'Player',
        characterId: 'player',
        expression: 'neutral',
        text: `“We're not saying you meant any harm, Ryan. And we don't know what's in that vape liquid—it could be harmless peach flavor, or it could be tainted black-market chemicals. But the truth is: NOBODY in this room actually knows.”`
      },
      {
        speaker: 'Ryan',
        characterId: 'ryan',
        expression: 'alarmed',
        text: `“...Man. When you lay it out like that... none of us has any clue what's inside this thing.”`
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
    title: 'Translucent Cartridge Vape',
    thumbnailType: 'pod',
    neutralDescription: 'Translucent plastic cartridge filled with amber e-liquid and unmarked brass contacts. Clean appearance with zero chemical batch etching or concentration disclosure.',
    quote: '“Translucent plastic vape cartridge filled with amber liquid and standard brass coil contacts. Standard hardware appearance with zero chemical or batch serial markings.”',
    context: 'Physical cartridge pod inspected on the coffee table.',
    contradictsClaimId: 'claim_ryan_appearance',
    tag: 'PHYSICAL EVIDENCE (HARDWARE)',
    itemDetails: 'Clean consumer appearance that reveals no information about the chemical composition of the e-liquid.'
  },
  item_telegram_chat_log: {
    id: 'item_telegram_chat_log',
    speakerId: 'ryan',
    speakerName: 'Digital Record',
    category: 'digital',
    title: 'Chat Log with UNKNOWN SELLER',
    thumbnailType: 'phone',
    neutralDescription: 'Direct messaging thread on Ryan\'s phone. Ryan asked if this batch had test sheets; the anonymous seller replied \'100% normal bro trust me\' with zero documentation.',
    quote: '“Message history: Ryan asked if this specific vape batch was verified. The UNKNOWN SELLER replied: \'100% normal bro trust me\' with zero test sheets or lab certificates provided.”',
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
    title: `The Anonymous Contact`,
    thumbnailType: 'ryan',
    neutralDescription: 'Ryan confirmed the supplier is an anonymous Telegram handle with zero verifiable business identity.',
    quote: `“Just an unverified account labelled UNKNOWN SELLER. Anyone can write 'clean grade' in a bio without testing anything.”`,
    context: `Revealed when pressing Ryan on his supplier's true identity and packaging.`,
    contradictsClaimId: '',
    tag: `DEPENDENCY: RYAN → UNKNOWN SELLER`
  },
  quote_alyssa_onset_chill: {
    id: 'quote_alyssa_onset_chill',
    speakerId: 'alyssa',
    speakerName: 'Alyssa',
    category: 'verbal',
    title: `Alyssa's Physical Sensation`,
    thumbnailType: 'alyssa',
    neutralDescription: 'Alyssa noticed heavy eyelids and tingling fingers 10 minutes after inhalation, demonstrating latency.',
    quote: `“Wait... my head feels super heavy and my fingers are tingling. I don't feel normal anymore.”`,
    context: `Revealed when pressing Alyssa on whether she feels 100% fine 10 minutes in.`,
    contradictsClaimId: '',
    tag: `LATENCY SYMPTOMS`
  },
  card_one_origin_three_voices: {
    id: 'card_one_origin_three_voices',
    speakerId: 'player',
    speakerName: 'Source Map',
    category: 'source_map',
    title: '“One origin, three voices”',
    thumbnailType: 'source_map',
    neutralDescription: 'Completed dependency map proving that Noah and Alyssa relied on Ryan, who relied on the unknown seller. Three apparently separate confirmations collapse into a single unverified source.',
    quote: 'Unknown seller → Ryan → Alyssa and Noah: Three apparently independent voices collapse back into a single unverified source.',
    context: 'Completed dependency map proving that all three friends were relying on an anonymous contact.',
    contradictsClaimId: 'claim_ryan_confirmations',
    tag: 'CASE CARD (STRUCTURAL MAP)',
    itemDetails: 'The structural proof that three apparent confirmations are really just one unverified claim echoed around the room.'
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
    shortDesc: 'Ryan\'s unlocked phone showing direct chat history with the unverified seller @VaporKush_SG.',
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
        label: `“Are you sure you're feeling completely fine? Your eyelids look heavy.”`,
        speakerResponse: `Alyssa blinks slowly, rubbing her temples: “Wait... actually, my head feels super heavy and my fingers are tingling. I don't feel normal anymore... is it hot in here?”`,
        speakerExpression: 'zoned_out',
        internalThought: `Inhaled synthetic sedatives like etomidate have a 5 to 15 minute onset window. Her symptoms are just starting.`,
        grantsQuote: ALL_DISCOVERABLE_QUOTES.quote_alyssa_onset_chill,
        tensionChange: 15
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
        label: `“Who is 'your guy' in real life, Ryan? Where did you meet him?”`,
        speakerResponse: `Ryan looks away: “Ai ya... Telegram contact la. Just an account called @VaporKush_SG on Telegram. Dropped in a ziplock behind a riser. Anyone can write 'clean grade' in a bio, I guess...”`,
        speakerExpression: 'defensive',
        internalThought: `An anonymous Telegram dead-drop behind an HDB stairwell! Ryan relied on an unknown seller!`,
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
    promptText: 'Explain that everyone repeated the same seller\'s word and nobody can verify what is inside.',
    subtext: 'Calmly reveal the single unverified origin without attacking anyone in the room.',
    leadsToTitle: 'Break the Chain'
  },
  {
    id: 'RIGHT_BUT_ALONE',
    promptText: 'Make the same argument after personally attacking Ryan.',
    subtext: 'Accuse Ryan of being reckless and irresponsible for trusting an anonymous dealer.',
    leadsToTitle: 'Right, but Alone'
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
    badge: 'CHAIN DISMANTLED (S-RANK)',
    badgeColor: 'bg-emerald-500 text-black',
    grade: 'S',
    narrativeText: `You address the living room calmly and clearly:

“Guys, think about how this confidence was built in this room. Noah relied on Ryan. Alyssa relied on Ryan. And Ryan relied on an anonymous seller on Telegram. That’s three people repeating one unverified claim from a stranger.

Nobody in this room knows what is actually inside that pod—whether it’s standard illicit liquid or an adulterated batch. None of us has the equipment or lab testing to verify it. We are mistaking our friendship with Ryan for quality assurance on a stranger's black-market product.”

Silence settles across the coffee table.

Noah looks at the vape, then at Alyssa: “...He’s right. I didn’t test anything. I just assumed because Ryan brought it, someone had verified it.”

Alyssa nods slowly, sliding the pod away across the glass table: “Yeah. The fact that I took a puff and didn't collapse doesn't prove it's clean either. It’s not worth gambling on.”

Ryan sits quietly for a moment, looking at his friends. The defensiveness leaves his posture:
“...You're right. I took the seller's text at face value because he was friendly. That was dumb of me. Let’s put this away.”

The pod goes back into Ryan's bag, unconsumed. The contents remain unresolved—whether standard liquid or synthetic additives, it doesn't matter. You dissolved the false consensus without attacking anyone, and the chain stopped right here.`,
    extendedSourceChain: {
      seller: 'Unknown Telegram Seller (@VaporKush_SG)',
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

  RIGHT_BUT_ALONE: {
    type: 'RIGHT_BUT_ALONE',
    title: 'RIGHT, BUT ALONE',
    subtitle: 'You made the correct argument, but attacked Ryan personally and polarized the room.',
    badge: 'DEFENSIVE BACKLASH (C-RANK)',
    badgeColor: 'bg-amber-500 text-black',
    grade: 'C',
    narrativeText: `You identify the unverified seller, but you direct your frustration squarely at Ryan:

“Are you an idiot, Ryan? You bought sketchy crap from some shady Telegram dealer and brought it here to push onto your friends! What kind of reckless criminal are you trying to be?!”

Ryan’s face turns bright red with humiliated fury:
“Poison you?! Bro, I paid for this out of my own pocket to share on a chill weekend, and you’re calling me a criminal dealer in front of everyone?! You think I want to hurt my own friends?!”

Noah steps up, physically placing himself between you and Ryan:
“Bro, chill out. You don’t have to insult him like that. If you don’t want it, just say no. Why are you acting like a self-righteous cop?”

Alyssa folds her arms, turning away from you:
“Yeah, Ryan was just trying to be nice. There’s no need to be toxic.”

Even though your underlying logic about the anonymous seller was completely correct, your aggressive delivery backed Ryan into an ego trap. To save face in front of the group, Ryan picks up the vape and defiantly takes another hit.

You were right about the chain, but your attack forced the group to defend Ryan, leaving them at risk.`,
    extendedSourceChain: {
      seller: 'Unknown Telegram Seller (@VaporKush_SG)',
      ryan: 'Ryan (Defensively doubling down to save face)',
      group: 'Noah & Alyssa (Siding with Ryan against your hostility)',
      player: 'You (Alienated despite accurate logic)',
      nextFriend: 'Risk Escalated (Group continues vaping out of defiance)'
    },
    educationalDebrief: {
      psychologicalPrinciple: "Psychological Reactance & Ego Threat",
      realWorldContext: "When people feel morally attacked or belittled in front of peers, their threat response shifts from the physical hazard to their social dignity. Accusations force peers to defend the person rather than evaluate the risk.",
      actionableTakeaway: "Attack the lack of verification, never the friend. When you attack a friend's character, the group rallies around them to protect their feelings, reinforcing the very behavior you wanted to stop."
    }
  },

  FALSE_CONSENSUS: {
    type: 'FALSE_CONSENSUS',
    title: 'FALSE CONSENSUS',
    subtitle: 'You tried to verify safety by asking the unverified seller to confirm their own claim.',
    badge: 'CIRCULAR VALIDATION (D-RANK)',
    badgeColor: 'bg-orange-500 text-white',
    grade: 'D',
    narrativeText: `You hesitate and say to Ryan:
“Can you message that Telegram seller right now and ask him if he can guarantee this batch is clean?”

Ryan pulls out his phone: “Easy bro, I’ll text him right now.”

Thirty seconds later, Ryan turns his screen around, showing a response from @VaporKush_SG:
“Bro 100% authentic peach flavour, fresh import, zero funny stuff. Super clean boss, trust me.”

Ryan grins triumphantly: “See? I literally just double-checked with him directly. He confirmed it. What else do you need?”

Noah nods in relief: “Nice, thanks for checking, Ryan. That settles it.”
Alyssa smiles: “See? Totally fine.”

By asking the unknown seller to verify his own product, you sought reassurance from the exact party with the strongest financial motive to lie. An anonymous black-market peddler has zero legal accountability and will never say 'actually, this batch might be contaminated.'

Instead of breaking the illusion, you gave the group a false sense of security that reinforced the loop.`,
    extendedSourceChain: {
      seller: 'Unknown Telegram Seller (Vouches for himself to protect profits)',
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
    badge: 'EASY DISMISSAL (C-RANK)',
    badgeColor: 'bg-amber-600 text-white',
    grade: 'C',
    narrativeText: `Instead of focusing on the fact that nobody knows what's inside, you make an unproven assertion:

“This definitely has drugs in it! I know for a fact this is laced with Kpod space oil or synthetic ketamine!”

Ryan stares at you in disbelief, then laughs:
“Bro, what on earth are you talking about? Are you hallucinating? Alyssa literally took two puffs ten minutes ago and she’s sitting right there laughing at cat videos. Where are the drugs?!”

Noah shakes his head:
“Dude, you're being completely paranoid. If it had horse tranquilizers or whatever crazy thing you're imagining, Alyssa would be passed out on the floor. You're just making wild guesses.”

Alyssa giggles:
“Yeah, I just taste sweet peach. You're overthinking it, bro.”

By claiming certainty on something you couldn't prove, you handed them an easy counter-argument. Because Alyssa didn't immediately show extreme symptoms, the group used her current state to 'disprove' your claim and dismiss you entirely.

The real hazard—that illicit vapes have zero quality standards and unpredictable chemical contents—was lost beneath your ungrounded speculation.`,
    extendedSourceChain: {
      seller: 'Unknown Telegram Seller (@VaporKush_SG)',
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
    subtitle: 'You yielded to apparent confidence. Your survival became the next reassurance in the chain.',
    badge: 'THE UNBROKEN CHAIN (F-GRADE)',
    badgeColor: 'bg-rose-700 text-white',
    grade: 'F',
    narrativeText: `You look at Noah’s calm expression, Ryan’s easy smile, and Alyssa relaxing on the sofa.

“Well... Alyssa seems completely fine, and everyone else is sure. I guess one puff won’t hurt.”

You take the device from Ryan and inhale. The vapor is warm, tasting heavily of artificial peach and sweetener. You sit waiting for something bad to happen, your heart racing for a few minutes.

Nothing obvious happens before the night ends.

The gathering continues casually. You split some pizza, watch videos, and pack up around midnight feeling slightly fatigued. The contents of that pod remain completely unresolved—whether ordinary illicit juice, diluted nicotine, or variable additives, you will never know.

---

Two weeks later, you are at Leo’s apartment with Chloe. Chloe pulls out a different unbranded cartridge purchased from a Telegram channel.

Leo hesitates, looking nervous: “Wait... is that thing actually safe? I’ve heard weird stuff about black-market pods lately.”

Chloe glances at you:
“Hey, didn't you try Ryan’s peach pod the other weekend? You were totally fine, right?”

All eyes turn to you. You shrug and reply:
“Yeah... I tried it. It was fine.”

Leo relaxes his shoulders: “Oh, okay. If you tried it and were fine, then pass it over.”

You didn't verify anything. You didn't know what was in Ryan's pod, and you know even less about Chloe's. But your simple survival just became the next link of unearned reassurance, passing the blind gamble forward to another friend.`,
    extendedSourceChain: {
      seller: 'Unknown Telegram Seller (@VaporKush_SG)',
      ryan: 'Ryan (Offered pod based on text message)',
      group: 'Noah & Alyssa (Echoed confidence without checking)',
      player: 'You (Inhaled because "Alyssa seemed fine")',
      nextFriend: 'Leo & Chloe (Relied on your survival as proof of safety)'
    },
    educationalDebrief: {
      psychologicalPrinciple: "Social Contagion & The Reassurance Trap",
      realWorldContext: "Surviving an unregulated encounter does not prove safety. But peers routinely interpret 'my friend tried it and was fine' as scientific endorsement, perpetuating the illusion of safety down an endless chain.",
      actionableTakeaway: "'I was fine' is not verification. When you rely on casual survival as proof of safety, you unwittingly become the next voice endorsing a blind gamble for someone else."
    }
  }
};
