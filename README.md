# kata-log

My solutions to the exercises on [kata-log.rocks](https://kata-log.rocks/).
I solve each kata twice: once in TypeScript and once in Python.

## Layout

```
kata-ts/               Bun + Vitest + Biome
  <kata-name>/         one folder per kata, code and tests side by side
kata-python/           uv + pytest + ruff + basedpyright
  <kata_name>/         one folder per kata, code and tests side by side
```

Python folders use `snake_case` so they can be imported.

## Setup

1. Install [mise](https://mise.jdx.dev).
2. Run `mise trust --all` in the repo root.
3. Run `mise install` in `kata-ts/` and in `kata-python/`.

Dependencies install by themselves when you `cd` into a sub-project.

## Tasks

From the repo root:

| Task | What it does |
|------|--------------|
| `mise run precommit` | Fix, lint, format check, type check and test both sub-projects. |
| `mise run test` | Run the tests in both sub-projects. |

Inside `kata-ts/` or `kata-python/`:

| Task | What it does |
|------|--------------|
| `mise run test [args]` | Run the tests. Pass a kata name to run only that kata. |
| `mise run test:watch` | Re-run tests when files change. |
| `mise run test:coverage` | Run tests with a coverage report in `reports/coverage`. |
| `mise run lint [--fix]` | Run the linter. |
| `mise run format [--fix]` | Check or apply formatting. |
| `mise run type-check` | Run the type checker. |
| `mise run check` | Format check, lint and type check. |
| `mise run fix` | Auto-fix format and lint, then type check. |
| `mise run precommit` | Fix, check and test. |

## Add a new kata

- TypeScript: create `kata-ts/<kata-name>/<kata-name>.ts` and `<kata-name>.test.ts`.
- Python: create `kata-python/<kata_name>/__init__.py`, `<kata_name>.py` and `test_<kata_name>.py`.

See `bowling-game` / `bowling_game` for an example.
