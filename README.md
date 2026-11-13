# Gaga – Restauracja Gruzińska (demo strony)

Jednostronicowa strona restauracji **Gaga** przy Al. Ujazdowskich 6A w Warszawie, w wersji polskiej i angielskiej.

## Struktura

```
index.html        – wersja polska (strona główna)
en.html           – wersja angielska
css/style.css     – wszystkie style (bez frameworków)
js/main.js        – slideshow, menu mobilne, animacje, formularz rezerwacji, mapa
assets/img/       – zdjęcia (.webp)
```

Czysty HTML, CSS i JavaScript – bez kroku budowania i bez zależności. Fonty ładowane z Google Fonts.

## Uruchomienie lokalne

Wystarczy otworzyć `index.html` w przeglądarce albo uruchomić prosty serwer:

```bash
npx http-server -p 5173
```

## Sekcje

Hero ze slideshow · pasek informacji · polecane dania · o nas · muzyka na żywo · opinie gości · rezerwacja (MojStolik.pl) · kontakt z mapą Google (ładowaną po kliknięciu) · stopka.

## Do potwierdzenia przed publikacją

- Prawa do zdjęć (pochodzą z Google Maps) – potrzebna zgoda restauracji lub własne zdjęcia.
- Dokładne dni występów muzyki na żywo (na stronie: „w weekendy”).
- Link przycisku „Zobacz pełne menu”.
