WRS
===


API
---

Usually a client invokes the API in the following order

 1. `/configuration`
 2. `/team`
 3. `/spawn`
 4. Loop over
   * `/radar`
   * `/move`
   * `/shoot`

### `/configuration`

No Arguments

```json
{	"teams":1000,
	"ships-per-team":2,

	"game-zone":1000,
	"ship-radius":10,

	"max-ship-speed":25,
	"max-shot-speed":250,

	"min-radar-interval":500,
	"min-shoot-interval":2500
}
```

