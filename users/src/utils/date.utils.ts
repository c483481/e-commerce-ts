export function toUnixEpoch(d: Date): number {
    return Math.round(d.getTime() / 1000);
}

export function isValidDate(year: number, month: number, date: number): boolean {
    const d = new Date(year, month - 1, date);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === date;
}
