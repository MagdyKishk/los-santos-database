export default function formatMoney(amount: number): string {
    if (amount < 1_000) return `$${amount.toFixed(0)}`;
    if (amount < 1_000_000) return `$${(amount / 1_000).toFixed(0)}K`;
    if (amount < 1_000_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
}
