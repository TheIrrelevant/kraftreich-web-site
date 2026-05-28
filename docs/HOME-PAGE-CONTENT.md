---
type: doc
category: content-brief
scope: home-page
description: Ana sayfa icin doldurulmasi gereken icerikler — identity strip, grid, medya ve sabit alanlar.
last-updated: 2026-05-26
status: draft
---

# Ana Sayfa Icerik Brief

Ana sayfa kabugu (layout, scroll, overlay, vinyl, gallery detay paneli) tamamlandi. Asagidaki alanlar gercek icerikle doldurulmayi bekliyor.

**Iliskili dosyalar (kod):**

| Alan | Dosya |
|------|-------|
| Identity strip — isim / email | `src/features/identity-strip/model/identity.ts` |
| Identity strip — gallery index | `src/features/identity-strip/model/gallery-index.ts` |
| Work grid — kolonlar ve kartlar | `src/features/work-grid/model/grid-items.ts` |
| Hero audio | `public/assets/audio/bergain.mp3` |

**Proje detay alanlari icin:** [GALLERY-ITEM-DETAIL.md](./GALLERY-ITEM-DETAIL.md)

---

## 1. Identity Strip (ust sabit serit)

### Sol kolon

| Alan | Mevcut | Doldurulacak |
|------|--------|--------------|
| Isim | Uğur Özkan | Dogru mu? Degisecekse yaz |
| Email | ugurozkan35@gmail.com | Guncel email |
| Headset / audio | Bergain.mp3 caliyor | Parca degisecek mi? |

### Orta kolon

| Alan | Mevcut | Doldurulacak |
|------|--------|--------------|
| Baslik satiri | Designer, Artist & AI Creative Technologist | Confirmed from current CV |
| Alt satir | Istanbul, Turkey | Sehir / ulke guncel mi? |

### Sag kolon — Gallery Index (14 satir)

Her satir `gallery-01` … `gallery-14` slug'ina karsilik gelir. Grid ve detay paneli ile **aynı slug** kullanilmali.

| Slug | Year | Tags | Proje adi (not) |
|------|------|------|-----------------|
| gallery-01 | 2023 | Art Direction, Campaign, Social | BKM Campaign Posters and Social Media System |
| gallery-02 | 2023 | Art Direction, Social, Momentum | Yargi Social Media Communication |
| gallery-03 | 2023 | Cinema, Release, Social | Bursa Bulbulu Cinema Release Campaign |
| gallery-04 | 2022 | Fashion, Ads, Social | Vamos Seasonal Social Media Campaign |
| gallery-05 | 2022 | Brand Design, Packaging | Benjamin Clean Kitchen Packaging System |
| gallery-06 | 2023 | Vinyl, Case Work, Artwork | Klangkuenstler Himmelreich Vinyl Design |
| gallery-07 | 2025 | Photography, Fine Art, Figure | Sculptural Figure Photography |
| gallery-08 | 2025 | Architecture, Concept, AI Rendering | Monolith Architectural Concept |
| gallery-09 | 2025 | Architecture, Urban Park, AI Rendering | Atrium Serenitatis Architectural Concept |
| gallery-10 | 2025 | Architecture, Cultural Space, AI Rendering | Claritas Architectural Concept |
| gallery-11 | 2024 | Procreate, Painting, Travel Route | Painted Travel Route Series |
| gallery-12 | 2026 | Design System, Figma, Automation | Schwarzgewalt Design System Creation |
| gallery-13 | — | — | Reserved |
| gallery-14 | — | — | Reserved |

**Ornek tags:** `VR, UX, Unity` veya `Gen AI, Figma`

---

## 2. Work Grid — kolon dagilimi

Grid 3 kolon:

| Kolon | ID | Detay paneli |
|-------|-----|--------------|
| About Me | `about-me` | Acilmaz — sadece kart |
| Work | `work` | gallery-01 … gallery-07 |
| Art | `art` | gallery-08 … gallery-14 |

Kolon atamasini degistirmek istersen hangi slug hangi kolonda olacagini buraya yaz.

---

## 3. About Me karti (sol kolon)

Detay paneli **acilmaz**. Sadece grid karti doldurulur.

| Alan | Mevcut | Doldurulacak |
|------|--------|--------------|
| Slug | `about-me` | Sabit |
| Kapak gorseli | Placeholder | `public/assets/gallery/about-me/cover.webp` |
| Kapak orani | `portrait` (3:4) | Degistirilecekse: portrait / tall / landscape / wide / square |
| Aciklama (max ~2 cumle) | Designer, artist and LLM engineer… | AI creative technologist with a background in creative direction, architectural visualization, and design systems. Builds React/TypeScript tools that turn creative workflows into structured products, including Figma automation, generative image systems, and AI-assisted production pipelines. |

---

## 4. Skills

Skill groupings to use for the home page or About Me detail copy.

| Group | Skills |
|-------|--------|
| Creative Direction | Art direction, creative strategy, brand systems, campaign direction, visual systems, motion concepts |
| Design Systems | Figma systems, Figma automation, token-based design systems, component libraries, product screen automation, design system documentation |
| AI & LLM Workflows | Claude Code, Gemini API, LLM workflows, prompt architecture, structured JSON outputs, provider adapters, AI-assisted production pipelines |
| Development | React 19, TypeScript, Vite, Tailwind CSS v4, Node.js, Python, Git, GitHub |
| Design & Production | Adobe Creative Collection, Figma, Procreate, 3D visualization, CAD, architectural visualization |
| Generative Production | Generative image systems, reference-to-image workflows, Midjourney, AI cinematography recipes, image-direction systems |

---

## 5. Grid kartlari (Work + Art)

Her gallery item icin ana sayfada gorunen minimum alanlar:

| Alan | Aciklama | Ornek |
|------|----------|-------|
| `slug` | URL hash + DOM id | `gallery-01` |
| `title` | Kart basligi (detayda da kullanilir) | PlaybookXR VR App UX |
| `description` | Grid alti, max 2 cumle | Kisa ozet |
| `coverAspect` | Placeholder orani | `landscape`, `portrait`, … |
| `coverImage` | Kapak dosyasi | `public/assets/gallery/gallery-01/cover.webp` |

### Work kolonu (gallery-01 — gallery-07)

Mevcut kapak oranlari sirayla: landscape, landscape, wide, landscape, square, landscape, portrait.

| Slug | Title | Description | Cover image path |
|------|-------|-------------|------------------|
| gallery-01 | BKM Campaign Posters and Social Media System | Art directed BKM campaign visuals where each production kept its own tone while tour dates, venues, and conversion-led information stayed instantly readable. | `/assets/gallery/gallery-01/cover.png` |
| gallery-02 | Yargi Social Media Communication | Art directed social media visuals for Ay Yapim's Yargi, translating ratings, awards, scenes, and fan momentum into sharp campaign content. | `/assets/gallery/gallery-02/cover.png` |
| gallery-03 | Bursa Bulbulu Cinema Release Campaign | Art directed the social media launch campaign for Bursa Bulbulu's cinema release, turning trailers, character cuts, and announcement assets into a full release communication system. | `/assets/gallery/gallery-03/cover.jpg` |
| gallery-04 | Vamos Seasonal Social Media Campaign | Art directed seasonal social media and paid ad creatives for Vamos, positioning the clothing brand through editorial styling, motion content, and confident youth-focused messaging. | `/assets/gallery/gallery-04/cover.png` |
| gallery-05 | Benjamin Clean Kitchen Packaging System | Designed a clean physical packaging system for Benjamin Clean Kitchen, connecting granola and nut butter products through a minimal, trustworthy, and premium visual language. | `/assets/gallery/gallery-05/cover.png` |
| gallery-06 | Klangkuenstler Himmelreich Vinyl Design | Designed a vinyl case work for Klangkuenstler's Himmelreich, translating the album's dark techno atmosphere into a monochrome physical music object. | `/assets/gallery/gallery-06/cover.png` |
| gallery-07 | Sculptural Figure Photography | A fine nude art series treating the body as sculptural form through low-key black-and-white light, partial crops, shadow, and controlled gesture. | `/assets/gallery/gallery-07/cover.png` |

### Art kolonu (gallery-08 — gallery-14)

Mevcut kapak oranlari sirayla: portrait, landscape, wide, landscape, tall, square, landscape.

| Slug | Title | Description | Cover image path |
|------|-------|-------------|------------------|
| gallery-08 | Monolith Architectural Concept | Designed a cliffside concrete residence as a solo architectural concept, using 3D modeling, Midjourney rendering, material retexturing, and video generation as an experimental visualization pipeline. | `/assets/gallery/gallery-08/cover.png` |
| gallery-09 | Atrium Serenitatis Architectural Concept | Designed a meditative urban atrium park as a solo architectural concept, using concrete, water, bamboo, stepped voids, and an experimental 3D-to-Midjourney rendering workflow. | `/assets/gallery/gallery-09/cover.png` |
| gallery-10 | Claritas Architectural Concept | Designed Claritas as a solo architectural concept around white stone, water reflection, axial calm, and an experimental 3D-to-Midjourney visualization workflow. | `/assets/gallery/gallery-10/cover.png` |
| gallery-11 | Painted Travel Route Series | A painterly travel-route art series moving through caves, coastal paths, ruins, rivers, villages, and mountain valleys as if mapping an imagined journey. | `/assets/gallery/gallery-11/cover.png` |
| gallery-12 | Schwarzgewalt Design System Creation | Created a full Kraftreich design system in Figma with Schwarzgewalt, an internal automation tool built to make brand-specific design systems, product screens, and custom components repeatable without LLM hallucination. | `/assets/gallery/gallery-12/cover.png` |
| gallery-13 | Reserved | Empty until content is selected. | — |
| gallery-14 | Reserved | Empty until content is selected. | — |

---

## 6. Medya dosya yapisi (onerilen)

```
public/assets/gallery/
  about-me/
    cover.png
  gallery-01/
    cover.png           # grid cover
    hero.png            # detail hero, or hero.mp4
    media-01.png        # detail media stack
    media-02.jpg
    ...
  gallery-02/
    ...
```

**Format decisions:**

- Cover: `.png`, `.jpg`, or `.jpeg`
- Hero: `.png`, `.jpg`, `.jpeg`, or `.mp4`
- Detail media: `.png`, `.jpg`, `.jpeg`, `.gif`, or `.mp4`
- Video: MP4 (H.264) preferred; large video files may need compression or Git LFS before release.

---

## 7. Ses / vinyl

| Alan | Mevcut | Not |
|------|--------|-----|
| Dosya | `public/assets/audio/bergain.mp3` | Degistirilecekse yeni dosya yolu |
| Gain | %30 | `audio-mute-context` |

Gallery detay acikken vinyl gizlenir; ses devam eder.

---

## 8. Tamamlanma kontrol listesi

- [ ] Identity — isim ve email dogrulandi
- [x] Identity — orta kolon metni
- [x] About Me — aciklama
- [x] Skills — skill groups added
- [x] Gallery index — 14 satir (year + tags)
- [ ] About Me — kapak
- [x] Work — 7 kart (title, description, cover)
- [ ] Art — 7 kart (title, description, cover) — gallery-13 and gallery-14 reserved
- [x] Tum kapak gorselleri `public/assets/gallery/` altinda
- [ ] Her gallery item icin detay brief dolduruldu → gallery-01 through gallery-12 done; gallery-13 and gallery-14 reserved

---

## 9. Kod entegrasyonu (sonraki muhendislik adimi)

Icerikler toplandiktan sonra muhtemel yol:

1. `src/content/gallery/*.md` veya JSON loader
2. `grid-items.ts` placeholder yerine loader
3. `gallery-index.ts` ayni kaynaktan sync
4. `GalleryDetailPanel` placeholder sabitleri item datasindan okur

Simdilik bu dosyalar **icerik toplama** icin; kod degisikligi ayri commit.
