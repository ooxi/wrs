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

`http://example.net:31337/configuration`

No arguments necessary

#### Response

```json
{	"teams":		1000,
	"ships-per-team":	2,

	"game-zone":		1000,
	"ship-radius":		10,

	"max-ship-speed":	25,
	"max-shot-speed":	250,

	"min-radar-interval":	500,
	"min-shoot-interval":	2500
}
```


***


### Is ship alive? `/is-alive`

Failing API calls can have many reasons, for example invokations of `/radar` at
a too high frequency. In order to know if your ship is still alive, you should
check `/is-alive`. This can also be used to check whether enemy ships are still
living, even if you do not see them on your radar.

#### Request

`http://example.net:31337/is-alive?public-key=f0afa14e-959d-4d1f-8f00-c268ae5f5cd7`

 * `public-key`: Public identification of the object you are interested in

#### Response

````json
{	"is-alive":	true
}
````

The information you care about is contained as boolean in the `is-alive`
property.


***


### Manovering `/move`

Static ships are an too easy target :-)

#### Request

`http://example.net:31337/move?ship-private-key=2f0d1b45-7d56-4b6a-a070-45d6b0179ec2&ship-desired-dx=0.5&ship-desired-dy=0.5`

 * `ship-private-key` Ship secret obtained with `/spawn`
 * `ship-desired-dx` Desired velocity in the x axis
 * `ship-desired-dy` Desired velocity in the y axis

Be aware that the server will reject `/move` invokations where the ships speed
is higher than `max-ship-speed`.

#### Response

No response if invokation was successflu.


***


### Get radar information `/radar`

#### Request

`http://example.net:31337/radar?ship-private-key=2f0d1b45-7d56-4b6a-a070-45d6b0179ec2`

 * `ship-private-key` Ship secret obtaineed with `/spawn`

#### Response

````json
````


### Spawn a new ship `/spawn`

#### Request

`http://example.net:31337/spawn?team-private-key=ee6d1e6c-6f44-4e76-8c29-32ba98b561b2&ship-name=my-ship`

 * `team-private-key` Team secret obtained with `/team`
 * `ship-name` Name of your new ship

#### Response

````json
{	"ship-public-key":	"f0afa14e-959d-4d1f-8f00-c268ae5f5cd7",
	"ship-private-key":	"2f0d1b45-7d56-4b6a-a070-45d6b0179ec2"
}
````

While `ship-public-key` contains a public ship identifier, you'll need to keep
`ship-private-key` for yourself. It is used for manovering, shooting and even
suicide.


***


### Register new team `/team`

In order to join the game you have to start with registering a team. This team
can then be used to spawn new ships.

#### Request

`http://example.net:31337/team?team-name=my-team&team-color=red`

 * `team-name` Name of your team
 * `team-color` Color of your team, see [web colors](http://en.wikipedia.org/wiki/Web_colors)

#### Response

````json
{	"team-public-key":	"e2fa4c28-3e82-4f9c-a482-bdb21316e6e6",
	"team-private-key":	"ee6d1e6c-6f44-4e76-8c29-32ba98b561b2"
}
````

The `team-public-key` will be used for queries of public team information like
kill rate statistics. Keep the `team-private-key` for yourself, you'll need it
in order to spawn ships.



