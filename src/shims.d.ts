// shims.d.ts
export {};
declare global {
  interface Window {
    edit?: (model: any) => void;
    save?: (model: any) => void;
    delete?: (key: string) => void;
  }
}
