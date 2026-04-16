import { matchTrainer } from './src/trainers.js';

const cases = [
    // Andrea expected: woman with cellulitis / female-specific goals
    { label: 'Žena 40+, celulitída, začiatočník, 2-3x, rýchle výsledky', a: { gender: 'Žena', goal: 'Odstrániť celulitídu', experience: 'Som úplný začiatočník', frequency: '2-3x týždenne', motivation: 'Rýchle a viditeľné výsledky' } },
    { label: 'Žena, schudnúť, začiatočník, iba raz, rýchle výsledky', a: { gender: 'Žena', goal: 'Schudnúť a spevniť postavu', experience: 'Som úplný začiatočník', frequency: 'Iba raz', motivation: 'Rýchle a viditeľné výsledky' } },

    // David expected: athletic, muscle mass, high frequency, fun
    { label: 'Muž, svalová hmota, pravidelne športujem, 4x+, rýchle výsledky', a: { gender: 'Muž', goal: 'Nabrať svalovú hmotu', experience: 'Pravidelne športujem', frequency: '4x alebo viac', motivation: 'Rýchle a viditeľné výsledky' } },
    { label: 'Muž, kondícia, pravidelne, 4x+, zábava', a: { gender: 'Muž', goal: 'Zlepšiť kondíciu', experience: 'Pravidelne športujem', frequency: '4x alebo viac', motivation: 'Zábava a odreagovanie' } },

    // Matúš expected: muscle/nutrition focus, casual exerciser, health
    { label: 'Muž, svalová hmota, občas, 2-3x, dlhodobé zdravie', a: { gender: 'Muž', goal: 'Nabrať svalovú hmotu', experience: 'Cvičím občas', frequency: '2-3x týždenne', motivation: 'Dlhodobé zdravie' } },
    { label: 'Žena, schudnúť, občas, 2-3x, zdravie', a: { gender: 'Žena', goal: 'Schudnúť a spevniť postavu', experience: 'Cvičím občas', frequency: '2-3x týždenne', motivation: 'Dlhodobé zdravie' } },

    // Martin expected: back pain, beginners, sedentary pain relief
    { label: 'Muž, bolesti chrbta, začiatočník, 2-3x, zdravie', a: { gender: 'Muž', goal: 'Odstrániť bolesti chrbta', experience: 'Som úplný začiatočník', frequency: '2-3x týždenne', motivation: 'Dlhodobé zdravie' } },
    { label: 'Žena, bolesti chrbta, občas, 2-3x, zdravie', a: { gender: 'Žena', goal: 'Odstrániť bolesti chrbta', experience: 'Cvičím občas', frequency: '2-3x týždenne', motivation: 'Dlhodobé zdravie' } },

    // Edge cases
    { label: 'Muž, kondícia, začiatočník, iba raz, zábava', a: { gender: 'Muž', goal: 'Zlepšiť kondíciu', experience: 'Som úplný začiatočník', frequency: 'Iba raz', motivation: 'Zábava a odreagovanie' } },
    { label: 'Žena, nabrať svaly, pravidelne, 4x+, rýchle výsledky', a: { gender: 'Žena', goal: 'Nabrať svalovú hmotu', experience: 'Pravidelne športujem', frequency: '4x alebo viac', motivation: 'Rýchle a viditeľné výsledky' } },
];

const distribution = { andrea: 0, david: 0, matus: 0, martin: 0 };
for (const c of cases) {
    const r = matchTrainer(c.a);
    distribution[r.key]++;
    const sStr = Object.entries(r.scores).map(([k, v]) => `${k}:${v}`).join(' ');
    console.log(`[${r.key.toUpperCase().padEnd(6)}] ${c.label}`);
    console.log(`         → ${r.name}   (${sStr})`);
}
console.log('\nDistribution:', distribution);
// Only Andrea + Dávid are active as of 2026-04-14 (other trainers no email yet).
const activeHit = distribution.andrea > 0 && distribution.david > 0;
const noInactiveWinner = distribution.matus === 0 && distribution.martin === 0;
console.log(activeHit && noInactiveWinner
    ? '✅ Active trainers (Andrea + Dávid) both picked; inactive never selected.'
    : '❌ Routing unbalanced or inactive trainer picked.');
process.exit(activeHit && noInactiveWinner ? 0 : 1);
