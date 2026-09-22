# Trust Me Bro — UI Improvement Backlog

This document is the running source of truth for the post-competition improvement pass. New findings can be appended prompt by prompt before implementation begins.

## Status

- Implemented locally on 22 September 2026; intentionally not committed or pushed pending owner review.
- Automated verification: TypeScript check, six unit tests, and production build pass. Browser/route and audio-listening checks remain for owner review.
- Implemented scope includes viewport composition, wide evidence workspace, sequential inquiry continuity, gated manual source synthesis, interactive practice tutorials with skip controls and AHA payoffs, four outcomes with one reconsideration, staged debrief, original environment/evidence art, and separate local music control.
- Follow-up Issue Sets 08–10 are newly planned from local owner testing and are not yet implemented.
- Issue Set 11 inventories the remaining art-pack and evidence-visual work; it is also planned and not yet implemented.
- Repository was not pulled after this backlog became the intentional untracked working document; no user work was discarded or overwritten.
- Product and safety constraints remain governed by `TRUST_ME_BRO_CODEX_VETTING_SPEC.md`.

## Experience target

The desktop game should behave like a staged visual-novel interface rather than a long webpage:

- The active scene or overlay fits within the visible browser viewport at 1440×900, 1366×768, and 1280×720.
- The page behind an open overlay does not scroll.
- Each overlay has at most one intentional content scroll region.
- The main action and close control remain visible without resizing the browser.
- Evidence is identifiable from its image, title, type, and concise observation before it is selected.
- Compact laptop layouts reduce decorative spacing before reducing readable text or useful art.

---

## Issue Set 01 — Viewport fit, nested scrolling, and evidence selection

### Screenshots reviewed

1. `Screenshot 2026-09-22 002355.png` — Character inquiry requires page/modal scrolling to reach all questions and actions.
2. `Screenshot 2026-09-22 002746.png` — Breakthrough dialogue contains a narrow nested scrollbar despite ample horizontal space.
3. `Screenshot 2026-09-22 002707.png` — Case file is too narrow and vertically crowded; evidence identity and selection are obscured.
4. `Screenshot 2026-09-22 003038.png` — Outcome/debrief uses a long document-like vertical flow with both clipped character art and scrolling.

### What is happening in the current code

- The base game uses `min-h-screen`, so scene content can grow beyond the viewport and produce document scrolling.
- Several overlays independently use `max-h` plus `overflow-y-auto`; some also contain a second scrollable child.
- `CharacterQuestionModal` puts the entire modal in a `max-h-[95vh] overflow-y-auto` container instead of preserving its header and actions and scrolling only the variable question list.
- `EvidenceDrawer` is capped at `max-w-2xl` (about 672 px), even on a desktop viewport. Its header, tabs, filters, full pinned-claim card, evidence cards, feedback, and action bar all compete for the same narrow column.
- `BreakthroughModal` is viewport-bound, but its dialogue panel still uses `overflow-y-auto`, creating a scrollbar inside the cinematic scene.
- `EndingModal` combines an outer scrollable overlay with an inner `max-h-[68vh] overflow-y-auto` narrative region. This produces a long report-like experience and risks nested scroll behaviour.
- Tall fixed art and generous padding do not adapt enough to compact-height desktop viewports.

### Design decision

Do not solve this by globally shrinking the interface. Introduce a shared viewport-fit pattern and recompose the affected screens around horizontal desktop space.

For overlays, use this structure:

1. Fixed viewport backdrop using dynamic viewport units.
2. Bounded shell (`height` or `max-height` derived from `100dvh`) with `min-height: 0`.
3. Fixed/compact header.
4. Exactly one flexible content region with `min-height: 0`.
5. Fixed action footer when an action is required.
6. Body-scroll lock while the overlay is open.

### Prioritised implementation plan

#### P0 — Establish the viewport contract

1. Add reusable overlay/shell layout utilities or a small shared component rather than repeating fragile height and overflow combinations.
2. Lock background document scrolling while any full-screen modal or drawer is open.
3. Use `100dvh` with a safe fallback and ensure all flex ancestors that contain scroll regions have `min-height: 0`.
4. Define a compact-height desktop breakpoint (for example, heights at or below 768 px) that reduces padding, gaps, and nonessential decoration while retaining readable body text and minimum button targets.
5. Audit the main investigation and cross-examination shells so normal play does not require page scrolling at the target desktop sizes. Preserve intentional scrolling only for variable lists or debrief detail.

#### P1 — Replace the narrow evidence drawer with a case-file workspace

1. Expand the case file to approximately 88–92% of the viewport width on desktop, capped to a sensible large-screen maximum. On compact widths it can become full-screen.
2. Recompose it as a two-column workspace:
   - Left/primary area: a two-column evidence grid or compact evidence list with clear thumbnails, title, evidence type, and one-line observation.
   - Right/context rail: the pinned claim, premise being challenged, attempts/room state, selected-evidence preview, and presentation readiness.
3. Keep the pinned claim visible throughout selection, satisfying the evidence-gate requirement without repeating a large banner above every item.
4. Make the selected item unmistakable through border, background, check state, and a larger preview in the context rail.
5. Keep the `Present Evidence` action persistently visible in the footer or context rail. It must not cover evidence or require scrolling to reach.
6. Collapse filters into a compact row and remove explanatory duplication that consumes vertical space.
7. Preserve the current tabs, category filters, source-map access, attempts, mismatch feedback, already-presented states, tutorial targeting, keyboard focus, and explicit select-then-present interaction.
8. On 1280×720, target at least two fully legible evidence choices in view at once; scrolling should occur only inside the evidence results region.

#### P1 — Recompose character inquiry for compact-height desktops

1. Keep the header and bottom actions fixed within the modal.
2. Use a desktop two-column composition: character/response on the left and questions/reflection on the right.
3. Let only the question list scroll when its content genuinely exceeds the available height.
4. Scale or crop the character art responsively at compact heights rather than pushing controls below the fold.
5. Keep `Record Testimony` visible as soon as a relevant answer is found.
6. Retain mouse, keyboard, and touch-friendly targets plus the existing reduced-motion behaviour.

#### P1 — Remove the scrollbar from breakthrough scenes

1. Preserve the existing breakthrough timing, framing, audio, and yellow contradiction treatment.
2. Make the premise revision band more compact at short heights.
3. Fit the current character and dialogue beat without an internal scrollbar by using responsive portrait sizing, cinematic cropping, and a tighter dialogue composition.
4. Keep `Continue Dialogue` / `Return to Room` pinned and visible.
5. For the final source-collapse gate, use horizontal space for the three-to-one diagram instead of stacking height.
6. Provide an emergency overflow fallback for unusually small viewports, but it should not activate at the three target desktop sizes.

#### P2 — Turn the ending into a staged debrief rather than a long report

1. Separate the immediate outcome beat from the detailed educational debrief.
2. First view: outcome title, group reaction art, concise consequence, and one clear `Continue to Debrief` action—all visible without scrolling.
3. Second view: compact reasoning summary organised around `Observed`, `Assumed`, `Source`, and `What to do`, with retry/restart actions fixed and visible.
4. Keep optional detailed source-chain material available through progressive disclosure rather than placing every section in one vertical document.
5. Preserve all five outcomes, personalised copy, copy-notes action, retry-another-response behaviour, and clean restart.

#### P2 — Main scene height budget

1. Reduce persistent chrome in active play, especially the two-tier navbar and tutorial block, when viewport height is tight.
2. Consider merging the micro case bar into the main navigation or hiding nonessential descriptors at compact heights.
3. Give the room/stage and dialogue layer an explicit shared height budget so they fit together rather than independently adding fixed heights.
4. Avoid page-level scrolling during investigation and cross-examination; if content varies, assign scrolling to the relevant local list only.

### Proposed implementation sequence

1. Shared viewport shell and background-scroll lock.
2. Evidence workspace redesign, because it is the largest interaction blocker.
3. Character inquiry reflow.
4. Breakthrough compact-height reflow.
5. Outcome/debrief staging.
6. Main investigation/cross-examination height-budget cleanup.
7. Regression tests and manual viewport verification.

### Acceptance checks for Issue Set 01

- At 1440×900, 1366×768, and 1280×720, no required action is below the browser viewport.
- Opening an overlay does not leave the page behind it scrollable.
- No affected screen shows both an outer scrollbar and an inner scrollbar.
- Character inquiry exposes all required controls without scrolling the entire modal.
- Breakthrough scenes show the full active dialogue and progression action without an internal scrollbar at target desktop sizes.
- The case file occupies enough width for evidence to be understood before selection.
- The pinned claim remains visible while browsing evidence.
- The selected evidence is visually obvious and the present action remains visible.
- The four outcome families, evidence requirements, attempts, retries, source-map behaviour, tutorial sequence, and reset logic remain unchanged.
- Keyboard focus is visible and logical; Escape/close behaviour is consistent where currently supported.
- Reduced motion and mute remain intact.
- No safety or narrative invariant is changed.

### Planned verification after implementation

- `npm run lint`
- `npm test`
- `npm run build`
- Manual desktop route checks at 1440×900, 1366×768, and 1280×720 for:
  - Character inquiry and clue recording.
  - Case-file selection and presentation for at least the tutorial gate and final gate.
  - Breakthrough continuation at a normal gate and the final source-collapse gate.
  - At least one ending, debrief, alternate final response, and full restart.
- Keyboard-only check of the affected interactions.
- Reduced-motion check of the affected overlays.

---

## Issue Set 02 — Require complete testimony before identifying the case-file clue

### Screenshot reviewed

- `Screenshot 2026-09-22 002355.png` — The current character inquiry exposes all questions simultaneously and immediately allows the key response to be recorded.

### Player-visible problem

The current interaction rewards finding the visibly useful question rather than comparing the character's full account. A player can select the decisive option first, record the clue, trigger the AHA transition, and leave without considering the other statements. This weakens the central value proposition: thinking through each claim and deciding what does and does not support it.

The inquiry also has no continuity. Closing and reopening a character resets the selected question, expression, response, reflection, and recordable clue state to the beginning.

### Confirmed current behaviour in code

- `CharacterQuestionModal` renders all three question buttons at once.
- Selecting a question immediately reveals that response and, when `targetQuoteId` is present, enables `Record Testimony in Case File`.
- `InvestigationSegment.handleRecordEvidenceFromModal` records the evidence and immediately clears the active hotspot, closing the modal.
- The inquiry state lives inside `CharacterQuestionModal` and its `useEffect` resets that state whenever the modal opens.
- Some contextual responses also have a `targetQuoteId`, so the current data model does not cleanly distinguish the single primary deduction from supplementary information.

### Design decision

Turn each first character inquiry into two short phases:

1. **Hear the account** — experience all three dialogue beats sequentially.
2. **Identify the weak link** — review the three statements one at a time and decide which should be recorded as the decisive case-file clue.

This is not a quiz about whether a statement is morally “good” or whether the vape is safe. The player is deciding which statement directly establishes the relevant reliance or assumption. Other responses may still contain useful safety context; the feedback should say that they do not prove the specific investigative point, never that they make the device safe or verified.

### Intended first-visit flow

1. The character opens with their initial statement and a clear progress label such as `Account 1 of 3`.
2. The player advances with a single `Next Statement` action.
3. Each beat shows the player's prompt, the character's response, expression/reaction, and a restrained player observation.
4. The first visit proceeds sequentially through all three beats. Previous/next navigation is not required during this initial listening phase; the purpose is to ensure the full account is heard once.
5. After the third beat, the interface explicitly changes mode: `Which statement reveals what this person was relying on?`
6. The player reviews one statement card at a time using visible left/right controls and keyboard arrow support. A `1 of 3`, `2 of 3`, or `3 of 3` indicator prevents disorientation.
7. The primary action becomes `Record This Statement as a Clue` only in this deduction phase.

### Wrong-selection behaviour

1. A wrong selection does not close the inquiry, add evidence, trigger the AHA, or consume a cross-examination attempt.
2. Show concise, statement-specific feedback explaining why it does not directly establish the investigative point.
3. Keep the response educational but evidence-bounded. Preferred language pattern:
   - `Useful context, but this does not show who they relied on.`
   - `Her immediate condition cannot verify the contents or safety, but another statement directly reveals her assumption.`
4. Mark reviewed choices subtly so the player can reason rather than repeatedly test the same option.
5. Allow continued left/right review immediately after feedback.

### Correct-selection payoff

1. Selecting the designated decisive statement triggers the existing clue-specific `AHA!` transition.
2. After the transition, return to a short resolved panel inside the inquiry rather than closing immediately.
3. The resolved panel explains in one or two sentences:
   - what the character directly admitted;
   - which assumption or reliance it exposes; and
   - what the evidence does **not** prove.
4. Add the clue to the case file exactly once.
5. The player closes the resolved panel with a clear action such as `Clue Recorded — Return to the Room`.
6. Preserve the existing safety boundaries: do not infer contents, safety, seller honesty, or Ryan's motive.

### Continuity requirements

Persist inquiry progress per character in the investigation-level run state rather than inside the temporary modal.

Suggested per-character state:

- Phase: `unseen`, `hearing`, `deduction`, or `resolved`.
- Last heard statement index / next unheard statement.
- Current review-card index.
- IDs of wrong deductions already tested.
- Whether the decisive clue has been recorded.

Expected reopen behaviour:

- If the player closes during the first sequential pass, reopening resumes at the last reached dialogue beat instead of restarting at statement one.
- If all statements have been heard but no clue was recorded, reopening returns to deduction mode and restores the last reviewed card and prior feedback markers.
- If the clue was recorded, reopening shows a compact resolved/review state; it must not replay the AHA or duplicate evidence.
- This state lasts only for the current run and resets on a full game restart. It must not use persistent storage or transmit data.

### Content/data cleanup required

1. Explicitly identify one primary case-file deduction per character rather than treating every non-empty `targetQuoteId` as equally correct.
2. Preserve supplementary responses for characterisation and safety messaging.
3. Write unique non-punitive feedback for each non-primary statement.
4. Review the Ryan inquiry carefully because the current first and third responses both map to recordable evidence. Decide which single response is the primary character deduction and keep the other as contextual testimony or direct it to the existing phone evidence flow without creating a duplicate evidence gate.
5. Keep the investigation's four decisive-clue gate unchanged unless a later approved issue explicitly changes progression.

### UI relationship to Issue Set 01

- Implement this inside the planned compact-height, two-column character-inquiry layout.
- Left side: character art, expression, and spoken response.
- Right side: sequential prompt/progress during hearing; statement carousel and feedback during deduction.
- Header and bottom action remain fixed; the entire modal must not become a scrolling document.
- Left/right controls require visible focus states, labels, keyboard arrow support, and touch-sized targets.
- Reduced-motion mode keeps the state changes but replaces sliding cards with instant swaps or fades.

### Acceptance checks for Issue Set 02

- On a character's first visit, the player cannot enter deduction mode or record the clue until all three dialogue beats have been viewed.
- The first sequential pass presents each beat once in order.
- Closing at beat one or two and reopening resumes from the saved position.
- After all beats are heard, the player can review all three statements with left/right buttons and keyboard arrows.
- Closing during deduction and reopening restores the deduction phase and last reviewed statement.
- A wrong choice gives statement-specific reasoning, remains inside the inquiry, and adds nothing to the case file.
- Wrong inquiry choices do not consume cross-examination attempts or affect ending logic.
- The correct choice triggers the clue AHA, then shows a concise explanation, then allows the player to return to the room.
- The decisive clue is added exactly once and cannot be duplicated by revisiting the character.
- Reopening a resolved character does not replay the first-visit sequence or AHA.
- The sealed box, phone evidence, four decisive investigation clues, evidence gates, four outcome families, and clean reset remain functional.
- Full restart clears every character's inquiry progress.

### Planned automated coverage

- First visit cannot record before all three beats are heard.
- Inquiry progress survives close/reopen for each character.
- Deduction index and tried wrong choices survive close/reopen.
- Wrong deductions do not add evidence or consume exchange attempts.
- Correct deduction adds only the designated evidence and triggers the clue-resolution state.
- Repeated correct submission cannot duplicate evidence or replay completion.
- Full reset clears inquiry progress.

### Status

- Implemented locally as part of the first backlog pass.
- Follow-up UX findings from the implemented flow are planned under Issue Set 08.

---

## Issue Set 03 — Distinguish case progress from source synthesis and earn the final deduction

### Screenshot reviewed

- `Screenshot 2026-09-22 011825.png` — The courtroom UI shows a top-navigation `Source Map 4/4` button and a second `Source Map — Card Ready` button beside `Case Notes`.

### Player-visible problems

1. Two controls are both called `Source Map`, even though they open different interfaces. The player cannot predict which one is a progress reference and which one advances the case.
2. `Card Ready` reads as if the final deduction has already been solved, making the source-collapse mechanic feel like a shortcut rather than a conclusion the player earned.
3. Pressing enough statements and collecting investigation quotes supplies the source connections too early. The player can reach the powerful final case card without first proving the intermediate contradictions through evidence presentation.
4. The source-collapse card behaves like an “ultimate” deduction, but its current availability and green success styling make it feel routine and low-risk.

### Confirmed current behaviour in code

- The top navigation `Source Map` button opens `TrustGraphModal`, whose actual heading is `Mind Palace: The Chain of Trust`. It is primarily a read-only overview of solved claims and collected quotes.
- The lower `Source Map` button in `DialogueBox` opens `SourceMapModal`, which is the interactive synthesis that awards `One origin, three voices`.
- `SourceMapModal` considers the three accounts available from investigation evidence alone.
- When the synthesis opens, an effect automatically assigns every available correct connection:
  - Ryan → unknown seller.
  - Alyssa → Ryan.
  - Noah → Ryan.
- The manual connection workbench still exists in the component but is hidden.
- With all three investigation accounts present, the player sees the completed relationship summary and needs only to select `Collapse the three assurances into their actual source`.
- Awarding the case card automatically selects the final gate, even if the earlier courtroom reasoning was not what earned the map.
- The top navigation counter uses solved-gate count, despite being labelled `Source Map`, which further blurs progress and synthesis.

### Design decision

Treat the two surfaces as separate tools with separate names and purposes:

1. **Case Progress** — a reference screen showing which claims have been tested and what has been clarified so far.
2. **Source Synthesis** — a gated final deduction used to connect earned clarifications and create the `One origin, three voices` evidence card.

The source synthesis should feel like a late-game ability: visible enough that the player anticipates it, but unavailable until the preceding reasoning has been demonstrated through correct evidence presentations.

### Naming and status changes

#### Top navigation

- Rename `Source Map` to `Case Progress` or `Reasoning Board`.
- Recommended final label: **Case Progress**.
- Keep its solved-gate counter, because `2/4 gates clarified` accurately describes this surface.
- Rename the modal heading from `Mind Palace: The Chain of Trust` to a more direct original label such as `Case Progress: Claims and Clarifications`.
- This view remains accessible as a reference and does not award evidence or solve a gate.

#### Courtroom action beside Case Notes

- Rename `Source Map` to **Source Synthesis**.
- Before eligibility: `Source Synthesis — Locked` with a restrained lock/progress treatment.
- When prerequisites are met: `Source Synthesis — Ready` using amber/cyan emphasis, not completed-state green.
- After successful synthesis: `Source Card Complete` or `Review Source Card`, with green reserved for actual completion.
- Replace ambiguous `Card Ready` wording; a card is not ready until the player has completed the synthesis.

### Earned-unlock conditions

Do not unlock source synthesis from raw investigation quotes or statement presses alone.

Recommended prerequisites:

1. Tutorial Gate — `Looks Normal → Contents Unknown` has been resolved so the evidence-presentation interaction is learned.
2. Noah's gate has been resolved with Alyssa's account, producing a clarified reliance fragment rather than merely a collected quote.
3. Alyssa's gate has been resolved with Ryan's seller conversation, producing the Ryan-source clarification.
4. The required source evidence remains in the case file, but possession alone does not satisfy the unlock.

The practical unlock should therefore occur only after the first three courtroom gates are successfully resolved. Pressing statements can reveal context and prepare evidence, but only a correct explicit presentation converts an uncertain statement into a trusted clarification for the synthesis.

The final gate remains visible as an anticipated locked objective, but cannot be selected or solved until the source card exists.

### Clarification fragments earned through courtroom play

Successful breakthroughs should add concise, evidence-bounded fragments to Case Progress and Source Synthesis:

1. **After Noah's gate:** `Noah did not independently verify anything; his confidence relied on Ryan and what he assumed Alyssa knew.`
2. **After Alyssa's gate:** `Alyssa did not inspect the contents; she acted because she assumed Ryan had checked.`
3. **After the seller-chat clarification:** `Ryan had no independent test or record; his reassurance came from one unknown seller's claim.`

These are not new claims about contents or motive. They record only what the successful evidence presentation established.

### Additional dialogue plan

The new gating needs short character dialogue so the map grows from social corrections rather than from abstract UI counters.

#### Noah breakthrough follow-through

- Noah: `Wait—I didn't verify anything myself. I was repeating what I thought Alyssa and Ryan knew.`
- Player reflection: `Noah's confidence is an echo, not an independent check.`
- Add a visible clarification fragment to Case Progress.

#### Alyssa breakthrough follow-through

- Alyssa: `So I wasn't relying on something Ryan checked. I was relying on Ryan trusting somebody else.`
- Player reflection: `Her confidence points back to Ryan, not to independent evidence.`
- Add the second clarification fragment.

#### Ryan/source clarification

- Ryan: `I asked the seller, but I didn't get a test, certificate, or independent record.`
- Player reflection: `Ryan's reassurance points back to the seller's own claim. Whether the seller believed it or not remains unknown.`
- Add the final source fragment.

#### Synthesis-ready beat

- Player: `The corrected accounts now overlap. I can trace what each person actually relied on.`
- UI notification: `Source Synthesis Ready — connect the clarified accounts.`

#### Completion beat

- Player: `Three confident voices did not create three checks. The reassurance travelled through the group from one unverified source.`
- The existing source-collapse AHA/breakthrough then awards `One origin, three voices`.

Final wording should be polished with the rest of the dialogue, but must remain concise and must never establish the contents, seller honesty, or Ryan's motive.

### Source Synthesis interaction

Restore an active reasoning step instead of pre-filling the map.

1. Show three target statements/people and the clarification fragments earned from successful gates.
2. Let the player assign or connect each target to the source they actually relied on. This can use selectable nodes or card-to-slot placement; pointer, keyboard, and touch must all work.
3. Recommended deductions:
   - Noah's confidence → Ryan / the room's reliance on Ryan.
   - Alyssa's action → Ryan's reassurance.
   - Ryan's reassurance → one unknown seller claim.
4. Do not render the correct arrows before the player makes the connections.
5. A wrong connection gives concise reasoning feedback and remains editable. It should not consume courtroom attempts because this is a synthesis workspace, not a character exchange.
6. The `Collapse to Actual Source` action remains disabled until all required links are correctly supported.
7. On completion, play the source-collapse payoff, award the card once, unlock/select the final gate, and return the player to explicit evidence presentation.
8. The card must still be presented against Ryan's `three separate confirmations` claim; completing the synthesis does not automatically solve the final gate.

### Difficulty and pacing safeguards

- Do not unlock from number of statements pressed; otherwise exhaustive clicking substitutes for reasoning.
- Do not unlock from number of quotes owned; investigation evidence is necessary but not sufficient.
- Do not expose the finished connection diagram while the synthesis is locked.
- The Case Progress screen may show earned fragments and unresolved slots, but it must not reveal unearned answers.
- Preserve the three-attempt system only for evidence presentation against testimony. Do not add punitive lives to source-map experimentation.
- Keep the route deterministic and avoid randomised connection sets.
- Do not add extra gates solely to lengthen play. Difficulty should come from comparing claims, choosing evidence, and constructing the source chain.

### State-model changes to plan for

- Track source clarification fragments separately from raw collected evidence.
- Derive synthesis eligibility from resolved prerequisite gate IDs, not quote count.
- Track source-link selections and completion independently.
- Persist partial synthesis work if the player closes and reopens it.
- Prevent `handleAwardCaseCard` from selecting the final gate before eligibility and completion.
- Prevent duplicate source-card awards and repeated completion cut-ins.
- Clear clarification fragments, partial map state, and card completion on full restart while preserving only permitted accessibility preferences.

### UI relationship to Issue Set 01

- `Case Progress` should use the planned viewport shell and remain a compact reference, not another long scrolling report.
- `Source Synthesis` should use the wider workspace pattern so all nodes, evidence fragments, and connections remain legible at 1280×720.
- The locked/ready/complete state should be understandable by label, icon, and copy—not colour alone.
- Avoid adding another persistent row of chrome; integrate the action with the gate/case-notes strip already being reworked.

### Acceptance checks for Issue Set 03

- The top and lower buttons no longer share the same name.
- `Case Progress` opens only the read-only claims/clarifications overview.
- `Source Synthesis` cannot award a card before the first three gates are correctly resolved.
- Pressing every statement without presenting correct evidence does not unlock synthesis.
- Collecting every investigation quote without solving the prerequisite gates does not unlock synthesis.
- Each successful relevant gate adds the correct clarification fragment and associated dialogue.
- Locked Case Progress does not reveal unearned final connections.
- Partial source-link work survives closing and reopening the synthesis.
- Wrong source links give bounded feedback and do not consume courtroom attempts.
- Correctly connecting all earned links enables the collapse action.
- Completing synthesis awards `One origin, three voices` exactly once and unlocks the final gate.
- The player must still explicitly present that card to solve the final gate.
- No route reveals device contents, seller honesty, or Ryan's motive.
- All five endings, retry behaviour, accessibility preferences, and full reset remain intact.

### Planned automated coverage

- Raw quote collection alone cannot unlock source synthesis.
- Statement presses alone cannot unlock source synthesis.
- Required resolved gates unlock synthesis deterministically.
- Each successful prerequisite gate adds only its intended clarification fragment.
- The final gate rejects access/presentation before source-card completion.
- Wrong map links do not award the card or consume exchange attempts.
- Partial map selections persist across close/reopen.
- Correct map completion awards one source card and unlocks the final gate.
- Reopening a completed map does not duplicate the card or replay completion.
- Retry of a courtroom exchange preserves already earned clarification fragments.
- Full restart clears synthesis progress and clarification fragments.

### Status

- Planned; not implemented.
- Implement after Issue Set 02's testimony-state model is defined, because both features distinguish raw dialogue from evidence-backed clarification.
- Coordinate with the evidence-workspace redesign in Issue Set 01 so the final source card remains explicit and legible when presented.

---

## Issue Set 04 — Replace read-through instructions with playable guided practice

### Player-visible problem

The current help model asks the player to read how the game works before or while trying to understand the scene. `StructureOverviewModal` and `HowToPlayModal` explain both segments through cards and bullet points, while `TutorialGuide` adds a large instruction panel above the active game. This consumes viewport space and teaches controls abstractly rather than through action.

The desired tutorial language is the familiar guided-product pattern:

- Dim the inactive interface.
- Clearly highlight the one control that matters now.
- Place a short coachmark beside that control.
- Advance only when the player performs the requested action on the real control.
- End the practice with a small payoff, then remove the tutorial layer and begin normal play.

### Confirmed current behaviour in code

- `StructureOverviewModal` displays a pre-investigation explanation of `Inspect, question, record` and `Press, pin, present`.
- `HowToPlayModal` contains a scrollable text summary of both segments.
- `TutorialGuide` occupies layout space above the scene and explains the active step with text and an optional 15-second hint.
- The speaker tutorial is already interactive and correctly kept out of the evidence inventory, but it opens from within the real investigation room rather than functioning as a clean practice stage.
- Completing the speaker interaction currently lowers the music and returns to the room without an AHA cut-in.
- The cross-examination tutorial highlights parts of the actual first evidence gate. It is not a separate practice exchange.

### Design decision

Create two short, sandboxed tutorial stages:

1. **Investigation Practice — Turn Down the Music**
2. **Cross-Examination Practice — Challenge a Harmless Room Claim**

Both tutorials use the same production controls and visual language as the real game, but their temporary observations never enter the real evidence inventory, never solve a case gate, and never affect an ending.

After each tutorial, play an AHA-style payoff and transition directly into the corresponding real segment. Do not combine both tutorials into one front-loaded sequence.

### Guided-coachmark interaction system

Introduce a reusable coachmark/spotlight layer rather than hard-coding a new instruction panel for each screen.

Required behaviour:

1. Identify the active target through a stable tutorial target ID or element ref.
2. Darken the rest of the screen while cutting out or visually lifting the target.
3. Anchor a compact dialogue bubble beside the target without covering it.
4. Use one action sentence and, when useful, one short reason. Avoid paragraphs.
5. Allow pointer, keyboard, and touch interaction with the highlighted control.
6. Advance from the control's actual success callback, not from a generic `Next` button.
7. Prevent unrelated controls from advancing the tutorial, but do not visually imply the whole application is broken.
8. Recalculate placement when the viewport changes and flip the bubble above/below/left/right to remain visible.
9. Move keyboard focus to the active target where appropriate and announce the instruction through an accessible live region.
10. In reduced-motion mode, replace animated spotlight movement with an immediate state change.
11. Retain the existing delayed hint concept, but show the hint inside the active coachmark rather than expanding a large banner.
12. Provide an always-visible `Skip Tutorial` control in the top-right corner of each dedicated practice stage. It must remain outside the moving coachmark target so returning players never need to complete a step before reaching it. Skipping guidance must not solve evidence gates or award evidence.

#### Tutorial skip behaviour

- Show `Skip Tutorial` only while a dedicated investigation or cross-examination practice stage is active.
- Keep it fixed in the top-right safe area at every supported viewport and above the spotlight scrim.
- Give it a visible keyboard focus state, an accessible name, and a minimum touch target.
- On activation, show a compact confirmation that explains: `Practice will end. No evidence or case gate will be completed.`
- Offer `Skip This Practice` and, optionally, `Skip All Tutorials This Run` as distinct choices so intent is clear.
- Skipping investigation practice enters the untouched real investigation with no speaker evidence.
- Skipping cross-examination practice enters the untouched real courtroom with all four real gates unresolved.
- A skipped practice remains available through `Guided Help` replay.
- Full restart clears the per-run skip choice and restores first-run tutorial behaviour.

### Tutorial Stage A — Investigation practice

#### Staging

- Insert a dedicated `investigation practice` phase after the prologue and before the full living-room investigation.
- Show a cropped coffee-table scene with the original portable speaker as the only active object.
- Keep the characters and real case objects out of focus or off-stage so the player is not distracted by unavailable interactions.
- Label the sequence discreetly as `Practice — nothing will be added to the case file`.

#### Action sequence

1. **Select:** spotlight the speaker; coachmark: `The music is covering the conversation. Select the speaker.`
2. **Inspect:** open the existing speaker inspection interface and spotlight a rotation affordance; coachmark: `Rotate objects to inspect another side.`
3. **Rotate:** require one successful drag/swipe, arrow-button activation, or keyboard-left/right action.
4. **Find hotspot:** once the rear view is reached, spotlight the volume dial; coachmark: `Select anything that may change what you can observe.`
5. **Interact:** spotlight `Turn Music Down`; coachmark: `Use the control so the room can hear one another.`
6. **Payoff:** play a short clue-style AHA cut-in such as `AHA! — The room is audible now.`
7. **Transition:** show one concise bridge: `Important observations can be recorded. Now investigate the real room.` Then load the actual investigation scene.

#### Boundaries

- The speaker remains low-stakes practice and never appears in the case-file inventory.
- Completing or skipping this practice cannot satisfy any investigation objective or evidence gate.
- The actual investigation begins in a clean visual state with the three characters and case objects available.
- The practice interaction resets on a full run reset.

### Tutorial Stage B — Cross-examination practice

#### Staging

- Insert a dedicated practice exchange after investigation is complete and before the four real courtroom gates.
- Use Noah as the practice speaker, matching the user's suggested familiar first character, but give him a tutorial-only extra statement rather than consuming or rewriting one of the real claims.
- Keep the practice exchange visually identical to the real courtroom controls so the learned action transfers directly.
- Mark temporary content as `Practice Exchange`; it must not be counted among the four case gates.

#### Recommended harmless practice claim

Use the earlier speaker event to avoid revealing or pre-solving the actual vape case:

- Noah: `The music was fine. Everyone could hear what was being said.`
- Temporary practice observation: `The speaker volume was masking the conversation until it was turned down.`
- Revision: `MUSIC WAS FINE → MUSIC MASKED THE ROOM`.

This teaches contradiction matching without introducing evidence about the device, contents, seller, or character motive. The observation is tutorial-only and disappears when practice ends.

#### Action sequence

1. **Press:** spotlight Noah's practice statement; coachmark: `Press the statement to hear exactly what Noah is claiming.`
2. **Pin:** spotlight the exact disputed phrase; coachmark: `Pin the part you want to test.`
3. **Open practice notes:** spotlight the case-file control; coachmark: `Open your notes and look for an observation that addresses this claim.`
4. **Select:** spotlight the temporary speaker-volume card; coachmark: `Select the observation that directly contradicts the pinned claim.`
5. **Present:** spotlight the explicit presentation button; coachmark: `Present it. Selecting evidence alone is not a submission.`
6. **Payoff:** play the normal courtroom AHA/breakthrough treatment and show the harmless correction.
7. **Transition:** `Practice complete. Now test the group's real claims.` Then enter the actual courtroom with all four real gates untouched.

The player should perform every interaction. Coachmarks guide the action but do not simulate clicks or advance automatically.

### Relationship to the revised investigation inquiry in Issue Set 02

The playable tutorial should teach object inspection and the general idea of recording observations. It should not duplicate the more complex character-testimony deduction flow.

When the player first opens a real character inquiry:

- Use one or two lightweight contextual coachmarks for `Next Statement` and, after all statements are heard, `Record This Statement as a Clue`.
- Let Issue Set 02's required sequential testimony provide the actual practice through use.
- Do not add another wall of instructions before the character conversation.

### Replacing the current How to Play surface

Remove the long instructional modal as the primary help experience. The persistent navigation control can become **Guided Help**.

Recommended compact help menu:

- `Show the next action` — highlights the currently relevant control without completing it.
- `Replay Investigation Practice` — opens the speaker tutorial in a sandbox and returns to the exact current game state afterward.
- `Replay Cross-Examination Practice` — available once cross-examination has been reached; uses the temporary Noah exchange and returns without changing case state.
- `Controls & Accessibility` — a concise reference for keyboard, touch, mute, and reduced motion. This may use a small panel because it is reference material, not the primary tutorial.

Replay practice must use isolated temporary state. It cannot duplicate evidence, alter attempts, resolve gates, change source clarification fragments, or affect endings.

### Removing redundant instructional UI

1. Replace `StructureOverviewModal` with a very short cinematic segment transition or remove it if the first coachmark provides enough context.
2. Retire the large persistent `TutorialGuide` layout block after the coachmark system covers its functions.
3. Preserve only concise segment framing:
   - `Investigate — inspect, question, record.`
   - `Cross-examine — press, pin, present.`
4. Do not permanently reserve vertical space for instructions during normal play.
5. Keep contextual 15-second hints and the ability to request help on demand.

### State-model requirements

- Add explicit phases for `investigationPractice` and `crossExamPractice`, separate from real progression.
- Track tutorial steps through successful user actions.
- Track completed/skipped tutorial status for the current run.
- Maintain an isolated practice evidence collection that is never merged with `collectedQuotes`.
- When replaying practice, store and restore the exact originating game state.
- Full restart resets tutorial completion and replay state.
- Skip does not mark any case interaction, quote, gate, source link, or ending condition as complete.

### UI relationship to Issue Set 01

- Coachmarks replace the tall tutorial banner, releasing vertical space for the room and dialogue.
- Both practice stages must fit at 1440×900, 1366×768, and 1280×720 without document scrolling.
- The cross-examination practice must use the redesigned wide evidence workspace or a faithful compact practice version of it; do not teach controls whose location immediately changes in real play.
- Coachmark placement must never cover the highlighted control or the fixed action footer.

### Content relationship to Issue Set 03

- The practice exchange teaches press, pin, select, and present only.
- It must not introduce Source Synthesis, clarification fragments, or the final source card.
- Source Synthesis should receive its own short contextual coachmark only when it genuinely unlocks after the prerequisite real gates.

### Acceptance checks for Issue Set 04

- A first-time player can complete both practice stages without reading a wall-of-text modal.
- Each tutorial advances only after the requested control is actually used.
- Coachmarks point to the correct live control and remain onscreen at all three desktop target sizes.
- Pointer, keyboard, and touch-equivalent actions can complete the relevant steps.
- The investigation practice uses the speaker and adds no item to the case file.
- Speaker completion triggers a short AHA and then opens the untouched real investigation.
- The courtroom practice uses a tutorial-only Noah statement and temporary observation.
- Completing the courtroom practice triggers an AHA but resolves none of the four real gates.
- Skipping either practice awards no evidence and solves no progression requirement.
- Replaying either practice returns to the exact prior state without changing evidence, attempts, gates, clarification fragments, source synthesis, or ending eligibility.
- The real courtroom still begins with the four intended gates and the cross-examination tutorial does not reveal their solutions.
- Contextual help remains available after tutorial completion.
- Reduced motion, mute, visible focus, and delayed hints remain functional.
- Full restart restores first-run tutorial behaviour.

### Planned automated coverage

- Speaker practice completion never adds evidence.
- Speaker practice skip never satisfies investigation readiness.
- Tutorial steps cannot advance from unrelated clicks.
- Cross-examination practice uses isolated temporary evidence.
- Completing or skipping the practice exchange leaves all four real gates unresolved.
- Practice AHA events do not invoke case breakthrough handlers.
- Replay restores evidence, selected gate, attempts, inquiry progress, and synthesis state exactly.
- Full reset clears tutorial completion and partial tutorial progress.
- Skip controls remain visible and operable throughout both practice stages.
- Skipping this practice versus all practices produces the intended later tutorial behaviour.

### Status

- Partially implemented locally: separate speaker and Noah practice stages, skip controls and AHA payoffs exist.
- The current courtroom practice is still a self-contained instruction modal whose buttons merely advance explanatory steps. It does not yet satisfy the live-control coachmark requirements above.
- Issue Set 09 supersedes the current practice presentation and defines the required contextual walkthrough implementation for both stages.

---

## Issue Set 05 — Restructure the outcomes around consequence, responsibility, and one reconsideration

### Screenshot reviewed

- `Screenshot 2026-09-22 003038.png` — `The Next Voice` currently focuses on extending the reassurance chain, presents a long report-like debrief, and allows repeated selection of other final outcomes.

### Product and narrative problems

1. `The Next Voice` explains the information cascade, but it does not sufficiently dramatise the player's internal conflict after they have personally uncovered all the evidence.
2. The player can accept the device despite knowing that nobody verified it, yet the current ending moves too quickly to the abstract idea of becoming another voice in the chain.
3. Unlimited outcome reselection makes the final choice feel like an outcome gallery rather than a consequential decision.
4. Five separately named endings create more taxonomy than the final decision needs. `Right, But Alone` is valuable, but it is better understood as a communication variant of an evidence-bounded refusal than as a wholly separate reasoning outcome.
5. The message must not become `distrust your friends` or `suspect everything`. The transferable lesson is that trust and familiarity do not verify an unknown product.

### Approved direction

Reduce the game from five named outcome families to four:

1. **Break the Chain** — refuse using accurate, evidence-bounded reasoning.
2. **False Consensus** — seek reassurance from the same unverified source again.
3. **The Guess** — claim certainty about the contents without evidence.
4. **The Next Voice** — accept because the room appears confident despite knowing that nobody verified the device.

Fold `Right, But Alone` into `Break the Chain` as a delivery-dependent narrative variant:

- **Calm/persuasive variant:** the player challenges the missing verification without attacking Ryan, and the room reconsiders.
- **Accusatory/alienating variant:** the player's core reasoning is correct, but personal attacks make the room defensive and reduce persuasion.

Both variants belong to the same `Break the Chain` outcome family because the player reached the same evidence-bounded conclusion. The response history changes the social result, not the underlying factual lesson.

### Intentional specification change

This issue supersedes the earlier requirement to preserve five separately named outcomes. When implemented:

- Remove `RIGHT_BUT_ALONE` as an independent final-response option and ending type.
- Preserve its communication lesson as a deterministic `Break the Chain` variant derived from the existing accusation/rapport history.
- Update route matrices, type definitions, tests, debrief copy, and any UI that states there are five outcomes.
- Do not remove or weaken the retry/reset behaviour for evidence gates; this change applies only to final-outcome selection.

### Core message wording

Preferred message:

> Trusting a friend is not the same as having evidence. Friendship, confidence, appearance, immediate effects, and repeated reassurance cannot verify an unknown product. You can refuse without proving that your friend is dishonest or identifying what is inside.

Avoid framing the lesson as:

- `Never trust your friends.`
- `Suspect everything.`
- `Ryan was lying.`
- `The seller knowingly deceived everyone.`
- `The device definitely contained a particular substance.`

The game should teach claim evaluation and refusal under uncertainty, not general paranoia.

### Revised `The Next Voice` emotional arc

The intended emotional register is **cognitive dissonance, guilt, and responsibility**, not humiliation or moral condemnation.

#### Beat 1 — The evidence returns

Before the decision is enacted, briefly echo the conclusions the player personally established:

- Nobody inspected or tested the contents.
- Alyssa's immediate condition did not verify safety.
- Noah and Alyssa relied on Ryan.
- Ryan relied on one unknown source's assurance.

Keep this visual and concise—short fragments, prior breakthrough wording, or restrained flashes of the source chain rather than another explanatory paragraph.

#### Beat 2 — Acting against one's own judgment

The player hesitates but yields to the room. Use an internal line such as:

> `I had already proved that none of us knew. I still let their confidence make the decision for me.`

Imply the acceptance through staging, a cutaway, or a fade. Do not show an attractive inhalation animation or glamour shot.

#### Beat 3 — No sensational reveal

- Do not reveal the contents.
- Do not decide whether Ryan or the seller was sincere.
- Do not invent an immediate medical event, punishment, police consequence, or random hidden outcome.
- The discomfort comes from knowingly abandoning one's reasoning, not from a shock consequence.

#### Beat 4 — Becoming social proof

Later, another person uses the player's experience as reassurance:

> `They tried it and seemed fine.`

The player recognises that their private compromise has become evidence in somebody else's decision. This is where the guilt becomes socially meaningful rather than merely self-directed.

Avoid named downstream characters unless they are introduced elsewhere. A generic later conversation or message is enough and prevents unnecessary story expansion.

#### Beat 5 — Responsibility and repair

End with agency rather than shame. Offer a corrective statement the player could realistically use:

> `I shouldn't have called it fine. I still don't know what was inside. Don't use what happened to me as proof.`

The debrief should distinguish:

- **Guilt:** `I acted against what I knew and can correct what I said.`
- **Shame:** `I am a bad person and cannot repair this.`

Use the former. The player should leave understanding how to interrupt the chain after a mistake.

### Revised `The Next Voice` framing

Replace language such as:

> `Your survival became the next reassurance in the chain.`

Recommended direction:

> `You acted against what the evidence told you. Your experience became the next reassurance in the chain.`

Suggested badge/theme:

- Title: `THE NEXT VOICE`
- Badge: `THE CHAIN CONTINUES`
- Emotional cue: a quieter, uneasy room and the player's evidence fragments fading behind the group's confidence.
- No `bad ending` label, morality score, or punitive grade.

### Four outcome families in detail

#### 1. Break the Chain

- Final choice: refuse and explain that several voices trace back to one unverified source.
- Calm variant: the group listens and steps back.
- Alienating variant: the player attacks Ryan personally; the evidence remains sound, but the room becomes defensive.
- Debrief: challenge the missing verification, not the friend's character.

#### 2. False Consensus

- Final choice: ask the same seller to verify the seller's own assurance again.
- Consequence: repetition feels reassuring but creates no independent evidence.
- Debrief: verification must come from an independent, accountable source; repeated confidence is not another check.

#### 3. The Guess

- Final choice: declare that the device definitely contains drugs or a particular substance.
- Consequence: the unsupported overclaim gives the room an easy reason to dismiss the otherwise valid concern.
- Debrief: uncertainty and lack of verification are already enough reason to refuse; the player does not need to invent certainty.

#### 4. The Next Voice

- Final choice: accept because Alyssa appears fine or the room sounds confident.
- Consequence: the player knowingly acts against the evidence and later becomes another cited reassurance.
- Debrief: a single apparently uneventful experience cannot verify contents or future risk; correct the reassurance and break the downstream chain.

### One-reconsideration rule

Replace unlimited outcome reselection with one explicitly framed opportunity per run.

Recommended model:

1. The first selected outcome is presented as the canonical result of that run.
2. After its narrative and debrief, show one action: `Reconsider Once` or `Explore One Alternative`.
3. Make the framing explicit: this is a single rewind/counterfactual reflection, not an erasure of the first decision.
4. The player may choose one different final response.
5. After the alternative outcome is viewed, outcome selection is locked for that run.
6. The available actions then become `Start a New Investigation` and any approved debrief-copy action.
7. To see the remaining outcomes, the player must complete a new run.

Recommended label:

> `REWIND ONCE — What would one different response change?`

This keeps educational comparison while restoring consequence and replay value.

### Reconsideration state rules

- Track the original outcome separately from the one optional counterfactual outcome.
- Track whether the single reconsideration has been consumed.
- Do not allow the same outcome to be selected twice during reconsideration.
- Do not reset investigation evidence, solved gates, inquiry progress, or source synthesis when entering the one counterfactual branch.
- Do not let reconsideration alter the original recorded outcome for that run if a session summary is shown.
- Full restart clears original outcome, alternative outcome, and reconsideration usage.
- No persistent analytics or external storage is required.

### Debrief presentation

Coordinate with Issue Set 01's staged outcome redesign:

1. First screen: immediate emotional and social consequence.
2. Second screen: concise reasoning debrief organised around:
   - `What you knew`
   - `What you chose`
   - `How it affected the room`
   - `What you can say or do now`
3. Place `Rewind Once` only after the player has read the practical takeaway.
4. Keep restart permanently visible after the debrief so institutional demonstrations can begin a clean session.
5. Do not display all four endings as unlockable collectibles or a completion checklist.

### Acceptance checks for Issue Set 05

- Exactly four named outcome families are selectable and reachable.
- `Right, But Alone` is no longer a fifth selectable outcome.
- Accusatory history deterministically changes the social variant of `Break the Chain` without changing the evidence-bounded conclusion.
- `The Next Voice` acknowledges that the player acted after learning the evidence.
- Its guilt arises from cognitive dissonance and downstream influence, not from invented substance contents or a random punishment.
- The ending never shows glamorous use, reveals contents, confirms motive, or invents a medical consequence.
- `The Next Voice` includes a realistic repair statement.
- The debrief never labels the player a bad person or assigns a morality score.
- Only one alternative final response can be explored per run.
- After that alternative, further outcome selection is unavailable until a full restart.
- The original outcome remains distinguishable from the counterfactual outcome.
- Full restart clears both outcomes and restores reconsideration availability.
- Evidence retry behaviour and all earlier gameplay progress remain unaffected.

### Planned automated coverage

- All four outcome families are reachable through deterministic choices.
- No fifth `RIGHT_BUT_ALONE` response remains selectable.
- Calm and accusatory histories select the correct `Break the Chain` narrative variant.
- One reconsideration is available after the original debrief.
- The reconsideration cannot select the original choice again.
- A second reconsideration is blocked.
- Full restart restores the one-reconsideration allowance.
- No outcome string asserts contents, seller honesty, or Ryan's motive as fact.
- `The Next Voice` retains uncertainty and the corrective-action copy.

### Status

- Approved plan; not implemented.
- Requires coordinated updates to outcome types, final-response data, ending content, the outcome UI, route tests, and the earlier five-outcome acceptance assumptions.
- Final prose should be reviewed for emotional credibility with educators or youth playtesters; code inspection alone cannot establish whether the guilt feels motivating rather than preachy.

---

## Issue Set 06 — Make illustrated environments the stage instead of placing the game inside black panels

### References reviewed

- `20240201013641_1.webp` — full-screen illustrated title backdrop and clear foreground menu hierarchy.
- `evidence case file.jpg` — selected evidence receives most of the visual attention while navigation remains compact.
- `investigating items.jpg` — investigation occurs inside an illustrated place with objects and characters positioned in the environment.
- `courtroom.jpg` — speaker-focused staging, strong background identity, and a restrained dialogue layer.
- `pahzVhMRfvhWR95HRSae8o-1440-80.jpeg` — large character presentation, character-specific setting, and bottom dialogue composition.

These images are composition and visual-density references only. Do not reproduce their characters, courtrooms, costumes, poses, typography, logos, interface geometry, effects, or other distinctive protected expression. Do not use them as direct style-transfer inputs for final assets.

### Player-visible problem

The current character illustrations are attractive, but much of the experience still presents them inside dark rectangular containers, gradients, and application-style panels. Outside the characters and colourful buttons, the game frequently lacks a strong sense of place.

This creates several problems:

1. The apartment rarely functions as a continuous narrative stage.
2. Investigation can feel like selecting interface modules instead of observing a room.
3. Character conversations lack distinctive camera positions and environmental identity.
4. Evidence handling gives large amounts of space to interface chrome rather than to the evidence itself.
5. Cross-examination does not consistently use staging, light, camera focus, or reaction composition to distinguish it from ordinary dialogue.
6. Adding more decorative panels would increase visual density without solving the underlying lack of environmental artwork.

### Existing strength to preserve

- The current semi-realistic anime character portraits are strong enough to anchor the visual direction.
- `public/art/living-room-ensemble.png` already establishes an effective Singapore night-gathering atmosphere with warm practical light, cool city light, foreground depth, and a coherent group composition.
- The existing amber, cyan, violet, navy, and restrained warning-red interface palette is usable.
- Existing buttons, focus treatments, AHA cut-ins, and breakthrough colour language can be refined rather than discarded.

The first visual priority is therefore not another wholesale character replacement. It is building a coherent illustrated environment around the existing characters and composing the UI as an overlay on that stage.

### Approved visual direction

Use an original **Singapore midnight psychological-anime social thriller** identity:

- Contemporary apartment living room at night.
- Warm amber lamp light contrasted with cool blue city light.
- Deep navy, charcoal, muted violet, cyan inspection light, and restrained red pressure accents.
- Semi-realistic anime rendering consistent with the current character assets.
- Glass-table reflections, foreground silhouettes, window light, furniture edges, and selective blur to create depth.
- Camera position, crop, character scale, and lighting change with the social situation.
- Interface elements float over or sit at the edge of the illustrated scene rather than enclosing the entire scene in a dashboard.

Do not create a literal courthouse. Cross-examination should transform the same living room into a psychological arena through focus, staging, lighting, and reaction cuts. This keeps the game original and makes the central point—that the pressure comes from friends in an ordinary room—more powerful.

### ImageGen and code responsibilities

#### Use ImageGen for

- Full-screen or wide illustrated environmental backgrounds.
- Empty-room clean plates and alternate camera angles.
- Transparent foreground furniture or prop layers when useful for depth.
- Original evidence-object illustrations and prepared object views.
- Transparent character pose/expression variants that match the existing cast.
- Protagonist thinking/reaction poses.
- Optional title key art or story-specific cinematic stills.

#### Keep code-native

- All dialogue, labels, buttons, evidence descriptions, and message text.
- Keyboard focus, accessible names, coachmarks, hotspots, arrows, filters, and tabs.
- Lighting tints, vignettes, depth blur, restrained parallax, camera pushes, and responsive crops.
- Evidence selection state, source-map connections, claim highlighting, and progress indicators.
- AHA, breakthrough, tutorial, and reduced-motion behaviours.

Do not embed essential words or evidence facts inside generated artwork. Code-rendered text remains reviewable, responsive, accessible, and reliable.

### Environmental art system

Create one coherent apartment environment rather than a collection of unrelated backgrounds.

#### Master environment

- Generate one 16:9 empty living-room clean plate that matches the current ensemble's architecture, night lighting, furniture, and colour language without containing characters or case-critical text.
- Preserve intentional open areas for character placement and dialogue overlays.
- Keep the coffee table, sofa, window, lamps, and character stations spatially consistent.

#### Alternate camera plates

Derive or generate consistent views from the same environment:

1. **Wide room view** — investigation and group staging.
2. **Ryan angle** — central sofa/coffee-table area with room for his larger portrait.
3. **Alyssa angle** — warmer lamp-lit sofa side.
4. **Noah angle** — cooler window/armchair side.
5. **Player thought angle** — doorway, window reflection, or foreground viewpoint that supports internal reasoning without inventing a new location.

These should feel like camera positions in one apartment, not different rooms.

#### Depth layers

Where practical, separate:

- Background architecture/window.
- Mid-ground furniture.
- Character layer.
- Foreground table, sofa edge, plant, or silhouette.
- Code-driven lighting/vignette layer.

Use restrained pointer or camera parallax only when motion is enabled. Reduced-motion mode should use stable compositions.

### Screen-by-screen composition plan

#### Title screen

- Use the existing ensemble image or a refined related composition as full-bleed key art.
- Place the original game title and start action over deliberate negative space.
- Keep all title text and buttons in HTML.
- Add only subtle atmosphere: slow camera push, window light shimmer, or lamp glow when motion is enabled.
- Remove unnecessary outer cards so the first impression is the gathering, not an application shell.

#### Player setup

- Keep the two-avatar choice readable, but stage it against a softened apartment-entry or reflective night backdrop.
- Enlarge the selected avatar and reduce competing borders.
- Preserve name input clarity and accessible selection states.

#### Prologue

Present the opening as several cinematic shots rather than text inside one large card:

1. Establishing view of the Saturday-night gathering.
2. Alyssa already seated after trying the device.
3. Noah repeating the room's reassurance.
4. Ryan leaning forward to offer it to the player.
5. A player-perspective shot as the room waits.

Reuse the master environment, camera plates, character sprites, crops, and lighting where possible. Do not generate five unrelated illustrations when one coherent scene can be staged five ways.

#### Investigation

- Use the wide empty-room plate as the actual interactive scene.
- Position the three transparent character sprites naturally in the room.
- Place the speaker, box, phone, and device visibly on or around the coffee table.
- Highlight the object itself on hover/focus rather than presenting a separate dashboard module.
- Use small camera moves or tighter crops when the player selects an object or character.
- Keep a foreground table/furniture layer over characters and props where it improves depth.
- Maintain explicit keyboard-accessible hotspot controls even when the visual hotspot is integrated into the art.

#### Character inquiry

- Use the relevant character's apartment camera plate.
- Present the character large enough for expression and posture to carry the scene.
- Keep the other characters or room context faintly visible when useful.
- Place dialogue and the Issue Set 02 testimony/deduction controls in a compact lower or side layer.
- Change light, crop, and expression as the conversation moves from ordinary response to weak-link deduction.
- Avoid putting the character and their speech inside another large black card.

#### Evidence workspace

Coordinate with Issue Set 01's wide redesign:

- Give the selected evidence illustration substantial space.
- Show title, type, and one concise neutral observation next to it.
- Use smaller thumbnails/cards for the remaining evidence.
- Keep the challenged claim and presentation action visible.
- Reveal detailed reasoning only on selection, mismatch, or presentation.
- Use generated evidence art for visual recognition; use code for all facts and labels.

#### Cross-examination

- Keep the living room as the setting but reframe it with stronger contrast and speaker focus.
- Enlarge and light the active speaker.
- Keep the other characters visible as reaction witnesses.
- Cut to a protagonist thinking pose during internal reasoning.
- Briefly split or layer the claim, selected evidence, and speaker when evidence is presented.
- Use background blur, crop, and light changes to separate press, pin, present, reaction, and breakthrough beats.
- Do not imitate a franchise courtroom, counsel bench, judge, or protected camera composition.

#### Source synthesis

- Present the connection workspace as the player's reasoning overlay on the dimmed living room.
- Let earned clarification fragments appear as cards or illuminated nodes above the room rather than on a blank administrative canvas.
- Keep source lines and node labels code-rendered.
- On completion, collapse the visible social links toward the single unverified origin, then return to the room for explicit final evidence presentation.

#### Breakthroughs

- Preserve the existing AHA timing, sound, and yellow contradiction treatment.
- Add a speaker reaction crop, group reaction cut, and room-light change around the corrected wording.
- Use the existing character sprites and background plates rather than generating a unique full-screen image for every gate.

#### Outcomes

Reuse the apartment with outcome-specific staging and colour rather than four unrelated settings:

- **Break the Chain, calm:** warmer/open composition; group attention returns to the evidence.
- **Break the Chain, alienating variant:** greater physical separation and defensive body language.
- **False Consensus:** superficially comfortable light while the unresolved source remains visually dominant.
- **The Guess:** player visually isolated as the room dismisses the overclaim.
- **The Next Voice:** the player joins the group composition while previously earned evidence recedes; a later echo shows the player's experience being reused as reassurance.

No outcome art may reveal the contents, glamorise use, or invent a medical/police consequence.

### Proposed ImageGen asset pack

#### Priority A — Vertical slice

Generate only enough to validate the art system first:

1. Empty living-room master background.
2. One character-specific room angle, recommended Alyssa because the existing screenshot exposes the black-panel problem clearly.
3. One transparent foreground furniture/table layer if the clean plate supports it.
4. One selected-evidence hero illustration, recommended the sealed box.
5. One protagonist thinking/reaction pose for the currently selected avatar.

Use these assets to build four representative frames:

- Investigation room.
- Alyssa inquiry.
- Selected-evidence workspace.
- Cross-examination thinking/reaction beat.

Review the vertical slice before generating the rest of the pack.

#### Priority B — Core production pack

After visual approval:

- Remaining Ryan, Noah, and player room angles.
- Evidence hero illustrations for the box, phone/chat device, cartridge exterior, and speaker practice object as needed.
- Prepared object views required by inspection interactions.
- Missing protagonist reaction/thinking variants for both avatar choices.
- Missing character pressure/reconsideration poses where current expression variants are insufficient.
- Optional title-specific key-art crop if the ensemble image cannot support the final layout.

#### Priority C — Polish only

- Additional reaction cuts.
- Outcome-specific background colour grades or alternate staging.
- Extra foreground depth layers.
- Optional prologue stills that cannot be achieved through existing assets and camera crops.

Do not generate Priority C before the layout and core interactions are stable.

### Consistency workflow for generated assets

1. Create a short art bible before generation: character identities, apartment layout, palette, rendering level, lighting, camera height, and prohibited elements.
2. Use the existing Trust Me Bro character assets and living-room ensemble as identity/environment references.
3. Do not use the attached franchise screenshots as final style-transfer references.
4. Generate one master environment and one vertical-slice angle first.
5. Inspect anatomy, furniture continuity, lighting direction, crop room, and transparency.
6. Iterate with one targeted change at a time.
7. Use approved assets as references for later related assets.
8. Store final project assets under versioned filenames in `public/art/`; do not overwrite the existing art until the replacement is approved.
9. Optimise final raster dimensions and file size without visibly degrading character edges or background detail.
10. Keep all required art local so the game remains usable after initial load without network access.

### Image-generation limitations to plan around

- Exact object identity across several angles may require multiple iterations and reference-based generation.
- Generated text inside packaging, phone screens, signs, or evidence is unreliable and should not carry facts.
- Multiple independently generated room views may drift in furniture layout; use one approved clean plate and tightly controlled related views.
- Transparent edges, hands, fingers, jewellery, and small props require visual inspection.
- A generated background cannot replace semantic hotspots, focus management, or responsive layout code.
- Artwork alone will not solve the black-box feeling if opaque panels continue covering most of the scene.

### Implementation sequence

1. Complete the Issue Set 01 viewport and overlay architecture so the artwork has a stable canvas.
2. Define the art bible and exact crop/aspect requirements from the implemented layouts.
3. Generate and integrate the Priority A vertical slice.
4. Review the four representative frames for originality, visual hierarchy, character consistency, text readability, and performance.
5. Adjust the composition system before generating more assets.
6. Produce Priority B assets using the approved visual references.
7. Integrate screen by screen, preserving deterministic game state and interaction logic.
8. Add Priority C polish only after the complete route works with the new stage system.

### Acceptance checks for Issue Set 06

- Every major mode has a recognisable illustrated place or cinematic composition.
- Title, prologue, investigation, inquiry, cross-examination, synthesis, breakthrough, and outcome remain visually distinct.
- The apartment remains spatially coherent across views.
- Investigation visibly occurs inside the living room rather than as a set of dashboard cards.
- Active speakers are larger and visually focused while group reactions remain legible.
- Evidence is recognisable from its illustration before selection.
- Essential information remains code-rendered and readable without relying on pixels inside an image.
- UI panels no longer obscure most of the artwork at target desktop sizes.
- Artwork and crops fit 1440×900, 1366×768, and 1280×720 without horizontal overflow or inaccessible actions.
- Focus indicators and keyboard-accessible hotspots remain visible over illustrated backgrounds.
- Reduced-motion mode preserves all compositions without parallax or camera movement.
- Generated assets contain no copied franchise characters, logos, typography, courtroom designs, or distinctive interface expression.
- No artwork glamorises the device, reveals its contents, or establishes character motive.
- All required assets load locally and the meaningful route remains available offline after load.

### Planned verification

- Visual comparison of the four vertical-slice frames at all target desktop sizes.
- Check contrast and text readability over every background and lighting state.
- Keyboard-only hotspot and evidence-selection checks.
- Reduced-motion comparison for camera, parallax, and light transitions.
- Local/offline asset loading check.
- Production build size review and browser performance check after image optimisation.
- Complete hero-route and representative negative-outcome review after full integration.

### Status

- Approved plan; not implemented.
- No images have been generated and no existing asset has been replaced.
- Begin with the Priority A vertical slice only after the layout changes in Issue Set 01 establish the final image dimensions and safe UI regions.

---

## Issue Set 07 — Add quiet local background music and independent music controls

### Supplied audio

1. `yakastreams-retro-gaming-271301.mp3`
   - Intended use: courtroom/cross-examination segment.
   - Source track: `Retro gaming` by YaKaStreams.
   - Official page: https://pixabay.com/music/upbeat-retro-gaming-271301/
   - Listed duration: 4:00.
2. `pripac-calm-gaming-flow-323449.mp3`
   - Intended use: investigation segment.
   - Source track: `Calm Gaming Flow` by Pripac.
   - Official page: https://pixabay.com/music/ambient-calm-gaming-flow-323449/
   - Listed duration: 2:37.

### Licence review recorded on 22 September 2026

- Both official track pages state that the tracks are available under the Pixabay Content License.
- Pixabay's official licence summary states that content may be used for free, may be modified/adapted, and generally does not require attribution, while standalone redistribution is prohibited.
- Pixabay's official FAQ identifies incorporation into an app or game as use within a larger creative work rather than standalone redistribution.
- The `Calm Gaming Flow` track page includes a creator request to credit `Music by Pripac from Pixabay`.
- Although general attribution is optional, credit both creators as a respectful and useful provenance record.
- Preserve the official track URLs, original filenames, download date if known, and the licence-summary URL alongside the project.
- Licence summary: https://pixabay.com/service/license-summary/
- Before a public institutional release, retain a screenshot, certificate where available, or other download record in the project documentation because external track status can change.

This is a project plan, not legal advice. The game may embed the tracks as part of the experience but must not expose them as standalone downloadable audio.

### Experience goal

Music should add atmosphere without competing with dialogue, sound effects, accessibility, or live facilitation in an education setting.

- Investigation: calm, low-level ambient focus.
- Courtroom: more energetic retro tension, still substantially quieter than evidence and breakthrough sound effects.
- Transitions: smooth fades rather than abrupt starts or overlapping tracks.
- Default listening level: intentionally soft.
- Player control: music can be independently turned off without disabling interface and dramatic sound effects.

### Segment mapping

#### Investigation practice

- Use `Calm Gaming Flow` carefully as the sound associated with the portable speaker tutorial.
- It may begin at a modest, non-startling level and lower to the normal background level when the player turns the speaker down.
- Recommended relative levels: approximately 20–22% during the tutorial's `music is masking the room` state and 12–15% after the volume is lowered.
- Do not make the initial tutorial audio genuinely uncomfortable or loud.
- If this diegetic-to-background transition feels confusing in testing, keep the practice silent and begin the track only after the tutorial AHA.

#### Investigation

- Loop `Calm Gaming Flow` locally at approximately 12–15% of full media volume.
- Fade in after the practice transition or after the first user gesture when practice is skipped.
- Continue through object inspection and character inquiry without restarting from the beginning for every modal.

#### Cross-examination practice and courtroom

- Crossfade from the calm track to `Retro gaming` when the cross-examination practice begins.
- Continue the same courtroom track into the real courtroom so the tutorial-to-play transition feels continuous.
- Because this track is brighter and more energetic, start around 9–12% and tune by listening against existing effects.
- Do not treat a numeric percentage as final until it has been auditioned on laptop speakers and headphones.

#### AHA, evidence presentation, source collapse, and breakthrough scenes

- Briefly duck background music when a major sound effect or important breakthrough line plays.
- Recommended starting point: fade music to roughly 35–50% of its current segment level, then restore it smoothly.
- Do not restart the song after every AHA.
- Reduced-motion mode does not automatically disable music; audio preferences remain independent.

#### Outcomes and reset

- Fade courtroom music down as the final choice resolves.
- Reuse or continue a track only when it supports the selected ending; do not add new outcome music during this pass.
- A full restart stops the current track and resets playback position, while preserving only the player's allowed audio preferences.

### Audio controls

Add a distinct music control near the existing top-right audio/accessibility controls.

Recommended controls:

1. **Music toggle** — music-note icon with clear `Music On` / `Music Off` tooltip and `aria-pressed` state.
2. **Sound-effects toggle** — retain control over clicks, AHA, evidence presentation, and dramatic cues.

Do not use two visually identical speaker icons. The music control should use a music-note treatment; the effects/master control should use a speaker treatment with explicit labels/tooltips.

If the existing mute button remains a master mute:

- Master mute silences both music and effects.
- The separate music preference remains remembered, so unmuting restores music only if the music toggle was previously on.

If the control is simplified into separate `Music` and `Effects` toggles:

- Label both clearly.
- Avoid ambiguous icon-only state at compact widths.

Persist music-enabled, effects-enabled/master-mute, and music-volume preferences locally as non-sensitive accessibility/preferences data. Do not store gameplay or identity data with them.

### Playback architecture

- Copy approved project-bound tracks into a local `public/audio/` directory using descriptive, versioned filenames; do not reference the Downloads folder at runtime.
- Keep a human-readable attribution/provenance file beside the audio assets.
- Use a single music manager responsible for current track, looping, volume, fading, ducking, pause/resume, and cleanup.
- Avoid mounting multiple audio players that can overlap after route or modal changes.
- Begin playback only after a user interaction to satisfy browser autoplay restrictions.
- Preload only what is useful; do not delay the title screen on full audio download.
- Pause or reduce work when the tab becomes hidden and resume according to the user's preference.
- Keep all playback deterministic and local. No streaming, analytics, runtime API, or network request is allowed.
- Prevent the static server from presenting an intentional music-download UI.

### Credits and provenance

Add a concise audio-credit section to an appropriate credits/about surface and repository documentation:

- `Calm Gaming Flow — Pripac, via Pixabay`
- `Retro gaming — YaKaStreams, via Pixabay`
- `Used under the Pixabay Content License`

Include direct source links in repository documentation. The in-game credit may use plain creator/platform text if long URLs would harm the interface.

### Relationship to the visual and tutorial plans

- The top-right `Skip Tutorial` control from Issue Set 04 must remain visually distinct from Music, Sound, Reduced Motion, and Guided Help.
- Avoid crowding the header with five equally prominent buttons. Group secondary accessibility/audio controls into a compact labelled cluster or popover while keeping `Skip Tutorial` directly visible during practice.
- Music must not consume vertical space or reintroduce the crowded chrome identified in Issue Set 01.
- The speaker tutorial should communicate that the player lowered in-world music, while the music toggle communicates the player's global preference.

### Acceptance checks for Issue Set 07

- Investigation uses the local `Calm Gaming Flow` track and courtroom uses the local `Retro gaming` track.
- No core music file is loaded from a network URL.
- Music never begins before a permitted user gesture.
- Segment transitions crossfade without both tracks remaining audibly active.
- Background music is noticeably softer than dialogue reading and important effects.
- AHA, presentation, and source-collapse effects remain clear through music ducking.
- The music toggle immediately silences/resumes music without muting effects.
- The effects/master control behaves consistently and its relationship to music is clear.
- Toggle state is conveyed through label, icon, tooltip, and accessibility state—not colour alone.
- Music preference survives refresh as an allowed local preference.
- Full game reset stops/restarts playback correctly without creating duplicate audio instances.
- Reduced motion does not silently alter audio preferences.
- Tutorial skip remains visible and keyboard accessible while audio controls are present.
- Credits and source records identify both tracks and the Pixabay licence.
- Offline play after initial load includes both music tracks.

### Planned automated and manual coverage

- Unit-test segment-to-track selection and music-enabled state transitions.
- Unit-test that master mute and independent music preference restore correctly.
- Unit-test that only one current track instance is active.
- Verify full reset cleanup and preference preservation.
- Verify audio asset paths are local and no remote URL is referenced.
- Manually audition investigation and courtroom volume on laptop speakers and headphones.
- Manually check crossfades, loops, ducking, tab visibility, refresh, mute, music-off, and restart.
- Manually confirm both tutorial-skip choices while music is playing.
- Do not claim volume balance, looping quality, or browser playback verification until these listening checks are actually performed.

### Status

- Approved plan; not implemented.
- The two supplied files remain in Downloads and have not been copied, modified, or referenced by the application.
- Track pages and the Pixabay licence were verified from official Pixabay pages on 22 September 2026.

---

## Issue Set 08 — Make the hearing-to-deduction transition explicit and vary clue positions

### Screenshot reviewed

- `Screenshot 2026-09-22 040035.png` — Noah's third and final listening statement is already displayed with the deduction carousel and `Record This Statement in Case File` action.

### Player-visible problems

1. The first-pass listening phase changes directly into deduction controls while the third statement remains on screen. Because the primary button suddenly becomes `Record This Statement in Case File`, the interface implies that statement three is the intended answer or that the player is expected to record it immediately.
2. The player is not explicitly told that listening has ended and a new reasoning task has begun.
3. Every character currently places the decisive clue in statement one. Once the player notices the pattern, later inquiries become pattern matching rather than evaluating the claims.
4. Several first-pass player reflections already explain the dependency too directly. This can reveal the answer before the deduction phase begins.

### Design decision

Keep the authored, deterministic dialogue order. Do not randomise statements at runtime and do not generate interchangeable generic dialogue. Instead:

- add a distinct **account complete** transition between hearing and deduction;
- deliberately author a different fixed decisive-statement position for each character; and
- separate neutral listening observations from post-selection deduction feedback.

This preserves coherent character conversations, keeps tests deterministic and prevents the correct answer from always occupying the same slot.

### Revised interaction phases

Use five explicit inquiry phases:

1. `unseen` — character has not been opened during this run;
2. `hearing` — statements are presented once in authored order;
3. `review_intro` — listening is complete and the reasoning task is explained;
4. `deduction` — the player reviews and selects one statement;
5. `resolved` — the clue and its limits are explained after the AHA transition.

#### End of the hearing phase

- Statements one and two use `Next Statement`.
- Statement three still uses a forward action, labelled `Finish Listening` or `Continue`; it must never display the record action during the first pass.
- Activating it opens a short transition state rather than immediately showing the carousel.

#### Account-complete transition

Replace the spoken-statement panel temporarily with a concise transition card:

- eyebrow: `Account complete · 3 statements heard`;
- heading: `Now identify the weak link`;
- instruction: `Review all three statements. Record the one that directly reveals where this person's confidence came from.`;
- clarification: `Useful context is not always the decisive clue.`;
- primary action: `Review the statements`.

The record button, left/right carousel and selection feedback appear only after the player deliberately enters deduction mode. Move keyboard focus to the transition heading and announce the phase change through an `aria-live` region.

### Deterministic clue-position plan

Use all three positions exactly once across the current cast:

| Character | Decisive position | Authored account order |
| --- | ---: | --- |
| Ryan | 1 of 3 | Independent proof/seller reliance → why he counted three confirmations → source accountability |
| Alyssa | 2 of 3 | Immediate condition cannot verify safety → she did not inspect and relied on Ryan → no independent documentation |
| Noah | 3 of 3 | Friendship made Ryan persuasive → Noah has no firsthand knowledge → he treated Alyssa/Ryan's confidence as verification |

This ordering is fixed, not random. Each sequence should read naturally as a short escalation from social context to uncertainty to the precise reliance admission.

### Copy and information hierarchy

Split each statement's supporting copy into three fields:

- `listeningObservation` — neutral and non-revealing context shown during the first pass;
- `wrongSelectionFeedback` — specific explanation shown only after an incorrect deduction;
- `resolutionExplanation` — the complete reasoning shown only after the correct selection and AHA.

During listening, avoid labels such as `key testimony`, coloured answer cues, or reflections that explicitly say who relied on whom. The player may notice suspicious wording, but the interface must not solve the deduction for them.

### Continuity requirements

- Closing on statement three before `Finish Listening` returns to statement three on reopen.
- Closing on `review_intro` returns to the account-complete transition on reopen.
- Closing during deduction restores the current carousel index and previously attempted wrong choices.
- Reopening a resolved character returns to the resolved summary and never replays the transition or AHA.
- A full restart clears all five-phase inquiry states.

### Feedback and safety boundaries

- Wrong selections remain inside the inquiry and never add evidence or consume courtroom attempts.
- Feedback explains why a statement is contextual rather than decisive; it must never describe that statement as proof of safety.
- Correct resolution identifies the reliance or assumption but does not infer contents, safety, seller honesty, or Ryan's motive.
- Preserve the existing separation between character testimony, phone evidence and the sealed-box evidence gate.

### Implementation outline

1. Replace the current boolean `hasCompletedFirstPass` model with the explicit inquiry phase enum.
2. Add `review_intro` rendering to `CharacterQuestionModal` with a fixed action area and no record control.
3. Move statement content into authored per-character data with separate listening, error and resolution copy.
4. Reorder Alyssa and Noah's authored sequences according to the table while retaining the same decisive evidence IDs and overall narrative facts.
5. Start every deduction carousel at statement one, independently of which statement ended the listening phase.
6. Persist phase, hearing index, review index and attempted wrong statement IDs in `InquiryProgressMap`.
7. Keep the existing two-column viewport-fit layout, focus styling, keyboard arrows, touch targets and reduced-motion behaviour.

### Acceptance checks

- The record action never appears while hearing statements one, two or three.
- Statement three has an explicit forward action and is followed by the account-complete transition.
- Deduction controls appear only after `Review the statements` is activated.
- Deduction starts at statement one rather than inheriting statement three from the hearing phase.
- Ryan, Alyssa and Noah have decisive clues in positions one, two and three respectively.
- Each authored sequence remains coherent when heard in order; no runtime shuffling occurs.
- Listening observations do not reveal the correct answer.
- Wrong and correct selections retain the behaviour, AHA payoff, continuity and evidence safeguards from Issue Set 02.
- Pointer, keyboard and touch paths can complete the transition and deduction.
- The interaction fits the supported desktop viewport without introducing a modal scrollbar.

### Planned automated coverage

- All three hearing statements use listening actions and expose no record control.
- Completing statement three enters `review_intro`, not `deduction` directly.
- `Review the statements` enters deduction at index zero.
- The decisive indexes are unique and cover `[0, 1, 2]` across Ryan, Alyssa and Noah.
- Phase and indexes survive close/reopen and clear on full reset.
- Wrong selections add no evidence; correct selections add the same designated evidence exactly once.

### Status

- Implemented locally on 22 September 2026; not committed or pushed.
- Added explicit hearing, account-complete, deduction and resolved phases with persistent indexes and wrong-choice history.
- Ryan, Alyssa and Noah now place their decisive clues at positions one, two and three respectively, with neutral listening observations and contextual deduction feedback.
- Automated coverage confirms the fixed clue positions and the hearing-to-review transition.

---

## Issue Set 09 — Replace simulated tutorial slides with live-control spotlight walkthroughs

### Screenshots reviewed

1. `Screenshot 2026-09-22 040205.png` — The current cross-examination practice is visually polished but remains a separate five-step instruction screen. The player repeatedly activates `Do This Action` rather than operating the courtroom controls they are meant to learn.
2. `example of a tutorial 2.png` — Reference for dimming the surrounding interface, lifting one live control and anchoring a short pointer callout directly beside it.
3. `example of a tutorial.png` — Reference for a compact coachmark attached to the relevant part of an otherwise usable interface.

The reference screenshots communicate interaction structure only. Do not copy their branding, colours, typography, icons, layouts or other distinctive visual expression.

### Player-visible problem

The current cross-examination practice explains five actions inside a tutorial-only modal, but those actions are represented by one generic button. The player reads `Press`, `Pin`, `Open case notes`, `Select evidence` and `Present`, yet never builds spatial or motor familiarity with the actual courtroom interface.

The speaker practice is more interactive, but it still concentrates instructions inside its inspection modal instead of consistently pointing to each live control. Both tutorials should teach by temporarily annotating the real interface, not by recreating that interface as explanatory slides.

### Design decision

Replace the current `CrossExamPractice` slide/modal and remaining instructional tutorial panels with one reusable **guided spotlight system** layered over production controls.

At every step:

1. render the same control the player will use in normal play;
2. dim and block unrelated controls;
3. visually lift the exact active target;
4. attach one concise coachmark with an arrow pointing at that target; and
5. advance only when the player successfully operates the highlighted control.

There is no generic `Do This Action` or `Next` button for actionable steps. A coachmark may contain `Got it` only for a non-interactive bridge or completion message.

### Reusable spotlight architecture

Create a shared `GuidedSpotlight`/`CoachmarkOverlay` system rather than positioning tutorial bubbles independently in each component.

#### Target registration

- Give tutorial-capable production controls stable semantic IDs such as:
  - `investigation-speaker-hotspot`;
  - `speaker-rotate-right`;
  - `speaker-volume-dial`;
  - `speaker-turn-down`;
  - `practice-press-statement`;
  - `practice-pin-claim`;
  - `practice-open-case-notes`;
  - `practice-evidence-speaker-volume`;
  - `practice-present-evidence`.
- Prefer a small target registry or React refs over querying presentation classes or visible text.
- The production control remains the actual click, keyboard and touch target. Do not place a fake button above it.

#### Scrim and input behaviour

- Render the tutorial overlay through a top-level portal so it is not clipped by scene or drawer overflow.
- Calculate the target's viewport rectangle with `getBoundingClientRect()` and add a comfortable focus margin.
- Use four surrounding scrim regions or an equivalent mask that leaves the target physically operable.
- Block pointer interaction outside the active target and skip control. Clicking the dimmed area may gently pulse the target or repeat the hint; it must not advance the tutorial.
- Recalculate target geometry after resize, compact-height changes, drawer/modal transitions and relevant content changes.
- Wait for dynamically mounted targets—especially evidence cards inside the drawer—before positioning the coachmark. Never point at stale coordinates.

#### Coachmark placement

- Anchor the coachmark above, below, left or right of the target according to available space.
- Keep at least 16 px from viewport edges and never cover the target, fixed action footer or `Skip Tutorial` control.
- Use a short pointer/arrow that terminates at the target edge.
- Maximum copy per step: one action sentence plus one short reason or hint.
- Keep a small `Step N of M` indicator, but remove large tutorial headings and explanatory paragraphs from the stage.
- Match Trust Me Bro's original amber/cyan psychological-thriller visual language; do not imitate the reference apps' styling.

#### Accessibility and controls

- Focus the live target when a step begins when doing so will not unexpectedly activate it.
- Associate the coachmark through `aria-describedby` and announce step changes with a polite live region.
- Preserve visible focus indicators and normal Enter/Space activation.
- For rotation, accept drag, swipe, arrow buttons and keyboard A/D or arrow keys; any valid completed rotation advances the same step.
- Support `Escape` only according to a deliberate policy: open the skip confirmation rather than silently abandoning partial practice.
- Reduced-motion mode moves the spotlight instantly and replaces pulsing/animated arrows with static emphasis.

### Investigation walkthrough — operate the actual speaker

Use the dedicated pre-investigation practice room and existing speaker inspection, but replace its instruction panel with live coachmarks.

1. **Select speaker**
   - Target: the portable speaker on the coffee table.
   - Coachmark: `The music is masking the conversation. Select the speaker.`
   - Success event: the real speaker inspection opens.
2. **Rotate object**
   - Target: the speaker render plus its visible rotation affordances.
   - Coachmark: `Rotate the speaker to inspect another side.`
   - Success event: one valid drag, swipe, arrow-button or keyboard rotation.
3. **Reach the rear view**
   - Keep the rotation target active.
   - Coachmark: `Keep looking until you find a control that can change the room.`
   - Success event: the back view is visible.
4. **Select volume dial**
   - Target: the real dial hotspot.
   - Coachmark: `You found the volume control. Inspect it.`
   - Success event: dial selected.
5. **Turn music down**
   - Target: the real `Turn Music Down` control.
   - Coachmark: `Lower the music so everyone can hear one another.`
   - Success event: volume action completes.
6. **Payoff and bridge**
   - Play the clue-style AHA.
   - Show one short non-interactive bridge: `Important observations can be recorded. Now investigate the real room.`
   - Enter the untouched investigation.

The speaker remains practice-only and cannot enter the case file or satisfy an evidence gate.

### Cross-examination walkthrough — operate the production courtroom

Render a sandboxed practice exchange through the same courtroom, dialogue and evidence-workspace components used by the real case. Feed them tutorial-only state and callbacks instead of recreating their appearance in a separate modal.

Practice content remains:

- Noah: `The music was fine. Everyone could hear what was being said.`
- Temporary observation: `The speaker volume was masking the conversation until it was turned down.`
- Harmless correction: `MUSIC WAS FINE → MUSIC MASKED THE ROOM`.

#### Live action sequence

1. **Press statement**
   - Target: Noah's actual practice `Press` control.
   - Coachmark: `Press Noah's statement to hear the exact claim.`
   - Advance from the real press callback.
2. **Pin claim**
   - Target: the actual practice claim/pin control.
   - Coachmark: `Pin the precise claim you want to test.`
   - Advance only when the harmless music claim is pinned.
3. **Open Case Notes**
   - Target: the real `Case Notes` button.
   - Coachmark: `Open your notes and find an observation that addresses the claim.`
   - Advance when the real evidence workspace opens.
4. **Select evidence**
   - Target: the temporary speaker-volume evidence card inside the wide evidence workspace.
   - Coachmark: `Select the observation that directly contradicts the pinned claim.`
   - Wrong practice cards may be visible but cannot advance the step; if selected, provide one brief explanation and return focus to the correct reasoning task.
5. **Present evidence**
   - Target: the real fixed presentation button.
   - Coachmark: `Present it. Selecting evidence alone does not submit your argument.`
   - Advance from the real presentation callback.
6. **Payoff and transition**
   - Trigger the normal AHA/breakthrough treatment for the harmless correction.
   - Show `Practice complete. Now test the group's real claims.`
   - Dispose of every practice object and enter the real courtroom with all four gates unresolved.

### Practice-state isolation

- Create a dedicated tutorial state container with a temporary claim, temporary evidence card, selected practice evidence and tutorial step.
- Never merge tutorial evidence into `collectedQuotes`, investigation readiness, source clarifications or the real evidence drawer state.
- Never call real gate-correction, exchange-miss, ending or source-card handlers from practice callbacks.
- Completing or skipping the practice must leave all four real gates unresolved and all real attempt counters untouched.
- Replaying practice from Guided Help must snapshot and restore the exact originating route, selected claim, evidence selection, drawer state and modal state.

### Skip behaviour

- Keep `Skip Tutorial` fixed at the top-right above the scrim throughout both walkthroughs.
- Skip opens a compact confirmation outside the spotlight flow:
  - `Skip This Practice`;
  - `Skip All Tutorials This Run`;
  - `Continue Practice`.
- Explain that no evidence or case gate will be completed.
- After skipping, remove the coachmark, temporary state and scrim before loading the untouched real segment.

### Contextual help after onboarding

Rename the permanent help entry to `Guided Help` and provide:

- `Show next action` — temporarily spotlights the relevant real control;
- `Replay speaker practice`;
- `Replay cross-examination practice` after that segment is available;
- `Controls & accessibility`.

Do not bring back a multi-page how-to-play modal as the primary teaching experience.

### Implementation outline

1. Add the portal-based spotlight/coachmark primitive and stable target registry.
2. Add geometry/placement logic with resize and dynamic-target observation.
3. Convert speaker practice to render its current real controls without the side instruction panel.
4. Refactor the practice exchange to compose production `RoomBackground`, `DialogueBox` and `EvidenceDrawer` with isolated tutorial data.
5. Advance tutorial state only from each target control's existing success callback.
6. Remove the current generic-action `CrossExamPractice` slide UI after the live walkthrough is functional.
7. Route delayed hints and `Show next action` through the same coachmark primitive.
8. Add skip confirmation, replay snapshot/restore and reduced-motion behaviour.

### Acceptance checks

- No tutorial action is completed through a generic `Do This Action` or explanatory `Next` button.
- Every actionable step points to and requires the exact live production control.
- Unrelated clicks cannot advance the walkthrough or mutate real game state.
- Coachmarks remain attached to targets when opening the speaker inspector and evidence workspace.
- The callout never covers its target, fixed footer or skip control at 1440×900, 1366×768 and 1280×720.
- Pointer, keyboard and touch-equivalent controls can complete both walkthroughs.
- Investigation practice awards no evidence and starts the real investigation untouched.
- Courtroom practice resolves no real gate, spends no attempt and reveals no real-case answer.
- Both successful practice flows retain their AHA payoffs.
- Skip and replay preserve the isolation and restoration rules.
- Reduced motion, music/SFX controls and visible focus continue to work.

### Planned automated and manual coverage

- Unit-test the step reducer: only the expected success event advances each step.
- Unit-test that outside/unrelated actions do not advance steps.
- Unit-test speaker practice cannot produce a case-file item.
- Unit-test courtroom practice callbacks never mutate real evidence, attempts, gates or source state.
- Component-test target discovery and coachmark repositioning after the evidence drawer opens.
- Component-test skip cleanup and replay snapshot restoration.
- Keyboard-test every spotlighted target and skip confirmation.
- Manually verify arrow placement, target cut-outs and non-overlap at all three desktop viewports.
- Manually verify pointer, keyboard, drag and touch-emulation paths before claiming them verified.

### Status

- Implemented locally on 22 September 2026; not committed or pushed.
- Added a portal-based live-control spotlight used by the speaker practice and an isolated courtroom practice composed from the production dialogue and evidence components.
- The permanent entry is now `Guided Help`, with replay actions for the practice available in the relevant segment.
- Browser/viewport visual verification remains pending owner testing; no visual-layout claim has been made from automated tests alone.

---

## Issue Set 10 — Offer immersive fullscreen and preserve the full game in windowed viewports

### Screenshot reviewed

- `Screenshot 2026-09-22 040232.png` — At a wide but browser-windowed viewport, the room and claim framing are visible while the actual `Press Ryan on this statement` choices fall below the fold. The full experience becomes visible only after entering browser fullscreen.

### Player-visible problems

1. The game is more legible and immersive in fullscreen, but it never recommends or offers that mode.
2. Browser chrome reduces the available CSS viewport height even on a large monitor. The courtroom stacks the room stage, gate row, pinned statement, speaker row, dialogue and press choices vertically, so the press controls are clipped.
3. Fullscreen currently acts as an accidental layout requirement. Players who decline fullscreen, cannot use it, or exit it with Escape must still be able to see and operate the complete courtroom.

### Design decision

Implement both parts together:

1. Add an optional cinematic fullscreen recommendation immediately after `Enter the Room` on the title screen.
2. Recompose the courtroom around the actual browser viewport so all primary controls fit without document scrolling in ordinary windowed play.

Fullscreen is an enhancement for immersion, never a prerequisite or substitute for responsive layout.

### Fullscreen recommendation flow

Insert a lightweight `display mode` step between the title screen and character setup.

#### Presentation

- Use a restrained full-screen overlay over the living-room artwork rather than an operating-system-style warning.
- Heading: `For the clearest investigation`.
- Copy: `Fullscreen removes browser distractions and gives the room, dialogue and evidence more space.`
- Primary action: `Enter Fullscreen`.
- Secondary action: `Continue Windowed`.
- Show an honest shortcut hint: `F11 may toggle browser fullscreen on desktop. N continues windowed.`
- Do not imply that fullscreen is mandatory or that declining produces an inferior/unsupported game.

#### Browser/API behaviour

- `Enter Fullscreen` calls the standard Fullscreen API from that direct user gesture, preferably on the application root element.
- Check `document.fullscreenEnabled` before offering the API action. If unavailable, keep `Continue Windowed` prominent and explain that the game still works normally.
- Catch denied or failed fullscreen promises and show a brief inline message without blocking progression.
- Listen to `fullscreenchange` so the interface updates when the player exits with Escape or browser controls.
- Do not attempt to synthesize or intercept F11. Browsers reserve that key and browser-level fullscreen may not update `document.fullscreenElement`; present it only as an optional browser shortcut.
- Bind `N` to `Continue Windowed` while this display-mode overlay is active. Ignore the shortcut when a text field or editable control has focus.
- A primary-button Enter/Space activation must work normally.
- Do not automatically enter fullscreen without an explicit player gesture.

#### Prompt frequency and later control

- Show the recommendation once per page session when the player first leaves the title screen.
- Returning to the title during the same run should not repeatedly interrupt the player.
- A fresh page load may show it again; do not store a long-term fullscreen preference unless later testing requests it.
- Add a compact `Enter Fullscreen`/`Exit Fullscreen` action under the game's display/accessibility controls so the player can change modes later.
- Exiting fullscreen must immediately fall back to the fully usable compact windowed layout.

### Courtroom viewport reflow

Build a single explicit height budget from the *actual CSS viewport* (`100dvh`/`window.innerHeight`), not the monitor resolution. Browser toolbar height therefore reduces the stage automatically instead of pushing controls below the fold.

#### Shared courtroom shell

- Root gameplay shell: `height: 100dvh; overflow: hidden` with `min-height: 0` through every grid/flex ancestor.
- Reserve measured rows for compact navigation and scene framing, then give the remaining space to the courtroom interaction panel.
- No page-level vertical scrollbar during standard courtroom play.
- Keep case notes, source synthesis and other large workspaces as viewport overlays rather than allowing them to expand the base document.

#### Compact navigation

- At short viewport heights, collapse the micro case bar into the main navigation or hide its descriptive subtitle.
- Keep the title, Case Progress, music/SFX/display controls and Guided Help available without a second tall header row.
- Group secondary controls instead of shrinking every icon below comfortable target sizes.

#### Room-stage budget

- Use a responsive room height such as `clamp(180px, 28dvh, 300px)` rather than letting the room consume all flexible height.
- Crop character art cinematically at compact heights; do not uniformly scale the characters into small thumbnails.
- Preserve the active-speaker emphasis and readable group reactions.
- Reduce decorative top/bottom padding before reducing character visibility.

#### Courtroom interaction composition

At desktop widths, reorganise the post-room panel horizontally:

- Fixed compact top strip: gate selector, Source Synthesis and Case Notes.
- Fixed compact claim strip: pinned statement, room-attention state and contradiction action.
- Remaining content area: two-column layout.
  - Left: active speaker name, current statement/reaction and player thought.
  - Right: the `Press` options or current contextual action.
- Keep at least the current two press choices visible without scrolling at common compact-height browser windows.
- When a reaction or mismatch message appears, replace content inside its allocated region rather than increasing total panel height.
- Move the final deliberation into the same bounded content region or a focused overlay instead of appending another large section below it.

#### Emergency overflow policy

- The target experience uses no courtroom document scroll at the supported desktop sizes.
- If an unusually small viewport or enlarged text genuinely cannot fit, allow one intentional scroll region inside the variable press/dialogue content—not on the page and not around fixed gate/action controls.
- Never hide the currently required action below that emergency region.

### Whole-game display-parity audit

Apply the viewport contract to the complete hero route, not only the courtroom screenshot. Fullscreen and windowed play may use different cropping and spacing because their available height differs, but they must preserve the same screen structure, information, controls and progression actions.

Audit and reflow every major state:

1. Title and display-mode prompt.
2. Player setup.
3. Prologue/story scenes.
4. Speaker practice and its spotlight coachmarks.
5. Main investigation room.
6. Object inspection and character inquiry.
7. Investigation case-file preview.
8. Cross-examination practice and real courtroom.
9. Full Case Notes/evidence workspace.
10. Case Progress and Source Synthesis.
11. AHA cut-ins, presentation overlays and breakthrough dialogue.
12. Final deliberation, all four outcomes and debrief.
13. Retry, reconsideration and clean restart routes.

#### Display parity definition

`Same view` does not require identical pixel dimensions. It requires functional and compositional parity:

- the same primary sections appear in the same logical order;
- no information, evidence identity, dialogue, status or action disappears in windowed mode;
- the same action remains visually discoverable and reachable;
- character and evidence art retain useful scale rather than becoming thumbnails;
- only decorative spacing, cinematic crop and nonessential metadata may reduce at shorter heights;
- fullscreen must not reveal extra gameplay information that windowed players cannot access;
- moving between modes does not reset, close or change the current gameplay state.

### Evidence workspace requirements in both modes

The Case Notes/evidence workspace is a priority parity check because it previously became narrow and compressed.

- Preserve the wide workspace treatment in both modes: approximately 88–92vw with a large-screen cap, not a narrow right drawer.
- Use the same evidence grid, pinned claim/context rail, selected-evidence preview and fixed presentation action in fullscreen and windowed mode.
- Respond primarily to available height by tightening header/filter spacing and the number of visible grid rows; do not collapse the workspace back into a narrow column.
- Evidence cards must retain a legible thumbnail, title, category, concise observation and selection state before presentation.
- Keep the pinned claim and `Present Evidence` action visible while only the evidence-results region scrolls when necessary.
- At 1280×640 windowed size, show at least two clearly identifiable evidence choices at once without covering the context rail or footer action.
- Opening or closing the evidence workspace must not alter the underlying exchange, selected claim, attempts or fullscreen state.
- Recalculate spotlight/coachmark targets after the workspace opens in either display mode.

### Overlay and modal parity contract

- Every large overlay uses `100dvh`, a fixed header, `min-height: 0` flexible body and fixed required-action footer.
- Never combine page scrolling with a second modal scrollbar.
- Character inquiry, breakthrough and outcome screens should recompose horizontally or crop artwork before reducing text readability.
- Source Synthesis keeps its manual links and collapse action visible; the evidence grid and ending debrief use one intentional content region only when content truly varies.
- AHA and transition overlays cover the current viewport identically in both modes and respect reduced motion.
- On `fullscreenchange`, remeasure open overlays and coachmarks in place rather than closing/reopening them.

### Supported viewport matrix

Test both fullscreen and browser-windowed CSS viewport sizes. The windowed checks must include reduced heights caused by browser chrome, not only nominal screen resolutions.

Minimum planned checks:

| Mode | CSS viewport to verify | Expected behaviour |
| --- | --- | --- |
| Fullscreen | 1920×1080 | Maximum cinematic room framing; all courtroom controls visible |
| Fullscreen | 1440×900 | Full room and dialogue composition visible |
| Windowed | 1440×780 | Compact navigation and cropped room; press controls visible |
| Windowed | 1366×650 | Short-height courtroom composition; no page scroll |
| Windowed | 1280×640 | Minimum showcase layout; fixed required actions remain visible |

The implementation should respond to available CSS pixels rather than user-agent or device detection.

### Accessibility and user choice

- Treat fullscreen as optional and describe why it helps without pressuring the player.
- Announce fullscreen success/failure and display-mode changes accessibly.
- Do not trap keyboard focus after entering fullscreen.
- Keep Escape's native fullscreen-exit behaviour.
- Preserve reduced motion, audio preferences, visible focus and zoom/readability.
- Do not hide essential content solely because the player declined fullscreen.

### Implementation outline

1. Add a `displayModePrompt` state between title and setup plus a session-scoped `hasSeenDisplayPrompt` flag.
2. Add a small fullscreen controller/hook for feature detection, request/exit, errors and `fullscreenchange` cleanup.
3. Add the optional fullscreen control to the compact display/accessibility menu.
4. Convert the courtroom route to an explicit `100dvh` grid with measured navigation, room and interaction rows.
5. Recompose `DialogueBox` into compact fixed strips plus a two-column flexible content area.
6. Make room height responsive to viewport height and add short-height breakpoints based on CSS height.
7. Keep the real press choices, evidence action and final deliberation inside the shared remaining-height budget.
8. Apply the shared viewport/overlay shell to the full route and explicitly re-audit the evidence workspace at compact windowed heights.
9. Verify that entering or exiting fullscreen at any route or open overlay causes a clean in-place reflow without resetting game state.

### Acceptance checks

- Selecting `Enter the Room` shows the display-mode recommendation once per page session before setup.
- `Enter Fullscreen` uses the Fullscreen API only from the player's click/keyboard activation.
- `Continue Windowed` and the `N` shortcut proceed without requesting fullscreen.
- Unsupported or denied fullscreen never blocks the game.
- Escape/browser exit returns to windowed play without state loss.
- A later control can enter or exit fullscreen.
- At every viewport in the matrix, the active claim and its `Press` choices are visible without page scrolling.
- Windowed play exposes the same gameplay information and actions as fullscreen play.
- Every route and overlay in the whole-game audit retains display parity between fullscreen and windowed modes.
- The evidence workspace remains wide and legible in windowed mode; it never regresses to a compressed narrow drawer.
- Evidence identity, pinned claim, selection state and presentation action remain simultaneously understandable in both modes.
- Mismatch feedback, collected-quote notices and character reactions do not grow the base panel beyond the viewport.
- Evidence drawer, Source Synthesis, breakthroughs and endings continue to open as bounded overlays.
- Keyboard focus, audio controls, reduced motion and tutorial coachmarks remain usable in both display modes.

### Planned automated and manual coverage

- Unit-test display prompt progression and once-per-session behaviour.
- Unit-test Fullscreen API supported, unsupported, resolved and rejected paths with mocked browser APIs.
- Unit-test `fullscreenchange` state updates and listener cleanup.
- Unit-test `N` only dismisses the active display prompt and does not fire in editable fields.
- Component-test that compact-height state renders the press controls in the bounded courtroom region.
- Component-test the evidence workspace at 1280×640 and assert that the grid, context rail and fixed presentation action remain present.
- Exercise entering/exiting fullscreen from the prompt and later display control.
- Manually inspect the complete hero route and relevant retry/reconsideration routes at every CSS viewport in the matrix.
- Open Case Notes, character inquiry, Source Synthesis, breakthrough and outcome/debrief before and after each display-mode transition.
- Verify the same active exchange before fullscreen, in fullscreen and after exiting fullscreen without state reset.
- Do not claim fullscreen, browser-chrome or viewport verification until these checks are actually performed.

### Status

- Implemented locally on 22 September 2026; not committed or pushed.
- Added the once-per-page-session display-mode prompt, Fullscreen API error handling, windowed continuation shortcut and later fullscreen toggle.
- Reflowed the courtroom into an explicit dynamic-viewport grid and widened/compacted the evidence workspace for short desktop windows.
- Automated type/build checks cover code integrity; manual verification at the named desktop viewport sizes remains pending owner testing.

---

## Issue Set 11 — Complete and integrate the visual asset pack

### Screenshot reviewed

- `Screenshot 2026-09-22 040440.png` — The Case Notes workspace uses simple cartoon/SVG witness avatars for Noah and Ryan even though the main scenes use higher-quality original psychological-anime character artwork.

### Assessment: missing assets versus missing integration

The immediate witness-card inconsistency is primarily an integration problem, not proof that every character must be regenerated.

High-quality transparent character assets already exist:

- `public/art/characters/v2/ryan.png`
- `public/art/characters/v2/ryan-shocked.png`
- `public/art/characters/v2/noah.png`
- `public/art/characters/v2/noah-alarmed.png`
- `public/art/characters/v2/alyssa.png`
- `public/art/characters/v2/alyssa-worried.png`
- `public/art/characters/v2/player-male.png`
- `public/art/characters/v2/player-female.png`

The evidence UI still routes `box`, `pod`, `phone`, `alyssa`, `ryan`, `noah` and `source_map` through legacy inline SVG illustrations in `EvidenceThumbnail.tsx`. Therefore:

- witness evidence can be upgraded immediately by cropping and styling existing character art;
- the generated sealed-box hero can be reused more consistently;
- several object, expression and narrative assets are genuinely still missing.

### Design decision

Create one coherent Trust Me Bro asset system rather than replacing isolated thumbnails ad hoc.

The system should:

- preserve character identity between story scenes, evidence cards, presentations and outcomes;
- distinguish evidence items through intentional artwork, crop and expression;
- keep factual text in HTML/code instead of baking important wording into generated images;
- maintain the original Singapore midnight psychological-anime social-thriller identity;
- remain locally bundled, deterministic and reviewable;
- avoid copying any named game's characters, compositions, courtroom, typography or effects.

### Priority A — Integrate the character art that already exists

This is the immediate fix for the screenshot and does not require ImageGen.

1. Replace legacy witness-avatar SVGs in evidence cards with the existing v2 character PNGs.
2. Use consistent head-and-shoulder crops inside the evidence thumbnail frame rather than shrinking the full transparent figure until the face is unreadable.
3. Give each evidence item an intentional expression/crop:
   - Noah's statement of reliance: thoughtful or skeptical Noah;
   - Ryan's source admission: defensive or shocked Ryan;
   - Alyssa's assumption: worried Alyssa;
   - any secondary Ryan testimony: a distinct crop or expression from the source admission.
4. Use the same mapping in:
   - Case Notes evidence cards;
   - selected-evidence preview;
   - presentation overlay;
   - investigation case-file preview;
   - any compact evidence notification that displays artwork.
5. Remove emoji, simplified face drawings and warning/chat symbols from the character portraits. Evidence category/status remains separate UI chrome.

### Evidence visual data model

Replace the generic `thumbnailType`-only selection with an evidence-specific visual manifest.

Suggested model:

```ts
interface EvidenceVisual {
  thumbnailSrc?: string;
  heroSrc?: string;
  kind: 'character' | 'object' | 'device' | 'diagram';
  characterId?: CharacterId;
  expression?: CharacterExpression;
  objectPosition?: string;
  cropVariant?: 'portrait' | 'object-closeup' | 'wide-context';
  alt: string;
}
```

Each evidence record should reference one manifest entry. The renderer must have an explicit fallback, but automated coverage should fail when a production clue accidentally relies on it.

Benefits:

- two clues about Ryan can use different expressions or crops;
- thumbnails and large previews can use related but appropriately composed assets;
- art changes no longer require adding another large conditional block to `EvidenceThumbnail`;
- accessibility text and focal points remain reviewable alongside each asset.

### Priority A — Reuse the sealed-box artwork everywhere appropriate

Available asset:

- `public/art/evidence/sealed-box-hero.png`

Planned integration:

- sealed-box evidence thumbnail;
- large evidence preview;
- presentation overlay;
- inspection-modal environmental plate where useful.

Create responsive crops from the same source before generating duplicate box illustrations. Preserve the visible sliced seal and blank fields, but never imply that the packaging verifies contents or safety.

### Priority B — Complete the core evidence-object pack

#### Exterior cartridge/pod

Create an original non-glamorous exterior evidence render:

- neutral three-quarter close-up;
- clear exterior silhouette and unmarked surfaces;
- no readable brand, seller or flavour marketing;
- no smoke, use pose or aspirational lighting;
- no visual claim about the liquid or contents;
- thumbnail and hero crops.

#### Phone/chat device

Create the physical phone/device frame and cinematic room reflections as artwork, but render all exact chat messages as HTML/CSS:

- generated images must not contain essential text;
- the seller remains unidentified and unverified;
- no contact handle, marketplace instructions or acquisition route;
- thumbnail may show the device silhouette; large preview shows the coded message layer.

#### Portable speaker

Create a consistent original speaker asset for the investigation tutorial:

- front, side and rear views or a single rotatable-feeling set;
- clearly identifiable rear volume dial;
- ordinary consumer object, visually separate from evidence;
- never appears in the real evidence manifest or inventory.

#### Source Synthesis card

Prefer a code-rendered diagram for nodes, labels and links so its state and wording remain exact and accessible.

Artwork may supply:

- blueprint-paper texture;
- restrained frame treatment;
- subtle original iconography.

Do not bake the dependency labels into a generated bitmap. The same live diagram should scale between the synthesis workspace, case card and presentation overlay.

### Priority B — Expand the character expression pack

The existing renderer maps several semantic expressions onto only one base or one reaction image. Generate identity-preserving transparent PNG variants using each existing character as the reference.

#### Ryan

- confident/casual host;
- defensive;
- shocked breakthrough;
- unsettled/uncertain;
- reflective/de-escalated.

#### Noah

- relaxed/agreeable;
- thoughtful/skeptical;
- alarmed;
- realization;
- concerned.

#### Alyssa

- detached/neutral;
- uncertain;
- worried;
- defensive reaction;
- realization/resolved.

#### Player — male and female

- neutral listening;
- analytical/thinking;
- determined presentation;
- shocked reaction;
- reflective outcome pose.

Requirements for every variant:

- identical face, hairstyle, outfit and accessories to the approved base character;
- consistent proportions, rendering, line treatment and transparent background;
- pose/expression readable at both large stage scale and evidence-thumbnail crop;
- no copyrighted character resemblance or distinctive borrowed pose;
- no unexpected object, text, logo, smoke or device added to the character.

### Priority C — Complete the environmental camera-plate pack

Available:

- `public/art/living-room-ensemble.png`
- `public/art/environments/living-room-empty-master.png`

Derive useful camera plates from the existing master before generating wholly new rooms:

1. Coffee-table investigation crop.
2. Ryan-focused conversational angle.
3. Noah-focused armchair angle.
4. Alyssa-focused sofa angle.
5. Player-seat/reverse angle showing the social position of the player.
6. Wide group/courtroom confrontation composition.
7. Breakthrough lighting state.
8. Quiet post-decision/outcome lighting state.

Implementation preference:

- use CSS cropping, layered gradients and separately composited transparent characters where that creates sufficient variation;
- generate a new plate only when perspective, foreground occlusion or lighting cannot be achieved convincingly from the master;
- maintain consistent furniture, skyline, time of night and spatial continuity between angles.

### Priority C — Presentation and breakthrough visual variants

Optional but included in the full pack:

- player analytical close-up before presenting evidence;
- active witness reaction close-up after a correct contradiction;
- group reaction strip where background characters remain legible;
- three-to-one Source Synthesis collapse tableau;
- foreground light/shadow overlays for rising tension;
- restrained speed-line, glass-reflection and evidence-flash textures.

Prefer code-driven motion and reusable transparent layers to generating a separate flattened image for every gate.

### Priority D — Outcome tableaux

Optional bespoke illustrations for the four outcome families:

#### Break the Chain

- calm refusal and group de-escalation;
- optional alienating/accusatory communication variant using the same reasoning outcome;
- device remains put away and contents remain unknown.

#### False Consensus

- the group visibly relaxing after repeated reassurance while the source remains unresolved;
- composition communicates circular validation, not verified safety.

#### The Guess

- player overclaims, Ryan challenges the unsupported certainty, group becomes dismissive;
- never depict or identify a substance.

#### The Next Voice

- immediate cognitive dissonance after acting against the evidence;
- later repair scene where the player corrects the reassurance chain;
- avoid medical, police or substance imagery that would establish an unapproved factual outcome.

These tableaux should support the staged outcome/debrief flow and remain secondary to finishing the core character/evidence pack.

### Priority D — Optional title, transition and help artwork

- Title-screen empty-room or doorway variant with deliberate logo safe area.
- `Enter the Room` display-mode/fullscreen prompt backdrop.
- Investigation-to-courtroom confrontation transition accents that preserve the existing transition timing.
- Guided Help/replay-practice thumbnail art.
- Credits/about art panel that accommodates music and artwork attribution.

These are polish items and must not delay evidence readability, expression coverage or viewport work.

### Asset-production workflow

1. Establish the manifest, naming convention, dimensions and safe crop zones before generating batches.
2. Use existing Trust Me Bro assets as identity/environment references.
3. Generate one approved reference variant per character/object before creating the full batch.
4. Review identity consistency, hands, transparency, silhouette and lighting at original resolution.
5. Create or derive thumbnail and hero crops without overwriting source masters.
6. Compress web delivery copies while retaining working masters outside the runtime bundle if needed.
7. Place approved runtime assets under versioned local paths such as:
   - `public/art/characters/v3/`;
   - `public/art/evidence/v2/`;
   - `public/art/environments/v2/`;
   - `public/art/outcomes/v1/`.
8. Record generation date, prompt intent, source references and intended screens in a local asset manifest/readme.
9. Wire assets only after visual review; retain the current version until its replacement is accepted.

### Safety and accuracy constraints

- Never depict or reveal the device's contents.
- Never visually establish that Ryan or the seller is honest or dishonest.
- Packaging, flavour, colour, branding, immediate appearance and lack of an immediate reaction never verify safety.
- Avoid glamorous product shots, use poses, smoke, aspirational consumption or attractive seller imagery.
- Do not add contact details, handles, marketplaces or acquisition instructions.
- Keep exact evidence text and dynamic claims in code, not generated pixels.
- All runtime assets remain local; no network-dependent media or runtime generation.

### Implementation sequence

1. Add the evidence visual manifest and fallback coverage.
2. Wire existing v2 character art into every witness-evidence surface.
3. Wire the sealed-box hero into thumbnail, preview and presentation contexts.
4. Produce and integrate the missing pod, phone and speaker assets.
5. Replace/refine the Source Synthesis card using a live diagram plus optional texture.
6. Produce the NPC and player expression variants.
7. Derive or generate the camera plates and lighting states.
8. Add presentation/breakthrough variants.
9. Add optional outcome tableaux.
10. Add optional title, display-mode, Guided Help and credits artwork.

### Acceptance checks

- No witness evidence card uses the legacy cartoon/SVG avatar when approved character art exists.
- A character remains recognisably identical across room, inquiry, evidence, presentation, breakthrough and outcome screens.
- Different witness clues can intentionally use different expressions or crops.
- Every evidence item has a manifest entry, accessible description and valid thumbnail/hero behaviour.
- Evidence thumbnails remain recognisable at the compact windowed size defined in Issue Set 10.
- Large evidence previews do not simply upscale a tiny crop.
- Generated object art contains no essential text, seller detail or unsupported factual conclusion.
- Speaker art never enters the evidence inventory.
- Source Synthesis text and state remain live, selectable/readable UI.
- Transparent character assets have clean edges on warm, cool and dark backgrounds.
- No new asset glamorises the device or weakens the safety rules.
- Fullscreen and windowed modes use the same asset identity and information; only crop/scale may adapt.

### Planned automated and manual coverage

- Unit-test that every `EvidenceQuote` resolves to an evidence visual manifest entry.
- Unit-test that every manifest file path exists in the production asset directory.
- Unit-test that tutorial-only speaker art is absent from real evidence mappings.
- Component-test thumbnail, selected-preview and presentation renderers for each visual kind.
- Check for missing-image fallbacks and layout shift.
- Manually review every character expression at thumbnail, dialogue and full-stage sizes.
- Manually compare identity, outfit, lighting and crop consistency across all surfaces.
- Review physical/digital evidence for accidental readable misinformation or unsafe implication.
- Inspect evidence cards in fullscreen and the compact windowed viewport matrix from Issue Set 10.
- Do not claim visual or identity consistency until the generated batches have been reviewed in the running application.

### Status

- Implemented locally on 22 September 2026; not committed or pushed.
- Added an evidence-specific visual manifest, integrated v3 expression sheets throughout character presentation, and replaced legacy evidence SVGs with character/object/device artwork.
- Added the pod, blank-screen phone, three-view tutorial speaker and four outcome tableaux. The sealed-box hero is reused across evidence surfaces; source-map wording remains live UI.
- Conversation camera variation is derived from the existing room master through responsive crops and composited characters. Generation prompts and safety constraints are recorded in `public/art/ASSET_MANIFEST.md`.
- Automated manifest/path coverage is implemented. Manual running-app review at the supported desktop viewport matrix remains pending and is not claimed here.

---

## Issue Set 12 — Persistent, object-led box, pod and phone inspections

### Owner observations

- The packaging-box interaction does not feel like rotating the object. It swaps between flat, diagram-like panels over a static room image, unlike the tutorial speaker, where the rendered object itself appears to turn.
- The pod has the same problem: its cyan schematic/card states read as interface slides rather than different views of one physical object.
- Recording the packaging clue immediately closes the inspection. This conceals the remaining task of opening the lid and inspecting the sealed pod.
- The current `Open Box Lid` action competes with the yellow inspection overlay and is too easy to miss or mistake for part of the hotspot graphic.
- Recording a pod clue should not eject the player from the object. The player may still want to inspect its other exterior surfaces.
- Phone/message evidence behaves similarly: recording one clue should leave the phone open so the player can continue reading and inspect other threads.

### Confirmed implementation cause

- `InvestigationSegment` currently handles modal evidence recording by collecting the evidence and immediately clearing `activeModalHotspot`. That shared callback closes the box/pod and phone modals regardless of whether their inspection is complete.
- `BoxAndPodInspectionModal` tracks box and pod angle indexes, but renders each angle primarily as a different CSS information card. The sealed-box artwork is used as the canvas background rather than as the foreground object being manipulated.
- The pod inspection likewise uses a CSS chassis and per-angle data panels instead of the approved pod artwork as the inspected object.
- The lid control is positioned over the inspection canvas, where it competes with the seal hotspot, tint and object annotations.

### Design decision

Treat recording and leaving as two separate actions throughout investigation:

1. **Record** saves a useful observation, plays the first-time `Aha!` feedback, and returns the player to the same inspection state.
2. **Continue inspecting** remains the default state after the transition, with the recorded hotspot visibly marked.
3. **Finish inspecting** or the close control is the only ordinary way to return to the room.

The physical-inspection UI should present the actual object as the main interactive subject. Hotspots and short labels may overlay it, but large schematic cards must not replace it.

### Box inspection flow

1. Open the packaging inspection with the sealed box centred in the room plate.
2. Drag horizontally, swipe, use the left/right controls or use the arrow keys to turn the box through coherent views.
3. Inspect the seal and the exterior verification fields.
4. Record the packaging observation. On its first recording, play the `Aha!` transition above the still-mounted inspection and return to the same box angle.
5. Change the evidence action to a clear recorded state such as `Recorded in Case File`; do not close the modal and do not create a duplicate item.
6. Present `Break Seal & Open Lid` as a prominent action in the persistent modal action area, outside the tinted artwork and hotspot overlays. Its styling must read as the next physical action, not as another annotation.
7. Opening the lid—not merely recording the exterior clue—reveals and unlocks the pod inspection.
8. Preserve the selected angle, opened-lid state and completed hotspots while switching between box and pod. If the player closes and reopens the inspection during the same run, resume its meaningful progress rather than resetting the object.

### Pod inspection flow

- Use the approved pod render as the visible foreground object and provide coherent front, side, rear/base and connection-end views.
- Keep scale, lighting, silhouette and object position stable across views so input reads as rotation rather than replacement.
- Drag/touch movement should interpolate smoothly and may snap to inspectable angles. Arrow controls and keyboard input remain equivalent alternatives with visible focus states.
- Anchor hotspots to the object/view coordinate system so they stay associated with the correct physical feature.
- Recording the neutral exterior observation plays `Aha!` only on the first successful recording, then returns to the same pod view with exploration still available.
- The pod stays unavailable until the lid has actually been opened. Recording the box clue alone must never unlock it.

### Asset requirement and honest rotation model

- A convincing bitmap rotation requires a matched multi-view turnaround, not one image stretched or skewed to simulate unseen surfaces.
- Produce or approve a small coherent set for the box: front, left, back, right, underside/top as required, plus a matching opened state.
- Produce or approve a matched set for the pod: front, side, rear/base and connection-end views, while keeping the contents completely unknown.
- Where a full continuous 3D model is unavailable, use smooth yaw/crossfade transitions between matched renders and describe the control as `Turn object` rather than claiming unrestricted 3D rotation.
- Do not regress to abstract coloured cards if an angle asset is unavailable; use the closest honest rendered view with a clearly positioned hotspot.

### Phone/message inspection flow

- Recording a message clue must not close the phone.
- After recording, keep the active thread and scroll position, mark the relevant message as recorded, and leave other threads/messages selectable.
- Use explicit `Finished Inspecting` and close actions to leave the phone.
- Reopening the phone during the same run should restore the last useful thread/position where practical.
- Re-recording an already collected message must be idempotent and must not replay the breakthrough or add duplicate evidence.

### Evidence-state architecture

- Replace the modal-closing record callback with a record-only callback. Modal dismissal remains a separate handler.
- Determine recorded state per evidence ID, not from one generic `isAlreadyRecorded` flag tied to the originating hotspot. The box exterior, pod exterior and each eligible message must retain independent state.
- Keep presentation and evidence-gate logic unchanged: recording an observation adds only its intended case-file entry and cannot solve or skip a later gate.
- Mount the inspection beneath the `Aha!` transition so its local target, angle, open state, thread and scroll state survive the animation. Restore focus to the next logical inspection control afterwards.

### Visual and copy cleanup

- Make the rendered box or pod the largest, highest-contrast element; reduce tint strength and annotation chrome around it.
- Keep hotspot affordances visually separate from navigation and state labels. Use concise verbs: `Inspect Seal`, `Record Observation`, `Open Lid`, `Turn Object`, `Finished Inspecting`.
- Show a compact progress cue such as `Exterior recorded • Lid still closed` so the remaining physical step is explicit without becoming a checklist dashboard.
- Remove decorative or generated specifics that could be mistaken for verified facts, including flavour, capacity, contents, chemistry, regulatory legitimacy or normality. Exterior graphics may look commercial, but the UI must state that appearance cannot verify contents or safety.
- Never reveal what is inside the device, establish whether Ryan is sincere, or imply that packaging, appearance or an immediate reaction proves safety.

### Interaction and accessibility requirements

- Pointer drag, touch swipe, on-screen arrow controls and keyboard arrows must reach the same views.
- All hotspots, target tabs, lid action, record action and finish action require visible keyboard focus and meaningful accessible names.
- Reduced-motion mode should replace yaw/crossfade movement and the full `Aha!` animation with the existing restrained state change while preserving progress feedback.
- Do not let overlays block the lid action or any required hotspot at supported desktop window sizes.

### Acceptance checks

- The box and pod are visibly rendered objects being turned; inspection does not read as paging through coloured information cards.
- Recording the box clue leaves the inspection open and makes opening the lid an unmistakable next available action.
- Recording the box clue does not itself open the lid or unlock the pod.
- Opening the lid unlocks the pod, and switching targets preserves inspection progress.
- Recording the pod clue leaves the pod open for further inspection.
- Recording a phone/message clue leaves the phone on the same thread and retains access to all other messages.
- Each first valid clue triggers `Aha!`, then returns to the same inspection context; already-recorded clues do not trigger it again.
- Recorded controls clearly change state and duplicate evidence cannot enter the case file.
- Closing and reopening an unfinished inspection resumes meaningful progress during the current run.
- All evidence gates, the tutorial speaker separation, reset behaviour and deterministic local gameplay remain intact.

### Planned automated and manual coverage

- Component-test that recording box, pod and phone evidence does not invoke modal dismissal.
- Test that evidence collection remains idempotent for every inspection evidence ID.
- Test that recording the packaging clue leaves the pod locked, while opening the lid unlocks it.
- Test persistence of selected target, angle, lid state and phone thread across the `Aha!` transition and modal reopen.
- Test pointer controls, keyboard arrows, explicit close/finish controls and visible focus states.
- Test that the speaker remains tutorial-only and no inspection action bypasses an evidence gate.
- Manually verify the rendered turn sequence, hotspot alignment, lid discoverability and post-`Aha!` focus at supported desktop browser and fullscreen sizes.

### Status

- Implemented locally on 22 September 2026; not committed or pushed.
- The box and pod now use newly generated, reference-matched five-view and four-view transparent turnaround strips with turn controls, keyboard arrows and object-bound hotspots. Recording an observation leaves the inspection open; opening the lid is a separate, prominent action and is what unlocks the pod.
- Box/pod target, angle and lid state persist while the inspection remains mounted, including across the first-time `Aha!` transition and modal reopen. Phone recording likewise stays on the active conversation, becomes idempotently marked as recorded and leaves other messages available.
- Focused browser verification was completed at 1280×720 for box recording, lid opening, pod unlocking/recording and phone recording. The wider desktop/fullscreen matrix and automated component-level persistence checks remain future coverage and are not claimed here.

---

## Issue Set 13 — Repair and browser-verify the courtroom guided practice

### Owner observation

- The first courtroom practice step is visually misaligned: the coachmark, highlighted outline and actual `Press` control do not line up.
- The intended control cannot reliably be selected, so the guided sequence becomes a progression blocker.
- The separate `Skip Tutorial` control is currently the only dependable escape route. It must remain available, but it cannot be the workaround for a broken required interaction.

### Current implementation findings

- `CrossExamPractice` mounts the production `DialogueBox` inside a fixed, viewport-height practice layer and adds `GuidedSpotlight` through a document-body portal.
- The first step targets `#press-inquiry-0` using a global `document.querySelector`, while the dialogue content lives in its own vertically scrollable container.
- `GuidedSpotlight` measures the target with `getBoundingClientRect()` and creates four pointer-blocking overlay rectangles around that measurement.
- The callout position is calculated independently from the scroll container and can overlap either the target or the path needed to reach it.
- The screenshot indicates that the tutorial's cyan cutout is not tracking the visible amber-highlighted `Press` control. Potential causes to verify during implementation include stale measurements during dialogue/typewriter layout changes, non-unique global selectors, target movement within the internal scroller, and clamping calculations that size or position the cutout against the viewport rather than the actual visible target.

### Design decision

The guided practice must be an action-gated tour of the real controls. At every step there should be exactly one obvious, unobstructed, operable target. The coachmark explains the action, points to that exact target and advances only when the player performs it.

### Repair plan

1. Give each practice action a stable, unique tutorial target owned by the practice instance; avoid reusable global element IDs and ambiguous `querySelector` matches.
2. Resolve the target within the active practice dialog/root rather than across the entire document.
3. Before displaying a step, scroll the target into the visible region of the dialogue or evidence-drawer scroller using restrained, reduced-motion-aware behaviour.
4. Measure only after the target is mounted, visible and layout-stable. Re-measure after typewriter completion, animation/layout changes, internal scrolling, drawer transitions, viewport resize and font loading where relevant.
5. Clamp the spotlight to the target's actually visible intersection with the viewport. If the target is clipped or has a zero/invalid rectangle, do not show a misleading empty cutout; keep the step in a brief preparing state and recover by locating/scrolling the target.
6. Position the coachmark on the side with sufficient free space. It must never cover the active control or sit between the pointer and that control.
7. Allow pointer input only through the spotlight cutout to the intended target, while keeping `Skip Tutorial` and essential accessibility controls operable.
8. Advance from step 1 only after the actual press inquiry fires. Apply the same contract to pinning the claim, opening Case Notes, selecting practice evidence and presenting it.
9. Preserve the current isolated-practice guarantee: practice evidence is never saved, no real gate is resolved and completion enters the real courtroom in its initial state.
10. Keep `Skip Tutorial` visible and keyboard accessible throughout, with a clear confirmation and a clean transition into the real courtroom.

### Responsive layout requirements

- The complete practice header and active gameplay control must fit in the browser viewport without requiring page-level scrolling.
- Internal dialogue or drawer scrolling is acceptable only when the tutorial automatically brings the current target into view.
- Spotlight position must remain correct in ordinary browser chrome and fullscreen. Fullscreen may provide more space but must not be required to complete the tutorial.
- Long text, browser zoom and font rendering must not detach the coachmark from its target.
- The evidence-drawer steps must be tested independently because their target lives in a different overlay and scroll context.

### Accessibility and failure recovery

- Move keyboard focus to the active target after it becomes visible, without stealing focus repeatedly during re-measurement.
- Announce the step title, instruction, position and target purpose to assistive technology.
- Support Tab/Shift+Tab and Enter/Space for every required action; do not require precision pointer input.
- Escape should not silently abandon or corrupt practice state. Use the same explicit skip/close decision as the visible control.
- Respect reduced motion when scrolling and moving the coachmark.
- If a target cannot be found after the bounded mounting/layout window, show a recoverable error with `Retry step` and `Skip tutorial`, rather than an inert darkened screen.

### Acceptance checks

- The cyan spotlight outline precisely encloses the same visible control that receives the amber tutorial styling.
- Clicking the highlighted `Press` option works on the first attempt and advances to `Pin the exact claim`.
- Each subsequent target is automatically visible, aligned, clickable and advances exactly one step.
- The coachmark never overlaps or blocks the active target.
- No step displays a large empty cutout detached from its intended control.
- Practice can be completed from start to finish without using `Skip Tutorial`, fullscreen or page-level scrolling.
- The complete flow works with pointer and keyboard input, and the skip path remains available.
- Completing or skipping practice starts the real courtroom cleanly and saves no practice evidence.

### Required browser-based verification

This issue cannot be marked verified from unit tests or static inspection alone. During implementation, run the application and complete the following in a real browser:

1. Start courtroom guided practice without skipping.
2. Select the highlighted press inquiry.
3. Pin the exact practice claim.
4. Open Case Notes.
5. Select the speaker-volume practice evidence.
6. Present the evidence and observe the practice `Aha!`/completion transition.
7. Confirm arrival in the real courtroom with no practice item or solved gate carried over.
8. Replay the practice from Guided Help and verify the sequence again.
9. Test the skip route separately and confirm the real courtroom begins cleanly.

Perform that sequence at the supported desktop browser sizes, including at least 1440×900, 1366×768 and 1280×720, and repeat one complete pass in fullscreen. Verify both pointer and keyboard operation. Capture any failing step and viewport before adjusting layout. Do not claim this check unless the controls were actually exercised in the browser.

### Planned automated coverage

- Component-test that each tutorial step resolves exactly one target inside the active practice root.
- Test progression guards so unrelated clicks cannot advance a step.
- Test missing, clipped and delayed targets enter recovery behaviour instead of producing an inert overlay.
- Test that internal scroll and resize events trigger target re-measurement.
- Test that the coachmark placement algorithm avoids overlap with the target bounds.
- Test completion and skip cleanup: no practice evidence, selections, reactions or solved gates survive into the real courtroom.

### Status

- Implemented locally on 22 September 2026; not committed or pushed.
- Guided targets are now resolved inside the active practice root, scrolled into view, remeasured through layout/drawer transitions and paired with a bounded retry/skip recovery state. Coachmarks choose a viewport-safe side and the cutout follows the visible target.
- A fresh pointer-driven browser replay at 1280×720 completed all five real-control steps without skipping: press, pin, open Case Notes, select evidence and present. The spotlight aligned with both the dialogue controls and evidence drawer, the practice `Aha!` played, and the real 4/4 case state remained intact.
- Keyboard-only, fullscreen and the remaining desktop viewport passes are not claimed in this implementation check.

---

## Issue Set 14 — Remove the Source Synthesis gate and rebuild the 4/4 case conclusion

### Owner observation

- Gate 4 appears broken after the Source Synthesis eligibility rules changed.
- The player can resolve Gates 1–3 and select relevant witness evidence, but Gate 4 still instructs them to build a separate Source Synthesis card before they are allowed to challenge it.
- Source Synthesis now duplicates reasoning the player has already performed across the first three contradictions and adds unnecessary friction to an otherwise direct case.
- The preferred flow is for the earlier breakthroughs to update the case file with usable findings. Those findings should counter Gate 4 directly.
- After Gate 4 is resolved, `Case Progress` should become the route into a whole-case review and then the four outcome choices.

### Confirmed implementation cause

- `handlePresentQuote` explicitly rejects every Gate 4 presentation while `card_one_origin_three_voices` is absent.
- Selecting `claim_ryan_confirmations` is also blocked until that same card exists.
- Gate 4's only accepted target evidence is `card_one_origin_three_voices`.
- That card is created exclusively by `SourceMapModal`, so the final gate is structurally dependent on a separate puzzle whose unlock criteria have changed.
- The interface currently exposes both `Source Synthesis` and `Case Progress`/the trust graph. These overlapping relationship views obscure which one advances the case.

### Product decision

Remove Source Synthesis as a required gameplay mechanic for this case.

The relationship insight is still valuable, but it should emerge from the evidence already earned during Gates 1–3 and be summarised after Gate 4. It should not require the player to solve a second mapping interface to manufacture the only card accepted by the final claim.

Use two clearly separated concepts:

- **Case findings:** evidence and clarified claims earned during cross-examination and used to resolve Gate 4.
- **Whole-case review:** a post–4/4 recap accessed through `Case Progress`, followed by the player's outcome decision.

### Revised Gates 1–3 evidence progression

- Each successful contradiction keeps its existing `Aha!` and breakthrough scene.
- When that scene completes, add a concise, neutral `Case Finding` to Case Notes or visibly upgrade the relevant existing record. The finding must state what was established without inventing new facts.
- The useful reliance findings should make the chain legible:
  - Noah's reassurance came from trust in Ryan, not firsthand verification.
  - Alyssa's experience did not verify the device or its contents; she relied on Ryan.
  - Ryan relied on reassurance from an unknown seller without independent support.
- Gate 1's appearance finding remains part of the overall case—commercial appearance cannot verify contents or safety—but it should not be treated as proof of the social-source chain.
- Case findings must be local, deterministic records linked back to the exact evidence and breakthrough that produced them.
- Do not duplicate evidence cards if the underlying testimony already exists. Prefer a clear `Finding established` state and relationship label over adding near-identical inventory entries.

### Revised Gate 4 interaction

1. Gate 4 unlocks automatically when Gates 1–3 are resolved. It must not check for a Source Synthesis card.
2. Ryan makes the final claim that there were three separate confirmations.
3. The player opens Case Notes and uses the relevant established findings from the earlier exchanges.
4. Gate 4 should explicitly ask the player to trace the claimed confirmations back to their sources, not to guess a magic single card.
5. Use the existing evidence interaction with a small linked-evidence presentation:
   - select Noah's reliance finding;
   - select Alyssa's reliance finding;
   - select Ryan's seller-reliance finding;
   - present the linked set against `THREE CHECKS`.
6. The UI should show three compact evidence slots or checked links so the player understands that this final claim requires a pattern, while avoiding a separate node-map puzzle.
7. Give contextual feedback for incomplete or unrelated sets. Do not consume an attempt merely because the player has selected only part of the required chain; enable the final present action only when the required number of findings has been chosen.
8. On a correct set, play the existing Gate 4 `Aha!` and breakthrough: three voices trace back through Ryan to one unverified source.
9. Mark Gate 4 resolved, update progress to `4/4`, and return control to the courtroom. Do not immediately force an outcome before the player has reviewed the case.

If multi-select would destabilise the existing evidence drawer, the acceptable fallback is a short, ordered three-presentation sequence within Gate 4. It must still use the three earned findings directly and must not silently recreate the Source Synthesis card as a hidden prerequisite.

### Source Synthesis retirement and terminology cleanup

- Remove the `Source Synthesis` action from the courtroom action bar and evidence drawer for Case #01.
- Remove the `Source Map` inventory category if its only item is the generated Gate 4 card. Relationship information may instead appear as live UI in the final case review.
- Retire `card_one_origin_three_voices` as a presentable evidence prerequisite. Migrate or remove related flags such as `hasEarnedCaseCard` and `isSynthesisUnlocked` where no longer needed.
- Do not leave disabled, unreachable or duplicated Source Synthesis buttons.
- Preserve useful wording and the visual relationship concept for the post-case review, where it explains what the player established rather than unlocking something they already proved.
- `Case Progress` remains the single global progress entry point. Its name, count and destination should always agree.

### Post–4/4 whole-case review

- Before 4/4, `Case Progress` opens a read-only progress view showing resolved and unresolved gates and their established findings.
- At 4/4, give the control a clear completed state and an accessible call to action such as `Review Case & Decide`.
- The completed review assembles the case in a short visual sequence:
  1. appearance did not verify contents or safety;
  2. Alyssa did not independently verify the device;
  3. Noah repeated trust in Ryan rather than firsthand knowledge;
  4. Ryan's reassurance traced back to an unknown seller without independent support;
  5. therefore repeated confidence was not independent verification.
- This is a recap of player-earned evidence, not another puzzle and not a new piece of evidence.
- End the review with a deliberate action such as `Decide what you do next`.
- Only then reveal the four outcome choices in the main cinematic decision surface. Do not bury them in Case Notes or present them while the player is still resolving Gate 4.
- Preserve the existing reconsideration limit, outcome consequences, debrief, reset and replay behaviour.

### Message and safety constraints

- The conclusion is about evaluating claims and tracing confidence back to evidence—not distrusting every friend or assuming everyone is lying.
- The player should learn that repeated reassurance is not multiple independent checks when everyone relies on the same unsupported source.
- Never identify the device's contents or claim that an exterior inspection proves what is inside.
- Never establish whether Ryan is sincere or dishonest. He may be confidently repeating unsupported reassurance.
- Do not imply that appearance, flavour, packaging or immediate effects establish safety.
- Outcome choices may explore social and moral consequences, but the evidence review must remain factual and neutral.

### Acceptance checks

- Resolving Gates 1–3 always unlocks Gate 4 without opening Source Synthesis.
- The player can select Gate 4 and challenge it using findings already earned from prior exchanges.
- Relevant individual evidence is no longer rejected solely because `card_one_origin_three_voices` is absent.
- The final-gate UI clearly communicates that three linked findings are required and shows selection progress.
- The correct linked evidence triggers Gate 4's `Aha!`, breakthrough and `4/4` progress update.
- No Source Synthesis prerequisite, unreachable source card or duplicate source-map action remains in Case #01.
- Before 4/4, `Case Progress` accurately shows progress without exposing outcomes.
- At 4/4, `Case Progress` opens the whole-case review and then reveals exactly four outcome choices.
- Outcome selection, one reconsideration, debrief, retry and clean reset continue to work.

### Required browser-based verification

This flow must be exercised in a real browser before it is marked verified:

1. Begin from a clean run and enter the courtroom.
2. Resolve Gates 1–3 using their intended evidence.
3. After each `Aha!`, open Case Notes and confirm that the established finding is visible once, linked to its source and usable later.
4. Confirm Gate 4 becomes selectable automatically at 3/4 with no Source Synthesis action required.
5. Open Gate 4, select the three relevant reliance findings and present them.
6. Confirm unrelated evidence receives useful feedback and cannot accidentally solve the gate.
7. Confirm the correct set triggers the Gate 4 transition and updates Case Progress to 4/4.
8. Open `Case Progress`, complete the whole-case review and proceed to the four outcome choices.
9. Select an outcome, use the permitted reconsideration once, and verify the debrief.
10. Perform a clean reset/replay and confirm that no findings, selections, solved gates or outcome state carry over.

Run at least one complete route at 1440×900 and one at 1280×720 in an ordinary browser window, plus a focused 3/4-to-outcome pass in fullscreen. Confirm pointer and keyboard operation. Do not claim this verification unless the full sequence was actually completed in the browser.

### Planned automated coverage

- Unit-test that Gates 1–3—not a generated source card—control Gate 4 availability.
- Test that each solved gate creates or marks exactly one corresponding case finding.
- Test Gate 4's required linked-evidence IDs, incomplete selection state, unrelated evidence feedback and successful resolution.
- Test that `card_one_origin_three_voices` and Source Synthesis state are no longer required by the final gate.
- Test `Case Progress` behaviour before and after 4/4.
- Test that outcome choices cannot open before the completed case review.
- Regression-test the four outcomes, reconsideration limit, debrief, retry and clean reset.

### Status

- Implemented locally on 22 September 2026; not committed or pushed.
- Source Synthesis and its generated-card prerequisite have been removed from Case #01. Gates 1–3 now unlock Gate 4 directly, whose Case Notes view requires Noah's reliance, Alyssa's reliance and Ryan's seller-message finding as a visible three-link selection.
- `Case Progress` is now the single whole-case entry point: it is read-only before completion and, at 4/4, offers a recap followed by exactly four outcome responses. Existing ending, debrief and one-time reconsideration handling remain in place.
- Automated rule coverage confirms the direct final-gate unlock and linked-evidence requirements. A browser pass at 1280×720 exercised 3/4 → Gate 4 linked selection → final `Aha!` → 4/4 review → four responses → `Break the Chain` ending → one-time reconsideration.
- The additional 1440×900/fullscreen, unrelated-set feedback and clean-reset browser passes remain unclaimed future coverage.

---

## Issue Set 15 — Browser-height courtroom fit and readable gold text

### Owner observations

- In a normal laptop browser window, the courtroom still requires internal vertical scrolling even though the overall application is constrained to the viewport.
- The inquiry list is particularly painful: the third press option may be partially hidden, and the player cannot comfortably read the whole statement and all available questions together.
- Pressing a statement makes the problem substantially worse. The response, internal thought, recorded-quote confirmation and return control all consume height above the inquiry list, leaving the selectable area extremely narrow.
- Fullscreen improves the experience, but fullscreen must remain optional. Ordinary browser chrome and a shorter usable content viewport must not make required controls difficult to find or operate.
- Pale yellow sentence text—especially the pinned Ryan claim in the screenshot—blooms against the dark background and becomes difficult to read. The current hue and dense display face compound the problem.

### Confirmed implementation causes

- The main courtroom is a two-row grid whose room artwork reserves `clamp(170px, 28dvh, 290px)` even when browser chrome leaves a short content viewport.
- `DialogueBox` then reserves separate fixed-height bands for gate tabs, the pinned premise, the nameplate and the dialogue viewport before reaching the only `overflow-y-auto` action area.
- The dialogue viewport has a fixed minimum height of 70–80 pixels, but it grows when a press response adds the thought strip, recorded-quote card or mismatch feedback. These additions sit outside the action area's scroll ownership.
- The inquiry grid uses two columns from the `sm` breakpoint upward. On a wide desktop browser this leaves the third inquiry alone on a second row, spending vertical space that could be saved with three columns.
- The existing short-height media query reduces a few global paddings but does not change the courtroom row ratio, response composition, inquiry-column count or minimum reserved height for required actions.
- Sentence-length pinned text uses the decorative heading font at 12–13 pixels with `text-amber-200`. Other small labels use `text-yellow-300` and `text-amber-200`; these very light tones can flare visually on dark panels and lose letter definition in the condensed display face.

### Design decision

Use **responsive stage compression**, not browser scrolling, for supported desktop play. The room remains cinematic, but it yields height to the current interaction. Required press controls receive an explicit minimum-height budget and post-press feedback is recomposed rather than simply stacked.

More importantly, retire the assumption that the entire courtroom interaction must live inside one large rectangular dashboard panel. Use the Pokémon battle example only for its broad compositional lesson: the scene, status and command choices can occupy separate surfaces with different responsibilities. Trust Me Bro should retain its own psychological-anime social-thriller framing, typography and motion.

The recommended direction is a **three-surface cinematic courtroom**, with deliberately unequal visual weight:

- **1. Cinematic room stage — dominant surface:** the living room, characters, active-speaker lighting and reactions. This is the visual anchor and should occupy the most area, but it can use a shallower crop in short windows.
- **2. Statement/reaction surface — narrative surface:** the active statement or pressed response, pinned premise and immediate thought/recorded feedback. It should feel attached to the current speaker through position, layering, a notch or asymmetric edge rather than like a generic application card.
- **3. Player action surface — stable interaction surface:** the three press questions, Case Notes access and the current contradict/return action. Its dimensions remain stable while dialogue changes so the player never loses the controls they are reasoning with.

Gate and case progress stay in a slim status rail and are not treated as a fourth large panel. They can share the existing global navigation hierarchy or sit as a narrow bridge between the room and the two lower surfaces.

On wide desktop layouts, the narrative and action surfaces should sit side by side across the lower portion of the stage—for example, a 40/60 or 45/55 split—while partially overlapping the cinematic room to preserve depth. On narrower or shorter desktop windows, they may become two deliberately separated stacked surfaces beneath a shallower room crop. They must not collapse back into one endlessly growing card.

This three-surface system is the chosen design direction for implementation. Minor proportions may change during browser testing, but the separation of scene, narrative and player action should remain.

Separate the yellow system into two semantic roles:

- **Action gold:** the brighter existing yellow may remain for button fills, selected tabs, focus rings and short high-impact transition labels where dark text sits on top.
- **Readable gold text:** sentence text and small labels on dark backgrounds use a deeper amber/gold token with sufficient contrast, less glow and a non-condensed face when the copy is longer than a short label.

Do not perform a blind global substitution that makes dark text on yellow buttons worse or weakens focus visibility.

### Responsive courtroom reflow

1. Decompose the current monolithic `DialogueBox` presentation into named layout regions/components so the scene, exchange and commands can be arranged independently. State and handlers may remain shared; visual separation must not duplicate game logic.
2. Base the stage split on **available application height**, not only `dvh`:
   - normal desktop: retain the current cinematic room emphasis;
   - browser-height compact mode: reduce the room to approximately 18–22% of usable height, with a practical minimum near 130–150 pixels;
   - very short supported desktop mode: use a shallower cinematic crop while keeping faces and active-speaker focus legible.
3. Allow character scale and vertical crop to adapt with the room height. Do not merely cut off heads or shrink all characters into tiny thumbnails.
4. Compress the courtroom chrome in compact mode:
   - keep gate tabs and Case Notes on one line;
   - combine the speaker identity with the pinned-premise row where space is constrained;
   - reduce redundant borders and vertical padding;
   - retain full accessible names and visible focus states.
5. Give the inquiry/action region a guaranteed minimum height sufficient for its heading, all three press controls and the progress row at the supported browser sizes.
6. At wide desktop widths, lay the three press questions in three columns. At medium widths use a balanced two-column arrangement, and ensure the third control remains fully visible without depending on scroll.
7. Keep inquiry buttons content-sized but bounded: concise line height, 2–3 readable lines where necessary, and no text clipping or ellipsis that hides the question.

### Proposed spatial compositions

#### Wide ordinary browser window

- Keep the living-room scene as the dominant upper/background surface.
- Let a compact statement/reaction surface rise over the lower edge of the room, anchored toward the active speaker.
- Place the separate player-action surface beside it, using the wider half of the screen for all three press questions.
- Keep `Case Notes` and `Contradict with Quote` in the command card header so the action and the evidence route remain spatially connected.
- A recorded quote appears as a slim success ribbon attached to the exchange card, not as another full-width block above the commands.

#### Short laptop browser window

- Use a shallower cinematic room crop.
- Place the exchange surface and command surface in a compact two-column lower deck when width permits.
- If the width cannot support that split, use two visibly separate stacked surfaces with strict height budgets: a concise exchange strip followed by a command tray that is never squeezed below its required controls.
- Permit the exchange copy—not the command choices—to use a disclosure/expand interaction when unusually long text cannot fit.

#### Pressed-statement state

- Replace the base line inside the exchange surface with the response rather than inserting the response beneath it.
- Keep the questions in the command surface unchanged and stationary, so recording a quote does not make the player's targets jump or disappear.
- Attach `Thought`, `Quote recorded` and `Back to Base Statement` as compact secondary controls within or immediately around the exchange surface.
- Use character expression and lighting changes to carry emotional emphasis instead of allocating a new bordered rectangle to every piece of feedback.

### Visual-shape guidance

- The two surfaces do not need to be matching rectangles. The exchange surface may use an asymmetric clipped edge, speaker-tail notch, layered translucent plate or cinematic lower-third treatment.
- The command surface should be visually quieter and more regular because it contains interactive targets, but it may use stepped corners or layered tabs to avoid looking like an administrative form.
- Avoid placing borders around every internal subsection. Separation can come from spacing, background tone, alignment, typography and depth.
- Preserve clear hit areas, focus outlines and contrast regardless of decorative shape.
- Do not copy Pokémon's battle interface, proportions, colours, typography, character placement or exact menu arrangement. Only adopt the general principle of distributing information and commands across distinct surfaces.

### Post-press response composition

- Treat the base testimony and pressed response as the same primary dialogue slot rather than allowing the response state to make the whole upper section grow without limit.
- Convert `Thought` into a compact one-line insight strip in short-height mode, with a disclosure or accessible expansion affordance if the full copy cannot fit cleanly.
- Convert `Quote recorded` into a compact confirmation row or non-obstructing toast that does not reduce the inquiry area's allocated height. It must remain discoverable and retain the `View` action.
- Keep `Back to Base Statement` beside the response-state label in a single compact row.
- If a mismatch explanation is present, place it within the bounded response region and provide a clear dismiss action; it must not push required inquiry controls off-screen.
- When content genuinely exceeds the available height because of browser zoom, translated text or an unusually short window, use one clearly owned internal scroller and automatically reveal/focus the active control. Avoid nested scroll areas.
- Never reset the selected character, recorded quote or current exchange merely because the responsive mode changes.

### Scroll and control contract

- At supported desktop browser sizes, the player should see the active statement, all press questions and the relevant next action without manual vertical scrolling.
- Do not rely on hiding the scrollbar while leaving content inaccessible.
- Page-level scrolling remains disabled during courtroom play. Any emergency internal scroll must have a visible boundary, keyboard support, stable scroll position and enough bottom padding that the final button is never clipped beneath the viewport.
- Opening and closing Case Notes must return focus to the originating courtroom control and must not leave the inquiry region scrolled to an arbitrary position.
- The guided-practice spotlight must remeasure correctly after compact-mode reflow.

### Gold palette and typography audit

1. Add semantic design tokens in the shared stylesheet rather than continuing to scatter near-duplicate Tailwind yellow shades:
   - readable gold text on dark surfaces;
   - stronger/muted gold text states;
   - action-gold surface and hover state;
   - focus-ring gold;
   - decorative glow used only at large sizes.
2. Select the readable-gold values by measured contrast against the actual slate-900, slate-950 and translucent room overlays. Target WCAG AA for normal text; short decorative headings should still remain comfortably legible rather than relying only on the large-text exception.
3. Replace pale `amber-200`/`yellow-300` sentence text on dark panels with the readable-gold token. The pinned full claim is the first priority.
4. Use the condensed/display font only for short labels such as `PINNED STATEMENT`, `PRESS #1` and character names. Render complete claims, responses and explanatory sentences in the body font at a readable weight.
5. Remove or reduce glow, drop-shadow and heavy bolding from small gold copy. These effects may remain on large `Aha!`/breakthrough typography where they are part of the dramatic treatment.
6. Keep yellow button surfaces paired with slate/black text. Do not darken those fills so far that their label contrast or selected-state visibility is reduced.
7. Audit hover, selected, disabled and focus states so the darker readable gold is never the sole state indicator.

### Initial affected surfaces

- `App.tsx`: courtroom row allocation and responsive state classes.
- `DialogueBox.tsx`: split or refactor the fixed bands into exchange and command surfaces; revise dialogue/response composition, inquiry grid and progress row.
- Consider small focused components such as `CourtroomExchangeSurface` and `CourtroomCommandSurface` if that makes the visual split clear without fragmenting state management.
- `RoomBackground.tsx`: compact crop and character scale.
- `index.css`: height-aware rules and semantic gold variables/utilities.
- Courtroom practice: confirm that the production-layout changes do not detach guided targets.
- Shared gold-text audit: Navbar, Case Notes/evidence drawer, investigation modals, breakthroughs, outcomes, title/prologue and help. Apply the new text tokens selectively; preserve intentional action surfaces.

### Acceptance checks

- The courtroom no longer reads as one large rectangular panel containing every status, sentence and control.
- The room stage, statement/reaction content and player commands occupy three distinct surfaces with clear visual and functional roles.
- In an ordinary laptop browser window with browser chrome visible, the courtroom shows the active statement and all three press options without manual vertical scrolling.
- The same remains true after a press response records a quote and shows its thought/confirmation feedback.
- No required press, return, contradict or progress control is partially clipped at the bottom edge.
- The room remains visually meaningful and keeps the active speaker legible in compact-height mode.
- A pressed response changes the exchange surface without moving, shrinking or hiding the command surface.
- There is no nested-scroll trap; keyboard and wheel scrolling, if emergency overflow is needed, affect one predictable region.
- Case Notes opens at a usable size and returns the player to the same courtroom context.
- Pinned claims and other sentence-length gold copy are readable without pale-yellow blooming.
- Button fills, selected tabs, focus rings and dramatic `Aha!` styling retain clear hierarchy after the palette split.
- Long text is never converted to decorative condensed typography solely to make it fit.

### Required browser verification

This issue must be verified in the running application, not only through unit tests or screenshots:

1. Use a normal browser window with visible address/tab chrome and test effective content viewports representative of small laptops, including approximately 1366×650 and 1280×600, plus 1440×760 or the owner's reproduced window size.
2. At each size, enter the courtroom and inspect the base state for every character/gate.
3. Press each available inquiry, including one that records a quote, and confirm that the response, thought, record confirmation and all press controls remain usable without manual scrolling.
4. Exercise `Back to Base Statement`, `Contradict with Quote`, Case Notes open/close and the guided-practice route.
5. Repeat a focused pass at 100%, 110% and 125% browser zoom. Emergency scrolling is acceptable at increased zoom only if it is singular, obvious and never clips the focused action.
6. Compare normal browser and fullscreen framing to ensure fullscreen improves scale but does not expose controls that are inaccessible in windowed play.
7. Review the gold palette on the title screen, prologue, investigation, courtroom, evidence drawer, breakthroughs and outcomes. Record contrast results for the semantic text tokens.

Do not mark the issue fully verified unless the post-press/quote-recorded state—not only the initial courtroom—has been exercised at the short browser heights.

### Planned automated coverage

- Add layout-oriented component tests or assertions for compact courtroom mode and the three-column inquiry breakpoint.
- Test that post-press feedback does not change or unmount inquiry controls.
- Test that recorded-quote and mismatch states retain their actions after compact reflow.
- Add a style/token test ensuring sentence-length pinned claims use the readable text token rather than the pale decorative token.
- Add an automated browser check, if the available runner supports viewport control, that asserts the three inquiry buttons and key response actions are within the visible dialogue bounds before and after recording a quote.

### Status

- Implemented locally on 22 September 2026; not committed or pushed.
- The courtroom now uses a shallow responsive room stage plus separate narrative and command surfaces. Wide desktop play shows the three press questions in one stable row, and the compact-height rules reduce room art and chrome rather than squeezing the command tray.
- The pinned full claim now uses the body face and a semantic readable-gold token. Pale yellow text utilities on dark surfaces have been moved to a deeper gold while bright action fills remain unchanged.
- Static regression coverage confirms the distinct courtroom surfaces, three-column desktop inquiry grid, compact stage hook and readable-gold claim treatment. Type checking, all 11 unit tests and the production build pass.
- Browser automation reached the windowed 1280×720 investigation route, but the tool stalled on the guided-overlay interaction before a complete post-press courtroom pass. The complete short-height, zoom, Case Notes and fullscreen matrix remains explicitly unverified rather than inferred.

---

## Issue Set 16 — Repair outcome scrolling, portraits and debrief readability

### Owner observations

- After selecting `Understand this outcome`, the psychological and real-world debrief begins below the source-chain cards but cannot be scrolled into view.
- Scrolling is appropriate for the outcome/debrief because it contains optional explanatory depth; the current problem is that scrolling is disabled rather than merely inconvenient.
- The player portrait in `Sam's stance` appears as an empty dark circle. Other very small profile uses should be audited for the same failure.
- The white, heavily bolded source-chain descriptions are difficult to read, including `Unknown Seller (unverified source)` and `Ryan dismisses your warning as hysteria`.
- The five narrow source-chain columns combine a condensed heading face, very small size, heavy weight and near-white colour, making sentence-length copy look blurred and crowded.

### Confirmed implementation causes

- `EndingModal` has a fixed-height shell with separate header and footer flex children. Its middle content region is `min-h-0 flex-1 ... overflow-hidden`, so content taller than the available middle region is clipped with no scroll owner.
- The footer remains visible, but there is no body scroll or alternate route to the debrief content beneath the fold.
- Toggling between the outcome narrative and debrief replaces the middle content without resetting or managing a scroll position.
- The source-chain player portrait wraps a full expression-sheet character component inside a `w-4 h-4` container. The component is designed for much larger full/torso presentation and includes its own size classes, aspect ratio, aura and overflow behaviour; shrinking it to 16 pixels produces an unreadable or apparently empty result.
- Source-chain descriptions use `font-heading text-xs ... font-bold` inside five narrow columns. The display face is suitable for short labels, not complete explanatory sentences at approximately 12 pixels.
- Several descriptions use `text-slate-100` or `text-slate-200` with heavy bold weight. Against the very dark cards, the brightness and dense letter shapes bloom instead of producing comfortable reading contrast.

### Design decision

Keep the outcome shell cinematic and keep its footer actions available, but make the **middle outcome/debrief body the single explicit scroll region**. The scroll should feel intentional: header and actions stay stable while the narrative, source chain and educational explanation move together.

Use display typography only for short outcome labels and stage names. All sentence-length chain descriptions and explanatory text should use the body font at a moderate weight, comfortable line height and softened off-white/slate colour.

Provide a dedicated avatar presentation for compact profile contexts. Do not shrink a full-character expression-sheet composition until it becomes illegible.

### Scroll and modal structure

1. Change the middle outcome region from `overflow-hidden` to one `overflow-y-auto` scroll owner with `overscroll-contain` and sufficient bottom padding.
2. Keep the outcome banner and footer as non-scrolling flex children, but ensure the footer does not overlap or obscure the last debrief paragraph.
3. Add a subtle top/bottom scroll affordance or fade only when more content exists. Do not hide the scrollbar while content is clipped.
4. Support mouse wheel, trackpad, touch, Page Up/Down, Home/End and keyboard focus movement within the scroll region.
5. When `Understand this outcome` is selected, reset the body scroll to the top of the debrief view and move focus to its heading or scroll region.
6. When `Back to outcome` is selected, restore the outcome narrative at its top or restore a deliberately saved narrative position; do not inherit an arbitrary debrief scroll offset.
7. Reset scroll state when the ending changes, when reconsidering an outcome and when restarting the investigation.
8. Give the scroll region an accessible label such as `Outcome explanation` or `Psychological and real-world debrief`.
9. On short laptop viewports, reduce banner/footer padding before shrinking body copy. The modal must preserve a useful scrollable body height.

### Source-chain layout and typography

- Retain the five-stage relationship because it explains how reassurance travels, but treat it as a readable sequence rather than five miniature headline cards.
- Keep stage labels such as `1. UNVERIFIED SELLER` in the display face.
- Render each stage's explanation in the body font, normal or medium weight, with a minimum practical desktop size around 13–14 pixels and relaxed line height.
- Replace pure/near-white heavy text with a controlled `slate-200`/`slate-300` reading colour chosen by contrast testing. Emphasis should come from the stage label, border, accent and spacing—not bolding every word.
- Avoid all-uppercase sentence text. Only short labels remain uppercase.
- At widths where five columns make the descriptions too narrow, use a responsive sequence such as three stages followed by two, or a compact horizontal timeline with readable minimum card widths and an intentional horizontal overflow treatment. Do not compress prose below the readable threshold.
- Use arrows, connector lines or progression numbering to preserve the chain when the cards wrap.
- Align this treatment with Issue Set 15's semantic gold tokens: gold may identify the Ryan/player stages, but sentence copy should remain neutral and readable.

### Compact portrait repair

1. Add an explicit compact-avatar mode to `CharacterIllustration`, or provide a dedicated `CharacterAvatar` wrapper that crops the correct expression-sheet frame around the face and shoulders.
2. Use a minimum visual diameter of approximately 28–36 pixels for outcome-chain avatars rather than 16 pixels.
3. Ensure the selected player gender is used and the avatar shows the actual player character rather than a generic fallback.
4. Give the avatar a defined crop, neutral background and border so transparent artwork cannot disappear into the card.
5. Provide a non-empty deterministic fallback—initial/silhouette plus accessible name—if an asset fails to load. Do not show an unexplained empty circle.
6. Audit all very small `CharacterIllustration` uses across the courtroom, evidence cards, outcome chain and debrief. Full-character art and avatar crops should be separate variants rather than conflicting width/height overrides.
7. Verify Ryan, Noah, Alyssa, male player and female player compact portraits individually.

### Debrief hierarchy

- Keep `The Psychological & Real-World Debrief` as the section heading, but apply the readable-gold treatment planned in Issue Set 15 rather than pale or glowing yellow.
- Separate the psychological trap, Singapore context and actionable takeaway with spacing and restrained dividers rather than three additional heavy boxes.
- Body copy should use the regular body face, off-white/slate text and comfortable paragraph width.
- Keep the actionable takeaway visually prominent, but avoid making the entire paragraph bold.
- The copy and headings must remain selectable/readable where appropriate; the modal-wide `select-none` treatment should be reconsidered for educational text.
- Preserve the safety rules: the debrief must not reveal contents, claim Ryan is lying, or imply that appearance, immediate effects or packaging verify safety.

### Initial affected surfaces

- `EndingModal.tsx`: body scroll ownership, focus/scroll reset, footer spacing, source-chain layout, typography and compact player portrait.
- `CharacterIllustration.tsx`: explicit avatar/head-and-shoulders variant or a safe compact rendering contract.
- `index.css`: outcome scrollbar/fade treatment and shared readable text tokens from Issue Set 15.
- Character-art manifest/tests: verify all compact portraits resolve to local assets and expose useful fallbacks.

### Acceptance checks

- The entire psychological and real-world debrief can be reached using wheel, trackpad, touch and keyboard scrolling.
- The final debrief paragraph is fully visible above the footer and is never trapped behind it.
- `Understand this outcome` and `Back to outcome` begin at intentional scroll positions.
- Reconsidering or changing outcomes does not retain stale scroll state.
- Sam/player displays a recognisable compact portrait rather than an empty circle, for both selectable player genders.
- Other character profile circles across the game are not empty, incorrectly cropped or reduced below a useful size.
- Source-chain sentences use the body font and are readable without heavy white blooming.
- The five-stage relationship remains understandable if it wraps to multiple rows.
- Footer controls remain available without consuming so much height that the scroll region becomes unusable.
- Outcome narrative, source chain and debrief retain their meaning and all four outcomes remain deterministic.

### Required browser verification

1. Open each of the four outcomes at a normal laptop browser height and at 1280×720 and 1366×768.
2. Enter `Understand this outcome`, scroll from the first source-chain stage through the final actionable takeaway and verify the last line remains visible above the footer.
3. Exercise mouse/trackpad, keyboard and touch-style scrolling where tooling permits.
4. Toggle repeatedly between outcome and debrief and verify intentional scroll restoration.
5. Test `Reconsider Once`, return to another outcome and confirm the new outcome starts at the top.
6. Verify male and female player portraits plus Ryan, Noah and Alyssa anywhere compact avatars appear.
7. Inspect source-chain readability at 100%, 110% and 125% browser zoom. The chain may reflow, but prose must not become clipped or illegibly condensed.
8. Confirm the Copy Debrief, Back to Outcome, Reconsider and Restart controls remain reachable and operable throughout.

### Planned automated coverage

- Component-test that the outcome body is the scroll owner and footer/header remain outside it.
- Test scroll reset when toggling `showDebrief`, changing endings, reconsidering and restarting.
- Add coverage for the compact-avatar variant and failed-asset fallback for every character/player gender.
- Add a typography assertion preventing sentence-length source-chain descriptions from using the condensed heading font.
- Add a browser visibility assertion for the final actionable-takeaway block above the footer after scrolling to the end.

### Status

- Implemented locally on 22 September 2026; not committed or pushed.
- The outcome shell now keeps its banner and footer fixed while the labelled middle body owns vertical scrolling, bottom clearance, selection and scroll/focus reset when switching between outcome and debrief.
- Source-chain explanations now use readable body typography and reflow from five columns to three, two or one as space narrows. A dedicated face-and-shoulders avatar variant with a visible initial fallback replaces the broken 16-pixel full-figure crop.
- Static regression coverage confirms the scroll owner, avatar contract/fallback and source-chain body typography. Type checking, all 11 unit tests and the production build pass.
- A full four-outcome browser matrix, keyboard/zoom checks and male/female portrait visual pass remain unverified because the local browser automation stalled before the courtroom route.

---

## Issue Set 17 — Restore courtroom visual scale and require intentional evidence selection

### Owner observations

- The new split courtroom makes the press actions much easier to use, but the living-room stage and characters have become too compressed.
- In the supplied browser screenshot, the room is reduced to a shallow strip and the three full-character illustrations read as small figures rather than the visual focus of the scene.
- This is a visual investigation game, so making the controls fit cannot come at the cost of removing character presence, expressions and setting.
- When Case Notes is opened for the first time, one evidence card is already highlighted even though the player has not selected anything in the drawer.
- This issue set must be planned and documented first. No application changes are authorised yet, and nothing should be pushed.

### Diagnosis — compressed courtroom stage

- `App.tsx` currently gives the room row only `clamp(135px, 22dvh, 230px)` before any short-height override is applied.
- At desktop widths with a viewport height of 780px or less, `index.css` overrides that row again with `clamp(118px, 19dvh, 155px)`. This is the direct reason the screenshot shows the environment as a narrow banner.
- The same compact-height rule then reduces each character illustration to `8.5rem × 6.6rem` and independently scales character buttons to `0.74`, with the active character only reaching `0.9`. The room and its subjects are therefore compressed twice.
- The stage still spends some of its already limited height on its scene-status header and foreground-table footer, leaving even less vertical space for the characters.
- The previous Issue Set 15 optimisation treated the room as the easiest area from which to reclaim height. That solved action visibility, but the 118–155px cap is too aggressive for the game's visual-novel role.
- The action layout itself should be retained. The regression is the balance between visual stage and lower interaction deck, not the three-surface concept.

### Design decision — cinematic minimum, compact controls

Keep the three-surface courtroom, but establish a **cinematic minimum height** for the living-room stage. Reclaim space from redundant interface chrome and lower-panel padding before shrinking the art.

The intended hierarchy is:

1. The room and characters remain the visual anchor and must show recognisable faces, poses and active-speaker emphasis.
2. The narrative and command surfaces remain separate and stable so all press choices are visible.
3. Status information remains compact and may overlap or bridge the stage/lower deck instead of consuming another tall row.

For ordinary laptop browser heights, target a room stage around 210–260px rather than 118–155px. The exact value should be selected through browser testing, not hard-coded from the screenshot alone.

### Courtroom visual-scale plan

1. Replace the current short-height stage cap with a height-aware range that preserves a practical visual minimum:
   - standard desktop/fullscreen: approximately 280–340px where space allows;
   - ordinary laptop browser: approximately 220–260px;
   - shortest supported desktop viewport: do not reduce below approximately 200–220px without switching to an alternate composition.
2. Remove the compounded `0.74`/`0.9` character-button scaling in compact mode. Size each character once from the available stage height using a bounded `clamp()` or explicit stage variant.
3. Preserve full heads, faces and upper-body gestures. Cropping may remove lower torso/legs, but never the face or expression.
4. Use a modest difference between active and inactive characters—lighting, saturation, depth, position and a small scale change—rather than shrinking the inactive cast into thumbnails.
5. Compress the room's metadata bands before the artwork:
   - reduce the scene-status strip to a compact overlay within the room;
   - merge or visually overlay the player-seat/table information where possible;
   - avoid two opaque horizontal bars consuming the top and bottom of the scene.
6. Allow the lower narrative/command deck to overlap the lower edge of the room by roughly 24–48px on wide layouts. This recovers vertical space while retaining the distinct surfaces.
7. Preserve the current three-column press layout and stable command region. Do not solve the visual issue by returning to the old monolithic scrolling panel.
8. If a viewport is genuinely too short for both the cinematic minimum and all controls, make the bounded narrative surface—not the room or command choices—the single emergency scroll owner.
9. Keep responsive changes driven by available height and width together. A wide 1900×700 browser should not receive the same character scale as a narrow 1024×700 layout merely because both are below the same height breakpoint.
10. Ensure the guided-practice spotlight continues to measure the command targets correctly after overlap/reflow.

### Diagnosis — evidence preselection

- `selectedQuoteId` correctly starts as `null` in `App.tsx`.
- When a courtroom inquiry grants a quote, `handlePressInquiry` both adds the quote to the case file and calls `setSelectedQuoteId(quote.id)`.
- `EvidenceDrawer` treats `selectedQuoteId === quote.id` as an intentional card selection and immediately renders the amber border, `Ready To Present` badge and enabled presentation state.
- As a result, discovering/recording evidence and selecting evidence for a contradiction are currently the same state transition. Opening Case Notes for the first time therefore looks as if the player already made a choice.
- Investigation discoveries do not directly set this state, but the first decisive courtroom press does. The behaviour is deterministic rather than a random focus or CSS issue.
- The isolated tutorial uses its own `selected` state and explicitly sets it when the practice evidence card is clicked, so the production fix does not need to weaken the tutorial's guided selection step.

### Evidence-selection state contract

Separate **discovered evidence**, **recently recorded evidence**, and **selected evidence**:

- `collectedQuotes` means the item exists in the case file.
- `recentlyCollectedQuote` drives the temporary `Quote recorded` feedback and optional `View` route.
- `selectedQuoteId` means the player explicitly selected a card for the current contradiction.

Planned behaviour:

1. Do not set `selectedQuoteId` when an inquiry merely grants a quote.
2. First opening Case Notes for a normal gate shows all cards in a neutral, unselected state and keeps `Present Evidence` disabled.
3. Clicking a selectable evidence card sets `selectedQuoteId`, applies the selected styling and enables presentation when otherwise valid.
4. Preserve an intentional selection if the player closes and immediately reopens Case Notes for the same claim; accidental closure should not erase their work.
5. Clear the normal selection when switching to a different gate/claim, after a successful presentation, when restarting, and when entering or leaving the final multi-evidence gate.
6. A failed presentation may keep the selected card visibly selected long enough to explain the mismatch, but an already-tested card remains disabled and cannot silently become the next selection.
7. The `View` action on a newly recorded quote may open or scroll to that card, but it must not mark the card as selected. Use a separate reveal/focus identifier if this behaviour is retained.
8. The final gate continues to use explicit `selectedFinalQuoteIds`; opening it for the first time must likewise show zero linked findings unless the player deliberately linked them earlier.
9. Use `aria-pressed=false` for unselected cards and announce selection only after a player action. Initial keyboard focus must not visually impersonate selection.
10. Keep tutorial practice state isolated from production evidence state.

### Initial affected surfaces

- `App.tsx`: restore the stage/lower-deck balance; stop auto-selecting granted quotes; reset selection at defined claim and outcome transitions.
- `RoomBackground.tsx`: remove compounded compact scaling and introduce stage-aware character sizing/cropping.
- `DialogueBox.tsx`: retain the successful command layout while permitting stage overlap and a bounded narrative overflow fallback.
- `EvidenceDrawer.tsx`: neutral initial state, disabled presentation affordance, separate reveal/focus treatment and explicit selection semantics.
- `index.css`: replace the 118–155px stage override, remove double-scaling rules and add width-plus-height responsive variants.
- `CrossExamPractice.tsx`: regression-check tutorial targeting; production-state changes must not alter isolated practice selection.

### Acceptance checks

- At the owner's reproduced browser size, the characters and living-room setting are prominent again rather than confined to a narrow banner.
- Ryan, Noah and Alyssa have recognisable faces and expressions in both base and pressed states.
- The active speaker remains visually dominant without making the other two characters look like tiny icons.
- All three press choices remain visible and operable without page-level scrolling at supported desktop browser sizes.
- Recording a quote does not shrink the room or cause the command surface to jump.
- Opening Case Notes for the first time shows no evidence card selected and the presentation button is disabled.
- Discovering a quote does not select it; selecting requires an explicit card click.
- Closing and reopening the drawer for the same claim preserves only a deliberate selection.
- Switching claims, resolving a gate, entering the final gate and restarting clear or transform selection according to the explicit state contract.
- Tutorial practice still highlights and advances through the exact requested target without leaking any practice selection into the real case file.

### Required browser verification

This issue requires browser verification before it is considered complete:

1. Test the base courtroom and at least one post-press/quote-recorded state at approximately 1920×700 (close to the supplied screenshot), 1440×760, 1366×650 and 1280×600.
2. At each size, capture or inspect the room's rendered height, character bounding boxes and face visibility, plus all three press-button bounding boxes.
3. Confirm that the room remains visually substantial while the press choices and case-progress row stay within the viewport without page scrolling.
4. Switch between Ryan, Noah and Alyssa and verify that active-speaker scale/lighting does not clip heads or gestures.
5. Compare windowed and fullscreen modes. Fullscreen may enlarge the presentation, but it must not be the only mode with readable characters.
6. Test 100%, 110% and 125% zoom. At elevated zoom, allow one explicit narrative scroller if needed; do not collapse the room into the previous 118–155px strip.
7. Start a clean playthrough, enter the courtroom, record the first quote and open Case Notes. Assert that every normal evidence card has `aria-pressed=false`, none has `Ready To Present`, and the presentation button is disabled.
8. Select one card, close/reopen the drawer for the same claim and confirm the deliberate selection persists.
9. Switch to another gate and confirm the stale selection is cleared. Return to the original gate and verify the documented persistence/reset rule exactly.
10. Exercise a wrong presentation, a successful presentation, final-gate multi-selection and restart to confirm no hidden selection leaks between states.
11. Run the interactive courtroom tutorial and verify spotlight alignment after the stage reflow and explicit evidence-card selection step.

### Planned automated coverage

- Add a state-level test proving that quote acquisition updates the evidence inventory and recent-record notification without changing `selectedQuoteId`.
- Test selection reset/persistence rules across close/reopen, claim changes, successful presentation, final-gate entry and restart.
- Assert that the initial drawer state has no `aria-pressed=true` card and cannot present evidence.
- Add responsive browser assertions that the room clears its minimum visual height and every press control is fully within the supported viewport.
- Add screenshot regression coverage for the owner's wide/short viewport if the available browser runner supports stable image snapshots.
- Retain the Issue Set 15 tests proving the narrative and command surfaces remain distinct.

### Status

- Implemented and browser-verified locally on 22 September 2026.
- The short-height courtroom now preserves a 210–250px cinematic room stage, overlays the scene metadata bands and sizes characters once from available height. The successful three-surface command layout remains intact.
- Quote acquisition no longer assigns `selectedQuoteId`. Normal evidence selection is now created only by an explicit card click, persists across close/reopen for the same gate, and clears on gate changes, successful presentation and restart. Tutorial selection remains isolated.
- Type checking, all 13 unit/regression tests and the production build pass. The build retains the existing non-blocking bundle-size and ineffective dynamic-import warnings.
- Browser checks passed at 1280×600, 1366×650, 1440×760 and 1920×700. The room rendered at 210–250px, character art at approximately 137–201px, all three press controls stayed fully within the viewport and the page did not scroll.
- At 1280×600, the completed quote-recorded response kept all press controls and `Back to Base Statement` visible; the command surface had equal client and scroll heights (242px), confirming no hidden command overflow.
- On the first production Case Notes open after recording Ryan's quote, all five evidence cards reported `aria-pressed=false`, no `Ready To Present` callout appeared and the presentation button remained disabled. An explicit card selection survived same-gate close/reopen, then cleared when switching gates.
- Interactive investigation and courtroom tutorials were exercised successfully through their required highlighted controls after the reflow.
- Approved for commit and GitHub push by the owner; repository publication is recorded in the delivery message rather than inferred here.

---

## Issue Set 18 — Replace browser-native tutorial skip confirmations

### Owner observation

Selecting **Skip Tutorial** currently opens a browser-owned confirmation box labelled `localhost:3000 says`. This breaks the visual continuity of the game and makes the action feel like a browser warning rather than part of the guided experience.

### Diagnosis

This is intentional behaviour in the current implementation, not a Chrome or localhost fault:

- `GuidedSpotlight.tsx` calls `window.confirm(...)` before invoking its `onSkip` callback.
- `SpeakerTutorialModal.tsx` separately calls `window.confirm(...)` from its own skip button.
- The courtroom practice header also exposes a skip button, but that path invokes `onSkip` immediately without the same confirmation.

As a result, tutorial skipping is implemented through multiple paths with inconsistent behaviour. Native browser confirmations also cannot be styled, use generic **OK / Cancel** labels, block the browser UI, and do not match the game's presentation or interaction language.

### Planned interaction

Replace every native tutorial-skip confirmation with one reusable in-game confirmation dialog.

1. The first press of **Skip Tutorial** opens a themed game dialog; it must not skip immediately.
2. The dialog explains that the guided practice can be replayed later from **Guided Help**.
3. The safe/default action is **Continue Tutorial**.
4. The deliberate exit action uses destination-aware language:
   - **Skip to Investigation** during investigation practice;
   - **Skip to Cross-Examination** during courtroom practice.
5. Confirming performs the existing skip transition exactly once and does not alter case evidence, gate progress, attempts, or other game state.
6. Cancelling returns the player to the same tutorial step and restores focus to the original skip button.

### Implementation structure

- Introduce a shared controlled component such as `TutorialSkipConfirm` rather than placing separate confirmation logic inside each tutorial.
- Give the tutorial owner a single `isSkipConfirmOpen` state and route all skip entry points through it, including:
  - the top-right guided spotlight skip button;
  - the portable-speaker practice modal;
  - the courtroom practice header and spotlight.
- Remove both uses of `window.confirm()` and prevent new native `confirm()` or `alert()` calls from being used for this flow.
- Keep the existing final skip callbacks and tutorial-state transitions as the single source of truth.
- Prevent clicks from passing through the confirmation overlay to the highlighted tutorial target.
- Ensure nested tutorial surfaces cannot fire `onSkip` twice.

### Accessibility and presentation

- Use `role="dialog"`, `aria-modal="true"`, an accessible title, and descriptive text.
- Move initial focus to **Continue Tutorial**, trap focus inside the dialog, support `Escape` to cancel, and restore focus when dismissed.
- Position the dialog above the tutorial spotlight and dimmer without clipping at compact browser heights.
- Respect reduced-motion preferences for its entrance and exit.
- Keep the dialog visually consistent with the existing dark case-file UI, cyan guided-practice accent, and yellow action hierarchy.

### Verification plan

#### Behaviour checks

- First skip click opens the in-game dialog and does not call `onSkip`.
- **Continue Tutorial**, outside dismissal if enabled, and `Escape` leave the tutorial at the same step.
- The explicit skip action calls `onSkip` once and reaches the correct investigation or courtroom destination.
- Guided Help can replay the skipped tutorial.
- No tutorial skip route opens a browser-owned popup.

#### Browser checks

Check both investigation and courtroom tutorial flows at representative laptop viewports, including approximately `1280x600` and `1366x650`, at 100% and 125% browser zoom. Verify:

- the confirmation remains fully visible and above the spotlight;
- neither action is clipped;
- keyboard Tab, Shift+Tab, Enter, and Escape behave correctly;
- underlying highlighted controls cannot be activated while the dialog is open;
- confirming and cancelling preserve the correct tutorial and game state.

#### Automated regression coverage

- Add a source-level guard that tutorial components do not use `window.confirm` or `window.alert`.
- Add interaction coverage for open, cancel, confirm, focus restoration, and exactly-once skip handling.
- Cover both destination-specific variants and all visible skip entry points.

### Status

Implemented and browser-verified on 22 September 2026.

- Replaced native browser confirmations with the shared `TutorialSkipConfirm` game dialog.
- Connected investigation spotlight, speaker practice, courtroom header, and courtroom spotlight skip routes.
- Added destination-specific actions, keyboard focus containment, Escape cancellation, focus restoration, and click-through protection.
- Added regression coverage preventing tutorial components from returning to `window.confirm()` or `window.alert()`.
- Verified the investigation flow in-browser: open, Escape/cancel, focus restoration, and confirmed skip all behave correctly.

---

## Future issue intake template

### Issue Set NN — Title

- Screenshot(s):
- Player-visible problem:
- Affected route/state:
- Code/components involved:
- Likely cause:
- Proposed design decision:
- Priority and dependencies:
- Acceptance checks:
- Status: Planned / Approved / Implemented / Verified
