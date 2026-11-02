# kata-log

My solutions to the exercises on [kata-log.rocks](https://kata-log.rocks/).
I solve each kata twice: once in TypeScript and once in Python.

## Layout

```
kata-ts/               Bun + Vitest + Biome
  src/<kata-name>/     the code, one folder per kata
  test/<kata-name>/    the tests, same folder name
kata-python/           uv + pytest + ruff + basedpyright
  src/<kata_name>/     the code, one folder per kata
  tests/<kata_name>/   the tests, same folder name
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

- TypeScript: create `kata-ts/src/<kata-name>/<kata-name>.ts` and `kata-ts/test/<kata-name>/<kata-name>.test.ts`.
- Python: create `kata-python/src/<kata_name>/__init__.py` and `<kata_name>.py`. Create `kata-python/tests/<kata_name>/test_<kata_name>.py`.

See `bowling-game` / `bowling_game` for an example.
