#!/usr/bin/env python3
"""Generate the Pixel Dusk companion SFX set with ElevenLabs."""
from __future__ import annotations

import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "source"
SOURCE.mkdir(parents=True, exist_ok=True)

SOUNDS = [
    # id, prompt, duration, loop, influence
    ("amb-cave", "Seamless loop of a dark underground cave, low wind, distant water drips, faint torch crackle, subtle stone room reverb, no music, quiet ambient background", 20, True, 0.5),
    ("golem-breathe", "Low slow breathing of a huge stone golem, deep rocky rumble, soft grinding pebbles, subtle, close perspective", 2.5, False, 0.65),
    ("golem-work", "Seamless loop of a stone golem mining, slow heavy pickaxe strikes on rock, deep thuds, crumbling stone, low cave echo, no music", 6, True, 0.6),
    ("golem-done", "Stone golem satisfied low grunt, warm rocky hum, tiny completion chime, short", 1.6, False, 0.65),
    ("golem-error", "Stone golem low groan, heavy stone crack, ominous low thud, short", 1.8, False, 0.65),
    ("golem-waiting", "Soft magical alert ping from a carved stone rune, gentle glassy chime, cave echo, not harsh", 1.3, False, 0.65),
    ("golem-blink", "Tiny stone tick, single small pebble click, very short", 0.5, False, 0.75),
    ("chest-open", "Old wooden chest lid opening, creaking hinge, metal latch click, short", 1.6, False, 0.7),
    ("chest-close", "Wooden chest lid closing, soft thud, metal latch click, short", 1.2, False, 0.7),
    ("chest-loot", "Magical loot sparkle, soft shimmering chime, small gold coins, short", 1.8, False, 0.65),
    ("roster-open", "Parchment scroll unfurling, paper rustle, soft magical whoosh, short", 1.2, False, 0.65),
    ("roster-close", "Parchment scroll rolling up, paper rustle, short", 1.0, False, 0.65),
    ("roster-row", "Soft parchment tap, tiny wood click, very short", 0.5, False, 0.75),
    ("roster-scroll", "Soft paper scroll rustle, very short", 0.8, False, 0.65),
    ("notif-permission", "Gentle magical notification chime, two soft bell notes, cave reverb, short", 1.3, False, 0.65),
    ("notif-error", "Low ominous alert tone, soft stone rumble, not loud, short", 1.3, False, 0.65),
    ("notif-done", "Bright soft success sparkle, tiny chime, short", 1.2, False, 0.65),
    ("notif-info", "Subtle single soft ping, quiet, short", 0.8, False, 0.6),
    ("ui-click", "Crisp 8-bit UI click, short square blip, retro game menu", 0.5, False, 0.9),
    ("ui-hover", "Very soft 8-bit tick, quiet retro UI hover", 0.5, False, 0.9),
    ("ui-open", "Retro 8-bit menu open, short ascending blip", 0.6, False, 0.8),
    ("ui-close", "Retro 8-bit menu close, short descending blip", 0.6, False, 0.8),
    ("ui-toggle", "Soft 8-bit switch click, tiny toggle", 0.5, False, 0.9),
    ("rune-activate", "Magical rune activation, soft glowing hum and sparkle, stone reverb, short", 1.5, False, 0.65),
]


def generate(sound_id: str, prompt: str, duration: float, loop: bool, influence: float) -> None:
    out = SOURCE / f"{sound_id}.mp3"
    if out.exists() and out.stat().st_size > 1024:
        print(f"skip {sound_id}", flush=True)
        return
    cmd = [
        "npx", "-y", "@elevenlabs/cli@latest",
        "text-to-sound-effects", "convert",
        "--text", prompt,
        "--model-id", "eleven_text_to_sound_v3",
        "--duration-seconds", str(duration),
        "--prompt-influence", str(influence),
        "--output-format", "mp3_44100_128",
        "--output", str(out),
    ]
    if loop:
        cmd[cmd.index("--output-format"):cmd.index("--output-format")] = ["--loop", "true"]
    print(f"gen {sound_id}...", flush=True)
    started = time.time()
    result = subprocess.run(cmd, cwd=ROOT.parent, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FAIL {sound_id}: {result.stderr[-1200:]}", flush=True)
        raise SystemExit(1)
    if not out.exists() or out.stat().st_size < 1024:
        print(f"FAIL {sound_id}: no output\n{result.stdout[-800:]}\n{result.stderr[-800:]}", flush=True)
        raise SystemExit(1)
    print(f"ok {sound_id} {out.stat().st_size} bytes in {time.time()-started:.1f}s", flush=True)


def main() -> None:
    only = sys.argv[1:]
    for sound in SOUNDS:
        if only and sound[0] not in only:
            continue
        generate(*sound)
    print("done", flush=True)


if __name__ == "__main__":
    main()
