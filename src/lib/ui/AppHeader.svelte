<script lang="ts">
  interface Props {
    current?: "print" | "history";
  }
  let { current }: Props = $props();
</script>

<header class="bar">
  <a class="wordmark" href="/#" aria-label="Cashu Brrr home">CASHU BRRR</a>
  <nav aria-label="Main">
    <a href="#print" aria-current={current === "print" ? "page" : undefined}>Print</a>
    <a href="#history" aria-current={current === "history" ? "page" : undefined}>History</a>
  </nav>
</header>

<style>
  .bar {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 18px var(--gutter);
    border-bottom: 1px solid var(--ink);
    background: var(--liner);
  }
  .wordmark {
    font-family: var(--font-display);
    font-stretch: 125%;
    font-weight: 900;
    font-size: 22px;
    letter-spacing: -0.01em;
    color: var(--ink);
    text-decoration: none;
  }
  nav {
    display: flex;
    gap: 28px;
  }
  nav a {
    font-family: var(--font-display);
    font-stretch: 112%;
    font-weight: 750;
    font-size: 15px;
    color: var(--ink);
    text-decoration: none;
    padding: 4px 0;
    border-bottom: 2px solid transparent;
    transition: border-color 160ms var(--ease-out);
  }
  nav a:hover {
    border-bottom-color: var(--ink);
  }
  nav a[aria-current="page"] {
    border-bottom-color: var(--cut);
  }
</style>
