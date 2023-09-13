export const IS_BROWSER = typeof window !== 'undefined';
export const WINDOW: any = IS_BROWSER ? window : {};
export const IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in WINDOW.document.documentElement : false;
export const HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
