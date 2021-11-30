import { css } from 'styled-components'

export const CSSShadows = {
  small: css`
    --shadow-color: #0002;
    box-shadow: 0 1px 1px var(--shadow-color);
  `,
  medium: css`
    --shadow-color: #0002;
    box-shadow: 0 1px 1px var(--shadow-color), 0 2px 2px var(--shadow-color), 0 4px 4px var(--shadow-color);
  `,
  large: css`
    --shadow-color: #0002;
    box-shadow: 0 1px 1px var(--shadow-color), 0 2px 2px var(--shadow-color), 0 4px 4px var(--shadow-color),
      0 8px 8px var(--shadow-color), 0 16px 16px var(--shadow-color);
  `,
}

export const usableNames = `
Piggsvin-
Spissmus 🐁
Flaggermus 🦇
Mus 🐁
Katt 🐈
Hund 🐶
Løve 🦁
Kanin 🐰
Okse 🐂
Hjort 🦌
Papegøye 🦜
Fugl 🐦
Fisk 🐟
Tiger 🐯
Leopard 🦁
Ape 🦧
Nesehorn 👃📯-
Giraffe 🦒
Rein 🦌
Elg 🦌
Røyskatt
Jerv
Ulv 🐺
Fjellrev 🦊
Oter 🦦
Bever
Bjørn 🐻
Isbjørn 🧊🐻
Brunbjørn 🐻
Vaskebjørn 🐼
Mink
Grevling
Ilder
Hare 🐰
Ekorn 🐿-
Husmus 🐭
Lemen
Hest 🐴
Sau 🐑
Kylling 🐥
Høne 🐔
Brunost 🟫🧀
Agurk 🥒
Paprika
Syltetøy
Jordbær 🍓-
Blåbær-
Pære 🍐
Banan 🍌
Bacon 🥓
Bringebær-
Skogsbær-
Mango 🥭
Ost 🧀
Kjeks 🍪
Brødskive 🍞
Iskrem 🍦
Sjokolade 🍫
Grønnsak 🥬
Ingefær
Hamburger 🍔
Pizza 🍕
Spaghetti 🍝
Saus
Taco 🌮
Havre
Grøt 🥣
Risgrøt 🥣
Ribbe
Pinnekjøtt-
Potet 🥔
Søtpotet 🍠
Riskrem 🍚🍨
Ananas
Appelsin 🍊
Asparges
Avokado 🥑
Biff 🥩
Blomkål
Brokkoli 🥦
Brus 🥤
Julebrus 🎅🥤
Bønne
Chilisaus 🌶
Chips
Cola 🥤
Daddel
Dill
Drue
Eddik
Eple 🍎-
Ert
Fetaost
Fiskepinne
Geitost
Havregrøt 🥣
Honning 🍯
Hvitløk 🧅
Kakao
Kake 🎂
Kanel
Ketchup
Kirsebær 🍒-
Krem
Kringle 🍩
Krydder-
Kål
Lapskaus
Lime
Løk 🧅
Mais 🌽
Makaroni
Mandel
Nudel 🍜
Oliven
Pannekake
Persille
Popkorn 🍿-
Potetstappe
Pølse 🌭
Riskake 🍚🍰
Rosin
Rømme
Salat 🥗
Salt-
Sennep
Sirup
Sitron 🍋
Sopp 🍄
Squash
Sukker-
Sylteagurk 🥒
Tomat 🍅
Tomatsuppe 🍅🍲
Suppe 🍲
Vaffel 🧇
Vanilje`
  .trim()
  .split('\n')
