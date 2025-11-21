<script lang="ts">
    import type { Sponsor } from "./sponsors";

    interface Props {
        sponsor: Sponsor
    }
    
    let { sponsor }: Props = $props();

    const tierColors = {
        GOLD: {
            border: 'border-yellow-400',
            bg: 'bg-yellow-200',
            text: 'text-gray-900',
            badge: 'bg-yellow-300'
        },
        SILVER: {
            border: 'border-yellow-300',
            bg: 'bg-yellow-100',
            text: 'text-gray-900',
            badge: 'bg-yellow-200'
        },
        BRONZE: {
            border: 'border-orange-300',
            bg: 'bg-orange-100',
            text: 'text-gray-900',
            badge: 'bg-orange-200'
        }
    };

    const tierConfig = tierColors[sponsor.tier];
</script>

<a 
    target="_blank" 
    rel="noopener noreferrer"
    class="block p-6 rounded-lg border-2 {tierConfig.border} {tierConfig.bg} shadow-lg sponsor-card"
    href="{sponsor.link}"
>
    <div class="flex items-center gap-4">
        <!-- Avatar -->
        <div class="flex-shrink-0">
            <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-300 shadow-md">
                <img 
                    src="{sponsor.imageLink}" 
                    alt="{sponsor.name}"
                    class="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
            <h3 class="font-sedgwick font-bold text-xl {tierConfig.text}">
                {sponsor.name}
            </h3>
            <div class="flex items-center gap-2 mt-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {tierConfig.badge} border border-yellow-400 text-gray-900 font-sedgwick">
                    {sponsor.tier} Sponsor
                </span>
                <span class="text-sm font-semibold text-gray-700 font-sedgwick">
                    {sponsor.amount} sats
                </span>
            </div>
        </div>
    </div>
</a>
