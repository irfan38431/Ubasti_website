/**
 * Auto-wired replacements — all values come from placeholder-replacement.json.
 * Edit that file; this module and every component that imports from here updates automatically.
 */
import cfg from "../placeholder-replacement.json";

export const BRAND           = cfg.brand;
export const SOCIAL          = cfg.social;
export const CONTACT         = cfg.contact;
export const ADOPTION        = cfg.adoption;
export const HERO            = cfg.hero;
export const SLIDESHOW_IMAGES: string[] = cfg.slideshow;
export const VIDEOS: string[]           = cfg.videos;
export const OFFERINGS       = cfg.offerings;
export const ABOUT           = cfg.about;
export const ADOPTION_REASONS_IMAGES: string[] = cfg.adoptionReasons;
export const KITTIES         = cfg.kitties;
export const BLOG            = cfg.blog;
export const EVENTS          = cfg.events;
export const PRIVATE_PARTIES = cfg.privateParties;
export const DECORATIVE      = cfg.decorative;
export const BADGES          = cfg.badges;

// Convenience flat exports used across the codebase
export const INSTAGRAM_URL    = cfg.social.instagram;
export const ADOPTION_FORM_URL = cfg.adoption.formUrl;
