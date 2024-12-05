export function ordinalSuffixOf(i: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = i % 100;
    return i + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}