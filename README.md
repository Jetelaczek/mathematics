# Matematika pro děti

Zábavná procvičovací webová hra pro děti — sčítání, odčítání a porovnávání
čísel, s avatary, barevnými motivy, body, úrovněmi a denní šňůrou.

## Spuštění lokálně

Žádná instalace závislostí není potřeba — jde o čistě statickou stránku.
Stačí ji otevřít přes libovolný statický server, např.:

```sh
npx http-server .
# nebo
python -m http.server 8080
```

a pak otevřít `http://localhost:<port>/` v prohlížeči.

## Testy

Jádro hry (`js/core/gameEngine.js`) je čistý, testovatelný modul bez závislosti
na DOM nebo `localStorage`. Testy běží přes vestavěný Node.js test runner
(žádné externí závislosti):

```sh
npm test
```

## Nasazení

Statická stránka je určená k nasazení přes GitHub Pages (zdroj: větev `main`,
kořenový adresář). Žádný build krok není potřeba.

## Struktura

- `js/core/gameEngine.js` — čistá herní logika (generování příkladů,
  vyhodnocení odpovědí, body/úrovně/šňůra). Jediný testovaný seam.
- `js/storage.js` — ukládání profilu do `localStorage`.
- `js/ui/*.js` — obrazovky (výběr profilu, nastavení avatara/barvy, výběr
  cvičení, procvičování, souhrn kola).
- `js/main.js` — propojení obrazovek dohromady.
- `tests/gameEngine.test.js` — testy jádra hry.
