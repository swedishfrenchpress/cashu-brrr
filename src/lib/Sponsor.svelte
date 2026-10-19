<script lang="ts">
  import type { Sponsor } from "./sponsors";

  interface Props {
    sponsor: Sponsor;
  }

  let { sponsor }: Props = $props();
</script>

<a class="sponsor" target="_blank" rel="noopener noreferrer" href={sponsor.link}>
  <img class="avatar" src={sponsor.imageLink} alt="" loading="lazy" width="56" height="56" />
  <span class="body">
    <span class="name">{sponsor.name}</span>
    <span class="slug">{sponsor.tier} sponsor · {sponsor.amount} sat</span>
  </span>
</a>

<style>
  .sponsor {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 280px;
    padding: 14px 24px 14px 14px;
    background: var(--paper);
    border: 1px solid var(--ink);
    border-radius: 999px;
    color: var(--ink);
    text-decoration: none;
    outline: 1px solid rgba(229, 0, 125, 0.55);
    outline-offset: 6px;
    transition:
      transform 300ms var(--ease-out),
      outline-color 200ms var(--ease-out);
  }
  .sponsor:hover {
    transform: translateY(-2px);
    outline-color: var(--cut);
  }
  .avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    background: var(--liner-deep);
    flex: none;
  }
  .body {
    display: grid;
    gap: 4px;
    min-width: 0;
  }
  .name {
    font-family: var(--font-display);
    font-stretch: 112%;
    font-weight: 800;
    font-size: 20px;
    line-height: 1.1;
  }
</style>
