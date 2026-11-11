#!/usr/bin/env python3
"""Trim, normalize, and encode the generated SFX into final mp3s."""
from __future__ import annotations

import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "source"
FINAL = ROOT / "final"
TEMP = Path(tempfile.gettempdir()) / "pixel-dusk-sfx-trim"
FINAL.mkdir(parents=True, exist_ok=True)
TEMP.mkdir(parents=True, exist_ok=True)

# id: (loop, max_seconds, target_peak_db, mono)
SPEC = {
    "amb-cave": (True, None, -3.0, False),
    "golem-work": (True, None, -3.0, True),
    "golem-breathe": (False, None, -1.0, True),
    "golem-done": (False, None, -1.0, True),
    "golem-error": (False, None, -1.0, True),
    "golem-waiting": (False, None, -1.0, True),
    "golem-blink": (False, 0.15, -1.0, True),
    "chest-open": (False, None, -1.0, True),
    "chest-close": (False, None, -1.0, True),
    "chest-loot": (False, None, -1.0, True),
    "roster-open": (False, 0.45, -1.0, True),
    "roster-close": (False, 0.35, -1.0, True),
    "roster-row": (False, 0.22, -1.0, True),
    "roster-scroll": (False, 0.4, -1.0, True),
    "notif-permission": (False, None, -1.0, True),
    "notif-error": (False, None, -1.0, True),
    "notif-done": (False, None, -1.0, True),
    "notif-info": (False, 0.8, -1.0, True),
    "ui-click": (False, 0.14, -1.0, True),
    "ui-hover": (False, 0.12, -1.0, True),
    "ui-open": (False, 0.28, -1.0, True),
    "ui-close": (False, 0.24, -1.0, True),
    "ui-toggle": (False, 0.14, -1.0, True),
    "rune-activate": (False, None, -1.0, True),
}


def run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True)


def max_volume(path: Path) -> float:
    out = run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "volumedetect", "-f", "null", "-"]).stderr
    match = re.search(r"max_volume: (-?[0-9.]+) dB", out)
    if not match:
        raise RuntimeError(f"no max_volume for {path}")
    return float(match.group(1))


def duration(path: Path) -> float:
    for entry in ("format=duration", "stream=duration"):
        out = run(
            ["ffprobe", "-v", "error", "-show_entries", entry, "-of", "csv=p=0", str(path)]
        ).stdout.strip().splitlines()
        for line in out:
            line = line.strip()
            if line and line != "N/A":
                try:
                    return float(line)
                except ValueError:
                    pass
    return 0.0


def main() -> None:
    missing = [key for key in SPEC if not (SOURCE / f"{key}.mp3").exists()]
    if missing:
        raise SystemExit(f"missing sources: {missing}")

    for key, (loop, cap, target, mono) in SPEC.items():
        src = SOURCE / f"{key}.mp3"
        tmp = TEMP / f"{key}.wav"
        dst = FINAL / f"{key}.mp3"

        trim = ["ffmpeg", "-hide_banner", "-y", "-i", str(src)]
        filters = []
        if not loop:
            filters.append(
                "silenceremove=start_periods=1:start_threshold=-50dB:start_duration=0.005"
            )
        if filters:
            trim += ["-af", ",".join(filters)]
        if cap is not None:
            trim += ["-t", str(cap)]
        trim += ["-ar", "44100", "-c:a", "pcm_s16le"]
        if mono:
            trim += ["-ac", "1"]
        else:
            trim += ["-ac", "2"]
        trim += [str(tmp)]
        result = run(trim)
        if result.returncode != 0:
            raise SystemExit(f"trim failed for {key}\n{result.stderr[-1600:]}")

        gain = target - max_volume(tmp)
        encode = ["ffmpeg", "-hide_banner", "-y", "-i", str(tmp)]
        efilters = [f"volume={gain:.2f}dB"]
        if not loop:
            efilters += [
                "afade=t=in:st=0:d=0.0005",
                "areverse",
                "afade=t=in:st=0:d=0.015",
                "areverse",
            ]
        encode += ["-af", ",".join(efilters), "-map_metadata", "-1", "-ar", "44100"]
        if mono:
            encode += ["-ac", "1", "-b:a", "96k"]
        else:
            encode += ["-ac", "2", "-b:a", "128k"]
        encode += [str(dst)]
        result = run(encode)
        if result.returncode != 0:
            raise SystemExit(f"encode failed for {key}\n{result.stderr[-1600:]}")
        print(f"{key:20s} {dst.stat().st_size:7d} bytes  {duration(dst):.2f}s")

    shutil.rmtree(TEMP, ignore_errors=True)
    print("done")


if __name__ == "__main__":
    main()
