# Pixel Dusk — OpenCode Pixel Art Theme

A Minecraft-inspired pixel-art theme for OpenCode Desktop, with a night cave world, a waystone-framed chat window, a grounded golem companion, and an interactive agent chest.

## What is included

- `theme-pixel/` — the Pixel Dusk theme plugin (required)
- `pixel-companion/` — the companion plugin (recommended)

## Features

- Pixel Dusk dark/light theme using Monocraft and Departure Mono.
- Night cave world behind the chat, with crystals, lanterns, mist, rails, and mine props.
- Waystone-framed chat window with carved rune labels.
- Grounded golem and chest on a 92px ground band.
- Agent chest roster with ACTIVE / ALL / WORKING filters.
- Live permission/question attention indicators.
- Loot-scroll roster animation.
- Adaptive companion hiding on small windows.
- Reactive cave lighting based on agent state: working, waiting, error, done, idle.
- Cave focus mode (`View -> Toggle Cave Focus`).
- Clickable `rune gate` (jump to top) and `summon gate` (focus composer).

## Installation

1. Copy the plugin folders to your OpenCode plugins directory:

```bash
mkdir -p ~/.config/opencode/plugins
cp -r theme-pixel ~/.config/opencode/plugins/
cp -r pixel-companion ~/.config/opencode/plugins/
```

2. Open OpenCode Desktop.
3. Go to **Settings → Extensions → Plugins**.
4. Enable `theme-pixel` and `pixel-companion`.
5. Reload OpenCode if the UI does not refresh.

## Notes

- `theme-pixel` works on its own.
- `pixel-companion` adds the golem, chest, roster, and reactive state lighting.
- The theme uses embedded SVG backgrounds and fonts, so the plugin bundle is intentionally self-contained.
- Reduced-motion preferences are respected.

## License

MIT
