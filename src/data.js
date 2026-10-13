// Sample content for the prototype. In the app this comes from the API.
// Images are imported as modules. In React Native use require('./assets/...') the same way.

import photoHerbs from '../assets/img/photo_herbs.jpg';
import photoTea from '../assets/img/photo_tea.jpg';
import photoFriends from '../assets/img/photo_friends.jpg';
import photoSeedlings from '../assets/img/photo_seedlings.jpg';
import logo from '../assets/img/logo.webp';
import appIcon from '../assets/img/app_icon.png';
import intHerbs from '../assets/img/int_herbs.webp';
import intYoga from '../assets/img/int_yoga.webp';
import intFarms from '../assets/img/int_farms.webp';
import intNutrition from '../assets/img/int_nutrition.webp';
import intSoundbaths from '../assets/img/int_soundbaths.webp';
import intMarkets from '../assets/img/int_markets.webp';
import intGardening from '../assets/img/int_gardening.webp';
import intMeditation from '../assets/img/int_meditation.webp';
import conPath from '../assets/img/con_path.webp';
import conCare from '../assets/img/con_care.webp';
import conCircle from '../assets/img/con_circle.webp';
import esNoResults from '../assets/img/es_noresults.webp';
import esError from '../assets/img/es_error.webp';
import esOffline from '../assets/img/es_offline.webp';
import esSaved from '../assets/img/es_saved.webp';
// Figma: Illustration / Role. The Seeker and Practitioner art on Which one are you?
import roleSeeker from '../assets/img/role_seeker.webp';
import rolePractitioner from '../assets/img/role_practitioner.webp';
// Figma: Group art. One cover per group (Ask the Experts keeps its icon).
import grpWelcome from '../assets/img/grp_welcome.webp';
import grpHerbal from '../assets/img/grp_herbal.webp';
import grpGut from '../assets/img/grp_gut.webp';
import grpFarms from '../assets/img/grp_farms.webp';
import grpForaging from '../assets/img/grp_foraging.webp';
import grpBookclub from '../assets/img/grp_bookclub.webp';
import grpParenting from '../assets/img/grp_parenting.webp';
// Figma: Medallion art. Full color for earned, a grey copy for in progress and locked.
import artSeedling from '../assets/img/art_seedling.webp';
import artSeedlingGrey from '../assets/img/art_seedling_grey.webp';
import artSprout from '../assets/img/art_sprout.webp';
import artSproutGrey from '../assets/img/art_sprout_grey.webp';
import artRoot from '../assets/img/art_root.webp';
import artRootGrey from '../assets/img/art_root_grey.webp';
import artGrove from '../assets/img/art_grove.webp';
import artGroveGrey from '../assets/img/art_grove_grey.webp';
import artForest from '../assets/img/art_forest.webp';
import artForestGrey from '../assets/img/art_forest_grey.webp';
import artOak from '../assets/img/art_oak.webp';
import artOakGrey from '../assets/img/art_oak_grey.webp';
import artExplorer from '../assets/img/art_explorer.webp';
import artExplorerGrey from '../assets/img/art_explorer_grey.webp';
import artFarmFriend from '../assets/img/art_farmfriend.webp';
import artFarmFriendGrey from '../assets/img/art_farmfriend_grey.webp';
import artWelcomer from '../assets/img/art_welcomer.webp';
import artWelcomerGrey from '../assets/img/art_welcomer_grey.webp';
import artSteady from '../assets/img/art_steady.webp';
import artSteadyGrey from '../assets/img/art_steady_grey.webp';

export const images = {
  logo,
  appIcon,
  photos: { herbs: photoHerbs, tea: photoTea, friends: photoFriends, seedlings: photoSeedlings },
  illustrations: {
    path: conPath, care: conCare, circle: conCircle,
    noResults: esNoResults, error: esError, offline: esOffline, saved: esSaved,
  },
  roles: { seeker: roleSeeker, practitioner: rolePractitioner },
};

// Medallion art by the stage or badge's icon id, so every Medallion keeps its icon prop. Grove is both the stage and
// the membership. The Seedling badge shares the Seedling stage art.
export const MEDALLION_ART = {
  'soil-alt': { art: artSeedling, grey: artSeedlingGrey },
  leaf: { art: artSprout, grey: artSproutGrey },
  flower: { art: artRoot, grey: artRootGrey },
  tree: { art: artGrove, grey: artGroveGrey },
  'pine-tree': { art: artForest, grey: artForestGrey },
  'african-tree': { art: artOak, grey: artOakGrey },
  compass: { art: artExplorer, grey: artExplorerGrey },
  farm: { art: artFarmFriend, grey: artFarmFriendGrey },
  'user-love': { art: artWelcomer, grey: artWelcomerGrey },
  'sun-light': { art: artSteady, grey: artSteadyGrey },
};

export const INTERESTS = [
  { id: 'Herbs', art: intHerbs },
  { id: 'Yoga', art: intYoga },
  { id: 'Farms', art: intFarms },
  { id: 'Nutrition', art: intNutrition },
  { id: 'Sound baths', art: intSoundbaths },
  { id: 'Markets', art: intMarkets },
  { id: 'Gardening', art: intGardening },
  { id: 'Meditation', art: intMeditation },
];
export const interestArt = Object.fromEntries(INTERESTS.map((i) => [i.id, i.art]));

// The four broad Directory categories. IHL adds subcategories under each later.
export const CATEGORIES = ['All', 'Holistic Business', 'Food', 'Shop', 'Services'];
// Subcategories under each, 4 to 6, from the filter button next to Search on Directory. A draft until IHL sends the
// final list. Each listing has one subcategory.
export const SUBCATEGORIES = {
  'Holistic Business': [
    { id: 'Massage', icon: 'user-love' }, { id: 'Acupuncture', icon: 'healthcare' }, { id: 'Herbalism', icon: 'leaf' },
    { id: 'Nutrition', icon: 'apple-fruit' }, { id: 'Chiropractic', icon: 'walking' }, { id: 'Yoga and movement', icon: 'yoga' },
  ],
  Food: [
    { id: 'Farms', icon: 'farm' }, { id: 'Markets', icon: 'cart' }, { id: 'Bakeries and cafés', icon: 'coffee-cup' },
    { id: 'Restaurants', icon: 'cutlery' }, { id: 'Grocers', icon: 'shopping-bag' },
  ],
  Shop: [
    { id: 'Apothecary', icon: 'flask' }, { id: 'Supplements', icon: 'pharmacy-cross-tag' }, { id: 'Skin care', icon: 'soap' },
    { id: 'Teas and herbs', icon: 'leaf' },
  ],
  Services: [
    { id: 'Fitness', icon: 'gym' }, { id: 'Classes', icon: 'graduation-cap' }, { id: 'Coaching', icon: 'chat-lines' },
    { id: 'Birth and baby', icon: 'stroller' },
  ],
};
// The category a subcategory belongs to.
export const categoryOf = (sub) => Object.keys(SUBCATEGORIES).find((k) => SUBCATEGORIES[k].some((x) => x.id === sub));

// Detail rows on a listing: address + area, days + opening times, phone + "Call or text" (Figma: Listing profile).
// sponsored: a paid partner. Home shows them in the Sponsored reel, always labeled. Services are names only, no prices.
// This is the imported database IHL supplies before launch. specialties: tags from the IHL tag taxonomy (draft), what
// the place offers first, then focus areas. They show as tags under Specialties on the listing, each one opens every
// place with that tag, and search matches them. email: the business email on record for a listing nobody has claimed
// yet. Claim links go there.
// website: shows the Website button, or a Detail row when there is a booking link. No website, no button.
// booking: a booking page, which puts Book on the listing. offer: a member offer, { title, details }.
// Whether a listing is claimed lives in the store (unclaimed), so the claim flow can start before Dana claims hers.
export const LISTINGS = [
  {
    id: 'wildroot', name: 'Wildroot Herbal Co.', kind: 'Herbalist', area: 'Broad Ripple', category: 'Holistic Business', subcategory: 'Herbalism',
    distance: '2.1 mi away', hours: 'Open until 6:00 PM', days: 'Tue to Sat', time: '10:00 AM to 6:00 PM', photo: photoTea, photos: [photoTea, photoHerbs, photoSeedlings], sponsored: true,
    about: 'Sarah grows and dries most of her herbs on a small plot in Broad Ripple. She blends teas for sleep, digestion and calm, and teaches a kitchen workshop each month. Stop in on Saturdays for a free tasting.',
    services: ['Herbal consultation', 'Custom tea blend', 'Kitchen workshop'],
    specialties: ['Herbal medicine', 'Nutrition', 'Stress', 'Sleep', 'Gut health'], website: 'wildrootherbal.com',
    address: '6280 N College Ave', city: 'Broad Ripple, Indianapolis', phone: '(317) 555-0142',
  },
  {
    id: 'traders', name: 'Traders Point Creamery', kind: 'Farm', area: 'Zionsville', category: 'Food', subcategory: 'Farms',
    distance: '14 mi away', hours: 'Open until 5:00 PM', days: 'Every day', time: '9:00 AM to 5:00 PM', photo: photoFriends, photos: [photoFriends, photoSeedlings], sponsored: true,
    about: 'An organic dairy farm with grass fed cows, a farm store and a Friday market. Families come for the milk and stay for the walks around the pasture. The dairy bar serves ice cream made the same morning.',
    services: ['Farm tour', 'Friday market', 'Cheese tasting'],
    specialties: ['Dairy', 'Pasture raised', 'Organic', 'Gut health'], website: 'traderspointcreamery.com',
    address: '9101 Moore Rd', city: 'Zionsville, IN', phone: '(317) 555-0178',
  },
  {
    id: 'garfield', name: 'Garfield Park Market', kind: 'Market', area: 'South side', category: 'Food', subcategory: 'Markets',
    distance: '3.4 mi away', hours: 'Saturdays until 1:00 PM', days: 'Saturdays, May to Oct', time: '8:00 AM to 1:00 PM', photo: photoSeedlings, photos: [photoSeedlings, photoHerbs, photoTea, photoFriends], sponsored: true,
    about: 'A neighborhood market with local growers, bakers and honey makers under the trees by the conservatory. Bring a bag and come early for the tomatoes. Benches and shade make it an easy morning out.',
    services: ['Seasonal produce', 'Local honey', 'Seedlings'],
    specialties: ['Market', 'Bakery'],
    address: '2432 Conservatory Dr', city: 'Garfield Park, Indianapolis', phone: '(317) 555-0119',
  },
  {
    id: 'stillwaters', name: 'Still Waters Acupuncture', kind: 'Acupuncture', area: 'Carmel', category: 'Holistic Business', subcategory: 'Acupuncture',
    distance: '9 mi away', hours: 'Open until 7:00 PM', days: 'Tue to Sat', time: '9:00 AM to 7:00 PM', photo: photoHerbs, sponsored: true,
    about: 'Gentle acupuncture for back pain, sleep and stress, in a quiet room with warm blankets. First visits run a little longer so there is time to talk. Parking is right by the door.',
    services: ['First visit', 'Follow up', 'Cupping'],
    specialties: ['Acupuncture', 'Cupping', 'Back pain', 'Sleep', 'Stress'], website: 'stillwatersacupuncture.com',
    address: '210 W Main St', city: 'Carmel, IN', phone: '(317) 555-0164',
  },
  {
    id: 'rooted', name: 'Rooted Nutrition', kind: 'Dietitian', area: 'Fishers', category: 'Holistic Business', subcategory: 'Nutrition',
    distance: '11 mi away', hours: 'Open until 4:00 PM', days: 'Mon to Fri', time: '8:00 AM to 4:00 PM', photo: photoSeedlings,
    about: 'A registered dietitian who helps with blood sugar, heart health and simple weekly meal plans you will actually cook. Visits can be in person or by video, and a grocery walk is part of the plan.',
    services: ['First consult', 'Meal plan', 'Grocery walk'],
    specialties: ['Nutrition', 'Blood sugar', 'Heart health', 'Gut health', 'Healthy aging'], website: 'rootednutrition.com', email: 'hello@rootednutrition.com',
    address: '8900 E 116th St', city: 'Fishers, IN', phone: '(317) 555-0132',
  },
  {
    id: 'quietmind', name: 'Quiet Mind Massage', kind: 'Massage', area: 'Irvington', category: 'Holistic Business', subcategory: 'Massage',
    distance: '5 mi away', hours: 'Open until 8:00 PM', days: 'Wed to Sun', time: '11:00 AM to 8:00 PM', photo: photoFriends, photos: [photoFriends, photoHerbs, photoSeedlings],
    about: 'Relaxing and therapeutic massage with extra time for stiff shoulders and hips. Tables adjust for easy on and off, and the studio is on the ground floor with no steps.',
    services: ['60 minute massage', '90 minute massage', 'Chair massage'],
    specialties: ['Massage', 'Reflexology', 'Back pain', 'Joint pain', 'Stress'], website: 'quietmindmassage.com', email: 'dana@quietmindmassage.com',
    booking: 'quietmindmassage.com/book', offer: { title: '10% off your first massage', details: 'Mention the app when you book.' },
    address: '5625 E Washington St', city: 'Irvington, Indianapolis', phone: '(317) 555-0150',
  },
  {
    id: 'apothecary', name: 'Fountain Square Apothecary', kind: 'Shop', area: 'Fountain Square', category: 'Shop', subcategory: 'Apothecary',
    distance: '4 mi away', hours: 'Open until 6:00 PM', days: 'Tue to Sun', time: '10:00 AM to 6:00 PM', photo: photoHerbs,
    about: 'Loose teas, salves and bulk herbs, weighed out while you wait. The owner will happily explain every jar and write down how to brew it. Small tins make easy gifts.',
    services: ['Loose tea', 'Calendula salve', 'Bulk herbs'],
    specialties: ['Apothecary', 'Teas', 'Bulk herbs', 'Skin care', 'Sleep'], website: 'fsapothecary.com', email: 'shop@fsapothecary.com',
    address: '1105 Prospect St', city: 'Fountain Square, Indianapolis', phone: '(317) 555-0187',
  },
];

export const TOPICS = ['All', 'Herbs', 'Food', 'Movement', 'Mind'];

// Seekers are members. Practitioners post as their practice: a Practitioner badge sits next to the name,
// and the name or photo opens their listing instead of a member profile.
export const PEOPLE = {
  karen: { id: 'karen', name: 'Karen B.', initials: 'KB', photo: photoHerbs, area: 'Broad Ripple', since: '2025', interests: ['Herbs', 'Gardening', 'Markets'], stage: 'root', bio: 'Gardener and grandma of four. Ask me about herbs.', badges: ['seedling', 'explorer', 'farmfriend', 'welcomer'] },
  linda: { id: 'linda', name: 'Linda S.', initials: 'LS', photo: photoTea, area: 'Irvington', since: '2024', interests: ['Yoga', 'Meditation'], stage: 'forest', bio: 'Yoga three mornings a week, then coffee with friends.', badges: ['seedling', 'explorer', 'welcomer', 'steady'] },
  tom: { id: 'tom', name: 'Tom W.', initials: 'TW', photo: photoFriends, area: 'Carmel', since: '2025', interests: ['Farms', 'Markets', 'Nutrition'], stage: 'sprout', bio: 'Farmers market regular on the north side.', badges: ['seedling', 'farmfriend'] },
  mike: { id: 'mike', name: 'Mike R.', initials: 'MR', photo: photoTea, area: 'Fishers', since: '2026', interests: ['Sound baths'], stage: 'seedling', bio: 'Retired teacher, new to sound baths.', badges: ['seedling'] },
  jane: { id: 'jane', name: 'Jane M.', initials: 'JM', photo: photoSeedlings, area: 'Broad Ripple', since: '2026', interests: ['Herbs', 'Yoga', 'Gardening'] },
  // Jane's sample posts from before this session. 'jane' is whoever is signed in (a practitioner posts as the practice).
  janem: { id: 'janem', name: 'Jane M.', initials: 'JM', photo: photoSeedlings, area: 'Broad Ripple', since: '2026', interests: ['Herbs', 'Yoga', 'Gardening'], stage: 'sprout', bio: 'Retired librarian. I grow herbs and love a slow walk.', badges: ['seedling', 'farmfriend'] },
  wildroot: { id: 'wildroot', name: 'Wildroot Herbal Co.', initials: 'WH', photo: photoTea, practitioner: true, listingId: 'wildroot' },
  quietmind: { id: 'quietmind', name: 'Quiet Mind Massage', initials: 'QM', photo: photoFriends, practitioner: true, listingId: 'quietmind' },
};

// See more in a conversation loads the next replies, 5 at a time. The prototype fills them from this pool of short,
// general replies, so they sit under any post, timed between the last reply shown and now.
const MORE_REPLIES = [
  ['tom', 'Thank you for sharing this.'],
  ['mike', 'Saving this one for later.'],
  ['karen', 'Good to know. I’ll try it this week.'],
  ['linda', 'This is so helpful.'],
  ['janem', 'Same question here. Following along.'],
  ['tom', 'Love this idea.'],
  ['mike', 'I learned something new today.'],
  ['karen', 'Thanks for asking. I wondered too.'],
  ['linda', 'Great tip, thank you.'],
  ['janem', 'My neighbor does this too. She swears by it.'],
];
const toMinutes = (t) => { const m = /^(\d+)(m|h|d)$/.exec(t || ''); return m ? +m[1] * ({ m: 1, h: 60, d: 1440 })[m[2]] : 60; };
const fromMinutes = (n) => (n < 60 ? `${Math.max(1, n)}m` : n < 1440 ? `${Math.round(n / 60)}h` : `${Math.round(n / 1440)}d`);
export function moreReplies(post, count = 5) {
  const shown = post.replies.reduce((n, r) => n + 1 + (r.replies || []).length, 0);
  const left = Math.max(0, post.replyCount - shown);
  const last = post.replies.length ? post.replies[post.replies.length - 1].time : post.time;
  const span = toMinutes(last);
  const start = post.id.charCodeAt(post.id.length - 1);
  return Array.from({ length: Math.min(count, left) }, (_, k) => {
    const [author, text] = MORE_REPLIES[(start + shown + k) % MORE_REPLIES.length];
    const at = Math.round((span * (left - k)) / (left + 1));
    return { id: `${post.id}-more-${shown + k}`, author, time: fromMinutes(at), text, likes: (shown + k) % 4, liked: false, loaded: true };
  });
}

// The first three match the Community feed in Figma, in the same order.
export const POSTS = [
  {
    id: 'p1', author: 'karen', time: '2h', topic: 'Herbs', liked: true, likes: 14,
    text: 'I’ve been drying lemon balm and mint from the garden. What else belongs in a fall tea blend?',
    photos: [photoHerbs],
    replies: [
      // A practitioner reply, as in Figma: the Practitioner badge sits after the name.
      { id: 'r2', author: 'wildroot', time: '1h', text: 'Lemon verbena too. Dry the leaves whole and steep for ten minutes.', likes: 5, liked: false },
      { id: 'r1', author: 'linda', time: '45m', text: 'Rose hips and a little cinnamon. So good with honey.', likes: 3, liked: false },
    ],
    replyCount: 12,
  },
  {
    id: 'p2', author: 'linda', time: '1d', topic: 'Movement', liked: false, likes: 32,
    text: 'My physical therapist showed me this stretch for stiff knees. Two minutes, morning and night.',
    photos: [photoFriends, photoHerbs, photoSeedlings],
    replies: [{ id: 'r4', author: 'karen', time: '20h', text: 'Trying it tonight. Thank you for sharing.', likes: 2, liked: false }],
    replyCount: 21,
  },
  {
    id: 'p3', author: 'mike', time: '5h', topic: 'Food', liked: false, likes: 6,
    text: 'Which farmers markets stay open in November? Looking for one on the east side.',
    photos: [],
    replies: [{ id: 'r5', author: 'tom', time: '3h', text: 'Traders Point has a Friday market all winter. It’s north, but worth the drive.', likes: 4, liked: false }],
    replyCount: 8,
  },
  {
    id: 'p6', author: 'quietmind', time: '6h', topic: 'Movement', liked: false, likes: 27,
    text: 'A small habit for stiff shoulders: roll them back slowly ten times each time you stand up. It adds up over a day.',
    photos: [],
    replies: [{ id: 'r6', author: 'linda', time: '4h', text: 'Doing this now. Thank you!', likes: 1, liked: false }],
    replyCount: 6,
  },
  {
    id: 'p4', author: 'tom', time: '2d', topic: 'Food', liked: false, likes: 21,
    text: 'Raw honey from the Saturday market, and the seedlings are finally in. Anyone else growing tomatoes this late?',
    photos: [photoSeedlings],
    replies: [],
    replyCount: 0,
  },
  {
    id: 'p5', author: 'linda', time: '3d', topic: 'Mind', liked: false, likes: 11,
    text: 'First sound bath last night. I slept better than I have in months.',
    photos: [],
    replies: [],
    replyCount: 0,
  },
  // Ask the Experts: questions IHL approved, in the Ask the Experts group (V2). Practitioners whose specialties match
  // (asks) see them under Questions for you.
  {
    id: 'q1', author: 'tom', time: '3h', topic: 'Movement', group: 'experts', ask: true, asks: ['Massage'], liked: false, likes: 4,
    text: 'Is massage safe after a knee replacement? Mine was in June and the stiffness hasn’t let up.',
    photos: [],
    replies: [],
    replyCount: 0,
  },
  {
    id: 'q2', author: 'mike', time: '1d', topic: 'Movement', group: 'experts', ask: true, asks: ['Massage', 'Reflexology'], liked: false, likes: 9,
    text: 'What helps tight shoulders from sleeping wrong? It’s been a week and turning my head still hurts.',
    photos: [],
    replies: [{ id: 'r7', author: 'linda', time: '20h', text: 'A warm towel on my neck before bed helps me.', likes: 2, liked: false }],
    replyCount: 1,
  },
  {
    id: 'q3', author: 'janem', time: '2d', topic: 'Herbs', group: 'experts', ask: true, asks: ['Herbal medicine'], liked: false, likes: 7,
    text: 'Which herbal teas are gentle enough to drink every evening?',
    photos: [],
    replies: [
      { id: 'r8', author: 'wildroot', time: '1d', text: 'Chamomile, lemon balm and linden are gentle for most people. Start with one cup and check with your doctor if you take blood thinners.', likes: 6, liked: false,
        replies: [{ id: 'r9', author: 'janem', time: '20h', text: 'Thank you. I’ll start with lemon balm.', likes: 1, liked: false }] },
    ],
    replyCount: 2,
  },
  // Groups: forum spaces on top of the topics. Their posts live in the group, not in the main feed.
  {
    id: 'g1', author: 'karen', time: '4h', group: 'bookclub', liked: false, likes: 12,
    text: 'October pick: Braiding Sweetgrass. We meet here on Thursdays to talk about a chapter. Who’s in?',
    photos: [],
    replies: [{ id: 'r10', author: 'linda', time: '2h', text: 'I’m in. My library has two copies left.', likes: 3, liked: false }],
    replyCount: 9,
  },
  {
    id: 'g2', author: 'linda', time: '1d', group: 'bookclub', liked: true, likes: 18,
    text: 'Chapter one made me want to plant something this weekend. What stood out to you?',
    photos: [photoSeedlings],
    replies: [],
    replyCount: 6,
  },
  {
    id: 'g3', author: 'mike', time: '3h', group: 'welcome', liked: false, likes: 8,
    text: 'Hi all, Mike from Fishers. Retired teacher, new to sound baths and looking for a walking buddy.',
    photos: [],
    replies: [{ id: 'r11', author: 'karen', time: '2h', text: 'Welcome Mike! The Saturday walk at Garfield Park is a friendly bunch.', likes: 2, liked: false }],
    replyCount: 4,
  },
  {
    id: 'g4', author: 'tom', time: '5h', group: 'herbal', liked: false, likes: 15,
    text: 'Drying elderberries on screens in the garage this year. Any tips for keeping fruit flies away?',
    photos: [photoHerbs],
    replies: [],
    replyCount: 7,
  },
];

// Ask the Experts: questions a member sent. IHL reads each one first (In review), then publishes it in the
// Ask the Experts group or sends it back with a note (Needs changes).
export const MY_QUESTIONS = [
  { id: 'aq1', topic: 'Herbs', text: 'Which herbal teas are gentle enough to drink every evening?', status: 'published', postId: 'q3', when: 'Sep 30' },
  { id: 'aq2', topic: 'Herbs', text: 'Is it safe to take ashwagandha with my lisinopril?', status: 'changes', note: 'Please leave out the name of your medicine, then send it again. An expert can share general guidance.', when: 'Oct 2' },
];

// Photos offered in the Choose photos sheet (the phone's recent photos).
export const RECENT_PHOTOS = [photoFriends, photoHerbs, photoSeedlings, photoTea, photoHerbs, photoFriends, photoTea, photoHerbs, photoTea];

// Jane, the sample member: a Grove member at the Sprout stage, three weeks into her check-ins.
// weeks: the last six weeks of check-ins, this week last. badges: earned (with the day) and progress toward the rest.
export const ME = {
  name: 'Jane Miller', short: 'Jane M.', email: 'jane@example.com', dob: 'March 14, 1958',
  location: 'Broad Ripple, Indianapolis', neighborhood: 'Broad Ripple', gender: 'Woman', photo: photoSeedlings,
  bio: 'Retired librarian. I grow herbs and love a slow walk.',
  interests: ['Herbs', 'Yoga', 'Gardening'], goals: ['Better sleep', 'Joint comfort'], care: ['Myself'],
  tier: 'grove', plan: 'yearly', renews: 'October 4, 2027',
  groups: ['welcome', 'experts', 'herbal', 'bookclub'],
  stage: 'sprout', posts: 6,
  weeks: [false, false, true, true, true, false], mood: null,
  badges: { seedling: 'Sep 14', farmfriend: 'Sep 28' }, progress: { explorer: 6, welcomer: 2, steady: 3 },
};

export const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];

// Places offered in the Location sheet (the app gets these from a places API).
export const PLACES = [
  { name: 'Broad Ripple', area: 'Indianapolis' }, { name: 'Fountain Square', area: 'Indianapolis' }, { name: 'Irvington', area: 'Indianapolis' },
  { name: 'Garfield Park', area: 'Indianapolis' }, { name: 'Carmel', area: 'Indiana' }, { name: 'Fishers', area: 'Indiana' },
  { name: 'Zionsville', area: 'Indiana' }, { name: 'Noblesville', area: 'Indiana' }, { name: 'Westfield', area: 'Indiana' },
];

// Places the location field understands in the prototype.
export const KNOWN_PLACES = ['broad ripple', 'indianapolis', 'carmel', 'fishers', 'zionsville', 'irvington', 'fountain square', 'garfield park', 'noblesville', 'westfield'];

// ---------- Practitioner accounts ----------
// A practitioner account runs one listing: a practice, farm, food spot or shop.
// Type picks the Directory category. Kind is the line people see on cards ("Massage  ·  Irvington").
export const PRACTICE_TYPES = ['Practice', 'Farm', 'Food', 'Shop'];
export const TYPE_CATEGORY = { Practice: 'Holistic Business', Farm: 'Food', Food: 'Food', Shop: 'Shop' };
// Figma: the type cards on Your practice reuse the Interest card with these Interest illustrations.
export const TYPE_ART = { Practice: intMeditation, Farm: intFarms, Food: intNutrition, Shop: intMarkets };
// Practice setup runs as a stepper, one part of the listing per step. Services and Member offer are optional.
export const PRACTICE_STEPS = ['PracticeBasics', 'EditSpecialties', 'PracticePlace', 'EditPhotos', 'EditAbout', 'EditHours', 'EditContact', 'EditServices', 'EditOffer'];
// Specialties: the tags on a listing, from the IHL tag taxonomy (a draft, IHL sends the final list). What the place
// offers depends on its type. Focus areas are the same for every type. Up to 10 per listing, at least one from What
// you offer. The first pick from What you offer is the kind on cards, like Massage  ·  Irvington.
export const SPECIALTIES = {
  Practice: ['Acupuncture', 'Chiropractic', 'Counseling', 'Cupping', 'Energy work', 'Herbal medicine', 'Massage', 'Meditation', 'Naturopathy', 'Nutrition', 'Reflexology', 'Reiki', 'Sound healing', 'Yoga'],
  Farm: ['CSA', 'Dairy', 'Eggs', 'Honey', 'Meat', 'Organic', 'Pasture raised', 'Produce', 'Regenerative', 'U-pick'],
  Food: ['Bakery', 'Café', 'Grocer', 'Juice bar', 'Market', 'Meal prep', 'Restaurant'],
  Shop: ['Apothecary', 'Bulk herbs', 'Crafts', 'Skin care', 'Supplements', 'Teas'],
};
export const FOCUS_AREAS = ['Back pain', 'Blood sugar', 'Gut health', 'Healthy aging', 'Heart health', 'Joint pain', 'Menopause', 'Mobility', 'Sleep', 'Stress'];
export const MAX_SPECIALTIES = 10;
// The kind a listing shows on cards: its first pick from What you offer, or the type until there is one.
export const kindOf = (type, specialties = []) => specialties.find((s) => (SPECIALTIES[type] || []).includes(s)) || type;
export const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// Opening and closing times offered in the Hours sheet, every 30 minutes from 6:00 AM to 10:00 PM.
export const TIMES = Array.from({ length: 33 }, (_, i) => {
  const mins = 360 + i * 30;
  const h = Math.floor(mins / 60);
  return `${((h + 11) % 12) + 1}:${mins % 60 ? '30' : '00'} ${h < 12 ? 'AM' : 'PM'}`;
});
export const CLOSED_WEEK = Object.fromEntries(WEEK.map((d) => [d, null]));
// How long a feature on Home runs. The IHL team emails to set it up. No prices or payment in the app.
export const FEATURE_LENGTHS = ['1 month', '3 months', '6 months'];

// The sample practitioner: Quiet Mind Massage in Irvington (owner Dana). Claimed and live in the Directory.
// promos: the days this practice shared a promotion (1 a day, 3 in any 7 days).
export const SAMPLE_PRACTICE = {
  listingId: 'quietmind', name: 'Quiet Mind Massage', type: 'Practice', specialties: ['Massage', 'Reflexology', 'Back pain', 'Joint pain', 'Stress'],
  email: 'dana@quietmindmassage.com',
  address: '5625 E Washington St', city: 'Irvington, Indianapolis',
  phone: '(317) 555-0150', website: 'quietmindmassage.com', booking: 'quietmindmassage.com/book',
  offer: { title: '10% off your first massage', details: 'Mention the app when you book.' },
  promos: ['2026-10-01'],
  photos: [photoFriends, photoHerbs, photoSeedlings],
  about: 'Relaxing and therapeutic massage with extra time for stiff shoulders and hips. Tables adjust for easy on and off, and the studio is on the ground floor with no steps.',
  hours: { Monday: null, Tuesday: null, Wednesday: ['11:00 AM', '8:00 PM'], Thursday: ['11:00 AM', '8:00 PM'], Friday: ['11:00 AM', '8:00 PM'], Saturday: ['11:00 AM', '8:00 PM'], Sunday: ['11:00 AM', '8:00 PM'] },
  services: ['60 minute massage', '90 minute massage', 'Chair massage'],
  status: 'live', feature: null,
  stats: { views: 248, saves: 31, directions: 17 },
};

// What a new practitioner has right after Your practice and Where people find you.
// Hours start unset: each day reads Add until it is set to opening times or Closed.
export const NEW_PRACTICE = {
  ...SAMPLE_PRACTICE, specialties: [], phone: '', website: '', booking: '', offer: null, promos: [], photos: [], about: '', hours: {}, services: [],
  status: 'draft', stats: { views: 0, saves: 0, directions: 0 },
};

// Today in the prototype, in Indiana time (America/Indiana/Indianapolis). The app uses the phone's clock.
export const TODAY = '2026-10-04';

// The liability waiver everyone accepts before the account is made (scroll to the end, then I agree).
// Plain language draft. IHL's lawyer supplies the final text. Keep the version with the account.
export const WAIVER = {
  version: '2026-10',
  title: 'Before you join',
  intro: 'Please read to the end. Agreeing is part of creating your account.',
  agreed: 'You agreed to this when you made your account.',
  sections: [
    ['We’re a directory', 'Indy Holistic Living helps you find local practitioners, farms and shops, and talk with neighbors. We don’t provide medical care.'],
    ['Not medical advice', 'Listings, posts and expert answers are general information. They don’t replace your doctor. Talk with your doctor before you start or stop any treatment.'],
    ['Your care, your choice', 'Practitioners and businesses in the app are independent. They don’t work for Indy Holistic Living. You choose who you see, and your care is between you and them.'],
    ['Our responsibility', 'Indy Holistic Living isn’t liable for care, products or services you get from anyone listed in the app, or for what members post.'],
    ['In an emergency', 'Call 911. The app isn’t for urgent help.'],
  ],
  outro: 'By tapping I agree, you accept this waiver as part of our Terms of Use.',
};

// ---------- Groups ----------
// Forum spaces on top of the topics. A Seedling joins up to 3 and posts in them. Grove opens every group.
// art: the group's cover from Figma (Group art). Ask the Experts shows its icon on bg/color-info-subtle instead.
export const FREE_GROUPS = 3;
export const GROUPS = [
  { id: 'welcome', name: 'Welcome Circle', art: grpWelcome, members: 412, fresh: 5, about: 'Say hello, meet new members and find your way around.' },
  { id: 'experts', name: 'Ask the Experts', icon: 'chat-bubble-question', members: 1096, fresh: 2, about: 'Wellness questions from members, answered by verified local practitioners.' },
  { id: 'herbal', name: 'Herbal Medicine', art: grpHerbal, members: 687, fresh: 3, about: 'Growing, drying and brewing herbs at home.' },
  { id: 'gut', name: 'Gut Health and Nutrition', art: grpGut, members: 534, fresh: 0, about: 'Simple meals and habits that help digestion.' },
  { id: 'farms', name: 'Local Farms', art: grpFarms, members: 498, fresh: 1, about: 'Farm stands, CSAs and markets around Indiana.' },
  { id: 'foraging', name: 'Foraging', art: grpForaging, members: 221, fresh: 0, about: 'What’s in season on Indiana trails, and how to pick it safely.' },
  { id: 'bookclub', name: 'Book Club', art: grpBookclub, members: 156, fresh: 4, about: 'One book a month about nature and food.' },
  { id: 'parenting', name: 'Natural Parenting', art: grpParenting, members: 302, fresh: 0, about: 'Raising kids and grandkids close to nature.' },
];
export const groupById = Object.fromEntries(GROUPS.map((g) => [g.id, g]));
// Groups we suggest from the quiz: what a member wants help with, what they're into and who they care for.
// Every new member is pointed to the Welcome Circle first.
export const GROUP_HINTS = {
  'Better sleep': ['herbal'], 'Less stress': ['bookclub', 'herbal'], 'Easier digestion': ['gut'], 'Joint comfort': ['experts'],
  'More energy': ['gut'], 'Healthy aging': ['experts'], 'Eating local': ['farms'], 'Meeting people': ['welcome', 'bookclub'],
  Herbs: ['herbal'], Farms: ['farms'], Markets: ['farms'], Nutrition: ['gut'], Gardening: ['foraging'], Meditation: ['bookclub'],
  'Kids or grandkids': ['parenting'], 'An aging parent': ['experts'],
};

// ---------- Grove membership ----------
// Prices come from the App Store (StoreKit) in the app. These are the brief's.
export const PLANS = [
  { id: 'yearly', label: 'Yearly', price: '$89.00', per: 'year', note: '$7.42 a month', save: 'Save 33%' },
  { id: 'monthly', label: 'Monthly', price: '$11.11', per: 'month', note: 'Cancel anytime' },
];
export const GROVE_PERKS = [
  { id: 'groups', icon: 'community', title: 'Every group', text: 'Join and post in all of them, not just 3.' },
  { id: 'experts', icon: 'chat-bubble-question', title: 'Ask the Experts', text: 'Verified local practitioners answer.' },
  { id: 'offers', icon: 'gift', title: 'Member offers', text: 'Thank you offers from local businesses.' },
];

// ---------- Your journey ----------
// Stages and badges from the brief. Events are not in the MVP, so Sprout asks for a local visit instead.
// A visit is I was here on a listing. unit: what the progress counts, as in "6 of 10 places".
export const STAGES = [
  { id: 'seedling', name: 'Seedling', icon: 'soil-alt', steps: ['Make your account'] },
  { id: 'sprout', name: 'Sprout', icon: 'leaf', steps: ['Add a short bio', 'Reply to a post', 'Visit a local place'] },
  { id: 'root', name: 'Root', icon: 'flower', steps: ['Check in 4 weeks in a row', 'Share 10 posts'] },
  { id: 'grove', name: 'Grove', icon: 'tree', steps: ['Join Grove', 'Post in all 4 topics'] },
  { id: 'forest', name: 'Forest', icon: 'pine-tree', steps: ['Check in 12 weeks in a row', 'Share 25 posts'] },
  { id: 'oak', name: 'Oak', icon: 'african-tree', steps: ['Take part for a year'] },
];
export const BADGES = [
  { id: 'seedling', name: 'Seedling', icon: 'soil-alt', how: 'Make your account.' },
  { id: 'explorer', name: 'Explorer', icon: 'compass', how: 'Visit 10 places in the Directory.', goal: 10, unit: 'places' },
  { id: 'farmfriend', name: 'Farm Friend', icon: 'farm', how: 'Visit 3 local farms or markets.', goal: 3, unit: 'farms' },
  { id: 'welcomer', name: 'Welcomer', icon: 'user-love', how: 'Greet 5 new members in the Welcome Circle.', goal: 5, unit: 'members' },
  { id: 'steady', name: 'Steady', icon: 'sun-light', how: 'Check in 4 weeks in a row.', goal: 4, unit: 'weeks' },
];

// Weekly check-in moods. Once a week is enough, there is no daily streak.
export const MOODS = [
  { id: 'great', label: 'Great', icon: 'emoji-talking-happy' },
  { id: 'good', label: 'Good', icon: 'emoji' },
  { id: 'okay', label: 'Okay', icon: 'emoji-quite' },
  { id: 'hard', label: 'Hard', icon: 'emoji-sad' },
];

// Onboarding quiz: three questions that set the Home feed and suggest groups.
// Each answer is a tile with an Iconoir glyph, two to a row. Answers are kept with the member and never shown to others.
export const QUIZ_GOALS = [
  { id: 'Better sleep', icon: 'half-moon' }, { id: 'Less stress', icon: 'yoga' },
  { id: 'Easier digestion', icon: 'apple-fruit' }, { id: 'Joint comfort', icon: 'walking' },
  { id: 'More energy', icon: 'flash' }, { id: 'Healthy aging', icon: 'heart' },
  { id: 'Eating local', icon: 'farm' }, { id: 'Meeting people', icon: 'community' },
];
export const QUIZ_CARE = [
  { id: 'Myself', icon: 'user' }, { id: 'My partner', icon: 'user-love' },
  { id: 'Kids or grandkids', icon: 'group' }, { id: 'An aging parent', icon: 'home-user' },
];
