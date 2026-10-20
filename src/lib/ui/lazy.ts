/** Calls `onVisible` once the node scrolls near the viewport (or its scroll container). */
export function lazy(node: HTMLElement, onVisible: () => void) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        onVisible();
        observer.disconnect();
      }
    },
    { rootMargin: "200px" },
  );
  observer.observe(node);
  return {
    destroy: () => observer.disconnect(),
  };
}
