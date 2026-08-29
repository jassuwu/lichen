# lichen

a monochrome theme with one colour. neutral greys, chroma 0, and the lime from jass.gg.

## ports

only ghostty for now. copy `ports/ghostty/lichen` to `~/.config/ghostty/themes/lichen`, then set `theme = lichen` in your ghostty config.

## build

```
bun install
bun run build
bun run check
bun test
```

## palette

| role         | hex       |
| ------------ | --------- |
| base         | `#040404` |
| surface      | `#0f0f0f` |
| overlay      | `#1d1d1d` |
| border       | `#303030` |
| muted        | `#6c6c6c` |
| subtle       | `#9b9b9b` |
| text         | `#cecece` |
| bright       | `#f5f5f5` |
| accent       | `#d4fd80` |
| accent-quiet | `#b4c695` |
| error        | `#e47b79` |
| warning      | `#e1b767` |

## license

mit
