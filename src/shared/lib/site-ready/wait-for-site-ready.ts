/**
 * ---metadata---
 * @file src/shared/lib/site-ready/wait-for-site-ready.ts
 * @description Waits for window load, fonts, catalog assets, and mounted DOM media.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|$)/i;
const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|aac)(\?|$)/i;

export type SiteReadyOptions = {
  assetUrls?: readonly string[];
  root?: HTMLElement | null;
  signal?: AbortSignal;
  timeoutMs?: number;
};

function isAborted(signal?: AbortSignal) {
  return signal?.aborted ?? false;
}

function waitForWindowLoad(signal?: AbortSignal): Promise<void> {
  if (isAborted(signal)) return Promise.resolve();
  if (document.readyState === "complete") return Promise.resolve();

  return new Promise((resolve) => {
    const finish = () => {
      window.removeEventListener("load", finish);
      resolve();
    };
    window.addEventListener("load", finish, { once: true });
    signal?.addEventListener("abort", finish, { once: true });
  });
}

function waitForNextFrames(count: number): Promise<void> {
  return new Promise((resolve) => {
    let remaining = count;
    const step = () => {
      remaining -= 1;
      if (remaining <= 0) resolve();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<T | void> {
  if (timeoutMs <= 0) return promise;

  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(), timeoutMs);
    const finish = () => {
      window.clearTimeout(timer);
      resolve();
    };
    promise.then(finish).catch(finish);
    signal?.addEventListener("abort", finish, { once: true });
  });
}

function preloadAsset(url: string, signal?: AbortSignal): Promise<void> {
  if (isAborted(signal)) return Promise.resolve();

  if (VIDEO_EXT.test(url)) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const finish = () => {
        video.removeAttribute("src");
        video.load();
        resolve();
      };
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.addEventListener("canplaythrough", finish, { once: true });
      video.addEventListener("error", finish, { once: true });
      signal?.addEventListener("abort", finish, { once: true });
      video.src = url;
      video.load();
    });
  }

  if (AUDIO_EXT.test(url)) {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      const finish = () => {
        audio.removeAttribute("src");
        audio.load();
        resolve();
      };
      audio.preload = "auto";
      audio.addEventListener("canplaythrough", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });
      signal?.addEventListener("abort", finish, { once: true });
      audio.src = url;
      audio.load();
    });
  }

  return new Promise((resolve) => {
    const image = new Image();
    const finish = () => resolve();
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
    signal?.addEventListener("abort", finish, { once: true });
    image.src = url;
    if (image.complete) finish();
  });
}

function waitForDomImage(img: HTMLImageElement, signal?: AbortSignal): Promise<void> {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();

  return new Promise((resolve) => {
    const finish = () => {
      img.removeEventListener("load", finish);
      img.removeEventListener("error", finish);
      resolve();
    };
    img.addEventListener("load", finish, { once: true });
    img.addEventListener("error", finish, { once: true });
    signal?.addEventListener("abort", finish, { once: true });
  });
}

function waitForDomVideo(video: HTMLVideoElement, signal?: AbortSignal): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) return Promise.resolve();

  return new Promise((resolve) => {
    const finish = () => {
      video.removeEventListener("canplaythrough", finish);
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("error", finish);
      resolve();
    };
    video.addEventListener("canplaythrough", finish, { once: true });
    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
    signal?.addEventListener("abort", finish, { once: true });
  });
}

function waitForDomMedia(root: HTMLElement, signal?: AbortSignal): Promise<void> {
  const images = [...root.querySelectorAll<HTMLImageElement>("img[src]")];
  const videos = [...root.querySelectorAll<HTMLVideoElement>("video[src]")];

  return Promise.all([
    ...images.map((img) => waitForDomImage(img, signal)),
    ...videos.map((video) => waitForDomVideo(video, signal)),
  ]).then(() => undefined);
}

export async function waitForSiteReady(options: SiteReadyOptions = {}): Promise<void> {
  const { assetUrls = [], root, signal, timeoutMs = 45_000 } = options;

  await waitForWindowLoad(signal);
  if (isAborted(signal)) return;

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitForNextFrames(2);
  if (isAborted(signal)) return;

  const uniqueUrls = [...new Set(assetUrls.filter(Boolean))];
  await withTimeout(
    Promise.all(uniqueUrls.map((url) => preloadAsset(url, signal))),
    timeoutMs,
    signal,
  );
  if (isAborted(signal)) return;

  const scope = root ?? document.body;
  await withTimeout(waitForDomMedia(scope, signal), timeoutMs, signal);
}
