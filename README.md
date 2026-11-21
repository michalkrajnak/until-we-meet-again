# Odpočet do shledání / Until We Meet Again

Osobná dvojjazyčná (**CZ** predvolená / **EN**) odpočítavacia stránka pre **Simču** (spolu s **Riou a Texasom**) počas jej Erasmu vo fínskom **Oulu** (18. 8. – 24. 12. 2026 o 12:00), na ktorú doma čakajú **Mišák**, rodičia **Mamka & Tatka** a kone **Bony E** a **Gorny**.

## Čo stránka obsahuje
- **Česká (predvolená) a anglická verzia** s prepínačom `CZ | EN` v hornej lište (pamätá si voľbu v `localStorage`).
- **Živý odpočet** (dni, hodiny, minúty, sekundy) do 24. 12. o 12:00 + špeciálna vianočná obrazovka po dobehnutí odpočtu (`?preview=reunion`).
- **Progress bar celého Erasmu** (18. august → 24. december) s percentami, počtom prejdených/ostávajúcich dní a míľnikmi.
- **Téma polárnej žiary a zimného Oulu** s jemným snežením, hviezdami a tlačidlom na pozastavenie animácií.
- **Živé dvojité hodiny** – čas v Oulu vs. doma.
- **Prehľad oboch tímov** – tím v Oulu (Simča, Ria, Texas) a všetci, ktorí čakajú doma (Mišák, Mamka & Tatka, Bony E, Gorny).
- **Bežiaci fotoprezentér a videoprehrávač** s filtrami (`Vše`, `Simča`, `Simča & Mišák`, `Ria & Texas`, `Bony E & Gorny`), automatickým prispôsobením pre fotky na výšku aj na šírku a full-screen náhľadom po kliknutí.

## Ako pridať vlastné fotky a videá
Originálne súbory ostávajú nedotknuté v `photos/` a skript z nich vytvorí rýchlu webovú verziu (vrátane konverzie iPhone `.HEIC` na `.jpg`, kompresie veľkých `.mp4` videí a malých náhľadov) do priečinka `media/`:

1. Nakopíruj fotky alebo krátke videá (`.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.mp4`, `.mov`) do príslušných priečinkov:
   - `photos/simca/` – fotky Simče samej (napr. z Oulu)
   - `photos/us/` – spoločné fotky Simče a Mišáka
   - `photos/dogs/` – fotky Simče s Riou a Texasom
   - `photos/horses/` – *(voliteľné)* fotky s Gornym a Bony E
2. V termináli v priečinku projektu spusti:
   ```bash
   ./update-photos.sh
   ```
3. Skript automaticky zoptimalizuje médiá do `media/` a vygeneruje `photos-data.js`. Obnov stránku v prehliadači a galéria hneď pobeží.
4. *(Voliteľné)* Vlastné popisky k jednotlivým fotkám môžeš doplniť v `config.js` v sekcii `photoCaptions` (podľa názvu súboru v `media/`, napr. `'IMG_4174.jpg'`).

## Úprava dátumu alebo textov
Všetky dátumy, texty a nastavenia sú na jednom mieste v súbore **`config.js`**:
- `erasmusStart` – začiatok Erasmu (`2026-08-18T00:00:00+02:00`)
- `reunionDate` – cieľový dátum a čas návratu (`2026-12-24T12:00:00+01:00`)
- `inOulu` / `waitingAtHome` – kartičky pre tím v Oulu aj čakajúcich doma

## Spustenie a nasadenie
- **Lokálne:** Stačí dvojkliknúť na `index.html` (funguje bez servera), prípadne spustiť `python3 -m http.server 8080`.
- **Online (zadarmo):** Celý priečinok stačí nahrať na **GitHub Pages**, **Netlify** alebo **Cloudflare Pages** (žiadny build krok nie je potrebný).
