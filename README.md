# where

Personal tool to figure out where to live. US states only.

## Setup

```sh
mise install      # python, node, uv, pnpm
uv sync           # python deps
cd web && pnpm install && cd ..
```

## Run

```sh
mise run refresh  # pull data → data/states.json
mise run dev      # frontend at http://localhost:5173
```

## Test

```sh
mise run test
```

## Profile

Copy `profile.example.yaml` to `profile.yaml` and edit, or just edit live in the UI.
