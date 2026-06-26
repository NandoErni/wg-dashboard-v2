# 🏠 WG Dashboard v2

WG Dashboard v2 is a web dashboard for shared flats.

It can show chores, people, bus times, weather, waste collection information, and a photo booth. The app is built with React, TypeScript, Tailwind, shadcn/ui, and Firebase.

The goal of this version is to make the dashboard configurable, so it can be used by different WGs without changing the source code too much.

Live demo: [weegee-dashboard.nandoerni.com](https://weegee-dashboard.nandoerni.com/)

---

## Features

* Dashboard homepage
* Chore rotation
* People overview
* Photo booth
* Photo booth gallery
* Weather and outfit card
* Bus time display
* Waste collection card
* Language support
* Configurable pages and dashboard sections

---

## Getting Started

### Requirements

* Node.js
* npm or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/nandoerni/wg-dashboard-v2.git
cd wg-dashboard-v2
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app in your browser.

---

## Configuration

The app uses YAML files for configuration.

Main configuration:

```txt
src/config/config.yaml
```

Custom translations:

```txt
src/config/custom-translations.yaml
```

---

## `config.yaml`

Use `config.yaml` to configure the dashboard structure and data.

Example:

```yaml
appTitle: WG Dashboard

pages:
  dashboard: true
  photoBooth: true
  photoBoothGallery: true
  people: true
  settings: true

dashboard:
  holidayCountry: CH

  cards:
    trash: true
    weatherOutfit: true

  sbbBus:
    from: "8590930"
    to: "8506000"
    limit: 10

  weather:
    enabled: true
    provider: openMeteo
    latitude: 47.3769
    longitude: 8.5417
    timezone: Europe/Zurich

chores:
  rotationDays: 30
  startDate: "2025-01-01"

  people:
    - name: Nando
      birthday: "18.12.2000"
      img: nando-1.jpg
      altImg: nando-2.jpg

    - name: Michelle
      birthday: "04.11.1998"
      img: michelle-1.jpg
      altImg: michelle-2.webp

    - name: Timon
      birthday: "25.11.1999"
      img: timon-1.jpg
      altImg: timon-2.webp

  items:
    - id: bathroom
      icon: poop

    - id: floor
      icon: broom

    - id: kitchen
      icon: cutlery
```

### Pages

The `pages` section controls which pages are available.

```yaml
pages:
  dashboard: true
  photoBooth: true
  photoBoothGallery: true
  people: true
  settings: true
```

Set a page to `false` to hide it.

### Dashboard

The `dashboard` section controls dashboard-specific features.

```yaml
dashboard:
  holidayCountry: CH

  cards:
    trash: true
    weatherOutfit: true
```

`holidayCountry` is used for the holiday display.

The `cards` section controls whether certain dashboard cards are shown.

### Bus configuration

The bus panel uses the Swiss public transport API.

```yaml
sbbBus:
  from: "8590930"
  to: "8506000"
  limit: 10
```

`from` and `to` are station or stop IDs.

### Weather configuration

The weather panel can be configured with location values.

```yaml
weather:
  enabled: true
  provider: openMeteo
  latitude: 47.3769
  longitude: 8.5417
  timezone: Europe/Zurich
```

Do not put private API keys into frontend config files. Everything inside the frontend config can be visible to users in the browser.

### Chores

The `chores` section controls the chore rotation.

```yaml
chores:
  rotationDays: 30
  startDate: "2025-01-01"
```

`rotationDays` defines how long one chore assignment lasts.

`startDate` defines the date from which the rotation is calculated.

People are configured like this:

```yaml
people:
  - name: Nando
    birthday: "18.12.2000"
    img: nando-1.jpg
    altImg: nando-2.jpg
```

Images are loaded from:

```txt
src/assets/people/
```

Chores are configured like this:

```yaml
items:
  - id: bathroom
    icon: poop
```

The `id` is important. It connects the chore to its translations in `custom-translations.yaml`.

---

## Custom chore translations

Custom chore names and descriptions are not stored in the normal language JSON files.

They are stored here:

```txt
src/config/custom-translations.yaml
```

Example:

```yaml
de-CH:
  custom:
    chores:
      bathroom:
        name: Bad
        description: Wer jemandem in die Schüssel scheisst, muss mit den Konsequenzen rechnen!

      floor:
        name: Böden
        description: Der Boden hält uns für immer und ewig!

      kitchen:
        name: Küche
        description: Ohne ein El Tony kann selbst der aller beste nichts erreichen!

en-US:
  custom:
    chores:
      bathroom:
        name: Bathroom
        description: Whoever makes a mess in the bathroom has to deal with the consequences!

      floor:
        name: Floors
        description: The floor carries us forever and ever!

      kitchen:
        name: Kitchen
        description: Even the best cannot achieve anything without a clean kitchen!
```

The language keys must match the app language keys.

Current language keys:

```txt
de-CH
en-US
tr-TR
```

The chore ID from `config.yaml` must also exist in `custom-translations.yaml`.

Example:

```yaml
# config.yaml
items:
  - id: bathroom
    icon: poop
```

Needs this translation key:

```yaml
# custom-translations.yaml
de-CH:
  custom:
    chores:
      bathroom:
        name: Bad
        description: ...
```

To add a new chore, add it in both files.

Example:

```yaml
# config.yaml
items:
  - id: windows
    icon: broom
```

```yaml
# custom-translations.yaml
de-CH:
  custom:
    chores:
      windows:
        name: Fenster
        description: Die Fenster müssen wieder einmal geputzt werden.
```

---

## Icons

Chore icons are selected by name in `config.yaml`.

Example:

```yaml
icon: broom
```

Available icons depend on the icon registry in the source code.

Currently used icons:

```txt
poop
broom
cutlery
```

---

## Project Structure

```txt
src/
  assets/
    people/
  components/
  config/
    config.yaml
    custom-translations.yaml
  locales/
    de.json
    en.json
    tr.json
  pages/
```

---

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Contributing

Contributions are welcome.

You can:

* open an issue
* suggest a feature
* report a bug
* create a pull request

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Contact

For questions or suggestions, contact:

[inquiries@nandoerni.com](mailto:inquiries@nandoerni.com)
