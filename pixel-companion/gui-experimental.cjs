const { Plugin, Style, Command } = require("@opencode/plugin/gui")

const SETTINGS_KEY = "pixel-companion:settings:v1"
const DEFAULTS = { enabled: true, side: "left", always: false, rosterFilter: "active" }

const CSS = `
#pixel-companion {
  position: fixed;
  inset: 0;
  z-index: 30;
  overflow: hidden;
  pointer-events: none;
  font-family: "Monocraft", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  line-height: 1.45;
  color: var(--v2-text-text-base, #e8e8e8);
  --pc-body: #6a6a6a;
  --pc-body-light: #8f8f8f;
  --pc-body-dark: #303030;
  --pc-eye: var(--mc-gold, #f2c94c);
  --pc-wood: #8b5a2b;
  --pc-wood-light: #b9824a;
  --pc-wood-dark: #5a3518;
  --pc-shadow: var(--mc-shadow, #000000cc);
  --pc-frame: var(--mc-frame-color, #080808);
  --pc-panel: var(--mc-panel, #2b2b2b);
  --pc-panel-2: var(--mc-panel-2, #2e2e2e);
  --pc-slot: var(--mc-slot, #1f1f1f);
  --pc-slot-2: var(--mc-slot-2, #232323);
  --pc-bevel-light: var(--mc-bevel-light, #5e5e5e);
  --pc-bevel-dark: var(--mc-bevel-dark, #141414);
  --pc-gold: var(--mc-gold, #f2c94c);
  --pc-grass: var(--mc-grass, #6fbf44);
  --pc-diamond: var(--mc-diamond, #4fd6d6);
  --pc-redstone: var(--mc-redstone, #e04b4b);
  --pc-emerald: var(--mc-emerald, #4fd67a);
  --pc-stone-dark: #2f3742;
  --pc-stone-mid: #4a5562;
  --pc-stone-light: #6b7684;
  --pc-stone-hi: #8a95a4;
  --pc-moss: #3f6a2f;
  --pc-moss-light: #6fbf44;
  --pc-rim: #f2c94c;
}
[data-color-scheme="light"] #pixel-companion {
  --pc-body: #b08a5a;
  --pc-body-light: #d8b078;
  --pc-body-dark: #6b4a2f;
  --pc-eye: var(--mc-gold, #a87b12);
  --pc-wood: #b07a45;
  --pc-wood-light: #d8a76a;
  --pc-wood-dark: #7a4a22;
  --pc-shadow: #1a1c2c66;
  --pc-frame: var(--mc-frame-color, #3a2a1a);
  --pc-panel: var(--mc-panel, #f4e7c5);
  --pc-panel-2: var(--mc-panel-2, #f7ecd0);
  --pc-slot: var(--mc-slot, #d8c7a5);
  --pc-slot-2: var(--mc-slot-2, #e0d0b0);
  --pc-bevel-light: var(--mc-bevel-light, #fff6e0);
  --pc-bevel-dark: var(--mc-bevel-dark, #a08a64);
  --pc-stone-dark: #6b5a45;
  --pc-stone-mid: #8a7454;
  --pc-stone-light: #b09a74;
  --pc-stone-hi: #d8c7a5;
  --pc-moss: #4f8f2f;
  --pc-moss-light: #6fbf44;
  --pc-rim: #a87b12;
  color: var(--v2-text-text-base, #2b2118);
}
#pixel-companion[data-visible="false"],
#pixel-companion [hidden] {
  display: none !important;
}
#pixel-companion *,
#pixel-companion *::before,
#pixel-companion *::after {
  box-sizing: border-box;
}
#pixel-companion .pc-golem-wrap,
#pixel-companion .pc-chest-wrap {
  position: absolute;
  bottom: 92px;
  width: 132px;
  transform-origin: bottom center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  pointer-events: none;
}
#pixel-companion .pc-golem-hit {
  position: relative;
  width: 112px;
  height: 112px;
  pointer-events: auto;
  cursor: pointer;
  outline: none;
  transition: filter 80ms steps(2, end), transform 80ms steps(2, end);
}
#pixel-companion .pc-golem-hit:hover,
#pixel-companion .pc-golem-hit:focus-visible {
  filter: brightness(1.12);
  transform: translateY(-1px);
}
#pixel-companion .pc-golem {
  width: 112px;
  height: 112px;
  display: block;
  overflow: visible;
  image-rendering: pixelated;
  filter: drop-shadow(4px 4px 0 var(--pc-shadow));
  animation: pc-breathe 3.4s steps(2, end) infinite;
}
#pixel-companion .pc-chest-hit {
  position: relative;
  width: 112px;
  height: 94px;
  pointer-events: auto;
  cursor: pointer;
  outline: none;
  transition: transform 70ms steps(2, end), filter 70ms steps(2, end);
}
#pixel-companion .pc-chest-hit:hover,
#pixel-companion .pc-chest-hit:focus-visible {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
#pixel-companion .pc-chest {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 112px;
  height: 92px;
  z-index: 2;
  perspective: 180px;
  filter: drop-shadow(4px 4px 0 var(--pc-shadow));
}
#pixel-companion .pc-chest[data-glow="true"] {
  filter: drop-shadow(0 0 7px var(--pc-redstone)) drop-shadow(4px 4px 0 var(--pc-shadow));
}
#pixel-companion .pc-chest[data-glow="approval"] {
  filter: drop-shadow(0 0 7px var(--pc-gold)) drop-shadow(4px 4px 0 var(--pc-shadow));
}
#pixel-companion .pc-chest-lid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: var(--pc-wood);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-wood-light), inset -2px -2px 0 var(--pc-wood-dark);
  transform-origin: 50% 100%;
  backface-visibility: hidden;
  transition: transform 220ms steps(4, end);
}
#pixel-companion .pc-chest-body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 66px;
  background: var(--pc-wood);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-wood-light), inset -2px -2px 0 var(--pc-wood-dark);
  overflow: hidden;
}
#pixel-companion .pc-chest-lid .pc-latch {
  position: absolute;
  left: 50%;
  top: 9px;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  background: var(--pc-gold);
  border: 2px solid var(--pc-frame);
  transition: transform 120ms steps(2, end);
}
#pixel-companion .pc-band {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 10px;
  background: var(--pc-band, #2a2a2a);
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}
#pixel-companion .pc-band-l {
  left: 8px;
}
#pixel-companion .pc-band-r {
  right: 8px;
}
#pixel-companion .pc-chest-wrap[data-lid="ajar"] .pc-chest-lid {
  transform: rotateX(-12deg);
}
#pixel-companion .pc-chest-wrap[data-lid="open"] .pc-chest-lid {
  transform: rotateX(-78deg);
}
#pixel-companion .pc-chest-wrap[data-lid="open"] .pc-latch {
  transform: translateY(-2px) scaleY(0.7);
}
#pixel-companion .pc-loot-beam {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 88px;
  height: 80px;
  background: linear-gradient(to top, #f2c94c99, #f2c94c33 55%, transparent);
  clip-path: polygon(22% 100%, 78% 100%, 100% 0, 0 0);
  opacity: 0;
  transform: scaleY(0.25);
  transform-origin: bottom;
  pointer-events: none;
  z-index: 1;
}
#pixel-companion .pc-chest-wrap[data-lid="open"] .pc-chest {
  animation: pc-loot-rattle 160ms steps(2, end) both;
}
#pixel-companion .pc-chest-wrap[data-lid="open"] .pc-loot-beam {
  opacity: 0.35;
  animation: pc-loot-beam 420ms steps(5, end) both;
}
#pixel-companion .pc-mouth {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 1px;
  height: 14px;
  background: linear-gradient(#090604, #24160c);
  border-bottom: 2px solid #5a3a1e;
  box-shadow: inset 0 2px 0 #000, 0 0 8px #f2c94c22;
  opacity: 0;
  transition: opacity 140ms steps(2, end);
  z-index: 1;
}
#pixel-companion .pc-chest-wrap[data-lid="ajar"] .pc-mouth,
#pixel-companion .pc-chest-wrap[data-lid="open"] .pc-mouth {
  opacity: 1;
}
#pixel-companion .pc-magic-smoke {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}
#pixel-companion .pc-magic-smoke span {
  position: absolute;
  left: 50%;
  bottom: 32px;
  width: var(--size, 4px);
  height: var(--size, 4px);
  background: var(--tone, var(--pc-gold));
  opacity: 0;
  box-shadow: 0 0 5px var(--tone, var(--pc-gold));
}
#pixel-companion .pc-chest-wrap[data-lid="open"] .pc-magic-smoke span {
  animation: pc-magic-smoke 760ms steps(6, end) var(--delay, 0ms) both;
}
#pixel-companion .pc-slots {
  position: absolute;
  left: 26px;
  right: 26px;
  top: 16px;
  display: grid;
  grid-template-columns: repeat(2, 20px);
  grid-auto-rows: 20px;
  gap: 4px;
  justify-content: center;
  align-content: center;
}
#pixel-companion .pc-slot {
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--pc-slot);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-dark), inset -2px -2px 0 var(--pc-bevel-light);
  color: var(--v2-text-text-base, #e8e8e8);
  font: inherit;
  font-size: 9px;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 70ms steps(2, end), filter 70ms steps(2, end);
}
#pixel-companion .pc-slot[data-filled="false"] {
  opacity: 0.5;
  cursor: default;
}
#pixel-companion .pc-slot[data-filled="true"]:hover {
  filter: brightness(1.16);
  transform: translateY(-1px);
}
#pixel-companion .pc-avatar {
  width: 14px;
  height: 14px;
  background: var(--pc-agent, var(--pc-diamond));
  border: 1px solid #000;
  position: relative;
  box-shadow: inset 1px 1px 0 #ffffff66, inset -1px -1px 0 #00000066;
}
#pixel-companion .pc-avatar::before,
#pixel-companion .pc-avatar::after {
  content: "";
  position: absolute;
  top: 4px;
  width: 2px;
  height: 2px;
  background: #101010;
}
#pixel-companion .pc-avatar::before {
  left: 3px;
}
#pixel-companion .pc-avatar::after {
  right: 3px;
}
#pixel-companion .pc-agent-slot {
  position: relative;
}
#pixel-companion .pc-agent-slot[data-status="working"] {
  border-color: var(--pc-grass);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-dark), inset -2px -2px 0 var(--pc-bevel-light), 0 0 6px var(--pc-grass);
}
#pixel-companion .pc-agent-slot[data-status="working"] .pc-avatar {
  animation: pc-bounce 900ms steps(2, end) infinite;
}
#pixel-companion .pc-agent-slot[data-status="waiting"] {
  border-color: var(--pc-gold);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-dark), inset -2px -2px 0 var(--pc-bevel-light), 0 0 6px var(--pc-gold);
}
#pixel-companion .pc-agent-slot[data-status="error"] {
  border-color: var(--pc-redstone);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-dark), inset -2px -2px 0 var(--pc-bevel-light), 0 0 7px var(--pc-redstone);
}
#pixel-companion .pc-agent-slot[data-status="idle"],
#pixel-companion .pc-agent-slot[data-status="done"],
#pixel-companion .pc-agent-slot[data-status="stopped"] {
  opacity: 0.74;
}
#pixel-companion .pc-agent-slot[data-current="true"] {
  outline: 2px solid var(--pc-gold);
  outline-offset: 1px;
}
#pixel-companion .pc-agent-dot {
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 4px;
  height: 4px;
  background: var(--pc-status-color, var(--pc-bevel-light));
  border: 1px solid #000;
}
#pixel-companion .pc-roster-bar {
  width: 108px;
  height: 8px;
  background: var(--pc-slot);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-dark);
  display: flex;
  overflow: hidden;
  pointer-events: none;
}
#pixel-companion .pc-seg {
  display: block;
  height: 100%;
  width: 0;
  transition: width 300ms steps(6, end);
}
#pixel-companion .pc-seg-working {
  background: var(--pc-grass);
  box-shadow: inset 0 2px 0 #a8e87a, inset 0 -2px 0 #2f5f1a;
}
#pixel-companion .pc-seg-waiting {
  background: var(--pc-gold);
  box-shadow: inset 0 2px 0 #ffe38a, inset 0 -2px 0 #7a5c12;
}
#pixel-companion .pc-seg-error {
  background: var(--pc-redstone);
  box-shadow: inset 0 2px 0 #ff8a8a, inset 0 -2px 0 #5a0e0e;
}
#pixel-companion .pc-seg-idle {
  background: var(--pc-bevel-dark);
}
#pixel-companion .pc-detail.pc-roster-detail {
  width: 320px;
  max-height: 360px;
  display: flex;
  flex-direction: column;
}
#pixel-companion .pc-filter {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
}
#pixel-companion .pc-filter button {
  flex: 1;
  padding: 3px 4px;
  font: inherit;
  font-size: 9px;
  color: var(--v2-text-text-base, #e8e8e8);
  background: var(--pc-slot);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-light), inset -2px -2px 0 var(--pc-bevel-dark);
  cursor: pointer;
}
#pixel-companion .pc-filter button[data-active="true"] {
  background: var(--pc-gold);
  color: #1a1200;
  box-shadow: inset -2px -2px 0 var(--pc-bevel-light), inset 2px 2px 0 var(--pc-bevel-dark);
}
#pixel-companion .pc-roster-list {
  overflow: auto;
  max-height: 280px;
  padding-right: 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
#pixel-companion .pc-agent-row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  gap: 6px;
  align-items: center;
  width: 100%;
  padding: 4px 5px;
  font: inherit;
  text-align: left;
  color: var(--v2-text-text-base, #e8e8e8);
  background: var(--pc-slot);
  border: 2px solid transparent;
  cursor: pointer;
}
#pixel-companion .pc-agent-row:hover {
  filter: brightness(1.14);
  border-color: var(--pc-bevel-light);
}
#pixel-companion .pc-agent-row[data-status="working"] {
  border-left-color: var(--pc-grass);
}
#pixel-companion .pc-agent-row[data-status="waiting"] {
  border-left-color: var(--pc-gold);
}
#pixel-companion .pc-agent-row[data-status="error"] {
  border-left-color: var(--pc-redstone);
}
#pixel-companion .pc-agent-row[data-current="true"] {
  border-color: var(--pc-gold);
}
#pixel-companion .pc-agent-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
#pixel-companion .pc-agent-name {
  font-size: 9px;
  color: var(--v2-text-text-base, #e8e8e8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#pixel-companion .pc-agent-meta {
  font-size: 8px;
  color: var(--v2-text-text-faint, #7a7a7a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#pixel-companion .pc-agent-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
}
#pixel-companion .pc-agent-status {
  font-size: 8px;
}
#pixel-companion .pc-agent-time {
  font-size: 8px;
  color: var(--v2-text-text-faint, #7a7a7a);
}
#pixel-companion .pc-agent-row[data-status="working"] .pc-agent-status {
  color: var(--pc-grass);
}
#pixel-companion .pc-agent-row[data-status="waiting"] .pc-agent-status {
  color: var(--pc-gold);
}
#pixel-companion .pc-agent-row[data-status="error"] .pc-agent-status {
  color: var(--pc-redstone);
}
#pixel-companion .pc-agent-row[data-status="done"] .pc-agent-status {
  color: var(--pc-emerald);
}
#pixel-companion .pc-current-badge {
  font-size: 7px;
  color: var(--pc-gold);
  border: 1px solid var(--pc-gold);
  padding: 0 2px;
  margin-left: 3px;
}
#pixel-companion .pc-roster-count {
  color: var(--v2-text-text-faint, #7a7a7a);
  font-size: 8px;
  margin-left: 4px;
}
#pixel-companion .pc-roster-alert-label {
  font-size: 8px;
}
#pixel-companion .pc-roster-alert-label[data-kind="approval"] {
  color: var(--pc-gold);
}
#pixel-companion .pc-roster-alert-label[data-kind="error"] {
  color: var(--pc-redstone);
}
#pixel-companion .pc-plate {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--pc-gold);
  text-shadow: 1px 1px 0 var(--pc-frame);
  pointer-events: none;
}
#pixel-companion .pc-bar {
  width: 108px;
  height: 8px;
  background: var(--pc-slot);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-dark);
  overflow: hidden;
  position: relative;
  pointer-events: none;
}
#pixel-companion .pc-bar-fill {
  display: block;
  width: 0;
  height: 100%;
  background: var(--pc-grass);
  box-shadow: inset 0 2px 0 #a8e87a, inset 0 -2px 0 #2f5f1a;
  transition: width 300ms steps(6, end);
  position: relative;
}
#pixel-companion .pc-bar-fill::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, #ffffff55, transparent);
  animation: pc-shimmer 2.6s steps(8, end) infinite;
}
#pixel-companion .pc-bar[data-high="true"] .pc-bar-fill {
  background: var(--pc-redstone);
  box-shadow: inset 0 2px 0 #ff8a8a, inset 0 -2px 0 #5a0e0e;
}
#pixel-companion .pc-bar-label {
  font-size: 10px;
  color: var(--v2-text-text-muted, #a8a8a8);
  white-space: nowrap;
  pointer-events: none;
}
#pixel-companion .pc-status,
#pixel-companion .pc-usage {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  height: 14px;
  font-size: 10px;
  color: var(--v2-text-text-faint, #7a7a7a);
  pointer-events: none;
}
#pixel-companion .pc-status {
  color: var(--pc-gold);
}
#pixel-companion .pc-bubble {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  left: auto;
  width: 214px;
  padding: 7px 9px;
  background: var(--pc-panel);
  color: var(--v2-text-text-base, #e8e8e8);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-light), inset -2px -2px 0 var(--pc-bevel-dark), 2px 2px 0 var(--pc-shadow);
  font-size: 10px;
  line-height: 1.45;
  text-align: left;
  pointer-events: auto;
  cursor: pointer;
  animation: pc-fade 160ms steps(2, end) both;
}
#pixel-companion .pc-bubble::after {
  content: "";
  position: absolute;
  bottom: -6px;
  right: 24px;
  left: auto;
  width: 6px;
  height: 6px;
  background: var(--pc-panel);
  border-right: 2px solid var(--pc-frame);
  border-bottom: 2px solid var(--pc-frame);
  transform: rotate(45deg);
}
#pixel-companion .pc-bubble[data-tone="permission"],
#pixel-companion .pc-bubble[data-tone="error"] {
  color: var(--pc-redstone);
  border-color: var(--pc-redstone);
  box-shadow: inset 2px 2px 0 #ff8a8a, inset -2px -2px 0 #5a0e0e, 2px 2px 0 var(--pc-shadow);
}
#pixel-companion .pc-bubble[data-tone="done"] {
  color: var(--pc-grass);
}
#pixel-companion[data-side="right"] .pc-bubble {
  left: 0;
  right: auto;
}
#pixel-companion[data-side="right"] .pc-bubble::after {
  left: 24px;
  right: auto;
}
#pixel-companion .pc-menu {
  position: absolute;
  left: 0;
  right: auto;
  bottom: calc(100% + 2px);
  width: 188px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--pc-panel);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-light), inset -2px -2px 0 var(--pc-bevel-dark), 4px 4px 0 var(--pc-shadow);
  pointer-events: auto;
  z-index: 4;
  animation: pc-pop 120ms steps(2, end) both;
}
#pixel-companion[data-side="right"] .pc-menu {
  left: auto;
  right: 0;
}
#pixel-companion .pc-menu button {
  display: block;
  width: 100%;
  padding: 5px 7px;
  text-align: left;
  font: inherit;
  font-size: 10px;
  color: var(--v2-text-text-base, #e8e8e8);
  background: var(--pc-panel-2);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-light), inset -2px -2px 0 var(--pc-bevel-dark), 2px 2px 0 var(--pc-shadow);
  cursor: pointer;
  transition: transform 70ms steps(2, end), filter 70ms steps(2, end);
}
#pixel-companion .pc-menu button:hover:not(:disabled) {
  filter: brightness(1.14);
  transform: translateY(-1px);
}
#pixel-companion .pc-menu button:active:not(:disabled) {
  box-shadow: inset -2px -2px 0 var(--pc-bevel-light), inset 2px 2px 0 var(--pc-bevel-dark), 1px 1px 0 var(--pc-shadow);
  transform: translateY(1px);
}
#pixel-companion .pc-menu button:disabled {
  opacity: 0.45;
  cursor: default;
}
#pixel-companion .pc-detail {
  position: absolute;
  right: 0;
  left: auto;
  bottom: calc(100% - 12px);
  width: 252px;
  padding: 8px;
  background: var(--pc-panel);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 2px 2px 0 var(--pc-bevel-light), inset -2px -2px 0 var(--pc-bevel-dark), 4px 4px 0 var(--pc-shadow);
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  visibility: hidden;
  transform: translateY(46px) scale(0.94);
  transform-origin: bottom center;
  transition:
    transform 150ms cubic-bezier(0.4, 0, 1, 1),
    opacity 110ms steps(2, end),
    visibility 0s linear 150ms;
  will-change: transform, opacity;
}
#pixel-companion .pc-detail[data-open="true"] {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
  transition:
    transform 260ms cubic-bezier(0.16, 1, 0.3, 1) 70ms,
    opacity 150ms steps(2, end) 70ms,
    visibility 0s linear 0s;
}
#pixel-companion .pc-detail.pc-roster-detail {
  padding-bottom: 18px;
}
#pixel-companion .pc-detail[data-open="true"][data-entering="true"] .pc-agent-row {
  animation: pc-loot-row 180ms steps(3, end) both;
  animation-delay: calc(var(--row, 0) * 24ms);
}
#pixel-companion .pc-chest-wrap[data-side="left"] .pc-detail {
  right: auto;
  left: 0;
}
#pixel-companion .pc-detail-head {
  font-size: 10px;
  color: var(--pc-gold);
  margin-bottom: 6px;
  letter-spacing: 0.08em;
}
#pixel-companion .pc-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 0;
  font-size: 10px;
  color: var(--v2-text-text-muted, #a8a8a8);
}
#pixel-companion .pc-detail-row b {
  color: var(--v2-text-text-base, #e8e8e8);
  font-weight: 400;
}
#pixel-companion .pc-detail-task {
  display: block;
  width: 100%;
  margin-top: 3px;
  padding: 3px 5px;
  text-align: left;
  font: inherit;
  font-size: 10px;
  color: var(--v2-text-text-base, #e8e8e8);
  background: var(--pc-slot);
  border: 1px solid var(--pc-frame);
  cursor: pointer;
}
#pixel-companion .pc-detail-task:hover {
  filter: brightness(1.15);
}
#pixel-companion[data-state="working"] {
  --pc-eye: var(--pc-diamond);
}
#pixel-companion[data-state="permission"],
#pixel-companion[data-state="error"] {
  --pc-eye: var(--pc-redstone);
}
#pixel-companion[data-state="done"] {
  --pc-eye: var(--pc-grass);
}
#pixel-companion[data-state="working"] .pc-golem {
  animation: pc-bounce 800ms steps(2, end) infinite;
}
#pixel-companion[data-state="permission"] .pc-golem {
  animation: pc-jump 900ms steps(2, end) infinite;
}
#pixel-companion[data-state="error"] .pc-golem {
  animation: pc-shake 340ms steps(2, end) infinite;
}
#pixel-companion[data-state="done"] .pc-golem {
  animation: pc-done 620ms steps(2, end) 2;
}
#pixel-companion .pc-eye {
  animation: pc-blink 4.6s steps(1, end) infinite;
  transform-box: fill-box;
  transform-origin: center;
}
#pixel-companion .pc-pickaxe {
  transform-box: view-box;
  transform-origin: 28px 12px;
}
#pixel-companion[data-state="working"] .pc-pickaxe {
  animation: pc-swing 550ms steps(3, end) infinite;
}
#pixel-companion .pc-sparkle {
  opacity: 0;
}
#pixel-companion[data-state="done"] .pc-sparkle {
  animation: pc-sparkle 800ms steps(2, end) 3;
}
#pixel-companion .pc-detail.pc-scroll {
  bottom: calc(100% + 10px);
  width: 336px;
  max-height: none;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(36px) scale(0.97);
  transform-origin: bottom center;
  clip-path: inset(100% 0 0 0);
  transition:
    transform 140ms cubic-bezier(0.4, 0, 1, 1),
    opacity 90ms steps(2, end),
    clip-path 140ms steps(5, end),
    visibility 0s linear 140ms;
  will-change: transform, opacity, clip-path;
}
#pixel-companion .pc-detail.pc-scroll[data-open="true"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  clip-path: inset(0 0 0 0);
  transition:
    transform 300ms cubic-bezier(0.16, 1, 0.3, 1) 80ms,
    opacity 120ms steps(2, end) 80ms,
    clip-path 280ms steps(7, end) 90ms,
    visibility 0s linear 0s;
}
#pixel-companion .pc-scroll-glow {
  position: absolute;
  inset: -18px -18px -10px;
  z-index: 0;
  background: radial-gradient(ellipse at 50% 80%, #f2c94c66, transparent 68%);
  pointer-events: none;
  opacity: 0;
}
#pixel-companion .pc-scroll[data-open="true"] .pc-scroll-glow {
  animation: pc-scroll-glow 700ms steps(6, end) both;
}
#pixel-companion .pc-scroll-rod {
  position: relative;
  z-index: 2;
  width: 336px;
  height: 14px;
  margin: 0 auto;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--pc-wood);
  border: 2px solid var(--pc-frame);
  box-shadow: inset 0 2px 0 var(--pc-wood-light), inset 0 -2px 0 var(--pc-wood-dark);
}
#pixel-companion .pc-scroll-rod-top {
  margin-bottom: -2px;
}
#pixel-companion .pc-scroll-rod-bottom {
  margin-top: -2px;
}
#pixel-companion .pc-rod-cap {
  width: 8px;
  height: 8px;
  background: var(--pc-gold);
  border: 1px solid #2a1b0e;
  box-shadow: inset 1px 1px 0 #ffe38a, inset -1px -1px 0 #7a5c12;
}
#pixel-companion .pc-scroll-body {
  position: relative;
  z-index: 1;
  width: 320px;
  max-height: 370px;
  margin: 0 auto;
  padding: 10px 10px 12px;
  display: flex;
  flex-direction: column;
  color: #3a2a1a;
  background-color: #ead3a2;
  background-image:
    repeating-linear-gradient(0deg, transparent 0 3px, #b99b6422 3px 4px),
    radial-gradient(circle at 18% 12%, #fff4d066, transparent 38%),
    radial-gradient(circle at 82% 88%, #b98a4a33, transparent 42%);
  border: 3px solid #3a2614;
  box-shadow:
    inset 0 0 0 2px #f7e7be,
    inset 0 0 18px #8a6a3a44,
    4px 4px 0 var(--pc-shadow);
}
#pixel-companion .pc-scroll .pc-detail-head {
  color: #4a3218;
  font-size: 11px;
  letter-spacing: 0.08em;
  margin: 0 0 7px;
  padding-bottom: 5px;
  border-bottom: 2px solid #b49a68;
  text-shadow: 0 1px 0 #f7e7be;
}
#pixel-companion .pc-scroll .pc-roster-count {
  color: #7a6448;
  font-size: 8px;
}
#pixel-companion .pc-scroll .pc-filter {
  gap: 4px;
  margin-bottom: 6px;
}
#pixel-companion .pc-scroll .pc-filter button {
  padding: 4px;
  color: #3a2a1a;
  font-size: 9px;
  background: #d8bd85;
  border: 1px solid #6b4a26;
  box-shadow: inset 1px 1px 0 #f7e7be, inset -1px -1px 0 #a8824e;
}
#pixel-companion .pc-scroll .pc-filter button[data-active="true"] {
  color: #fff4d0;
  background: #b8862f;
  box-shadow: inset -1px -1px 0 #6b4a26, inset 1px 1px 0 #e8c06a;
}
#pixel-companion .pc-scroll .pc-roster-list {
  max-height: 280px;
  padding-right: 18px;
  gap: 0;
  scrollbar-width: thin;
  scrollbar-color: #8a6a3a #d8bd85;
}
#pixel-companion .pc-scroll .pc-roster-list::-webkit-scrollbar {
  width: 10px;
}
#pixel-companion .pc-scroll .pc-roster-list::-webkit-scrollbar-track {
  background: #d8bd85;
  border-left: 1px solid #a8824e;
}
#pixel-companion .pc-scroll .pc-roster-list::-webkit-scrollbar-thumb {
  background: #8a6a3a;
  border: 2px solid #d8bd85;
  box-shadow: inset 1px 1px 0 #c9a66a;
}
#pixel-companion .pc-scroll .pc-agent-row {
  grid-template-columns: 22px minmax(0, 1fr) auto;
  gap: 6px;
  padding: 6px 3px;
  color: #3a2a1a;
  background: transparent;
  border: 0;
  border-left: 3px solid transparent;
  border-bottom: 1px dashed #b49a68;
  cursor: pointer;
}
#pixel-companion .pc-scroll .pc-agent-row:hover {
  background: #f7e7be;
  border-bottom-color: #7a5a2e;
  filter: none;
}
#pixel-companion .pc-scroll .pc-agent-row[data-status="working"] {
  border-left-color: #4f8f2f;
}
#pixel-companion .pc-scroll .pc-agent-row[data-status="waiting"] {
  border-left-color: #b8862f;
}
#pixel-companion .pc-scroll .pc-agent-row[data-status="error"] {
  border-left-color: #a02a2a;
}
#pixel-companion .pc-scroll .pc-agent-row[data-current="true"] {
  background: #f2c94c40;
  border-left-color: #b8862f;
  border-bottom-color: #b8862f;
}
#pixel-companion .pc-scroll .pc-avatar {
  border-color: #3a2614;
  box-shadow: inset 1px 1px 0 #ffffff88, inset -1px -1px 0 #00000055;
}
#pixel-companion .pc-scroll .pc-agent-name {
  color: #2b1b0d;
  font-size: 9px;
}
#pixel-companion .pc-scroll .pc-agent-meta {
  color: #7a6448;
  font-size: 8px;
}
#pixel-companion .pc-scroll .pc-agent-status {
  font-size: 8px;
}
#pixel-companion .pc-scroll .pc-agent-time {
  color: #7a6448;
}
#pixel-companion .pc-scroll .pc-agent-row[data-status="working"] .pc-agent-status {
  color: #2f6b25;
}
#pixel-companion .pc-scroll .pc-agent-row[data-status="waiting"] .pc-agent-status {
  color: #8a5a00;
}
#pixel-companion .pc-scroll .pc-agent-row[data-status="error"] .pc-agent-status {
  color: #a02020;
}
#pixel-companion .pc-scroll .pc-agent-row[data-status="done"] .pc-agent-status {
  color: #2a6b42;
}
@keyframes pc-breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(1px); } }
@keyframes pc-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
@keyframes pc-jump { 0%, 100% { transform: translateY(0); } 40%, 60% { transform: translateY(-7px); } }
@keyframes pc-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
@keyframes pc-done { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes pc-blink { 0%, 94%, 100% { transform: scaleY(1); } 96%, 98% { transform: scaleY(0.1); } }
@keyframes pc-swing { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-38deg); } }
@keyframes pc-sparkle { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
@keyframes pc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes pc-loot-rattle {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-1px); }
}
@keyframes pc-loot-beam {
  0% { opacity: 0; transform: scaleY(0.25); }
  22% { opacity: 0.9; transform: scaleY(1); }
  100% { opacity: 0.35; transform: scaleY(1); }
}
@keyframes pc-magic-smoke {
  0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
  18% { opacity: 0.9; }
  100% { opacity: 0; transform: translate(var(--x, 0px), var(--y, -72px)) scale(1.5); }
}
@keyframes pc-loot-row {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}
@keyframes pc-scroll-glow {
  0% { opacity: 0; }
  30% { opacity: 0.85; }
  100% { opacity: 0; }
}
@keyframes pc-pop { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pc-shimmer { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
@keyframes pc-mini-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
@media (prefers-reduced-motion: reduce) {
  #pixel-companion *, #pixel-companion *::before, #pixel-companion *::after {
    animation: none !important;
    transition: none !important;
  }
}
:root[data-motion="reduce"] #pixel-companion *,
:root[data-motion="reduce"] #pixel-companion *::before,
:root[data-motion="reduce"] #pixel-companion *::after {
  animation: none !important;
  transition: none !important;
}
/* ground shadow under the rock */
#pixel-companion .pc-golem-wrap::after,
#pixel-companion .pc-chest-wrap::after {
  content: "";
  position: absolute;
  left: -28px;
  right: -28px;
  bottom: -14px;
  height: 8px;
  background: radial-gradient(ellipse at center, #00000077 0 55%, transparent 75%);
  filter: blur(1px);
  z-index: -2;
  pointer-events: none;
}

/* companion inscriptions: glowing runes carved into the rock ledge */
#pixel-companion .pc-nameplate {
  position: absolute;
  left: 50%;
  bottom: 7px;
  transform: translateX(-50%);
  z-index: 4;
  width: 156px;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 6px 5px;
  background: none !important;
  border: 0 !important;
  box-shadow: none !important;
  pointer-events: none;
}
#pixel-companion .pc-nameplate::before,
#pixel-companion .pc-nameplate::after {
  content: none !important;
  display: none !important;
}
#pixel-companion .pc-nameplate-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  min-width: 0;
  min-height: 14px;
}
#pixel-companion .pc-nameplate .pc-plate {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  min-width: 0 !important;
  height: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  background-image: none !important;
  border: 0 !important;
  box-shadow: none !important;
  color: var(--pc-gold) !important;
  font-size: 12px !important;
  line-height: 1 !important;
  letter-spacing: .12em !important;
  text-shadow:
    0 1px 0 #05070a,
    0 2px 0 #05070a,
    0 -1px 0 #7f8fa3aa,
    0 0 7px #f2c94c55 !important;
}
#pixel-companion .pc-nameplate .pc-status {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  flex: 0 1 auto !important;
  min-width: 0 !important;
  height: 14px !important;
  max-width: 100px !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  color: #8be9e0 !important;
  font-size: 11px !important;
  line-height: 1 !important;
  letter-spacing: .04em !important;
  text-shadow:
    0 1px 0 #05070a,
    0 2px 0 #05070a,
    0 -1px 0 #7f8fa3aa,
    0 0 8px #8be9e066 !important;
}
#pixel-companion .pc-nameplate .pc-bar {
  width: 100% !important;
  height: 7px !important;
  border: 0 !important;
  background-color: #080b10 !important;
  background-image: repeating-linear-gradient(0deg, #0b0f15 0 2px, #080b10 2px 4px) !important;
  box-shadow: inset 0 2px 0 #05070a, inset 0 -1px 0 #3a4552 !important;
  clip-path: polygon(1px 0, 100% 0, calc(100% - 2px) 100%, 0 100%);
  overflow: hidden !important;
  position: relative !important;
}
#pixel-companion .pc-nameplate .pc-bar-fill {
  background: linear-gradient(180deg, #b8fff7, #2f9a9a) !important;
  box-shadow:
    inset 0 1px 0 #e6fffb,
    inset 0 -1px 0 #145c5c,
    0 0 5px #7fe7e066 !important;
}
#pixel-companion .pc-nameplate .pc-bar-fill::after {
  animation-duration: 3.2s !important;
}
#pixel-companion .pc-nameplate .pc-bar-label {
  color: #e6c07a !important;
  font-size: 11px !important;
  line-height: 1 !important;
  text-align: left !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  letter-spacing: .04em !important;
  text-shadow:
    0 1px 0 #05070a,
    0 2px 0 #05070a,
    0 -1px 0 #7f8fa3aa,
    0 0 6px #e6c07a33 !important;
}
#pixel-companion .pc-nameplate .pc-usage {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  height: 13px !important;
  gap: 2px !important;
  font-size: 10px !important;
  line-height: 1 !important;
  color: var(--pc-gold) !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}
#pixel-companion .pc-nameplate .pc-roster-bar {
  width: 100% !important;
  height: 7px !important;
  border: 0 !important;
  background-color: #080b10 !important;
  background-image: repeating-linear-gradient(0deg, #0b0f15 0 2px, #080b10 2px 4px) !important;
  box-shadow: inset 0 2px 0 #05070a, inset 0 -1px 0 #3a4552 !important;
  clip-path: polygon(1px 0, 100% 0, calc(100% - 2px) 100%, 0 100%);
  overflow: hidden !important;
  display: flex !important;
}
#pixel-companion .pc-nameplate .pc-seg {
  height: 100% !important;
  min-width: 0 !important;
  box-shadow:
    inset 0 1px 0 #ffffff55,
    inset 0 -1px 0 #00000066 !important;
}
#pixel-companion .pc-nameplate .pc-roster-usage {
  flex: 0 1 auto !important;
  max-width: 86px !important;
  min-width: 0 !important;
  overflow: hidden !important;
}
#pixel-companion .pc-nameplate .pc-roster-total {
  color: var(--pc-gold) !important;
  font-size: 10px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  text-shadow:
    0 1px 0 #05070a,
    0 0 6px #f2c94c55 !important;
}
#pixel-companion .pc-nameplate .pc-roster-alert-label {
  color: #ff8a8a !important;
  font-size: 10px !important;
  white-space: nowrap !important;
  text-shadow:
    0 1px 0 #05070a,
    0 0 7px #ff8a8a66 !important;
}
#pixel-companion .pc-nameplate .pc-roster-label {
  color: #e6c07a !important;
  font-size: 11px !important;
  line-height: 1 !important;
  text-align: left !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  letter-spacing: .04em !important;
  text-shadow:
    0 1px 0 #05070a,
    0 2px 0 #05070a,
    0 -1px 0 #7f8fa3aa,
    0 0 6px #e6c07a33 !important;
}
#pixel-companion .pc-nameplate .pc-roster-alert-label[data-kind="error"] {
  color: #ff8a8a !important;
}
#pixel-companion .pc-nameplate .pc-roster-alert-label[data-kind="approval"] {
  color: var(--pc-gold) !important;
}
@keyframes pc-rune-pulse {
  0%, 100% { opacity: .88; }
  50% { opacity: 1; }
}
#pixel-companion .pc-nameplate .pc-plate,
#pixel-companion .pc-nameplate .pc-status,
#pixel-companion .pc-nameplate .pc-roster-total,
#pixel-companion .pc-nameplate .pc-roster-alert-label {
  animation: pc-rune-pulse 4.8s steps(2, end) infinite;
}
/* the rock ledge the companions stand on */
#pixel-companion .pc-rock {
  position: relative;
  z-index: 0;
  flex: none;
  width: 192px;
  height: 120px;
  margin-top: -3px;
  pointer-events: none;
  image-rendering: pixelated;
  filter: drop-shadow(3px 3px 0 #000000aa);
}
#pixel-companion .pc-golem-hit,
#pixel-companion .pc-chest-hit {
  z-index: 2;
}
#pixel-companion .pc-golem-wrap .pc-rock {
  margin-top: -37px;
}
#pixel-companion .pc-chest-wrap .pc-rock {
  margin-top: -29px;
}

`

const HTML = `
<div class="pc-golem-wrap" data-side="left">
  <div class="pc-bubble" role="status" aria-live="polite" hidden></div>
  <div class="pc-golem-hit" role="button" tabindex="0" aria-label="Pixel companion menu">
    <svg class="pc-golem" viewBox="0 0 32 32" width="112" height="112" shape-rendering="crispEdges" aria-hidden="true">
      <ellipse class="pc-golem-shadow" cx="16" cy="30" rx="9" ry="1.6" fill="#000" opacity="0.42"/>
      <g class="pc-legs">
        <rect x="9" y="23" width="5" height="6" fill="var(--pc-stone-dark)"/>
        <rect x="18" y="23" width="5" height="6" fill="var(--pc-stone-dark)"/>
        <rect x="9" y="28" width="5" height="1" fill="var(--pc-stone-light)"/>
        <rect x="18" y="28" width="5" height="1" fill="var(--pc-stone-light)"/>
        <rect x="11" y="24" width="1" height="3" fill="var(--pc-stone-mid)"/>
        <rect x="20" y="24" width="1" height="3" fill="var(--pc-stone-mid)"/>
      </g>
      <g class="pc-body">
        <rect x="9" y="14" width="14" height="10" fill="var(--pc-stone-mid)"/>
        <rect x="9" y="14" width="14" height="2" fill="var(--pc-stone-light)"/>
        <rect x="9" y="22" width="14" height="2" fill="var(--pc-stone-dark)"/>
        <rect x="11" y="17" width="3" height="3" fill="var(--pc-stone-dark)" opacity="0.55"/>
        <rect x="12" y="16" width="1" height="4" fill="var(--pc-stone-dark)"/>
        <rect x="16" y="18" width="3" height="1" fill="var(--pc-stone-dark)"/>
        <rect x="16" y="15" width="3" height="1" fill="var(--pc-stone-light)"/>
        <rect x="9" y="14" width="1" height="8" fill="var(--pc-rim)" opacity=".55"/>
        <rect x="18" y="19" width="2" height="2" fill="var(--pc-stone-hi)"/>
        <rect x="13" y="21" width="6" height="1" fill="var(--pc-stone-dark)"/>
        <rect x="9" y="15" width="3" height="1" fill="var(--pc-moss)"/>
        <rect x="20" y="22" width="2" height="1" fill="var(--pc-moss)"/>
        <rect x="10" y="15" width="1" height="1" fill="var(--pc-moss-light)"/>
      </g>
      <g class="pc-shoulders">
        <rect x="6" y="13" width="5" height="4" fill="var(--pc-stone-light)"/>
        <rect x="6" y="13" width="5" height="1" fill="var(--pc-stone-hi)"/>
        <rect x="7" y="15" width="2" height="2" fill="var(--pc-moss)"/>
        <rect x="7" y="15" width="1" height="1" fill="var(--pc-moss-light)"/>
        <rect x="21" y="13" width="5" height="4" fill="var(--pc-stone-mid)"/>
        <rect x="21" y="13" width="5" height="1" fill="var(--pc-stone-light)"/>
        <rect x="24" y="15" width="2" height="1" fill="var(--pc-moss)"/>
      </g>
      <g class="pc-arm-left">
        <rect x="4" y="15" width="5" height="11" fill="var(--pc-stone-mid)"/>
        <rect x="4" y="15" width="1" height="10" fill="var(--pc-rim)"/>
        <rect x="7" y="19" width="2" height="6" fill="var(--pc-stone-dark)"/>
        <rect x="4" y="25" width="4" height="1" fill="var(--pc-stone-light)"/>
      </g>
      <g class="pc-arm-right">
        <rect x="23" y="15" width="5" height="11" fill="var(--pc-stone-mid)"/>
        <rect x="27" y="16" width="1" height="9" fill="var(--pc-stone-dark)"/>
        <rect x="24" y="19" width="1" height="6" fill="var(--pc-stone-hi)"/>
        <rect x="24" y="25" width="4" height="1" fill="var(--pc-stone-light)"/>
      </g>
      <g class="pc-head">
        <rect x="11" y="5" width="10" height="9" fill="var(--pc-stone-mid)"/>
        <rect x="11" y="5" width="10" height="2" fill="var(--pc-stone-light)"/>
        <rect x="11" y="12" width="10" height="2" fill="var(--pc-stone-dark)"/>
        <rect x="12" y="6" width="2" height="2" fill="var(--pc-moss)"/>
        <rect x="12" y="6" width="1" height="1" fill="var(--pc-moss-light)"/>
        <rect x="14" y="8" width="2" height="2" fill="var(--pc-eye)"/>
        <rect x="18" y="8" width="2" height="2" fill="var(--pc-eye)"/>
        <rect x="15" y="11" width="2" height="1" fill="var(--pc-stone-dark)"/>
        <rect x="20" y="6" width="1" height="3" fill="var(--pc-stone-dark)"/>
        <rect x="18" y="7" width="1" height="2" fill="var(--pc-stone-dark)"/>
        <rect x="11" y="5" width="1" height="4" fill="var(--pc-rim)" opacity=".45"/>
        <rect x="11" y="12" width="2" height="1" fill="var(--pc-rim)"/>
        <rect x="17" y="6" width="1" height="1" fill="var(--pc-stone-hi)"/>
      </g>
      <g class="pc-pickaxe">
        <rect x="28" y="10" width="1" height="17" fill="var(--pc-wood)"/>
        <rect x="28" y="10" width="1" height="2" fill="var(--pc-wood-light)"/>
        <rect x="25" y="8" width="7" height="1" fill="var(--pc-diamond)"/>
        <rect x="24" y="7" width="1" height="1" fill="var(--pc-diamond)"/>
        <rect x="31" y="7" width="1" height="2" fill="var(--pc-diamond)"/>
        <rect x="27" y="9" width="2" height="1" fill="var(--pc-stone-hi)"/>
      </g>
      <g class="pc-sparkle" fill="var(--pc-gold)">
        <rect x="3" y="4" width="1" height="1"/>
        <rect x="29" y="4" width="1" height="1"/>
        <rect x="2" y="14" width="1" height="1"/>
        <rect x="30" y="22" width="1" height="1"/>
      </g>
    </svg>
  </div>
  <svg class="pc-rock" viewBox="0 0 64 40" width="192" height="120" shape-rendering="crispEdges" aria-hidden="true">
      <path d="M3 0 H10 V1 H12 V7 H11 V8 H53 V7 H52 V1 H54 V0 H61 V2 H62 V6 H63 V10 H64 V14 H63 V18 H64 V22 H62 V26 H63 V30 H61 V34 H58 V36 H59 V39 H55 V40 H12 V39 H9 V37 H5 V34 H3 V30 H4 V26 H2 V22 H3 V18 H1 V14 H2 V10 H3 V6 H4 V2 H3 Z" fill="#465666" stroke="#07090d" stroke-width="1" stroke-linejoin="miter"/>
      <defs>
        <clipPath id="pc-rock-clip-golem"><path d="M3 0 H10 V1 H12 V7 H11 V8 H53 V7 H52 V1 H54 V0 H61 V2 H62 V6 H63 V10 H64 V14 H63 V18 H64 V22 H62 V26 H63 V30 H61 V34 H58 V36 H59 V39 H55 V40 H12 V39 H9 V37 H5 V34 H3 V30 H4 V26 H2 V22 H3 V18 H1 V14 H2 V10 H3 V6 H4 V2 H3 Z"/></clipPath>
      </defs>
      <g clip-path="url(#pc-rock-clip-golem)">
        <rect x="0" y="8" width="64" height="10" fill="#4a5563"/>
        <path d="M0 17 H7 V19 H16 V17 H28 V20 H40 V18 H50 V20 H57 V17 H64 V40 H0 Z" fill="#1f2833"/>
        <rect x="2" y="24" width="3" height="1" fill="#34404c"/>
        <rect x="59" y="26" width="3" height="1" fill="#2a3440"/>
        <rect x="3" y="33" width="2" height="1" fill="#34404c"/>
        <rect x="58" y="36" width="3" height="1" fill="#2a3440"/>
        <rect x="11" y="8" width="42" height="1" fill="#7a8798"/>
        <rect x="11" y="9" width="42" height="2" fill="#6b7684"/>
        <rect x="9" y="11" width="46" height="1" fill="#5a6a7d"/>
        <rect x="3" y="0" width="7" height="1" fill="#7a8798"/>
        <rect x="2" y="1" width="10" height="2" fill="#6b7684"/>
        <rect x="2" y="3" width="9" height="3" fill="#5a6a7d"/>
        <rect x="54" y="0" width="7" height="1" fill="#7a8798"/>
        <rect x="53" y="1" width="9" height="2" fill="#6b7684"/>
        <rect x="54" y="3" width="8" height="3" fill="#5a6a7d"/>
        <rect x="10" y="13" width="14" height="2" fill="#5a6a7d"/>
        <rect x="40" y="16" width="14" height="2" fill="#5a6a7d"/>
        <rect x="16" y="18" width="10" height="1" fill="#5a6a7d"/>
        <rect x="42" y="19" width="10" height="1" fill="#5a6a7d"/>
        <rect x="6" y="23" width="8" height="2" fill="#4a5563"/>
        <rect x="50" y="26" width="8" height="2" fill="#4a5563"/>
        <rect x="26" y="12" width="1" height="4" fill="#141a22"/>
        <rect x="27" y="16" width="1" height="1" fill="#141a22"/>
        <rect x="41" y="11" width="1" height="3" fill="#141a22"/>
        <rect x="40" y="14" width="1" height="2" fill="#141a22"/>
        <rect x="33" y="14" width="1" height="3" fill="#1b222c"/>
        <rect x="20" y="19" width="1" height="2" fill="#141a22"/>
        <rect x="52" y="20" width="1" height="2" fill="#141a22"/>
        <rect x="31" y="15" width="2" height="2" fill="#2f9a9a"/>
        <rect x="32" y="14" width="1" height="1" fill="#8be9e0"/>
        <rect x="30" y="16" width="1" height="1" fill="#4fd6d6"/>
        <rect x="33" y="16" width="1" height="1" fill="#4fd6d6"/>
        <rect x="4" y="0" width="5" height="1" fill="#3f6a2f"/>
        <rect x="5" y="1" width="2" height="1" fill="#4f7a36"/>
        <rect x="3" y="2" width="2" height="1" fill="#2f5426"/>
        <rect x="55" y="1" width="4" height="1" fill="#3f6a2f"/>
        <rect x="57" y="2" width="2" height="1" fill="#4f7a36"/>
        <rect x="12" y="8" width="4" height="1" fill="#3f6a2f"/>
        <rect x="13" y="9" width="2" height="1" fill="#4f7a36"/>
        <rect x="46" y="8" width="4" height="1" fill="#3f6a2f"/>
        <rect x="48" y="9" width="2" height="1" fill="#4f7a36"/>
        <rect x="16" y="9" width="1" height="3" fill="#3f6a2f"/>
        <rect x="17" y="10" width="1" height="2" fill="#4f7a36"/>
        <rect x="50" y="9" width="1" height="2" fill="#2f5426"/>
        <rect x="3" y="20" width="3" height="1" fill="#3f6a2f"/>
        <rect x="4" y="21" width="1" height="1" fill="#4f7a36"/>
        <rect x="5" y="33" width="2" height="1" fill="#2f5426"/>
        <rect x="58" y="17" width="3" height="1" fill="#3f6a2f"/>
        <rect x="59" y="18" width="1" height="1" fill="#4f7a36"/>
        <rect x="55" y="35" width="2" height="1" fill="#2f5426"/>
        <rect x="12" y="38" width="3" height="1" fill="#3f6a2f"/>
        <rect x="50" y="37" width="2" height="1" fill="#2f5426"/>
        <rect x="7" y="5" width="1" height="1" fill="#f2c94c"/>
        <rect x="8" y="6" width="1" height="1" fill="#b8862f"/>
        <rect x="58" y="5" width="1" height="1" fill="#f2c94c"/>
        <rect x="59" y="6" width="1" height="1" fill="#b8862f"/>
        <rect x="54" y="4" width="1" height="1" fill="#b8862f"/>
        <rect x="4" y="27" width="1" height="1" fill="#f2c94c"/>
        <rect x="60" y="31" width="2" height="2" fill="#4fd6d6"/>
        <rect x="61" y="30" width="1" height="1" fill="#b8fff7"/>
      </g>
    </svg>
  <div class="pc-nameplate pc-golem-nameplate">
    <div class="pc-nameplate-row">
      <span class="pc-plate">DUSK</span>
      <span class="pc-status">IDLE</span>
    </div>
    <div class="pc-bar pc-golem-bar" data-high="false"><span class="pc-bar-fill"></span></div>
    <div class="pc-bar-label pc-golem-context">CONTEXT</div>
  </div>
  <div class="pc-menu" hidden>
    <button type="button" data-pc-action="stop" disabled>Stop turn</button>
    <button type="button" data-pc-action="focus">Focus prompt</button>
    <button type="button" data-pc-action="copy">Copy last response</button>
    <button type="button" data-pc-action="settings">Settings</button>
    <button type="button" data-pc-action="side">Switch side</button>
    <button type="button" data-pc-action="hide">Hide companion</button>
  </div>
</div>
<div class="pc-chest-wrap" data-side="right">
  <div class="pc-chest-hit" role="button" tabindex="0" aria-label="Open agent roster" aria-expanded="false" aria-controls="pc-roster-panel">
    <div class="pc-chest" data-glow="false">
      <div class="pc-chest-lid"><span class="pc-latch"></span></div>
      <div class="pc-chest-body">
        <div class="pc-mouth" aria-hidden="true"></div>
        <span class="pc-band pc-band-l"></span>
        <span class="pc-band pc-band-r"></span>
        <div class="pc-slots" role="list" aria-label="Agents">
          <span class="pc-slot" data-filled="false"></span>
          <span class="pc-slot" data-filled="false"></span>
          <span class="pc-slot" data-filled="false"></span>
          <span class="pc-slot" data-filled="false"></span>
        </div>
      </div>
    </div>
    <div class="pc-loot-beam" aria-hidden="true"></div>
    <div class="pc-magic-smoke" aria-hidden="true">
      <span style="--x:-42px;--y:-78px;--size:5px;--delay:0ms"></span>
      <span style="--x:-28px;--y:-94px;--size:4px;--delay:50ms;--tone:var(--pc-diamond)"></span>
      <span style="--x:-14px;--y:-82px;--size:6px;--delay:90ms"></span>
      <span style="--x:2px;--y:-104px;--size:4px;--delay:20ms;--tone:var(--pc-diamond)"></span>
      <span style="--x:16px;--y:-86px;--size:5px;--delay:70ms"></span>
      <span style="--x:30px;--y:-98px;--size:4px;--delay:110ms;--tone:var(--pc-diamond)"></span>
      <span style="--x:44px;--y:-80px;--size:6px;--delay:30ms"></span>
      <span style="--x:0px;--y:-126px;--size:3px;--delay:140ms"></span>
    </div>
  </div>
  <svg class="pc-rock" viewBox="0 0 64 40" width="192" height="120" shape-rendering="crispEdges" aria-hidden="true">
      <path d="M3 0 H10 V1 H12 V7 H11 V8 H53 V7 H52 V1 H54 V0 H61 V2 H62 V6 H63 V10 H64 V14 H63 V18 H64 V22 H62 V26 H63 V30 H61 V34 H58 V36 H59 V39 H55 V40 H12 V39 H9 V37 H5 V34 H3 V30 H4 V26 H2 V22 H3 V18 H1 V14 H2 V10 H3 V6 H4 V2 H3 Z" fill="#465666" stroke="#07090d" stroke-width="1" stroke-linejoin="miter"/>
      <defs>
        <clipPath id="pc-rock-clip-chest"><path d="M3 0 H10 V1 H12 V7 H11 V8 H53 V7 H52 V1 H54 V0 H61 V2 H62 V6 H63 V10 H64 V14 H63 V18 H64 V22 H62 V26 H63 V30 H61 V34 H58 V36 H59 V39 H55 V40 H12 V39 H9 V37 H5 V34 H3 V30 H4 V26 H2 V22 H3 V18 H1 V14 H2 V10 H3 V6 H4 V2 H3 Z"/></clipPath>
      </defs>
      <g clip-path="url(#pc-rock-clip-chest)">
        <rect x="0" y="8" width="64" height="6" fill="#4a5563"/>
        <rect x="0" y="14" width="64" height="8" fill="#465666"/>
        <rect x="0" y="22" width="64" height="13" fill="#3a4552"/>
        <rect x="0" y="34" width="64" height="6" fill="#2f3a47"/>
        <rect x="11" y="8" width="42" height="1" fill="#7a8798"/>
        <rect x="11" y="9" width="42" height="2" fill="#6b7684"/>
        <rect x="9" y="11" width="46" height="1" fill="#5a6a7d"/>
        <rect x="3" y="0" width="7" height="1" fill="#7a8798"/>
        <rect x="2" y="1" width="10" height="2" fill="#6b7684"/>
        <rect x="2" y="3" width="9" height="3" fill="#5a6a7d"/>
        <rect x="54" y="0" width="7" height="1" fill="#7a8798"/>
        <rect x="53" y="1" width="9" height="2" fill="#6b7684"/>
        <rect x="54" y="3" width="8" height="3" fill="#5a6a7d"/>
        <rect x="10" y="13" width="14" height="2" fill="#5a6a7d"/>
        <rect x="40" y="16" width="14" height="2" fill="#5a6a7d"/>
        <rect x="16" y="18" width="10" height="1" fill="#5a6a7d"/>
        <rect x="42" y="19" width="10" height="1" fill="#5a6a7d"/>
        <rect x="6" y="23" width="8" height="2" fill="#4a5563"/>
        <rect x="50" y="26" width="8" height="2" fill="#4a5563"/>
        <rect x="26" y="12" width="1" height="4" fill="#141a22"/>
        <rect x="27" y="16" width="1" height="1" fill="#141a22"/>
        <rect x="41" y="11" width="1" height="3" fill="#141a22"/>
        <rect x="40" y="14" width="1" height="2" fill="#141a22"/>
        <rect x="33" y="14" width="1" height="3" fill="#1b222c"/>
        <rect x="20" y="19" width="1" height="2" fill="#141a22"/>
        <rect x="52" y="20" width="1" height="2" fill="#141a22"/>
        <rect x="31" y="15" width="2" height="2" fill="#2f9a9a"/>
        <rect x="32" y="14" width="1" height="1" fill="#8be9e0"/>
        <rect x="30" y="16" width="1" height="1" fill="#4fd6d6"/>
        <rect x="33" y="16" width="1" height="1" fill="#4fd6d6"/>
        <rect x="4" y="0" width="5" height="1" fill="#3f6a2f"/>
        <rect x="5" y="1" width="2" height="1" fill="#4f7a36"/>
        <rect x="3" y="2" width="2" height="1" fill="#2f5426"/>
        <rect x="55" y="1" width="4" height="1" fill="#3f6a2f"/>
        <rect x="57" y="2" width="2" height="1" fill="#4f7a36"/>
        <rect x="12" y="8" width="4" height="1" fill="#3f6a2f"/>
        <rect x="13" y="9" width="2" height="1" fill="#4f7a36"/>
        <rect x="46" y="8" width="4" height="1" fill="#3f6a2f"/>
        <rect x="48" y="9" width="2" height="1" fill="#4f7a36"/>
        <rect x="16" y="9" width="1" height="3" fill="#3f6a2f"/>
        <rect x="17" y="10" width="1" height="2" fill="#4f7a36"/>
        <rect x="50" y="9" width="1" height="2" fill="#2f5426"/>
        <rect x="3" y="20" width="3" height="1" fill="#3f6a2f"/>
        <rect x="4" y="21" width="1" height="1" fill="#4f7a36"/>
        <rect x="5" y="33" width="2" height="1" fill="#2f5426"/>
        <rect x="58" y="17" width="3" height="1" fill="#3f6a2f"/>
        <rect x="59" y="18" width="1" height="1" fill="#4f7a36"/>
        <rect x="55" y="35" width="2" height="1" fill="#2f5426"/>
        <rect x="12" y="38" width="3" height="1" fill="#3f6a2f"/>
        <rect x="50" y="37" width="2" height="1" fill="#2f5426"/>
        <rect x="7" y="5" width="1" height="1" fill="#f2c94c"/>
        <rect x="8" y="6" width="1" height="1" fill="#b8862f"/>
        <rect x="58" y="5" width="1" height="1" fill="#f2c94c"/>
        <rect x="59" y="6" width="1" height="1" fill="#b8862f"/>
        <rect x="54" y="4" width="1" height="1" fill="#b8862f"/>
        <rect x="4" y="27" width="1" height="1" fill="#f2c94c"/>
        <rect x="60" y="31" width="2" height="2" fill="#4fd6d6"/>
        <rect x="61" y="30" width="1" height="1" fill="#b8fff7"/>
      </g>
    </svg>
  <div class="pc-nameplate pc-chest-nameplate">
    <div class="pc-nameplate-row">
      <span class="pc-plate">AGENTS</span>
      <span class="pc-usage pc-roster-usage"><span class="pc-roster-total"></span><span class="pc-roster-alert-label"></span></span>
    </div>
    <div class="pc-roster-bar" aria-hidden="true">
      <span class="pc-seg pc-seg-working"></span>
      <span class="pc-seg pc-seg-waiting"></span>
      <span class="pc-seg pc-seg-error"></span>
      <span class="pc-seg pc-seg-idle"></span>
    </div>
    <div class="pc-bar-label pc-roster-label">AGENTS</div>
  </div>
  <div class="pc-detail pc-roster-detail pc-scroll" id="pc-roster-panel" data-open="false" aria-hidden="true" role="region" aria-label="Agent roster">
    <div class="pc-scroll-glow" aria-hidden="true"></div>
    <div class="pc-scroll-rod pc-scroll-rod-top" aria-hidden="true">
      <span class="pc-rod-cap"></span>
      <span class="pc-rod-cap"></span>
    </div>
    <div class="pc-scroll-body">
      <div class="pc-detail-head">AGENT ROSTER <span class="pc-roster-count"></span></div>
      <div class="pc-filter">
        <button type="button" data-pc-filter="active">ACTIVE</button>
        <button type="button" data-pc-filter="all">ALL</button>
        <button type="button" data-pc-filter="working">WORKING</button>
      </div>
      <div class="pc-roster-list" role="list"></div>
    </div>
    <div class="pc-scroll-rod pc-scroll-rod-bottom" aria-hidden="true">
      <span class="pc-rod-cap"></span>
      <span class="pc-rod-cap"></span>
    </div>
  </div>
</div>

`

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    const merged = Object.assign({}, DEFAULTS, parsed && typeof parsed === "object" ? parsed : {})
    if (!["active", "all", "working"].includes(merged.rosterFilter)) merged.rosterFilter = DEFAULTS.rosterFilter
    return merged
  } catch {
    return Object.assign({}, DEFAULTS)
  }
}

function saveSettings(value) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(value))
  } catch {}
}

function safe(fn, fallback) {
  try {
    const value = fn()
    return value === undefined || value === null ? fallback : value
  } catch {
    return fallback
  }
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms)
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

function formatTokens(value) {
  const n = Number(value) || 0
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  if (n >= 1000) return Math.round(n / 1000) + "k"
  return String(Math.round(n))
}

function toolLabel(tool) {
  const raw = String(tool && (tool.name || (tool.state && tool.state.title) || "tool")).toLowerCase()
  const map = {
    shell: "shell",
    bash: "shell",
    read: "reading files",
    edit: "editing",
    write: "writing",
    glob: "searching",
    grep: "searching",
    task: "subagent",
    webfetch: "reading web",
    websearch: "searching web",
    todo: "planning",
    apply_patch: "editing",
  }
  return map[raw] || raw
}

function findRunningTool(messages) {
  if (!Array.isArray(messages)) return null
  const start = Math.max(0, messages.length - 6)
  for (let i = messages.length - 1; i >= start; i--) {
    const message = messages[i]
    if (!message || message.type !== "assistant" || !Array.isArray(message.content)) continue
    for (let j = message.content.length - 1; j >= 0; j--) {
      const content = message.content[j]
      if (!content || content.type !== "tool" || !content.state) continue
      const type = content.state.type
      if (type === "running" || type === "streaming") return content
    }
  }
  return null
}

module.exports = Plugin.define({
  setup(ctx) {
    const host = document.createElement("div")
    host.id = "pixel-companion"
    host.dataset.visible = "false"
    host.dataset.state = "idle"
    host.innerHTML = HTML
    ;(document.body || document.documentElement).appendChild(host)

    const styleCleanup = ctx.add(Style, CSS)

    let settings = loadSettings()
    let timer = 0
    let themeObserver = null
    let resizeObserver = null
    let observedPanel = null
    let lastPositionAt = 0
    let lastDone = ""
    let doneUntil = 0
    let roster = []
    let rosterKey = ""
    let rosterFetchedAt = 0
    let rosterLoading = false
    let layoutVisible = false
    let layoutSide = settings.side === "right" ? "right" : "left"
    let positionTimer = 0
    let companionState = ""
    let rosterMetricsKey = ""
    let attentionBySession = new Map()
    let attentionFetchedAt = 0
    let attentionLoading = false
    let historyBySession = new Map()
    let historyKey = ""
    let historyFetchedAt = 0
    let historyLoading = false
    let usageCacheKey = ""
    let usageCacheValue = null
    let assistantCacheKey = ""
    let assistantCacheValue = null
    let lastRowTimeAt = 0
    let menuOpen = false
    let detailOpen = false
    let enterTimer = 0
    let copiedUntil = 0
    let busy = false
    let cleanupDone = false

    const $ = (selector) => host.querySelector(selector)
    function setText(el, value) {
      if (el && el.textContent !== value) el.textContent = value
    }
    function setData(el, key, value) {
      if (el && el.dataset[key] !== value) el.dataset[key] = value
    }
    function setAttr(el, key, value) {
      if (el && el.getAttribute(key) !== value) el.setAttribute(key, value)
    }
    function setStyle(el, key, value) {
      if (el && el.style[key] !== value) el.style[key] = value
    }
    function setCompanionState(state) {
      if (state === companionState) return
      companionState = state
      host.dataset.state = state
      const themeState = state === "permission" || state === "question" ? "waiting" : state
      if (document.documentElement.dataset.companionState !== themeState) {
        document.documentElement.dataset.companionState = themeState
      }
    }
    const els = {
      golemWrap: $(".pc-golem-wrap"),
      golemHit: $(".pc-golem-hit"),
      bubble: $(".pc-bubble"),
      menu: $(".pc-menu"),
      stop: $('[data-pc-action="stop"]'),
      golemBar: $(".pc-golem-bar"),
      golemBarFill: $(".pc-golem-bar .pc-bar-fill"),
      golemContext: $(".pc-golem-context"),
      status: $(".pc-status"),
      chestWrap: $(".pc-chest-wrap"),
      chestHit: $(".pc-chest-hit"),
      chest: $(".pc-chest"),
      slots: $(".pc-slots"),
      rosterWorking: $(".pc-seg-working"),
      rosterWaiting: $(".pc-seg-waiting"),
      rosterError: $(".pc-seg-error"),
      rosterIdle: $(".pc-seg-idle"),
      rosterLabel: $(".pc-roster-label"),
      rosterTotal: $(".pc-roster-total"),
      rosterAlertLabel: $(".pc-roster-alert-label"),
      rosterCount: $(".pc-roster-count"),
      rosterList: $(".pc-roster-list"),
      filterButtons: Array.from(host.querySelectorAll("[data-pc-filter]")),
      detail: $(".pc-detail"),
    }

    function messageKey(messages) {
      const first = messages[0]
      const last = messages[messages.length - 1]
      return [
        messages.length,
        first && first.id,
        last && last.id,
        last && last.time && last.time.completed,
        last && last.finish,
        last && Array.isArray(last.content) ? last.content.length : 0,
      ].join("|")
    }

    function computeUsage(info, messages, data) {
      const fallback = (info && info.tokens) || {}
      const total =
        (fallback.input || 0) +
        (fallback.output || 0) +
        (fallback.reasoning || 0) +
        ((fallback.cache && fallback.cache.read) || 0) +
        ((fallback.cache && fallback.cache.write) || 0)

      let stepTokens = null
      try {
        const client = require("@opencode/client/solid")
        const step = client.lastAssistantWithUsage(messages, info && info.revert && info.revert.messageID)
        stepTokens = step && step.tokens ? step.tokens : null
      } catch {}
      const source = stepTokens || fallback
      const used =
        (source.input || 0) +
        (source.output || 0) +
        (source.reasoning || 0) +
        ((source.cache && source.cache.read) || 0) +
        ((source.cache && source.cache.write) || 0)

      let limit = 0
      try {
        const list = data && data.location && data.location.model && data.location.model.list
        const models = typeof list === "function" ? list() : Array.isArray(list) ? list : []
        const ref = info && info.model
        const model = models.find(
          (item) => item && ref && item.providerID === ref.providerID && (item.modelID === ref.id || item.id === ref.id),
        )
        limit = Number(model && model.limit && model.limit.context) || 0
      } catch {}

      return { used, limit, total }
    }

    function schedulePosition() {
      clearTimeout(positionTimer)
      positionTimer = setTimeout(() => position(), 120)
    }

    function position() {
      const panel =
        document.querySelector('[data-slot="session-chat-panel"]') ||
        document.querySelector('[data-slot="session-timeline-scroll"]')
      const anchor = document.querySelector('[data-component="composer"]') || panel
      if (!anchor) return
      const observeTarget = panel || anchor
      if (observeTarget !== observedPanel && "ResizeObserver" in window) {
        if (resizeObserver) resizeObserver.disconnect()
        observedPanel = observeTarget
        resizeObserver = new ResizeObserver(() => schedulePosition())
        resizeObserver.observe(observeTarget)
      }

      const rect = anchor.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const viewport = window.innerWidth
      let contentLeft
      let contentRight
      if (anchor.matches('[data-component="composer"]')) {
        contentLeft = rect.left
        contentRight = rect.right
      } else {
        const contentWidth = Math.min(744, Math.max(320, rect.width - 32))
        contentLeft = rect.left + Math.max(0, (rect.width - contentWidth) / 2)
        contentRight = contentLeft + contentWidth
      }

      const panelRect = panel ? panel.getBoundingClientRect() : null
      const leftBoundary = panelRect ? panelRect.left : 0
      const rightBoundary = panelRect ? panelRect.right : viewport
      const leftMargin = Math.max(0, contentLeft - leftBoundary)
      const rightMargin = Math.max(0, rightBoundary - contentRight)
      const side = settings.side === "right" ? "right" : "left"
      const width = 132
      const showMargin = width + 24
      const hideMargin = width + 16
      const fits = leftMargin >= hideMargin && rightMargin >= hideMargin
      const shouldShow = layoutVisible
        ? fits
        : leftMargin >= showMargin && rightMargin >= showMargin

      if (shouldShow !== layoutVisible || side !== layoutSide) {
        layoutVisible = shouldShow
        layoutSide = side
        host.dataset.visible = shouldShow ? "true" : "false"
        host.dataset.side = side
        els.golemWrap.dataset.side = side
        els.chestWrap.dataset.side = side === "left" ? "right" : "left"
        els.golemWrap.style.transform = ""
        els.chestWrap.style.transform = ""
        els.chestWrap.style.bottom = "92px"
        els.chestWrap.style.display = shouldShow ? "" : "none"
      }

      if (!shouldShow) return

      const leftCenter = leftBoundary + leftMargin / 2
      const rightCenter = contentRight + rightMargin / 2
      const clampLeft = (value) => Math.max(8, Math.min(viewport - width - 8, value))
      const golemSide = side
      const chestSide = side === "left" ? "right" : "left"
      const golemCenter = golemSide === "left" ? leftCenter : rightCenter
      const chestCenter = chestSide === "left" ? leftCenter : rightCenter
      const golemLeft = clampLeft(golemCenter - width / 2)
      const chestLeft = clampLeft(chestCenter - width / 2)

      setStyle(els.golemWrap, "left", golemLeft + "px")
      setStyle(els.golemWrap, "right", "auto")
      setStyle(els.golemWrap, "bottom", "92px")
      setStyle(els.chestWrap, "left", chestLeft + "px")
      setStyle(els.chestWrap, "right", "auto")
      setStyle(els.chestWrap, "bottom", "92px")
      setStyle(els.chestWrap, "display", "")
    }

    function currentStatusFromState(state) {
      return state === "permission" || state === "question"
        ? "waiting"
        : state === "error"
          ? "error"
          : state === "working"
            ? "working"
            : state === "done"
              ? "done"
              : "idle"
    }

    function statusColor(status) {
      return status === "working"
        ? "var(--pc-grass)"
        : status === "waiting"
          ? "var(--pc-gold)"
          : status === "error"
            ? "var(--pc-redstone)"
            : status === "done"
              ? "var(--pc-emerald)"
              : "var(--pc-bevel-light)"
    }

    function statusLabel(status, attention) {
      if (attention && attention.kind === "permission") return "APPROVAL"
      if (attention && attention.kind === "question") return "QUESTION"
      if (attention && attention.kind === "input") return "INPUT"
      return status === "working"
        ? "WORKING"
        : status === "waiting"
          ? "WAITING"
          : status === "error"
            ? "ERROR"
            : status === "done"
              ? "DONE"
              : status === "stopped"
                ? "STOPPED"
                : "IDLE"
    }

    const RECENT_MS = 24 * 60 * 60 * 1000

    function isWorkingAgent(agent) {
      return agent.status === "working" || agent.status === "waiting" || agent.status === "error"
    }

    function isActiveAgent(agent, now) {
      return (
        agent.current ||
        agent.currentChild ||
        isWorkingAgent(agent) ||
        (Number(agent.updated) || 0) >= now - RECENT_MS
      )
    }

    function scopeEntries(entries, filter, now) {
      if (filter === "all") return entries
      if (filter === "working") return entries.filter(isWorkingAgent)
      return entries.filter((agent) => isActiveAgent(agent, now))
    }

    function attentionMeta(agent) {
      if (!agent.attention) return ""
      if (agent.attention.kind === "permission") {
        const action = String(agent.attention.action || "").trim()
        return action ? "APPROVAL · " + action : "APPROVAL"
      }
      return agent.attention.kind === "question" ? "QUESTION" : "INPUT"
    }

    function isDescendant(agent, ancestorID, byID) {
      let parent = agent.parentID
      let depth = 0
      while (parent && depth < 20) {
        if (parent === ancestorID) return true
        const next = byID.get(parent)
        parent = next && next.parentID
        depth += 1
      }
      return false
    }

    function liveEntries(currentState) {
      const byID = new Map(roster.map((agent) => [agent.id, agent]))
      return roster.map((agent) => {
        if (!agent.current) return agent
        const stateStatus = currentStatusFromState(currentState)
        if (stateStatus !== "waiting") {
          return { ...agent, status: stateStatus, attention: null }
        }
        const direct = agent.attention
        if (direct) return { ...agent, status: "waiting", attention: direct }
        const childAttention = roster.some(
          (other) => other.attention && isDescendant(other, agent.id, byID),
        )
        if (childAttention) {
          return { ...agent, status: agent.baseStatus || "idle", attention: null }
        }
        return {
          ...agent,
          status: "waiting",
          attention: {
            kind: currentState === "permission" ? "permission" : "question",
            derived: true,
            label: currentState === "permission" ? "Approval needed" : "Question waiting",
          },
        }
      })
    }

    function agentColor(agent) {
      const name = String(agent || "").toLowerCase()
      if (name.includes("plan")) return "var(--pc-diamond)"
      if (name.includes("build")) return "var(--pc-grass)"
      if (name.includes("explore")) return "var(--pc-gold)"
      if (name.includes("review")) return "var(--pc-emerald)"
      if (name.includes("writer")) return "var(--pc-redstone)"
      return "var(--pc-emerald)"
    }

    function formatDuration(ms) {
      const value = Math.max(0, Number(ms) || 0)
      if (value < 60000) return Math.max(1, Math.round(value / 1000)) + "s"
      if (value < 3600000) return Math.round(value / 60000) + "m"
      if (value < 86400000) return Math.round(value / 3600000) + "h"
      return Math.round(value / 86400000) + "d"
    }

    function agentTime(agent) {
      const now = Date.now()
      if (agent.status === "working" || agent.status === "waiting" || agent.status === "error") {
        return formatDuration(now - (agent.busy || agent.updated || now))
      }
      return formatDuration(now - (agent.updated || now)) + " ago"
    }

    function listFrom(result) {
      if (Array.isArray(result)) return result
      if (Array.isArray(result && result.data)) return result.data
      if (Array.isArray(result && result.data && result.data.data)) return result.data.data
      return []
    }

    async function callSessionList(params) {
      const fn = ctx.client && ctx.client.session && ctx.client.session.list
      if (typeof fn !== "function") return null
      try {
        return await fn.call(ctx.client.session, params)
      } catch {}
      try {
        return await fn.call(ctx.client.session, { query: params })
      } catch {}
      return null
    }

    async function callPermissionList(directory) {
      const request = ctx.client && ctx.client.permission && ctx.client.permission.request
      const fn = request && request.list
      if (typeof fn !== "function") return null
      const input = { location: { directory } }
      try {
        return await fn.call(request, input)
      } catch {}
      try {
        return await fn.call(request, { query: input })
      } catch {}
      return null
    }

    async function callFormList(directory) {
      const form = ctx.client && (ctx.client.form || (ctx.client.session && ctx.client.session.form))
      const fn = form && form.list
      if (typeof fn !== "function") return null
      const input = { location: { directory } }
      try {
        return await fn.call(form, input)
      } catch {}
      try {
        return await fn.call(form, { query: input })
      } catch {}
      return null
    }

    async function fetchAttention(directories) {
      const list = [...new Set(directories)].filter(Boolean)
      if (!list.length) return new Map()

      const results = await Promise.allSettled(
        list.map(async (directory) => {
          const [permissions, forms] = await Promise.allSettled([
            withTimeout(callPermissionList(directory), 1200),
            withTimeout(callFormList(directory), 1200),
          ])
          return { permissions, forms }
        }),
      )
      const map = new Map()
      let ok = false
      for (const result of results) {
        if (!result || result.status !== "fulfilled") continue
        const { permissions, forms } = result.value
        const permissionsOk = permissions.status === "fulfilled" && permissions.value !== null
        const formsOk = forms.status === "fulfilled" && forms.value !== null
        if (permissionsOk || formsOk) ok = true
        if (permissionsOk) {
          for (const item of listFrom(permissions.value)) {
            if (!item || !item.sessionID) continue
            map.set(item.sessionID, {
              id: item.id,
              kind: "permission",
              action: item.action || "",
              label: item.action || "permission",
            })
          }
        }
        if (formsOk) {
          for (const item of listFrom(forms.value)) {
            if (!item || !item.sessionID || map.has(item.sessionID)) continue
            const kind = item.metadata && item.metadata.kind === "question" ? "question" : "input"
            map.set(item.sessionID, {
              id: item.id,
              kind,
              label: item.title || (kind === "question" ? "Question" : "Input"),
            })
          }
        }
      }
      return ok ? map : null
    }

    function statusForInfo(info, current, currentState) {
      if (current) return currentStatusFromState(currentState)
      const time = (info && info.time) || {}
      const busy = Number(time.busy) || 0
      const idle = Number(time.idle) || 0
      if (busy && (!idle || busy > idle)) return "working"
      if (info && info.outcome === "failed") return "error"
      if (info && info.outcome === "interrupted") return "stopped"
      if (info && info.outcome === "succeeded") {
        const updated = Number(time.updated) || Number(time.created) || 0
        return Date.now() - updated < 3600000 ? "done" : "idle"
      }
      return "idle"
    }

    function focusAgent(agent) {
      if (!agent) return
      closeDetail(true)
      const tabs = safe(() => ctx.tabs.list(), [])
      const tab = tabs.find(
        (item) =>
          item &&
          item.session &&
          item.session.id === agent.id &&
          (!agent.serverID || !item.session.server || item.session.server.id === agent.serverID),
      )
      try {
        if (tab) ctx.tabs.focus(tab.key)
        else if (agent.current) safe(() => ctx.screen.current() && ctx.screen.current().composer.focus())
        else ctx.tabs.open({ server: agent.serverID, id: agent.id }, { focus: true })
      } catch {}
      menuOpen = false
      update()
    }

    function sortRoster() {
      const rank = { working: 0, waiting: 1, error: 2, done: 3, stopped: 4, idle: 5 }
      roster.sort(
        (a, b) =>
          Number(b.current) - Number(a.current) ||
          (rank[a.status] || 0) - (rank[b.status] || 0) ||
          b.updated - a.updated,
      )
    }

    function applyAttention(currentState) {
      for (const agent of roster) {
        agent.attention = attentionBySession.get(agent.id) || null
        if (!agent.current) agent.status = agent.attention ? "waiting" : agent.baseStatus
      }
      sortRoster()
    }

    async function refreshAttention(session, currentState) {
      if (!session || attentionLoading) return
      attentionLoading = true
      try {
        const directories = new Set()
        if (session.directory) directories.add(session.directory)
        for (const agent of roster) {
          if (agent.directory) directories.add(agent.directory)
        }
        const next = await withTimeout(fetchAttention([...directories]), 2500)
        if (next) attentionBySession = next
      } catch {
        // Keep the last known attention state on a transient timeout.
      } finally {
        attentionFetchedAt = Date.now()
        attentionLoading = false
      }
      applyAttention(currentState)
      renderRoster(currentState)
    }

    function historySessionKey(session) {
      return ((session && session.server && session.server.id) || "") + ":" + ((session && session.directory) || "")
    }

    function nextCursor(result) {
      const cursor = result && result.cursor
      if (!cursor) return null
      if (typeof cursor === "string") return cursor
      return cursor.next || null
    }

    async function loadHistory(session, currentState) {
      if (!session || historyLoading) return
      const key = historySessionKey(session)
      if (historyKey !== key) {
        historyKey = key
        historyBySession = new Map()
        historyFetchedAt = 0
      }
      if (Date.now() - historyFetchedAt < 30000) return

      historyLoading = true
      const next = new Map()
      try {
        let cursor = null
        for (let page = 0; page < 10; page += 1) {
          const params = { directory: session.directory, limit: 100, order: "desc" }
          if (cursor) params.cursor = cursor
          const result = await callSessionList(params)
          const items = listFrom(result)
          let added = 0
          for (const info of items) {
            if (!info || !info.id || next.has(info.id)) continue
            next.set(info.id, info)
            added += 1
          }
          cursor = nextCursor(result)
          if (!cursor || !items.length || !added) break
        }
        if (historyKey !== key) return
        historyBySession = next
        historyFetchedAt = Date.now()
        void refreshRoster(session, currentState)
      } catch {
        historyFetchedAt = Date.now()
      } finally {
        historyLoading = false
      }
    }

    async function refreshRoster(session, currentState) {
      if (!session || rosterLoading) return
      const key = historySessionKey(session)
      if (historyKey !== key) {
        historyKey = key
        historyBySession = new Map()
        historyFetchedAt = 0
      }
      rosterLoading = true
      try {
        const [workspace, children] = await Promise.allSettled([
          callSessionList({ directory: session.directory, limit: 100, order: "desc" }),
          callSessionList({ parentID: session.id, limit: 50 }),
        ])
        const map = new Map()
        const add = (info, server, isCurrent) => {
          if (!info || !info.id) return
          const existing = map.get(info.id)
          if (existing) {
            if (!isCurrent && server && server.id) existing.serverID = server.id
            return
          }
          const serverID = (server && server.id) || (session.server && session.server.id) || "sidecar"
          const key = info.id
          const current = !!isCurrent || info.id === session.id
          const time = info.time || {}
          const baseStatus = statusForInfo(info, false, currentState)
          map.set(key, {
            key,
            id: info.id,
            title: info.title || info.id,
            agent: info.agent || "agent",
            parentID: info.parentID,
            currentChild: !!info.parentID && info.parentID === session.id,
            serverID,
            directory: (info.location && info.location.directory) || session.directory,
            current,
            baseStatus,
            status: current ? currentStatusFromState(currentState) : baseStatus,
            attention: null,
            busy: Number(time.busy) || 0,
            idle: Number(time.idle) || 0,
            updated: Number(time.updated) || Number(time.created) || 0,
            outcome: info.outcome,
          })
        }

        const currentInfo = safe(() => session.server.data.session.get(session.id), null)
        add(
          currentInfo || { id: session.id, title: session.tab || session.id, time: {}, location: session.location },
          session.server,
          true,
        )

        for (const result of [workspace, children]) {
          if (!result || result.status !== "fulfilled") continue
          for (const info of listFrom(result.value)) add(info, session.server, info.id === session.id)
        }

        for (const open of safe(() => ctx.sessions.list(), [])) {
          const info = safe(() => open.server.data.session.get(open.id), null)
          add(
            info || { id: open.id, title: open.tab || open.id, time: {}, location: open.location },
            open.server,
            open.id === session.id,
          )
        }
        for (const info of historyBySession.values()) {
          add(info, session.server, info.id === session.id)
        }

        for (const agent of map.values()) {
          agent.attention = attentionBySession.get(agent.id) || null
          if (!agent.current) agent.status = agent.attention ? "waiting" : agent.baseStatus
        }

        roster = [...map.values()]
        sortRoster()
        rosterFetchedAt = Date.now()
        renderRoster(currentState)
        if (Date.now() - historyFetchedAt > 30000) void loadHistory(session, currentState)
        const attentionDue = detailOpen ? 2500 : 5000
        if (Date.now() - attentionFetchedAt > attentionDue) void refreshAttention(session, currentState)
      } finally {
        rosterLoading = false
      }
    }

    function makeAgentSlot(agent) {
      const button = document.createElement("button")
      button.type = "button"
      button.className = "pc-slot pc-agent-slot"
      button.dataset.status = agent.status
      button.dataset.current = agent.current ? "true" : "false"
      button.dataset.attention = agent.attention ? agent.attention.kind : ""
      button.title = agent.title + " · " + agent.agent + " · " + statusLabel(agent.status, agent.attention)
      const avatar = document.createElement("span")
      avatar.className = "pc-avatar"
      avatar.style.setProperty("--pc-agent", agentColor(agent.agent))
      const dot = document.createElement("span")
      dot.className = "pc-agent-dot"
      dot.style.setProperty("--pc-status-color", statusColor(agent.status))
      button.append(avatar, dot)
      button.addEventListener("click", (event) => {
        event.stopPropagation()
        focusAgent(agent)
      })
      return button
    }

    function agentMeta(agent) {
      const parts = [agent.agent]
      if (agent.parentID) parts.push("SUBAGENT")
      if (agent.current) parts.push("CURRENT")
      if (agent.attention) parts.push(attentionMeta(agent))
      if (agent.directory) parts.push(agent.directory.split("/").filter(Boolean).pop())
      return parts.join(" · ")
    }

    function makeAgentRow(agent, index) {
      const row = document.createElement("button")
      row.type = "button"
      row.className = "pc-agent-row"
      row.style.setProperty("--row", String(Math.min(index || 0, 16)))
      row.dataset.status = agent.status
      row.dataset.current = agent.current ? "true" : "false"
      row.dataset.attention = agent.attention ? agent.attention.kind : ""
      row.dataset.pcAgent = agent.key

      const avatar = document.createElement("span")
      avatar.className = "pc-avatar"
      avatar.style.setProperty("--pc-agent", agentColor(agent.agent))

      const info = document.createElement("span")
      info.className = "pc-agent-info"
      const name = document.createElement("span")
      name.className = "pc-agent-name"
      name.textContent = agent.title
      const meta = document.createElement("span")
      meta.className = "pc-agent-meta"
      meta.textContent = agentMeta(agent)
      info.append(name, meta)

      const side = document.createElement("span")
      side.className = "pc-agent-side"
      const status = document.createElement("span")
      status.className = "pc-agent-status"
      status.textContent = statusLabel(agent.status, agent.attention)
      const time = document.createElement("span")
      time.className = "pc-agent-time"
      time.textContent = agentTime(agent)
      side.append(status, time)

      row.append(avatar, info, side)
      row.addEventListener("click", (event) => {
        event.stopPropagation()
        focusAgent(agent)
      })
      return row
    }

    function renderRoster(currentState, entriesOverride) {
      if (!els.rosterList) return
      const now = Date.now()
      const entries = entriesOverride || liveEntries(currentState)
      const scoped = scopeEntries(entries, settings.rosterFilter, now)
      const total = scoped.length
      const working = scoped.filter((agent) => agent.status === "working").length
      const waiting = scoped.filter((agent) => agent.status === "waiting").length
      const errors = scoped.filter((agent) => agent.status === "error").length
      const idle = Math.max(0, total - working - waiting - errors)
      const alerts = waiting + errors
      const pct = (value) => (total > 0 ? (value / total) * 100 : 0)
      const scopeLabel =
        settings.rosterFilter === "all" ? "TOTAL" : settings.rosterFilter === "working" ? "WORKING" : "ACTIVE"
      const emptyLabel =
        settings.rosterFilter === "working"
          ? "NO WORKING"
          : settings.rosterFilter === "all"
            ? "NO AGENTS"
            : "NO ACTIVE"

      const metricsKey = [
        total,
        working,
        waiting,
        errors,
        idle,
        alerts,
        scopeLabel,
        rosterFetchedAt ? 1 : 0,
        detailOpen ? 1 : 0,
        settings.rosterFilter,
      ].join("|")
      if (metricsKey !== rosterMetricsKey) {
        rosterMetricsKey = metricsKey
        setStyle(els.rosterWorking, "width", pct(working) + "%")
        setStyle(els.rosterWaiting, "width", pct(waiting) + "%")
        setStyle(els.rosterError, "width", pct(errors) + "%")
        setStyle(els.rosterIdle, "width", pct(idle) + "%")
        setText(
          els.rosterLabel,
          total === 0 ? (rosterFetchedAt ? emptyLabel : "LOADING…") : working + " WORK · " + idle + " IDLE",
        )
        setText(els.rosterTotal, total === 0 ? "" : String(total))
        setText(els.rosterAlertLabel, alerts ? "!" + alerts : "")
        setData(els.rosterAlertLabel, "kind", errors ? "error" : waiting ? "approval" : "")
        setText(els.rosterCount, total === 0 ? "" : total + " AGENTS")
        setData(els.chestWrap, "lid", detailOpen ? "open" : working + alerts > 0 ? "ajar" : "closed")
        setData(els.chest, "glow", errors ? "true" : waiting ? "approval" : "false")
      }

      const key =
        scoped
          .map(
            (agent) =>
              agent.key +
              ":" +
              agent.status +
              ":" +
              agent.current +
              ":" +
              agent.serverID +
              ":" +
              agent.agent +
              ":" +
              (agent.attention
                ? agent.attention.kind + ":" + (agent.attention.action || agent.attention.label || "")
                : ""),
          )
          .join("|") +
        "|" +
        settings.rosterFilter
      if (key !== rosterKey) {
        rosterKey = key
        const scrollTop = els.rosterList.scrollTop
        const slots = []
        for (let i = 0; i < 4; i++) {
          const agent = scoped[i]
          if (agent) {
            slots.push(makeAgentSlot(agent))
          } else {
            const empty = document.createElement("span")
            empty.className = "pc-slot"
            empty.dataset.filled = "false"
            slots.push(empty)
          }
        }
        els.slots.replaceChildren(...slots)

        if (scoped.length) {
          els.rosterList.replaceChildren(...scoped.map((agent, index) => makeAgentRow(agent, index)))
        } else {
          const empty = document.createElement("div")
          empty.className = "pc-agent-meta"
          empty.textContent =
            settings.rosterFilter === "working"
              ? "No working agents"
              : settings.rosterFilter === "all"
                ? "No agents"
                : "No active agents"
          els.rosterList.replaceChildren(empty)
        }
        for (const button of els.filterButtons) {
          button.dataset.active = button.dataset.pcFilter === settings.rosterFilter ? "true" : "false"
        }
        els.rosterList.scrollTop = scrollTop
      } else if (detailOpen) {
        const byKey = new Map(scoped.map((agent) => [agent.key, agent]))
        const updateTimes = Date.now() - lastRowTimeAt > 1000
        if (updateTimes) lastRowTimeAt = Date.now()
        for (const row of els.rosterList.querySelectorAll(".pc-agent-row")) {
          const agent = byKey.get(row.dataset.pcAgent)
          if (!agent) continue
          row.dataset.status = agent.status
          row.dataset.attention = agent.attention ? agent.attention.kind : ""
          const name = row.querySelector(".pc-agent-name")
          if (name && name.textContent !== agent.title) name.textContent = agent.title
          const meta = row.querySelector(".pc-agent-meta")
          const metaText = agentMeta(agent)
          if (meta && meta.textContent !== metaText) meta.textContent = metaText
          const avatar = row.querySelector(".pc-avatar")
          if (avatar) avatar.style.setProperty("--pc-agent", agentColor(agent.agent))
          const status = row.querySelector(".pc-agent-status")
          const statusText = statusLabel(agent.status, agent.attention)
          if (status && status.textContent !== statusText) status.textContent = statusText
          if (updateTimes) {
            const time = row.querySelector(".pc-agent-time")
            const timeText = agentTime(agent)
            if (time && time.textContent !== timeText) time.textContent = timeText
          }
        }
      }
    }

    function startTimer() {
      if (timer) return
      timer = setInterval(update, 1000)
    }

    function stopTimer() {
      if (!timer) return
      clearInterval(timer)
      timer = 0
    }

    function onVisibilityChange() {
      if (document.hidden) {
        stopTimer()
      } else {
        startTimer()
        update()
      }
    }

    function update() {
      try {
        if (document.hidden) return
        const theme = document.documentElement.dataset.theme
        const session = safe(() => ctx.sessions.current(), null)
        const show = !!session && settings.enabled && (theme === "theme-pixel:pixel-dusk" || settings.always)
        if (!show) {
          layoutVisible = false
          setCompanionState("idle")
          if (host.dataset.visible !== "false") host.dataset.visible = "false"
          menuOpen = false
          closeDetail(false)
          return
        }
        const nextVisible = layoutVisible ? "true" : "false"
        if (host.dataset.visible !== nextVisible) host.dataset.visible = nextVisible
        if (Date.now() - lastPositionAt > 2000) {
          lastPositionAt = Date.now()
          schedulePosition()
        }
        if (host.dataset.side !== settings.side) host.dataset.side = settings.side

        const data = session.server && session.server.data
        const info = safe(() => data.session.get(session.id), null)
        const messages = safe(() => data.session.message.list(session.id), [])
        const currentMessageKey = messageKey(messages)
        let usage = usageCacheValue
        const currentUsageKey = [
          currentMessageKey,
          info && info.id,
          info && info.time && info.time.updated,
          info && info.model && info.model.id,
          info && info.revert && info.revert.messageID,
          info && info.tokens
            ? [
                info.tokens.input,
                info.tokens.output,
                info.tokens.reasoning,
                info.tokens.cache && info.tokens.cache.read,
                info.tokens.cache && info.tokens.cache.write,
              ].join(",")
            : "",
        ].join("|")
        if (!usage || currentUsageKey !== usageCacheKey) {
          usage = computeUsage(info, messages, data)
          usageCacheKey = currentUsageKey
          usageCacheValue = usage
        }
        const total = usage.total

        const workingEl = document.querySelector('[data-component="session-working"]')
        const permissionEl = document.querySelector('[data-component="dock-prompt"][data-kind="permission"]')
        const questionEl = document.querySelector(
          '[data-component="session-question-dock"], [data-component="dock-prompt"][data-kind="question"]',
        )
        let lastAssistant = assistantCacheValue
        if (currentMessageKey !== assistantCacheKey) {
          lastAssistant = null
          for (let i = messages.length - 1; i >= 0; i -= 1) {
            const message = messages[i]
            if (message && message.type === "assistant") {
              lastAssistant = message
              break
            }
          }
          assistantCacheKey = currentMessageKey
          assistantCacheValue = lastAssistant
        }
        const lastError = !!(lastAssistant && lastAssistant.finish === "error")
        busy =
          !!workingEl ||
          !!(info && info.time && info.time.busy && (!info.time.idle || info.time.busy > info.time.idle))

        if (
          !busy &&
          lastAssistant &&
          lastAssistant.time &&
          lastAssistant.time.completed &&
          lastAssistant.id !== lastDone &&
          !permissionEl &&
          !questionEl
        ) {
          lastDone = lastAssistant.id
          doneUntil = Date.now() + 2600
        }

        const state = permissionEl
          ? "permission"
          : questionEl
            ? "question"
            : busy
              ? "working"
              : lastError
                ? "error"
                : Date.now() < doneUntil
                  ? "done"
                  : "idle"
        setCompanionState(state)

        const runningTool = findRunningTool(messages)
        let text = ""
        if (state === "permission") text = "Permission needed!"
        else if (state === "question") text = "Question waiting"
        else if (state === "error") text = "Error — click to inspect"
        else if (state === "working") text = runningTool ? "Working: " + toolLabel(runningTool) : "Thinking…"
        else if (state === "done") text = "Done!"
        const liveRoster = liveEntries(state)
        const otherWorking = liveRoster.filter((agent) => !agent.current && agent.status === "working").length
        const otherApprovals = liveRoster.filter(
          (agent) =>
            !agent.current && agent.status === "waiting" && agent.attention && agent.attention.kind === "permission",
        ).length
        const otherInputs = liveRoster.filter(
          (agent) =>
            !agent.current && agent.status === "waiting" && (!agent.attention || agent.attention.kind !== "permission"),
        ).length
        const otherErrors = liveRoster.filter((agent) => !agent.current && agent.status === "error").length
        const alertCount = otherApprovals + otherInputs + otherErrors
        let tone = state
        if (copiedUntil > Date.now()) {
          text = "Copied!"
          tone = "done"
        } else {
          if (state === "working") {
            if (otherWorking) text += " · " + otherWorking + " other" + (otherWorking > 1 ? "s" : "")
            if (alertCount) {
              if (alertCount === 1 && otherApprovals) text += " · 1 approval"
              else if (alertCount === 1 && otherInputs) text += " · 1 input"
              else if (alertCount === 1 && otherErrors) text += " · 1 error"
              else text += " · " + alertCount + " alerts"
            }
          } else if (state === "idle" && alertCount) {
            if (otherApprovals && !otherInputs && !otherErrors) {
              text =
                otherApprovals +
                " agent" +
                (otherApprovals > 1 ? "s" : "") +
                " need" +
                (otherApprovals > 1 ? "" : "s") +
                " approval"
            } else {
              text = alertCount + " agents need attention"
            }
          } else if (state === "idle" && otherWorking) {
            text = otherWorking + " other agent" + (otherWorking > 1 ? "s" : "") + " working"
          }
          tone = state
        }
        setData(els.bubble, "tone", tone)
        setText(els.bubble, text)
        const bubbleHidden = !text || menuOpen
        if (els.bubble.hidden !== bubbleHidden) els.bubble.hidden = bubbleHidden

        const pct = usage.limit > 0 ? Math.max(0, Math.min(100, Math.round((usage.used / usage.limit) * 100))) : 0
        setStyle(els.golemBarFill, "width", pct + "%")
        setData(els.golemBar, "high", pct >= 85 ? "true" : "false")
        const contextText = usage.limit > 0 ? "CONTEXT " + pct + "%" : "TOKENS " + formatTokens(total)
        setText(els.golemContext, contextText)
        setText(
          els.status,
          state === "working"
            ? runningTool
              ? "WORKING: " + toolLabel(runningTool).toUpperCase()
              : "WORKING"
            : state === "permission"
              ? "PERMISSION!"
              : state === "question"
                ? "QUESTION"
                : state === "error"
                  ? "ERROR"
                  : state === "done"
                    ? "DONE"
                    : "IDLE",
        )

        const rosterDue = detailOpen ? 3000 : 6000
        if (!rosterLoading && Date.now() - rosterFetchedAt > rosterDue) {
          void refreshRoster(session, state)
        }
        renderRoster(state, liveRoster)
        if (els.stop.disabled !== !busy) els.stop.disabled = !busy

        if (els.menu.hidden !== !menuOpen) els.menu.hidden = !menuOpen
        setData(els.detail, "open", detailOpen ? "true" : "false")
        setAttr(els.detail, "aria-hidden", detailOpen ? "false" : "true")
        setAttr(els.chestHit, "aria-expanded", detailOpen ? "true" : "false")
        if (Date.now() - lastPositionAt > 2000) {
          lastPositionAt = Date.now()
          position()
        }
      } catch {
        setCompanionState("idle")
        if (!els.bubble.hidden) els.bubble.hidden = true
      }
    }

    function setSettings(next) {
      settings = Object.assign({}, settings, next)
      saveSettings(settings)
      update()
      schedulePosition()
    }

    function copyLastResponse() {
      const session = safe(() => ctx.sessions.current(), null)
      if (!session) return
      const messages = safe(() => session.server.data.session.message.list(session.id), [])
      const assistant = [...messages].reverse().find((message) => message && message.type === "assistant")
      const text = assistant && Array.isArray(assistant.content)
        ? assistant.content
            .filter((part) => part && part.type === "text" && typeof part.text === "string")
            .map((part) => part.text)
            .join("\n")
        : ""
      if (!text) {
        els.bubble.hidden = false
        els.bubble.textContent = "Nothing to copy"
        els.bubble.dataset.tone = "error"
        copiedUntil = Date.now() + 1400
        return
      }
      try {
        if (ctx.system && typeof ctx.system.copy === "function") ctx.system.copy(text)
        else void navigator.clipboard.writeText(text)
      } catch {}
      copiedUntil = Date.now() + 1400
      els.bubble.hidden = false
      els.bubble.textContent = "Copied!"
      els.bubble.dataset.tone = "done"
    }

    async function stopTurn() {
      const session = safe(() => ctx.sessions.current(), null)
      if (!session) return
      try {
        await ctx.client.session.interrupt({ sessionID: session.id })
        els.bubble.hidden = false
        els.bubble.textContent = "Stopping…"
        els.bubble.dataset.tone = "permission"
        copiedUntil = Date.now() + 1200
      } catch {
        els.bubble.hidden = false
        els.bubble.textContent = "Could not stop"
        els.bubble.dataset.tone = "error"
        copiedUntil = Date.now() + 1600
      }
      update()
    }

    function focusPrompt() {
      const permission = document.querySelector('[data-component="dock-prompt"][data-kind="permission"]')
      if (permission) {
        permission.scrollIntoView({ block: "center", behavior: "smooth" })
        const button = permission.querySelector("button")
        if (button) button.focus()
        return
      }
      const question = document.querySelector('[data-component="session-question-dock"]')
      if (question) {
        question.scrollIntoView({ block: "center", behavior: "smooth" })
        const button = question.querySelector("button")
        if (button) button.focus()
        return
      }
      safe(() => ctx.screen.current().composer.focus())
    }

    function onMenuAction(action) {
      if (action === "stop") void stopTurn()
      else if (action === "focus") focusPrompt()
      else if (action === "copy") copyLastResponse()
      else if (action === "settings") safe(() => ctx.layout.settings())
      else if (action === "side") setSettings({ side: settings.side === "left" ? "right" : "left" })
      else if (action === "hide") setSettings({ enabled: false })
      menuOpen = false
      update()
    }

    function closeDetail(restoreFocus) {
      if (restoreFocus && els.detail.contains(document.activeElement)) {
        safe(() => els.chestHit.focus({ preventScroll: true }))
      }
      detailOpen = false
      clearTimeout(enterTimer)
      delete els.detail.dataset.entering
    }

    function onGolem(event) {
      event.stopPropagation()
      menuOpen = !menuOpen
      closeDetail(true)
      safe(() => els.golemHit.focus({ preventScroll: true }))
      update()
    }

    function onChest(event) {
      event.stopPropagation()
      const opening = !detailOpen
      menuOpen = false
      if (opening) {
        detailOpen = true
        clearTimeout(enterTimer)
        els.detail.dataset.entering = "true"
        enterTimer = setTimeout(() => {
          delete els.detail.dataset.entering
        }, 700)
      } else {
        closeDetail(true)
      }
      update()
    }

    function onBubble(event) {
      event.stopPropagation()
      focusPrompt()
    }

    function onKey(event) {
      if (event.key === "Escape") {
        menuOpen = false
        closeDetail(true)
        update()
      }
    }

    function onOutside(event) {
      if (!menuOpen && !detailOpen) return
      if (host.contains(event.target)) return
      menuOpen = false
      closeDetail(true)
      update()
    }

    els.golemHit.addEventListener("click", onGolem)
    els.golemHit.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onGolem(event)
      }
    })
    els.chestHit.addEventListener("click", onChest)
    els.chestHit.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onChest(event)
      }
    })
    for (const button of els.filterButtons) {
      button.addEventListener("click", (event) => {
        event.stopPropagation()
        els.rosterList.scrollTop = 0
        setSettings({ rosterFilter: button.dataset.pcFilter })
        update()
      })
    }
    els.bubble.addEventListener("click", onBubble)
    els.menu.addEventListener("click", (event) => {
      const button = event.target.closest("[data-pc-action]")
      if (!button || button.disabled) return
      event.stopPropagation()
      onMenuAction(button.dataset.pcAction)
    })
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onOutside)
    window.addEventListener("resize", schedulePosition)

    themeObserver = new MutationObserver(() => {
      update()
      schedulePosition()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-color-scheme"],
    })

    ctx.add(Command, () => ({
      id: "toggle",
      title: "Toggle Pixel Companion",
      group: "View",
      run: () => {
        const next = !settings.enabled
        setSettings({ enabled: next })
        if (next) {
          els.bubble.hidden = false
          els.bubble.textContent = "Dusk is back."
          els.bubble.dataset.tone = "done"
          copiedUntil = Date.now() + 1600
        }
      },
    }))

    const cleanup = () => {
      if (cleanupDone) return
      cleanupDone = true
      stopTimer()
      clearTimeout(enterTimer)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      delete document.documentElement.dataset.companionState
      if (themeObserver) themeObserver.disconnect()
      if (resizeObserver) resizeObserver.disconnect()
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onOutside)
      window.removeEventListener("resize", schedulePosition)
      try {
        styleCleanup()
      } catch {}
      host.remove()
    }

    if (ctx.signal) ctx.signal.addEventListener("abort", cleanup, { once: true })
    document.addEventListener("visibilitychange", onVisibilityChange)
    update()
    startTimer()
    position()
    return cleanup
  },
})
