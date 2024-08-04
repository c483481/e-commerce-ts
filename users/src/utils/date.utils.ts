export function toUnixEpoch(d: Date): number {
    return Math.round(d.getTime() / 1000);
}
