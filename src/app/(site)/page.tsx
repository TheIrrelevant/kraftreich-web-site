/**
 * ---metadata---
 * @file src/app/(site)/page.tsx
 * @description Home route. AudioMuteProvider + vinyl engine, IdentityStrip slots, WorkGrid hero.
 * @last-updated 2026-05-28
 * @last-change load gallery catalog from public/assets/gallery markdown at build time
 * ---end-metadata---
 */

import HomeHero from "@/features/home-hero/ui/HomeHero";
import HomePageContent from "@/features/home-hero/ui/HomePageContent";
import IdentityStrip from "@/features/identity-strip/ui/IdentityStrip";
import { VinylLoadingProvider } from "@/features/vinyl-particles/context/vinyl-loading-context";
import VinylAssemblyAnchor from "@/features/vinyl-particles/ui/VinylAssemblyAnchor";
import VinylAudioEngine from "@/features/vinyl-particles/ui/VinylAudioEngine";
import VinylLoadingOverlay from "@/features/vinyl-particles/ui/VinylLoadingOverlay";
import VinylMount from "@/features/vinyl-particles/ui/VinylMount";
import VinylParticles from "@/features/vinyl-particles/ui/VinylParticles";
import { AudioMuteProvider } from "@/shared/lib/audio-mute/audio-mute-context";
import { loadGalleryCatalog } from "@/shared/lib/content/gallery";
import { collectHomeAssetUrls } from "@/shared/lib/site-ready/collect-home-asset-urls";
import { GalleryCatalogProvider } from "@/shared/lib/gallery-catalog/gallery-catalog-context";
import { GallerySelectionProvider } from "@/shared/lib/gallery-selection/gallery-selection-context";

export default function HomePage() {
  const catalog = loadGalleryCatalog();
  const homeAssetUrls = collectHomeAssetUrls(catalog);

  return (
    <AudioMuteProvider>
      <GallerySelectionProvider>
        <GalleryCatalogProvider catalog={catalog}>
          <VinylLoadingProvider assetUrls={homeAssetUrls}>
            <VinylAudioEngine>
              <VinylLoadingOverlay />
              <HomePageContent>
                <IdentityStrip
                  galleryIndex={catalog.index}
                  skills={catalog.skills}
                  vinylSlot={<VinylMount />}
                  assemblySlot={<VinylAssemblyAnchor />}
                />
                <HomeHero />
              </HomePageContent>
              <VinylParticles />
            </VinylAudioEngine>
          </VinylLoadingProvider>
        </GalleryCatalogProvider>
      </GallerySelectionProvider>
    </AudioMuteProvider>
  );
}
