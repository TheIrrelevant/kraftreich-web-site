/**
 * ---metadata---
 * @file src/features/audio-particle-cloud/ui/AudioMuteToggle.tsx
 * @description Headset-icon mute toggle for the hero audio. Fixed at the left edge, aligned
 *              under the IdentityStrip name column. Renders only after the user has activated
 *              audio (first interaction) and the hero has scrolled into its compacted state.
 *              Portaled to document.body so it escapes the hero section's fixed stacking context
 *              and sits above the sticky IdentityStrip.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  muted: boolean;
  visible: boolean;
  onToggle: () => void;
};

export default function AudioMuteToggle({ muted, visible, onToggle }: Props) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Mount-only setState: server render returns null to avoid a hydration mismatch on the
    // portal target, then the first client effect promotes us to document.body. This is the
    // canonical "wait for mount before portaling" pattern — no cascading renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPortalTarget(document.body);
  }, []);

  if (!portalTarget) return null;

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="audio-mute-toggle"
          type="button"
          onClick={onToggle}
          aria-label={muted ? "Unmute hero audio" : "Mute hero audio"}
          aria-pressed={!muted}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          className="fixed z-[60] inline-flex h-[var(--space-32)] w-[var(--space-32)] items-center justify-start rounded-sm p-0 text-[var(--secondary)] outline-none transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
          style={{
            left: "var(--space-48)",
            top: "calc(var(--space-32) + var(--space-16))",
          }}
        >
          <HeadsetIcon muted={muted} />
        </motion.button>
      ) : null}
    </AnimatePresence>,
    portalTarget,
  );
}

function HeadsetIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1" />
      <rect x="17" y="14" width="4" height="6" rx="1" />
      {muted ? <line x1="4" y1="4" x2="20" y2="20" /> : null}
    </svg>
  );
}
