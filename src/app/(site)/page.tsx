/**
 * ---metadata---
 * @file src/app/(site)/page.tsx
 * @description Home route. AudioMuteProvider + vinyl engine, IdentityStrip slots, WorkGrid hero.
 * @last-updated 2026-05-26
 * @last-change vinyl canvas portals above grid via VinylMount anchor
 * ---end-metadata---
 */

import HomeHero from "@/features/home-hero/ui/HomeHero";
import IdentityStrip from "@/features/identity-strip/ui/IdentityStrip";
import VinylAudioEngine from "@/features/vinyl-particles/ui/VinylAudioEngine";
import VinylMount from "@/features/vinyl-particles/ui/VinylMount";
import VinylMuteToggle from "@/features/vinyl-particles/ui/VinylMuteToggle";
import VinylParticles from "@/features/vinyl-particles/ui/VinylParticles";
import { AudioMuteProvider } from "@/shared/lib/audio-mute/audio-mute-context";

export default function HomePage() {
  return (
    <AudioMuteProvider>
      <VinylAudioEngine>
        <div className="relative isolate bg-[var(--primary)]">
          <IdentityStrip muteSlot={<VinylMuteToggle />} vinylSlot={<VinylMount />} />
          <VinylParticles />
          <HomeHero />
        </div>
      </VinylAudioEngine>
    </AudioMuteProvider>
  );
}
