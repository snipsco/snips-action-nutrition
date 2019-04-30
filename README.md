# snips-action-nutrition

Snips action code for the Nutrition app

## Setup

```sh
# Install the dependencies, builds the action and creates the config.ini file.
sh setup.sh
```

Don't forget to edit the `config.ini` file.

To be able to make calls to the API, you must have a [FatSecret Platform REST API key](https://platform.fatsecret.com/api/Default.aspx?screen=rapih).

An assistant containing the intents listed below must be installed on your system. Deploy it following [these instructions](https://docs.snips.ai/articles/console/actions/deploy-your-assistant).

## Run

- Dev mode:

```sh
# Dev mode watches for file changes and restarts the action.
npm run dev
```

- Prod mode:

```sh
# 1) Lint, transpile and test.
npm start
# 2) Run the action.
node action-nutrition.js
```

## Test & Demo cases

This app only supports french 🇫🇷 and english 🇬🇧.

### `GetNutritionalInfo`

#### Get nutritional info for a given food

Get nutritional information for the given food
> *Hey Snips, how many calories are in a serving of spaghetti?*

> *Hey Snips, how much vitamin A is in a carrot?*

### `CompareNutritionalInfo`

#### Compare the nutritional info between two given foods

Compare the nutritional info between the two given foods
> *Hey Snips, how much vitamin C in an orange compared to a lemon?*

## Debug

In the `action-nutrition.js` file:

```js
// Uncomment this line to print everything
// debug.enable(name + ':*')
```

## Test

*Requires [mosquitto](https://mosquitto.org/download/) to be installed.*

```sh
npm run test
```

**In test mode, i18n output and http calls are mocked.**

- **http**: see `tests/httpMocks/index.ts`
- **i18n**: see `src/factories/i18nFactory.ts`
