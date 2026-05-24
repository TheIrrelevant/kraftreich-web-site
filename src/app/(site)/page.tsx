/**
 * ---metadata---
 * @file src/app/(site)/page.tsx
 * @description Home route. Composition only. Wraps the identity strip + hero in the audio mute
 *              provider so the headset toggle (slotted into the strip) and the particle cloud
 *              (inside the hero) share one mute state.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import AudioMuteToggle from "@/features/audio-particle-cloud/ui/AudioMuteToggle";
import HomeHero from "@/features/home-hero/ui/HomeHero";
import IdentityStrip from "@/features/identity-strip/ui/IdentityStrip";
import { AudioMuteProvider } from "@/shared/lib/audio-mute/audio-mute-context";

export default function HomePage() {
  return (
    <AudioMuteProvider>
      <IdentityStrip audioSlot={<AudioMuteToggle />} />
      <HomeHero />
    </AudioMuteProvider>
  );
}
