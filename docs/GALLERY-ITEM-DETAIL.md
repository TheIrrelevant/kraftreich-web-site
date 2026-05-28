---
type: doc
category: content-brief
scope: gallery-detail
description: Gallery item detay paneli icin veri modeli ve proje basina doldurulacak sablon.
last-updated: 2026-05-26
status: draft
---

# Gallery Item — Detay Veri Modeli

Gallery item secildiginde acilan sag panel (`GalleryDetailPanel`) icin gerekli tum alanlar.

**Not:** `about-me` slug'i detay paneli **acmaz** — bu brief sadece `gallery-01` … `gallery-14` icin gecerlidir.

**Ana sayfa grid alanlari:** [HOME-PAGE-CONTENT.md](./HOME-PAGE-CONTENT.md)

---

## 1. Veri modeli (TypeScript hedefi)

Asagidaki sema, mevcut UI bolumleriyle birebir eslesir. Icerik toplandiktan sonra koda tasinacak.

```ts
type CoverAspect = "portrait" | "tall" | "landscape" | "wide" | "square";

type MediaType = "image" | "video";

type GalleryMediaItem = {
  id: string;                    // benzersiz, orn. "media-01"
  type: MediaType;
  src: string;                   // public path, orn. "/assets/gallery/gallery-01/media-01.webp"
  poster?: string;               // video icin poster frame
  aspectClass: CoverAspect | "aspect-video";  // UI orani
  caption?: string;              // gorsel alti aciklama
};

type TeamMember = {
  id: string;                    // benzersiz key, orn. "team-01"
  name: string;
  role: string;
};

type GalleryItemDetail = {
  // — Kimlik —
  slug: string;                  // gallery-01 … gallery-14
  categoryId: "work" | "art";
  categoryTitle: "Work" | "Art";

  // — Grid karti (ana sayfa) —
  title: string;
  description: string;             // max ~2 cumle, grid alti
  coverAspect: CoverAspect;
  coverImage: string;

  // — Detay header —
  yearLabel: string;             // sag ust, orn. "22—23"
  timeline: string;              // orn. "2022—2023 / 6 months (Part-time role)"
  platform: string;              // orn. "Quest App, Unity"

  // — My deliverables —
  deliverables: string[];         // numarali liste (sol kolon)
  tools: string;                   // orn. "Unity, Figma, Dall-E API"
  deliverablesIntro: string;       // sag kolon — 1. paragraf
  deliverablesExtra?: string;      // sag kolon — ek paragraf (opsiyonel)

  // — Team —
  team: TeamMember[];
  teamNarrative: string;           // sag kolon — testimonial / is birligi metni
  teamAttribution: string;         // orn. "Skylar Thomas, CTO & Co-Founder"

  // — Problem & Solution —
  summaryStatement: string;        // buyuk tek cumle / paragraf
  problem: string;                 // "Problem:" sonrasi metin
  solution: string;                // "Solution:" sonrasi metin

  // — Medya —
  hero: {
    type: MediaType;
    src: string;
    poster?: string;               // video icin
  };
  galleryMedia: GalleryMediaItem[]; // detay alt stack
};
```

---

## 2. UI yerlesimi (panel icinde sira)

```
[ Hero — 16:9 image veya video ]

Title                                    Year label
Timeline (sol)                           Platform (sag)
─────────────────────────────────────────────────────
My deliverables
  [numarali liste]  |  [tools + paragraflar]
─────────────────────────────────────────────────────
Team
  [isim/rol listesi] |  [narrative + attribution]
─────────────────────────────────────────────────────
[ Summary statement — buyuk baslik ]

Problem (sol)                            Solution (sag)

[ Gallery media stack — her biri gorsel/video + caption ]
```

---

## 3. Medya kurallari

| Alan | Oran | Dosya |
|------|------|-------|
| `hero` | 16:9 (`aspect-video`) | `.webp` / `.mp4` |
| `galleryMedia[]` | `aspect-video`, `aspect-[16/10]`, vb. | item basina |
| `coverImage` | `coverAspect`'e gore grid'de | grid kapak |

**Video:** MP4, muted autoplay kullanilmayacak (detay paneli — kullanici kontrollu oynatma tercih edilir).

---

## 4. Proje sablonu (kopyala — her slug icin bir blok)

Asagidaki blogu her proje icin kopyalayip doldur.

---

### gallery-XX

```yaml
slug: gallery-XX
categoryId: work          # work | art
categoryTitle: Work       # Work | Art

# Grid
title:
description:
coverAspect: landscape    # portrait | tall | landscape | wide | square
coverImage: /assets/gallery/gallery-XX/cover.webp

# Header
yearLabel:
timeline:
platform:

# Deliverables
deliverables:
  - 
  - 
  - 
tools:
deliverablesIntro:
deliverablesExtra:

# Team
team:
  - id: team-01
    name:
    role:
  - id: team-02
    name:
    role:
teamNarrative:
teamAttribution:

# Problem & Solution
summaryStatement:
problem:
solution:

# Media
hero:
  type: image             # image | video
  src: /assets/gallery/gallery-XX/hero.webp
  poster:                 # video ise

galleryMedia:
  - id: media-01
    type: image
    src: /assets/gallery/gallery-XX/media-01.webp
    aspectClass: aspect-video
    caption:
  - id: media-02
    type: image
    src: /assets/gallery/gallery-XX/media-02.webp
    aspectClass: aspect-video
    caption:
```

---

## 5. Ornek (doldurulmus — referans)

PlaybookXR placeholder'indan uyarlanmis ornek. Gercek projelerinle degistir.

```yaml
slug: gallery-02
categoryId: work
categoryTitle: Work

title: PlaybookXR VR App UX & Gen AI Tools
description: Designed locomotion and Gen AI tooling UX for a Quest VR app built in Unity.
coverAspect: landscape
coverImage: /assets/gallery/gallery-02/cover.webp

yearLabel: "22—23"
timeline: "2022—2023 / 6 months (Part-time role)"
platform: "Quest App, Unity"

deliverables:
  - Designed locomotion + controllers/system navigation UX for the VR app using Unity.
  - Prototyped texture and skybox AI generation for the VR app using Unity.
  - Collaborated with engineering on implementation handoff and design documentation.
tools: "Unity, Figma, Dall-E API"
deliverablesIntro: >
  I collaborated with the PlaybookXR team to design and prototype key features
  for their VR app. The work spanned locomotion UX, in-app navigation, and early
  Gen AI tooling experiments.

team:
  - id: team-01
    name: Jakub Zegzulka
    role: XR Designer & Researcher
  - id: team-02
    name: Skylar Thomas
    role: CTO & Co-Founder
teamNarrative: >
  PlaybookXR was a small, fast-moving team. I worked closely with the CTO and
  engineering leads to translate design intent into Unity prototypes and ship-ready specs.
teamAttribution: "Skylar Thomas, CTO & Co-Founder"

summaryStatement: >
  Prototyped multiple proof of concepts to improve the design tools' capabilities
  using Gen AI to generate textures & skyboxes.
problem: >
  VR creators needed faster ways to iterate on environment art without leaving
  the build loop or relying on a full art pipeline for every pass.
solution: >
  We prototyped Gen AI texture and skybox generation inside the app workflow,
  validating UX patterns in Unity before committing engineering resources.

hero:
  type: video
  src: /assets/gallery/gallery-02/hero.mp4
  poster: /assets/gallery/gallery-02/hero-poster.webp

galleryMedia:
  - id: media-01
    type: image
    src: /assets/gallery/gallery-02/media-01.webp
    aspectClass: aspect-video
    caption: "VR Prototype (Unity): Generating images inside of Playbook using Dall-E API"
  - id: media-02
    type: image
    src: /assets/gallery/gallery-02/media-02.webp
    aspectClass: aspect-video
    caption: "VR Prototype (Unity): Generating images inside of Playbook using Dall-E API"
```

---

## 6. Tum projeler — bos checklist

| Slug | Kolon | Title dolduruldu | Detay brief | Medya yuklendi |
|------|-------|------------------|-------------|----------------|
| gallery-01 | Work | [ ] | [ ] | [ ] |
| gallery-02 | Work | [ ] | [ ] | [ ] |
| gallery-03 | Work | [ ] | [ ] | [ ] |
| gallery-04 | Work | [ ] | [ ] | [ ] |
| gallery-05 | Work | [ ] | [ ] | [ ] |
| gallery-06 | Work | [ ] | [ ] | [ ] |
| gallery-07 | Work | [ ] | [ ] | [ ] |
| gallery-08 | Art | [ ] | [ ] | [ ] |
| gallery-09 | Art | [ ] | [ ] | [ ] |
| gallery-10 | Art | [ ] | [ ] | [ ] |
| gallery-11 | Art | [ ] | [ ] | [ ] |
| gallery-12 | Art | [ ] | [ ] | [ ] |
| gallery-13 | Art | [ ] | [ ] | [ ] |
| gallery-14 | Art | [ ] | [ ] | [ ] |

---

## 7. Slug eslesmesi (onemli)

Bu alanlar **ayni slug** ile senkron kalmali:

- Identity strip gallery index (`gallery-index.ts`)
- Work grid karti (`grid-items.ts`)
- URL hash (`#gallery-01`)
- Medya klasoru (`public/assets/gallery/gallery-01/`)

Slug degistirirsen dort yerde birlikte guncelle.
