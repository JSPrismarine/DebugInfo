## Config

```yaml

```

# Position info

## Placeholder

You can insert placerholder for specific values in you hot bar text. Like this:

### Config

`This is your X coordinate: {{playerX}}`

### Output

`This is your X coordinate: 10`

### Available Placeholder

| Placeholder | type   | description                                          |
| ----------- | ------ | ---------------------------------------------------- |
| provider    | string | Provider of your current world (LevelDB, Anvil, etc) |
| worldName   | string | The world name of the current player                 |
| playerX     | number | Player's X coordinate on the world                   |
| playerY     | number | Player's Y coordinate on the world                   |
| playerZ     | number | Player's Z coordinate on the world                   |
| chunkX      | number | Chunk X coordinate of the current player position    |
| chunkY      | number | Chunk Y coordinate of the current player position    |
| chunkZ      | number | Chunk Z coordinate of the current player position    |
