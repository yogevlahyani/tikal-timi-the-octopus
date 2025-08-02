export function isOrangish(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return (
        r > 200 &&
        g >= 100 && g <= 180 &&
        b < 100 &&
        r > g &&
        g > b
    );
}