// Photo feed posts.
// Photo filenames refer to /public/images/posts/{web,thumb}/<name>.jpg.
// Regenerate those outputs with `npm run optimize-photos`.
// Insertion order doesn't matter — the array is sorted newest-first on export
// by parsing the `date` field. Accepts "April 16, 2026", "March 21–25, 2026",
// "June–September 2023", "December 2024", etc.

export interface PhotoPost {
  id: string;
  title: string;
  date: string;
  location: string;
  caption: string;
  photos: string[];
}

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function parseSortDate(s: string): Date {
  const yearMatch = s.match(/\b(\d{4})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;

  const monthMatches = s.match(/January|February|March|April|May|June|July|August|September|October|November|December/gi) ?? [];
  const lastMonth = monthMatches.length > 0
    ? MONTHS[monthMatches[monthMatches.length - 1].toLowerCase()]
    : 11;

  const dayMatches = (s.match(/\b(\d{1,2})\b/g) ?? [])
    .map(n => parseInt(n, 10))
    .filter(n => n >= 1 && n <= 31);
  const lastDay = dayMatches.length > 0 ? Math.max(...dayMatches) : 28;

  return new Date(year, lastMonth, lastDay);
}

const rawPosts: PhotoPost[] = [
  {
    id: 'apr-2026-london-dinner',
    title: 'Dinner in the city',
    date: 'April 16, 2026',
    location: 'London',
    caption: 'Scallops and dry-aged steaks — felt fancy.',
    photos: ['IMG_4784', 'IMG_4782', 'IMG_4780', 'IMG_4781'],
  },
  {
    id: 'apr-2026-barbican',
    title: 'Barbican Estate',
    date: 'April 11, 2026',
    location: 'London',
    caption: 'Wandering the concrete terraces and lake fountains of the Barbican — brutalist architecture at its best.',
    photos: ['IMG_4774', 'IMG_4772', 'IMG_4765', 'IMG_4764'],
  },
  {
    id: 'apr-2026-cambridge-sky',
    title: 'Contrail sky',
    date: 'April 2, 2026',
    location: 'Cambridge',
    caption: 'Evening walk on the common — the sky decided to paint itself.',
    photos: ['IMG_4756'],
  },
  {
    id: 'mar-2026-cambridge-blossoms',
    title: 'Cherry blossom season',
    date: 'March 21–25, 2026',
    location: 'Cambridge',
    caption: 'Peak blossom week on the Selwyn/Newnham streets. Spring term in its prettiest form.',
    photos: [
      'IMG_4746', 'IMG_4743', 'IMG_4742',
      '98d8f8fb46b97db6e05707308ed36d7e',
      'eb81f845f93934351dc22ea47171cef1',
      'e653173a6f4d4fa88b0e9ea1ad768bfc',
    ],
  },
  {
    id: 'feb-2026-lunar-new-year',
    title: 'Year of the Horse',
    date: 'February 21, 2026',
    location: 'Cambridge',
    caption: 'CCS Lunar New Year — couplets and red lanterns.',
    photos: ['IMG_4724'],
  },
  {
    id: 'jan-2026-steak-night',
    title: 'Steak night',
    date: 'January 26, 2026',
    location: 'Cambridge',
    caption: 'Rare ribeye and scallops — a small celebration.',
    photos: ['IMG_4708'],
  },
  {
    id: 'christmas-2025-whytecliff',
    title: 'Christmas Day at Whytecliff',
    date: 'December 25, 2025',
    location: 'Whytecliff Park, West Vancouver',
    caption: 'Clear skies and a quiet sea — the kind of Christmas that makes you grateful you came home.',
    photos: ['IMG_4686', 'IMG_4685'],
  },
  {
    id: 'dec-2025-home',
    title: 'Home for the holidays',
    date: 'December 10–23, 2025',
    location: 'Vancouver',
    caption: 'Settling back into the North Shore — omakase night, the mountains from the deck, a slower pace.',
    photos: ['IMG_4682', 'IMG_4667'],
  },
  {
    id: 'nov-2025-cambridge-formal',
    title: 'Formal hall',
    date: 'November 24, 2025',
    location: 'Cambridge',
    caption: 'Gowns, candlelight, and an early Christmas tree in the bar afterwards.',
    photos: ['0AEEA209-A9D1-4FD7-8B61-94D026FF1D1F'],
  },
  {
    id: 'nov-2025-winter-wonderland',
    title: 'Winter Wonderland',
    date: 'November 23, 2025',
    location: 'Hyde Park, London',
    caption: 'Day trip down for Winter Wonderland — fairground rides, mulled wine, the whole thing.',
    photos: ['IMG_4649', 'IMG_4647'],
  },
  {
    id: 'oct-2025-cambridge-dinner',
    title: 'Steamed fish',
    date: 'October 24, 2025',
    location: 'Cambridge',
    caption: 'Cantonese night with the usual suspects.',
    photos: ['IMG_4621'],
  },
  {
    id: 'oct-2025-oxford',
    title: 'Oxford visit',
    date: 'October 11, 2025',
    location: 'Oxford',
    caption: "A day in the other place — Radcliffe Camera from the top of St Mary's.",
    photos: ['IMG_4604', 'IMG_4596'],
  },
  {
    id: 'sep-2025-chicago',
    title: '360 Chicago',
    date: 'September 29, 2025',
    location: 'Chicago',
    caption: 'Looking down at the Magnificent Mile and the Navy Pier from the 94th floor.',
    photos: ['IMG_4566', 'IMG_4565'],
  },
  {
    id: 'sep-2025-forest-lake',
    title: 'Mirror lake',
    date: 'September 22, 2025',
    location: 'British Columbia',
    caption: 'Somewhere on a hike — no wind, no sound, just reflection.',
    photos: ['IMG_4544'],
  },
  {
    id: 'sep-2025-st-georges',
    title: "Back at St George's",
    date: 'September 19, 2025',
    location: "St George's School, Vancouver",
    caption: 'The new academic centre that opened after I left. Felt like a completely different campus.',
    photos: ['IMG_4527', 'IMG_4526'],
  },
  {
    id: 'sep-2025-congee',
    title: 'Congee & tea',
    date: 'September 14, 2025',
    location: 'Vancouver',
    caption: 'Dim sum breakfast — nothing hits quite like it back home.',
    photos: ['IMG_4517', 'IMG_4516'],
  },
  {
    id: 'aug-2025-late-cambridge',
    title: 'End of summer',
    date: 'August 16–27, 2025',
    location: 'Cambridge',
    caption: 'The slow wind-down before Michaelmas.',
    photos: ['IMG_4436', 'IMG_4410'],
  },
  {
    id: 'aug-2025-cotswolds',
    title: 'Cotswolds wander',
    date: 'August 8–10, 2025',
    location: 'Cotswolds, UK',
    caption: 'Honey-stone villages, a willow over a stream, and the Slaughters Country Inn for lunch.',
    photos: ['IMG_4393', 'IMG_4389', 'IMG_4388', 'IMG_4385', 'IMG_4384'],
  },
  {
    id: 'aug-2025-scotland',
    title: 'Scotland road trip',
    date: 'August 1–4, 2025',
    location: 'Scottish Highlands & Isle of Skye',
    caption: 'Glenfinnan Viaduct, Kilt Rock, and more single-track roads than I could count. Probably the best week of the summer.',
    photos: [
      'IMG_4359',
      'IMG_4352', 'IMG_4338', 'IMG_4335', 'IMG_4330', 'IMG_4325', 'IMG_4319', 'IMG_4317',
      'IMG_4303',
      'e7f2578d4d52b28c1327f1521a1c8005',
      'IMG_4271',
    ],
  },
  {
    id: 'jul-2025-cambridge',
    title: 'Summer in Meta',
    date: 'July 25, 2025',
    location: 'Cambridge',
    caption: 'Empty roof gardon at Meta on a chill Friday.',
    photos: ['IMG_4244'],
  },
  {
    id: 'jun-2025-botanical',
    title: 'Botanical Garden & dinner',
    date: 'June 16, 2025',
    location: 'Cambridge',
    caption: 'An afternoon in the glasshouses followed by Ethiopian for dinner.',
    photos: ['IMG_4165', 'IMG_4161', 'IMG_4160', 'IMG_4159', 'IMG_4158'],
  },
  {
    id: 'jun-2025-doom',
    title: 'Lego Doomguy',
    date: 'June 15, 2025',
    location: 'Cambridge',
    caption: 'Found this in the wild. Had to.',
    photos: ['IMG_4155'],
  },
  {
    id: 'apr-21-2025-westlake',
    title: 'West Lake',
    date: 'April 21, 2025',
    location: 'Hangzhou',
    caption: 'A full day walking the causeways — tea houses, pagodas, weeping willows, and the rain clearing just in time.',
    photos: [
      'IMG_4097', 'IMG_4096',
      'IMG_4090',
      'IMG_4083', 'IMG_4080',
      'IMG_4073', 'IMG_4071',
      'IMG_4068', 'IMG_4060',
      'IMG_4055',
      'IMG_4028', 'IMG_4027',
    ],
  },
  {
    id: 'apr-2025-hangzhou',
    title: 'Hangzhou spring',
    date: 'April 7–13, 2025',
    location: 'Hangzhou',
    caption: 'Back in the city I grew up in — temples, the Qiantang skyline at night, and a lot of home cooking.',
    photos: [
      'IMG_3998', 'IMG_3990',
      'IMG_3984', 'IMG_3982', 'IMG_3979',
      'IMG_3952', 'IMG_3951', 'IMG_3949',
      'IMG_3927', 'IMG_3922',
      'IMG_3920',
      'IMG_3918', 'IMG_3912',
      'IMG_3897',
    ],
  },
  {
    id: 'mar-2025-bridge',
    title: 'Gaming with the boys',
    date: 'March 13–21, 2025',
    location: 'Cambridge',
    caption: 'Late-night gaming sessions in the JCR.',
    photos: ['IMG_3849', 'IMG_3827'],
  },
  {
    id: 'dec-2024-vancouver',
    title: 'Home for Christmas',
    date: 'December 2024',
    location: 'Vancouver',
    caption: 'First Christmas back after a long term. Beach walks, prime rib, and holiday lights along the sea wall.',
    photos: [
      'FullSizeRender', 'FullSizeRender2',
      'IMG_3691', 'IMG_3688', 'IMG_3687',
      'IMG_3677',
      'IMG_3669', 'IMG_3649',
      'IMG_3638',
    ],
  },
  {
    id: 'oct-2024-formal',
    title: 'First formal of term',
    date: 'October 29, 2024',
    location: 'Selwyn College, Cambridge',
    caption: "Gowns back on — dinner under the Master's portrait.",
    photos: ['IMG_3532'],
  },
  {
    id: 'sep-2024-china',
    title: 'Hangzhou & Tokyo',
    date: 'September 12–30, 2024',
    location: 'Hangzhou & Tokyo',
    caption: 'End-of-summer trip back home before Michaelmas — food, temples, a Japanese-style hotel, and some modern art on the way out.',
    photos: [
      'IMG_3500', 'IMG_3490', 'IMG_3486',
      'IMG_3474',
      'IMG_3467', 'IMG_3466',
      'IMG_3446',
    ],
  },
  {
    id: 'aug-2024-wizards',
    title: 'Wizard night',
    date: 'August 17, 2024',
    location: 'Unknown',
    caption: 'Hogwarts-themed evening. Robes came out.',
    photos: ['IMG_20240817_183546'],
  },
  {
    id: 'jun-2024-cambridge',
    title: 'Red-brick Cambridge',
    date: 'June 14, 2024',
    location: 'Cambridge',
    caption: 'Wandering past Ridley Hall and the old theological quads at the end of Easter term.',
    photos: ['IMG_3252', 'IMG_3253'],
  },
  {
    id: 'apr-2024-sea-to-sky',
    title: 'Sea-to-Sky',
    date: 'April 19, 2024',
    location: 'Squamish, British Columbia',
    caption: 'Easter break back home — gondola up over the forest, Howe Sound and the Tantalus range laid out in front.',
    photos: ['IMG_3216'],
  },
  {
    id: 'mar-2024-vancouver-beach',
    title: 'Stanley Park beach',
    date: 'March 17, 2024',
    location: 'Vancouver',
    caption: 'Driftwood, sun glare off the inlet, freighters in the distance — a quick reset after Lent term.',
    photos: ['IMG_3203'],
  },
  {
    id: 'feb-2024-digital-electronics',
    title: 'Digital electronics',
    date: 'February 27, 2024',
    location: 'Cambridge',
    caption: 'Breadboard spaghetti for the Part IB digital electronics lab. It worked, eventually.',
    photos: ['IMG_3195'],
  },
  {
    id: 'dec-2023-nhm',
    title: 'Natural History Museum',
    date: 'December 2, 2023',
    location: 'London',
    caption: 'The blue whale under Hintze Hall and the glowing earth on the way into the Red Zone.',
    photos: ['IMG_3128', 'IMG_3126'],
  },
  {
    id: 'summer-2023',
    title: 'Summer 2023',
    date: 'June–September 2023',
    location: 'Vancouver & Hangzhou',
    caption: 'The summer I graduated high school — sea urchins, long afternoons, one final run around the usual places.',
    photos: [
      'd6e83e6b7502bf7ac4fbac2358bbf895', 'IMG_3008',
      '9539086089928d7bc31a092f8222b2f3',
      'IMG_2953',
      'IMG_3026',
      'e76d990056fa1c8f81bffd397daa8f25',
    ],
  },
  {
    id: 'mar-2023-italy',
    title: 'Italy, first time',
    date: 'March 13–17, 2023',
    location: 'Italy',
    caption: 'First proper trip to Europe — fried fish, grilled chops, a fleur-de-lis in the cappuccino foam. Three of us in a six-bed hostel room.',
    photos: [
      'IMG_4496', 'IMG_4495',
      'IMG_2725', 'IMG_2754', 'IMG_2784', 'IMG_2790',
      'IMG_2738',
    ],
  },
];

export const photoPosts: PhotoPost[] = [...rawPosts].sort(
  (a, b) => parseSortDate(b.date).getTime() - parseSortDate(a.date).getTime(),
);
