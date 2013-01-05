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


***


### Configuration `/configuration`

Used to get game settings like ship speed, team size and orbit dimensions.

#### Request

No arguments necessary

#### Response

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


***


### Is ship alive? `/is-alive`

Failing API calls can have many reasons, for example invokations of `/radar` at
a too high frequency. In order to know if your ship is still alive, you should
check `/is-alive`. This can also be used to check whether enemy ships are still
living, even if you do not see them on your radar.

#### Request

`http://example.net:31337/is-alive?public-key=???`

 * `public-key`: Public identification of the ship you are interested in

#### Response

````json
````


***


### Register new team `/team`

In order to join the game you have to start with registering a team. This team
can then be used to spawn new ships.

#### Request

`http://example.net:31337/team?team-name=my-team&team-color=red`

 * `team-name` Name of your team
 * `team-color` Color of your team, see [http://en.wikipedia.org/wiki/Web_colors](Web colors)

#### Response

````json
{	"team-public-key":"e2fa4c28-3e82-4f9c-a482-bdb21316e6e6",
	"team-private-key":"ee6d1e6c-6f44-4e76-8c29-32ba98b561b2"
}
````

The `team-public-key` will be used for queries of public team information like
kill rate statistics. Keep the `team-private-key` for yourself, you'll need it
in order to spawn ships.



