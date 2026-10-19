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
    <span class="tier">{sponsor.tier.charAt(0)}{sponsor.tier.slice(1).toLowerCase()} sponsor · {sponsor.amount} sat</span>
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
    transition: background-color 160ms var(--ease-out);
  }
  .sponsor:hover {
    background: var(--liner-deep);
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
  .tier {
    font-size: 14px;
    color: var(--ink-soft);
  }
  .name {
    font-family: var(--font-display);
    font-stretch: 112%;
    font-weight: 800;
    font-size: 20px;
    line-height: 1.1;
  }
</style>
