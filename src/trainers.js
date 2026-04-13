export const TRAINERS = {
    andrea: {
        key: 'andrea',
        name: 'Andrea Kavuličová',
        desc: 'Špecialistka na ženské tréningy, EMS, lymfodrenáže a formovanie postavy. 40 rokov skúseností.',
        phone: '0908 093 438',
        email: 'kavulicovaandrea9@gmail.com'
    },
    david: {
        key: 'david',
        name: 'Dávid Bobb',
        desc: 'Špecialista na atletický výkon, funkčný tréning (TRX, Kettlebell, BOSU), nárast svalovej hmoty a výživu.',
        phone: '0910 454 850',
        email: ''
    },
    matus: {
        key: 'matus',
        name: 'Ing. Matúš Beraxa',
        desc: 'Špecialista na budovanie svalovej hmoty, redukciu tuku, zdravý životný štýl a výživu.',
        phone: '0902 656 593',
        email: ''
    },
    martin: {
        key: 'martin',
        name: 'Martin Hořák',
        desc: 'Špecialista na silový tréning, úľavu od bolestí chrbta a krku, korekciu sedavého štýlu života a mobilitu.',
        phone: '0911 424 504',
        email: ''
    }
};

/**
 * Deterministic trainer matcher.
 * Each answer adds weighted points to trainers whose specialization fits.
 * Highest total wins. Tie-breaker order: david > matus > martin > andrea
 * (arbitrary but stable — men pool rotates fairly before falling to Andrea).
 */
export function matchTrainer(answers) {
    const { gender, goal, experience, frequency, motivation } = answers;
    const s = { andrea: 0, david: 0, matus: 0, martin: 0 };

    // GOAL — strongest signal
    if (goal === 'Odstrániť celulitídu') {
        s.andrea += 15; // unique to female-only trainer
    }
    if (goal === 'Odstrániť bolesti chrbta') {
        s.martin += 15; // pain relief is his stated specialty
    }
    if (goal === 'Nabrať svalovú hmotu') {
        s.david += 6;
        s.matus += 6;
    }
    if (goal === 'Schudnúť a spevniť postavu') {
        if (gender === 'Žena') {
            s.andrea += 6;
        } else {
            s.david += 4;
            s.matus += 4;
        }
    }
    if (goal === 'Zlepšiť kondíciu') {
        s.david += 4;
        s.martin += 3;
        s.matus += 2;
    }

    // GENDER — women skew to Andrea (only female-specific trainer)
    if (gender === 'Žena') s.andrea += 3;

    // EXPERIENCE
    if (experience === 'Som úplný začiatočník') {
        s.martin += 3; // patient, 14-75 age range
        if (gender === 'Žena') s.andrea += 3;
    }
    if (experience === 'Cvičím občas') {
        s.matus += 3;
        s.martin += 1;
    }
    if (experience === 'Pravidelne športujem') {
        s.david += 5; // athletic/functional background
        s.matus += 1;
    }

    // FREQUENCY
    if (frequency === 'Iba raz' || frequency === 'Nie som si zatiaľ istý') {
        if (gender === 'Žena') s.andrea += 3; // EMS: 20min = 90min gym
        s.martin += 1;
    }
    if (frequency === '2-3x týždenne') {
        s.matus += 2;
        s.martin += 1;
    }
    if (frequency === '4x alebo viac') {
        s.david += 4;
        s.matus += 2;
    }

    // MOTIVATION
    if (motivation === 'Rýchle a viditeľné výsledky') {
        s.david += 3;
        s.matus += 2;
        if (gender === 'Žena') s.andrea += 2;
    }
    if (motivation === 'Dlhodobé zdravie') {
        s.martin += 4;
        s.matus += 2;
    }
    if (motivation === 'Zábava a odreagovanie') {
        s.david += 3;
        s.martin += 1;
    }

    // Pick winner. Tie-breaker: david → matus → martin → andrea
    const order = ['david', 'matus', 'martin', 'andrea'];
    let winner = order[0];
    for (const k of order) {
        if (s[k] > s[winner]) winner = k;
    }

    return { ...TRAINERS[winner], scores: s };
}
