
import { getZodiacSign } from "./lib/soul-math";

console.log("Testing Dec 16 (Month 12):");
const sign = getZodiacSign(16, 12);
console.log(`Input: Day 16, Month 12 -> Sign: ${sign}`);

console.log("Testing Jan 16 (Month 1):");
console.log(`Input: Day 16, Month 1 -> Sign: ${getZodiacSign(16, 1)}`);

console.log("Testing Dec 25 (Month 12):");
console.log(`Input: Day 25, Month 12 -> Sign: ${getZodiacSign(25, 12)}`);
