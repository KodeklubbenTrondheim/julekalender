# :mrs_claus: Kodekalender fra Kodeklubben Trondheim :santa:

Om du vil bidra er det bare å sende inn en issue [her](https://github.com/kodeklubbentrondheim/kodekalender/issues), så legger vi deg til! The more the merrier :raised_hands:

## :computer: Sette opp prosjektet på din maskin

_Dette må bare gjøres en gang per maskin._

**TL;DR: Installer [Node.js](https://nodejs.org/en/), [Git](https://git-scm.com/downloads) og [VSCode](https://code.visualstudio.com/). Klon prosjektet fra GitHub og kjør `npm install` så `npm start` i VSCode-terminalen.**

Det eneste du trenger er [Node.js](https://nodejs.org/en/), ellers så er [Git](https://git-scm.com/downloads) veldig hendig om du vil bidra. Video om Git [her](https://www.youtube.com/watch?v=HkdAHXoRtos&ab_channel=Fireship) om du er usikker på hvordan det brukes.

Gjerne også installer [VSCode](https://code.visualstudio.com/) for å redigere filer. Den er veldig godt integrert med Git, så den kan virkelig anbefales!

<details>
<summary>I VSCode kan det også være kjekt å installere en rekke extensions. Her er min anbefalte liste (trykk for å åpne)</summary>

- Prettier - Code formatter (for å formatere kode, så slepper man å tenke på det)
- GitLens (gjør Git hakket enklere, men den ikke nødvendig!)
- styled-components (så får man farge på CSS'en fra styled-components)

Her er litt ekstra som jeg bare må ha, men som egentlig ikke er så viktig:

- indent-rainbow (enklere å se innrykk)
- Better Comments (gir farge på kommentarer, f.eks. blir "!" rødt og "TODO" oransje)
- Rainbow Brackets (gir farge på parenteser så man lettere ser hva som matcher)
- Code Spell Checker, med norsk og engelsk ordbok (man får blå linjer under ord man skriver feil)
</details>

Nå må vi hente prosjektet fra GitHub. Det gjøres slik:

1. Åpne terminal (Powershell (Windows) eller Terminal (Mac OS))
2. Skriv `pwd` for å sjekke hvor du er nå
3. Naviger deg til der du vil installere prosjektet (skriv `cd mappenavn` for å gå inn i en mappe og `cd ..` for å gå ut)
4. Skriv så `git clone https://github.com/kodeklubbentrondheim/kodekalender.git` (Hvis du har SSH, kjør denne i stedet: `git clone git@github.com:kodeklubbentrondheim/kodekalender.git`)
5. Gå inn i mappen: `cd kodekalender`
6. Skriv `npm install`
7. Skriv `npm start`
8. Nå skal det kjøre! Bare å spørre kodeklubben trondheim om hjelp om du stod fast på et steg.

## :runner: Kjøre prosjektet

_Dette må gjøres hver gang man skal starte opp._

Åpne terminal i VSCode (se etter "Terminal" i toppmenyen)

```bash
npm install # Må kjøres av og til om nye pakker i `package.json` er lagt til
npm start # Denne vil åpne nettleseren og auto-refreshe når du endrer og lagrer en fil :)
```
