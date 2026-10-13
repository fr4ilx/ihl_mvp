// "Jump to" list in the control panel. Each item sets up the navigation stack and the scenario.
//   network / content: the panel values this state needs (the panel switches to them).
//   seed: sample data the app starts with for this item, for example which places are saved.
//   Route params like email, name, draft, denied, emailError, showAlert, autoSubmit, autoSend, autoPost, validate, picks,
//   expanded, scrollTo, openMaps, openShare, confirmDelete, openTopics, showWaiver, waiverRead, promo, query, openCheckIn, mood,
//   autoCheckIn, autoVisit, confirmLeave, replyTo, showStore, welcome and open only exist for the panel.
//   In the app every form opens empty.
//   v: 2 marks an item that only exists in V2 (the seeker round). v1: { label, nav } is how an item reads and opens
//   in V1, when it differs.
import { mk, tabRoots } from '../app/nav';
import { images, POSTS, SAMPLE_PRACTICE, NEW_PRACTICE, PRACTICE_STEPS, MY_QUESTIONS } from '../data';

const auth = (...routes) => ({ root: 'auth', auth: routes.map(([n, p]) => mk(n, p)) });
const tab = (t, ...routes) => ({ root: 'main', tab: t, tabs: { [t]: routes.map(([n, p]) => mk(n, p)) } });
const DRAFT = 'Gentle stretches for stiff knees? Any stretches or classes you’d suggest? My knees don’t love the floor poses.';
const REPLY_DRAFT = 'Chamomile and a little lavender helps me sleep.';
const P = images.photos;
const SAVED_ALL = ['wildroot', 'traders', 'stillwaters']; // after Wildroot is saved, like Figma
const JANE_EMAIL = 'jane@example.com';
const ABOUT = { name: 'Jane Miller', dob: 'March 14, 1958', gender: 'Woman' }; // About you filled in, like Figma
const NEW_MEMBER = { me: { photo: null, location: '' } }; // no photo and no location yet
const SEEKER = ['AccountType', { pick: 'seeker' }];
const PRACTITIONER = ['AccountType', { pick: 'practitioner' }];
// Practitioner seeds: Dana runs Quiet Mind Massage. A draft has only the name, type and address from onboarding.
const DANA = { role: 'practitioner', email: SAMPLE_PRACTICE.email };
const AS = (practice) => ({ me: DANA, practice });
const READY = AS({ ...SAMPLE_PRACTICE, status: 'draft' });
const LIVE = AS(SAMPLE_PRACTICE);
const REQUESTED = AS({ ...SAMPLE_PRACTICE, feature: { status: 'requested', length: '3 months' } });
const FEATURED = AS({ ...SAMPLE_PRACTICE, feature: { status: 'live', length: '3 months', until: 'January 3, 2027' } });
const BASICS = { name: 'Quiet Mind Massage', type: 'Practice' };
const PLACE = { address: '5625 E Washington St', city: 'Irvington, Indianapolis' };
const PRACTICE_POST = 'Tight shoulders after yard work? Roll them back slowly ten times, then rest your hands on your belly and breathe out long.';
const PROMO_POST = 'This week only: 15 minutes of reflexology added to any massage, on us. Book online or give us a call.';
const ANSWER = 'Most people can have gentle massage once the incision has healed, often around 6 to 8 weeks. Check with your surgeon first, and tell your therapist about the knee so they stay clear of it.';
// Practice setup: what each step fills in, in step order. upTo(n) is the practice when step n opens.
const STEP_FIELDS = [BASICS, { specialties: SAMPLE_PRACTICE.specialties }, PLACE, { photos: SAMPLE_PRACTICE.photos }, { about: SAMPLE_PRACTICE.about }, { hours: SAMPLE_PRACTICE.hours }, { phone: SAMPLE_PRACTICE.phone, website: SAMPLE_PRACTICE.website, booking: SAMPLE_PRACTICE.booking }, { services: SAMPLE_PRACTICE.services }, { offer: SAMPLE_PRACTICE.offer }];
const upTo = (n) => AS(Object.assign({ ...NEW_PRACTICE }, ...STEP_FIELDS.slice(0, n - 1)));
const SETUP = { setup: 'signup' };
const FULL_PICKS = ['Massage', 'Reflexology', 'Cupping', 'Back pain', 'Joint pain', 'Mobility', 'Sleep', 'Stress', 'Healthy aging', 'Menopause'];
// A brand new account, before Dana claims Quiet Mind Massage.
const NEW_ACCOUNT = { me: DANA, unclaimed: ['rooted', 'quietmind', 'apothecary'] };
const FIND = ['FindListing'];
// The sign up stack up to step n, with params for the step on screen. A new listing starts from Find your business.
const step = (n, params = {}) => auth(['Welcome'], ['SignUp'], PRACTITIONER, FIND, ...PRACTICE_STEPS.slice(0, n - 1).map((s) => [s, SETUP]), [PRACTICE_STEPS[n - 1], { ...SETUP, ...params }]);
const SIGNUP_FILLED = { email: JANE_EMAIL, password: 'Sunrise2026', confirm: 'Sunrise2026' };
const HALF_WEEK = { Monday: null, Tuesday: null, Wednesday: ['11:00 AM', '8:00 PM'] }; // Hours sheet over a week still being set
// Seeker round. Jane is a Grove member at Sprout by default. As a Seedling she has the free membership: 3 groups at most.
const SEEDLING = { me: { tier: 'seedling', plan: null, renews: null, groups: ['welcome', 'herbal', 'bookclub'] } };
const SEEDLING_TWO = { me: { tier: 'seedling', plan: null, renews: null, groups: ['welcome', 'bookclub'] } };
// A member who joined this week: Seedling stage, a bio and a reply already, so one visit finishes Sprout.
const FRESH = { me: { tier: 'seedling', plan: null, renews: null, groups: ['welcome'], stage: 'seedling', replied: true, visited: [], posts: 1, weeks: [false, false, false, false, false, true], badges: { seedling: 'Oct 1' }, progress: { explorer: 0 }, quest: {} } };
// Right after sign up: the quiz answers, no groups, no check-ins yet.
const NEW_SEEKER = { me: { tier: 'seedling', plan: null, renews: null, groups: [], stage: 'seedling', bio: '', replied: false, visited: [], posts: 0, goals: ['Better sleep', 'Meeting people'], interests: ['Herbs', 'Gardening'], care: ['Myself', 'Kids or grandkids'], weeks: [false, false, false, false, false, false], badges: { seedling: 'Today' }, progress: {}, quest: {} } };
const CHECKED = { me: { weeks: [false, false, true, true, true, true], mood: 'good', progress: { explorer: 6, welcomer: 2, steady: 4 }, badges: { seedling: 'Sep 14', farmfriend: 'Sep 28', steady: 'Oct 4' } } };
const QUIZ_STACK = [['Welcome'], ['SignUp'], SEEKER, ['AboutYou', { ...ABOUT, location: 'Broad Ripple, Indianapolis' }]];
const GOALS = ['Better sleep', 'Joint comfort', 'Meeting people'];
const QUESTION = 'What helps with stiff hands in the morning? Mine ache until about ten.';
const GROUP_POST = 'Finished chapter two on the porch this morning. The part about gifts stayed with me all day.';
const SUB_REPLY = 'Would linden help with sleep too?';
const SENT = { questions: [{ id: 'aq3', topic: 'Movement', text: QUESTION, status: 'review', when: 'Today' }, ...MY_QUESTIONS] };
const modal = (base, name, params) => ({ ...base, modal: mk(name, params) });

export const FLOWS = [
  {
    flow: 'Authentication',
    items: [
      { id: 'welcome', label: 'Welcome', nav: auth(['Welcome']) },
      { id: 'apple-sheet', label: 'Sign in with Apple', state: true, nav: auth(['Welcome', { showApple: true }]) },
      { id: 'signup', label: 'Sign up', nav: auth(['Welcome'], ['SignUp', SIGNUP_FILLED]) },
      { id: 'signup-empty', label: 'Sign up, empty', state: true, nav: auth(['Welcome'], ['SignUp']) },
      { id: 'signup-errors', label: 'Sign up, errors', state: true, nav: auth(['Welcome'], ['SignUp', { validate: true }]) },
      { id: 'signup-bad-email', label: 'Email not valid', state: true, nav: auth(['Welcome'], ['SignUp', { email: 'jane@example', emailError: true }]) },
      { id: 'signup-mismatch', label: 'Passwords don’t match', state: true, nav: auth(['Welcome'], ['SignUp', { email: JANE_EMAIL, password: 'Sunrise2026', confirm: 'Sunrise2025', showMismatch: true }]) },
      { id: 'waiver', label: 'Liability waiver', nav: auth(['Welcome'], ['SignUp', { ...SIGNUP_FILLED, showWaiver: true }]) },
      { id: 'waiver-read', label: 'Waiver read to the end', state: true, nav: auth(['Welcome'], ['SignUp', { ...SIGNUP_FILLED, showWaiver: true, waiverRead: true }]) },
      { id: 'waiver-early', label: 'I agree before the end', state: true, nav: auth(['Welcome'], ['SignUp', { ...SIGNUP_FILLED, showWaiver: true, waiverEarly: true }]) },
      { id: 'terms', label: 'Terms of Use', nav: auth(['Welcome'], ['SignUp'], ['TermsOfUse']) },
      { id: 'privacy', label: 'Privacy Policy', nav: auth(['Welcome'], ['SignUp'], ['PrivacyPolicy']) },
      { id: 'login', label: 'Log in', nav: auth(['Welcome'], ['LogIn', { email: JANE_EMAIL, password: 'Sunrise2026' }]) },
      { id: 'login-empty', label: 'Log in, empty', state: true, nav: auth(['Welcome'], ['LogIn']) },
      { id: 'login-wrong', label: 'Wrong password', state: true, nav: auth(['Welcome'], ['LogIn', { email: JANE_EMAIL, password: 'sunrise', autoSubmit: true }]) },
      { id: 'forgot', label: 'Forgot password', nav: auth(['Welcome'], ['LogIn'], ['ForgotPassword']) },
      { id: 'account-type', label: 'Which one are you?', nav: auth(['Welcome'], ['SignUp'], SEEKER) },
      { id: 'account-type-empty', label: 'Nothing picked yet', state: true, nav: auth(['Welcome'], ['SignUp'], ['AccountType']) },
      { id: 'account-type-error', label: 'Nothing picked, error', state: true, nav: auth(['Welcome'], ['SignUp'], ['AccountType', { validate: true }]) },
      { id: 'about', label: 'About you', nav: auth(['Welcome'], ['SignUp'], SEEKER, ['AboutYou', { ...ABOUT, location: 'Broad Ripple, Indianapolis' }]) },
      { id: 'about-empty', label: 'About you, empty', state: true, nav: auth(['Welcome'], ['SignUp'], SEEKER, ['AboutYou']) },
      { id: 'about-errors', label: 'About you, errors', state: true, nav: auth(['Welcome'], ['SignUp'], SEEKER, ['AboutYou', { validate: true }]) },
      { id: 'about-date', label: 'Date of birth sheet', state: true, nav: auth(['Welcome'], ['SignUp'], SEEKER, ['AboutYou', { name: 'Jane Miller', openDate: true }]) },
      { id: 'about-alert', label: 'Location permission', state: true, nav: auth(['Welcome'], ['SignUp'], SEEKER, ['AboutYou', { ...ABOUT, showAlert: true }]) },
      { id: 'about-denied', label: 'Location not allowed', state: true, nav: auth(['Welcome'], ['SignUp'], SEEKER, ['AboutYou', { ...ABOUT, denied: true }]) },
      { id: 'quiz-goals', v: 2, label: 'Question 1, help with', nav: auth(...QUIZ_STACK, ['QuizGoals', { picked: GOALS }]) },
      { id: 'quiz-goals-empty', v: 2, label: 'Nothing picked', state: true, nav: auth(...QUIZ_STACK, ['QuizGoals']) },
      { id: 'quiz-goals-error', v: 2, label: 'Nothing picked, error', state: true, nav: auth(...QUIZ_STACK, ['QuizGoals', { validate: true }]) },
      { id: 'interests', label: 'Question 2, interests', v1: { label: 'Interests', nav: auth(...QUIZ_STACK, ['Interests', { picked: ['Herbs', 'Yoga', 'Gardening'] }]) }, nav: auth(...QUIZ_STACK, ['QuizGoals', { picked: GOALS }], ['Interests', { picked: ['Herbs', 'Yoga', 'Gardening'] }]) },
      { id: 'interests-empty', label: 'Nothing picked', state: true, v1: { nav: auth(...QUIZ_STACK, ['Interests']) }, nav: auth(...QUIZ_STACK, ['QuizGoals', { picked: GOALS }], ['Interests']) },
      { id: 'interests-error', label: 'Nothing picked, error', state: true, v1: { nav: auth(...QUIZ_STACK, ['Interests', { validate: true }]) }, nav: auth(...QUIZ_STACK, ['QuizGoals', { picked: GOALS }], ['Interests', { validate: true }]) },
      { id: 'quiz-care', v: 2, label: 'Question 3, care for', nav: auth(...QUIZ_STACK, ['QuizGoals', { picked: GOALS }], ['Interests', { picked: ['Herbs'] }], ['QuizCare', { picked: ['Myself', 'An aging parent'] }]) },
      { id: 'quiz-care-empty', v: 2, label: 'Nothing picked', state: true, nav: auth(...QUIZ_STACK, ['QuizGoals', { picked: GOALS }], ['Interests', { picked: ['Herbs'] }], ['QuizCare']) },
      { id: 'seedling-award', v: 2, label: 'You’re a Seedling', nav: auth(...QUIZ_STACK, ['QuizGoals', { picked: GOALS }], ['Interests', { picked: ['Herbs'] }], ['QuizCare', { picked: ['Myself'] }], ['SeedlingAward']) },
      { id: 'preparing', label: 'Preparing', v1: { nav: auth(...QUIZ_STACK, ['Interests'], ['Preparing']) }, nav: auth(...QUIZ_STACK, ['QuizGoals'], ['Interests'], ['QuizCare'], ['SeedlingAward'], ['Preparing']) },
    ],
  },
  {
    flow: 'Home',
    items: [
      { id: 'home', label: 'Home', nav: tab('home', ['Home']) },
      { id: 'home-loading', label: 'Loading', state: true, network: 'slow', nav: tab('home', ['Home']) },
      { id: 'home-offline', label: 'Offline', state: true, network: 'offline', nav: tab('home', ['Home']) },
      { id: 'home-empty', label: 'Nothing here yet', state: true, content: 'empty', nav: tab('home', ['Home']) },
      { id: 'home-search', label: 'Search results', state: true, nav: tab('home', ['Home', { query: 'herb' }]) },
      { id: 'home-no-results', label: 'No results', state: true, nav: tab('home', ['Home', { query: 'Reiki' }]) },
      { id: 'home-week', v: 2, label: 'Weekly check-in', nav: tab('home', ['Home', { scrollTo: 'home-week' }]) },
      { id: 'home-new', v: 2, label: 'New member', state: true, seed: NEW_SEEKER, nav: tab('home', ['Home', { scrollTo: 'home-week' }]) },
      { id: 'home-checkin', v: 2, label: 'How was your week?', state: true, nav: tab('home', ['Home', { scrollTo: 'home-week', openCheckIn: true, mood: 'good' }]) },
      { id: 'home-checked', v: 2, label: 'Checked in', state: true, seed: CHECKED, nav: tab('home', ['Home', { scrollTo: 'home-week' }]) },
      { id: 'home-steady', v: 2, label: 'Steady earned', state: true, nav: tab('home', ['Home', { scrollTo: 'home-week', autoCheckIn: 'good' }]) },
    ],
  },
  {
    flow: 'Directory',
    items: [
      { id: 'directory', label: 'Directory', nav: tab('directory', ['Directory']) },
      { id: 'directory-loading', label: 'Loading', state: true, network: 'slow', nav: tab('directory', ['Directory']) },
      { id: 'directory-offline', label: 'Offline', state: true, network: 'offline', nav: tab('directory', ['Directory']) },
      { id: 'directory-empty', label: 'No places yet', state: true, content: 'empty', nav: tab('directory', ['Directory']) },
      { id: 'city-sheet', label: 'Show places in', state: true, nav: tab('directory', ['Directory', { openCity: true }]) },
      { id: 'city-near-me', label: 'Near me', state: true, nav: tab('directory', ['Directory', { city: 'Near me' }]) },
      { id: 'radius', label: 'Within 5 mi', state: true, nav: tab('directory', ['Directory', { city: 'Near me', radius: 5 }]) },
      { id: 'city-empty', label: 'No places in a city', state: true, nav: tab('directory', ['Directory', { city: 'Fort Wayne' }]) },
      { id: 'holistic', label: 'Holistic Business', nav: tab('directory', ['Directory'], ['CategoryResults', { category: 'Holistic Business' }]) },
      { id: 'category-sub', label: 'Massage', nav: tab('directory', ['Directory'], ['CategoryResults', { category: 'Holistic Business' }], ['SubcategoryResults', { category: 'Holistic Business', subcategory: 'Massage', city: 'Near me' }]) },
      { id: 'category-sub-empty', label: 'Nothing in a subcategory', state: true, nav: tab('directory', ['Directory'], ['CategoryResults', { category: 'Food' }], ['SubcategoryResults', { category: 'Food', subcategory: 'Restaurants' }]) },
      { id: 'services-empty', label: 'Services, none yet', state: true, nav: tab('directory', ['Directory'], ['CategoryResults', { category: 'Services' }]) },
      { id: 'search-results', label: 'Search results', state: true, nav: tab('directory', ['Directory', { query: 'herb' }]) },
      { id: 'no-listings', label: 'No listings', state: true, nav: tab('directory', ['Directory', { query: 'Reiki' }]) },
      { id: 'listing', label: 'Listing profile', nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'wildroot' }]) },
      { id: 'listing-specialties', label: 'Specialties', state: true, nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'wildroot', scrollTo: 'listing-specialties' }]) },
      { id: 'tag-results', label: 'Tag results', nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'wildroot', scrollTo: 'listing-specialties' }], ['TagResults', { tag: 'Stress' }]) },
      { id: 'listing-share', label: 'Share', state: true, nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'wildroot', openShare: true }]) },
      { id: 'listing-more', label: 'Show more', state: true, seed: { saved: SAVED_ALL }, nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'wildroot', expanded: true, scrollTo: 'listing-about-section' }]) },
      { id: 'listing-visited', v: 2, label: 'You’ve been here', state: true, seed: { me: { visited: ['wildroot'] } }, nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'wildroot' }]) },
      { id: 'listing-sprout', v: 2, label: 'I was here, Sprout reached', state: true, seed: FRESH, nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'traders', autoVisit: true }]) },
      { id: 'listing-booking', label: 'With a booking link', state: true, nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'quietmind' }]) },
      { id: 'listing-offer-locked', v: 2, label: 'Member offer, Seedling', state: true, seed: SEEDLING, nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'quietmind', scrollTo: 'listing-offer' }]) },
      { id: 'listing-no-website', label: 'No website', state: true, nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'garfield' }]) },
      { id: 'get-directions', label: 'Get directions', state: true, nav: tab('directory', ['Directory'], ['ListingProfile', { id: 'wildroot', scrollTo: 'listing-location', openMaps: true }]) },
      { id: 'saved', label: 'Saved', seed: { saved: SAVED_ALL }, nav: tab('directory', ['Directory'], ['Saved']) },
      { id: 'saved-loading', label: 'Saved loading', state: true, network: 'slow', seed: { saved: SAVED_ALL }, nav: tab('directory', ['Directory'], ['Saved']) },
      { id: 'saved-offline', label: 'Saved offline', state: true, network: 'offline', seed: { saved: SAVED_ALL }, nav: tab('directory', ['Directory'], ['Saved']) },
      { id: 'nothing-saved', label: 'Nothing saved', state: true, content: 'empty', nav: tab('directory', ['Directory'], ['Saved']) },
    ],
  },
  {
    flow: 'Community',
    items: [
      { id: 'community', label: 'Community', nav: tab('community', ['Community']) },
      { id: 'feed-loading', label: 'Feed loading', state: true, network: 'slow', nav: tab('community', ['Community']) },
      { id: 'feed-error', label: 'Couldn’t load', state: true, network: 'offline', nav: tab('community', ['Community']) },
      { id: 'no-posts', label: 'No posts yet', state: true, content: 'empty', nav: tab('community', ['Community']) },
      { id: 'topics-sheet', label: 'Topics', state: true, nav: tab('community', ['Community', { openTopics: true }]) },
      { id: 'topic-picked', label: 'Topic picked', state: true, nav: tab('community', ['Community', { topic: 'Food' }]) },
      { id: 'topic-empty', label: 'No posts in a topic', state: true, seed: { withoutTopic: 'Mind' }, nav: tab('community', ['Community', { topic: 'Mind' }]) },
      { id: 'feed-search', label: 'Search results', state: true, nav: tab('community', ['Community', { query: 'market' }]) },
      { id: 'feed-no-results', label: 'No results', state: true, nav: tab('community', ['Community', { query: 'Reiki' }]) },
      { id: 'post-options', label: 'Post options', state: true, nav: tab('community', ['Community', { options: 'p1' }]) },
      { id: 'block-alert', label: 'Block Karen B.', state: true, nav: tab('community', ['Community', { block: 'p1' }]) },
      { id: 'conversation', label: 'Conversation', nav: tab('community', ['Community'], ['Conversation', { postId: 'p1' }]) },
      { id: 'practitioner-post', label: 'Practitioner post', nav: tab('community', ['Community'], ['Conversation', { postId: 'p6' }]) },
      { id: 'no-replies', label: 'No replies yet', state: true, content: 'empty', nav: tab('community', ['Community'], ['Conversation', { postId: 'p1' }]) },
      { id: 'couldnt-send', label: 'Couldn’t send', state: true, network: 'offline', nav: tab('community', ['Community'], ['Conversation', { postId: 'p1', draft: REPLY_DRAFT, autoSend: true }]) },
      { id: 'member', label: 'Member profile', nav: tab('community', ['Community'], ['MemberProfile', { personId: 'karen' }]) },
      { id: 'member-empty', label: 'Member, no posts', state: true, content: 'empty', nav: tab('community', ['Community'], ['MemberProfile', { personId: 'karen' }]) },
      { id: 'newpost', label: 'New post', nav: { ...tab('community', ['Community']), modal: mk('NewPost') } },
      { id: 'newpost-errors', label: 'New post, errors', state: true, nav: { ...tab('community', ['Community']), modal: mk('NewPost', { validate: true }) } },
      { id: 'choose-photos', label: 'Choose photos', nav: { ...tab('community', ['Community']), modal: mk('NewPost', { topic: 'Movement', text: DRAFT, openSheet: true }) } },
      { id: 'photos-picked', label: '3 photos picked', state: true, nav: { ...tab('community', ['Community']), modal: mk('NewPost', { topic: 'Movement', text: DRAFT, openSheet: true, picks: [0, 1, 2] }) } },
      { id: 'newpost-photos', label: 'New post with photos', nav: { ...tab('community', ['Community']), modal: mk('NewPost', { topic: 'Movement', text: DRAFT, photos: [P.friends, P.herbs, P.seedlings] }) } },
      { id: 'couldnt-post', label: 'Couldn’t post', state: true, network: 'offline', nav: { ...tab('community', ['Community']), modal: mk('NewPost', { topic: 'Movement', text: DRAFT, photos: [P.friends, P.herbs, P.seedlings], autoPost: true }) } },
      { id: 'viewer', label: 'Photo viewer', nav: { ...tab('community', ['Community'], ['Conversation', { postId: 'p2' }]), viewer: { photos: POSTS[1].photos, index: 0 } } },
      { id: 'sub-thread', label: 'Reply to a reply', nav: tab('community', ['Community'], ['Conversation', { postId: 'q3', replyTo: 'r8', draft: SUB_REPLY }]) },
      { id: 'no-groups', v: 2, label: 'No groups yet', state: true, seed: { me: { groups: [] } }, nav: tab('community', ['Community']) },
      { id: 'groups', v: 2, label: 'Groups', nav: tab('community', ['Community'], ['Groups']) },
      { id: 'groups-new', v: 2, label: 'Suggested for you', state: true, seed: NEW_SEEKER, nav: tab('community', ['Community'], ['Groups']) },
      { id: 'groups-seedling', v: 2, label: 'Groups, Seedling', state: true, seed: SEEDLING_TWO, nav: tab('community', ['Community'], ['Groups']) },
      { id: 'groups-limit', v: 2, label: '3 of 3 free groups', state: true, seed: SEEDLING, nav: tab('community', ['Community'], ['Groups']) },
      { id: 'group', v: 2, label: 'Book Club', nav: tab('community', ['Community'], ['Group', { id: 'bookclub' }]) },
      { id: 'group-not-joined', v: 2, label: 'Not joined yet', state: true, nav: tab('community', ['Community'], ['Groups'], ['Group', { id: 'foraging' }]) },
      { id: 'group-leave', v: 2, label: 'Leave a group', state: true, nav: tab('community', ['Community'], ['Group', { id: 'bookclub', confirmLeave: true }]) },
      { id: 'group-post', v: 2, label: 'Group conversation', nav: tab('community', ['Community'], ['Group', { id: 'bookclub' }], ['Conversation', { postId: 'g1', from: 'bookclub' }]) },
      { id: 'group-newpost', v: 2, label: 'New post in a group', nav: modal(tab('community', ['Community'], ['Group', { id: 'bookclub' }]), 'NewPost', { group: 'bookclub', text: GROUP_POST }) },
      { id: 'group-posted', v: 2, label: 'Group post live', state: true, nav: modal(tab('community', ['Community'], ['Group', { id: 'bookclub' }]), 'NewPost', { group: 'bookclub', text: GROUP_POST, autoPost: true }) },
      { id: 'experts', v: 2, label: 'Ask the Experts', nav: tab('community', ['Community'], ['Group', { id: 'experts' }]) },
      { id: 'experts-seedling', v: 2, label: 'Ask the Experts, Seedling', state: true, seed: SEEDLING, nav: tab('community', ['Community'], ['Group', { id: 'experts' }]) },
      { id: 'ask', v: 2, label: 'Ask a question', nav: modal(tab('community', ['Community'], ['Group', { id: 'experts' }]), 'AskQuestion', { topic: 'Movement', text: QUESTION }) },
      { id: 'ask-empty', v: 2, label: 'Ask, empty', state: true, nav: modal(tab('community', ['Community'], ['Group', { id: 'experts' }]), 'AskQuestion') },
      { id: 'ask-errors', v: 2, label: 'Ask, errors', state: true, nav: modal(tab('community', ['Community'], ['Group', { id: 'experts' }]), 'AskQuestion', { validate: true }) },
      { id: 'ask-sent', v: 2, label: 'Sent for review', state: true, seed: SENT, nav: tab('community', ['Community'], ['Group', { id: 'experts' }]) },
      { id: 'ask-edit', v: 2, label: 'Edit a question', state: true, nav: modal(tab('community', ['Community'], ['Group', { id: 'experts' }]), 'AskQuestion', { edit: 'aq2' }) },
    ],
  },
  {
    flow: 'Membership',
    items: [
      { id: 'paywall', v: 2, label: 'Join Grove', seed: SEEDLING, nav: modal(tab('profile', ['MyProfile']), 'JoinGrove', { reason: 'profile' }) },
      { id: 'paywall-groups', v: 2, label: 'From the group limit', state: true, seed: SEEDLING, nav: modal(tab('community', ['Community'], ['Groups']), 'JoinGrove', { reason: 'groups' }) },
      { id: 'paywall-monthly', v: 2, label: 'Monthly picked', state: true, seed: SEEDLING, nav: modal(tab('profile', ['MyProfile']), 'JoinGrove', { reason: 'profile', plan: 'monthly' }) },
      { id: 'appstore', v: 2, label: 'App Store sheet', state: true, seed: SEEDLING, nav: modal(tab('profile', ['MyProfile']), 'JoinGrove', { reason: 'profile', showStore: true }) },
      { id: 'grove-welcome', v: 2, label: 'Welcome to Grove', state: true, nav: modal(tab('profile', ['MyProfile']), 'JoinGrove', { welcome: true }) },
      { id: 'membership', v: 2, label: 'Membership', nav: tab('profile', ['MyProfile'], ['Membership']) },
    ],
  },
  {
    flow: 'My Profile',
    items: [
      { id: 'profile', label: 'My Profile', nav: tab('profile', ['MyProfile']) },
      { id: 'profile-seedling', v: 2, label: 'Seedling member', state: true, seed: SEEDLING, nav: tab('profile', ['MyProfile']) },
      { id: 'journey', v: 2, label: 'Your journey', nav: tab('profile', ['MyProfile'], ['Journey']) },
      { id: 'journey-new', v: 2, label: 'Journey, new member', state: true, seed: FRESH, nav: tab('profile', ['MyProfile'], ['Journey']) },
      { id: 'badges', v: 2, label: 'Badges', nav: tab('profile', ['MyProfile'], ['Badges']) },
      { id: 'badge-sheet', v: 2, label: 'Badge in progress', state: true, nav: tab('profile', ['MyProfile'], ['Badges', { open: 'explorer' }]) },
      { id: 'badge-earned', v: 2, label: 'Badge earned', state: true, nav: tab('profile', ['MyProfile'], ['Badges', { open: 'farmfriend' }]) },
      { id: 'profile-new', label: 'No photo or location', state: true, seed: NEW_MEMBER, nav: tab('profile', ['MyProfile']) },
      { id: 'one-interest', label: 'One interest', state: true, seed: { me: { interests: ['Herbs'] } }, nav: tab('profile', ['MyProfile']) },
      { id: 'edit-profile', label: 'Edit profile', nav: tab('profile', ['MyProfile'], ['EditProfile']) },
      { id: 'edit-profile-new', label: 'Edit, no photo or location', state: true, seed: NEW_MEMBER, nav: tab('profile', ['MyProfile'], ['EditProfile']) },
      { id: 'add-photo', label: 'Add photo', state: true, seed: NEW_MEMBER, nav: tab('profile', ['MyProfile'], ['EditProfile', { openSheet: true }]) },
      { id: 'photo-picked', label: 'Photo picked', state: true, seed: NEW_MEMBER, nav: tab('profile', ['MyProfile'], ['EditProfile', { openSheet: true, pick: 3 }]) },
      { id: 'photo-added', label: 'Photo added', state: true, seed: NEW_MEMBER, nav: tab('profile', ['MyProfile'], ['EditProfile', { photo: P.tea }]) },
      { id: 'place-not-found', label: 'Place not found', state: true, nav: tab('profile', ['MyProfile'], ['EditProfile', { openPlace: true, placeQuery: 'Broad Rippel' }]) },
      { id: 'location-sheet', label: 'Location sheet', state: true, nav: tab('profile', ['MyProfile'], ['EditProfile', { openPlace: true }]) },
      { id: 'privacy-settings', label: 'Privacy', nav: tab('profile', ['MyProfile'], ['Privacy']) },
      { id: 'delete-account', label: 'Delete account', state: true, nav: tab('profile', ['MyProfile'], ['Privacy', { confirmDelete: true }]) },
      { id: 'waiver-page', label: 'Liability waiver', nav: tab('profile', ['MyProfile'], ['Privacy'], ['Waiver']) },
      { id: 'edit-interests', label: 'Edit interests', nav: tab('profile', ['MyProfile'], ['EditInterests']) },
      { id: 'edit-interests-empty', label: 'Nothing picked', state: true, nav: tab('profile', ['MyProfile'], ['EditInterests', { picked: [] }]) },
      { id: 'one-picked', label: 'One picked', state: true, nav: tab('profile', ['MyProfile'], ['EditInterests', { picked: ['Herbs'] }]) },
    ],
  },
  {
    flow: 'My Practice',
    items: [
      { id: 'role-practitioner', label: 'Which one are you?', nav: auth(['Welcome'], ['SignUp'], PRACTITIONER) },
      { id: 'find-business', label: 'Find your business', seed: NEW_ACCOUNT, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, FIND) },
      { id: 'find-results', label: 'One match', state: true, seed: NEW_ACCOUNT, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, ['FindListing', { query: 'Quiet' }]) },
      { id: 'find-none', label: 'No match', state: true, seed: NEW_ACCOUNT, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, ['FindListing', { query: 'Lotus' }]) },
      { id: 'claim', label: 'Is this your business?', seed: NEW_ACCOUNT, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, ['FindListing', { query: 'Quiet' }], ['ClaimListing', { id: 'quietmind' }]) },
      { id: 'claim-taken', label: 'Already managed', state: true, seed: NEW_ACCOUNT, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, ['FindListing', { query: 'Wildroot' }], ['ClaimListing', { id: 'wildroot' }]) },
      { id: 'claim-sent', label: 'Check your email', seed: NEW_ACCOUNT, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, ['FindListing', { query: 'Quiet' }], ['ClaimListing', { id: 'quietmind' }], ['ClaimSent', { id: 'quietmind' }]) },
      { id: 'claim-review', label: 'Ask us to check', seed: NEW_ACCOUNT, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, ['FindListing', { query: 'Quiet' }], ['ClaimListing', { id: 'quietmind' }], ['ClaimReview', { id: 'quietmind', role: 'Owner', phone: SAMPLE_PRACTICE.phone }]) },
      { id: 'claim-review-empty', label: 'Ask us to check, empty', state: true, seed: NEW_ACCOUNT, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, ['FindListing', { query: 'Quiet' }], ['ClaimListing', { id: 'quietmind' }], ['ClaimReview', { id: 'quietmind' }]) },
      { id: 'claimed', label: 'Listing claimed', seed: LIVE, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, FIND, ['Preparing', { claimed: true }]) },
      { id: 'claim-in-review', label: 'Claim in review', state: true, seed: AS({ ...SAMPLE_PRACTICE, status: 'review', claim: 'review' }), nav: tab('profile', ['MyPractice']) },
      { id: 'practice-basics', label: 'Step 1, Your practice', seed: { me: DANA }, nav: step(1, BASICS) },
      { id: 'practice-basics-empty', label: 'Your practice, empty', state: true, seed: { me: DANA }, nav: step(1) },
      { id: 'practice-basics-errors', label: 'Your practice, errors', state: true, seed: { me: DANA }, nav: step(1, { validate: true }) },
      { id: 'step-specialties', label: 'Step 2, Specialties', seed: upTo(2), nav: step(2, { picked: SAMPLE_PRACTICE.specialties }) },
      { id: 'step-specialties-empty', label: 'Specialties, empty', state: true, seed: upTo(2), nav: step(2) },
      { id: 'step-specialties-focus', label: 'Only focus areas', state: true, seed: upTo(2), nav: step(2, { picked: ['Back pain', 'Stress'] }) },
      { id: 'step-specialties-full', label: '10 picked', state: true, seed: upTo(2), nav: step(2, { picked: FULL_PICKS }) },
      { id: 'practice-place', label: 'Step 3, Where people find you', seed: AS({ ...upTo(3).practice, address: '', city: '' }), nav: step(3, PLACE) },
      { id: 'practice-place-empty', label: 'Where people find you, empty', state: true, seed: AS({ ...upTo(3).practice, address: '', city: '' }), nav: step(3) },
      { id: 'practice-place-sheet', label: 'City sheet', state: true, seed: AS({ ...upTo(3).practice, address: '', city: '' }), nav: step(3, { address: PLACE.address, openPlace: true }) },
      { id: 'step-photos', label: 'Step 4, Photos', seed: upTo(4), nav: step(4, { photos: SAMPLE_PRACTICE.photos }) },
      { id: 'step-photos-empty', label: 'Photos, empty', state: true, seed: upTo(4), nav: step(4) },
      { id: 'step-photos-sheet', label: 'Choose photos', state: true, seed: upTo(4), nav: step(4, { openSheet: true, picks: [0, 1, 2] }) },
      { id: 'step-about', label: 'Step 5, About', seed: upTo(5), nav: step(5, { about: SAMPLE_PRACTICE.about }) },
      { id: 'step-about-empty', label: 'About, empty', state: true, seed: upTo(5), nav: step(5) },
      { id: 'step-hours', label: 'Step 6, Hours', seed: upTo(6), nav: step(6, { hours: SAMPLE_PRACTICE.hours }) },
      { id: 'step-hours-empty', label: 'Hours, empty', state: true, seed: upTo(6), nav: step(6) },
      { id: 'hours-sheet', label: 'Hours sheet', state: true, seed: upTo(6), nav: step(6, { hours: HALF_WEEK, openDay: 'Wednesday' }) },
      { id: 'step-contact', label: 'Step 7, How people reach you', seed: upTo(7), nav: step(7, { phone: SAMPLE_PRACTICE.phone, website: SAMPLE_PRACTICE.website, booking: SAMPLE_PRACTICE.booking }) },
      { id: 'step-contact-empty', label: 'How people reach you, empty', state: true, seed: upTo(7), nav: step(7) },
      { id: 'step-services', label: 'Step 8, Services', seed: upTo(8), nav: step(8, { services: SAMPLE_PRACTICE.services }) },
      { id: 'step-services-empty', label: 'Services, empty', state: true, seed: upTo(8), nav: step(8) },
      { id: 'step-offer', label: 'Step 9, Member offer', seed: upTo(9), nav: step(9, SAMPLE_PRACTICE.offer) },
      { id: 'step-offer-empty', label: 'Member offer, empty', state: true, seed: upTo(9), nav: step(9) },
      { id: 'practice-preparing', label: 'Setting up your practice', seed: READY, nav: auth(['Welcome'], ['SignUp'], PRACTITIONER, ['Preparing']) },
      { id: 'practice-ready', label: 'Ready to send', seed: READY, nav: tab('profile', ['MyPractice']) },
      { id: 'practice-check', label: 'Check your listing', state: true, seed: READY, nav: tab('profile', ['MyPractice', { openCheck: true }]) },
      { id: 'practice-later', label: 'Finished later', state: true, seed: upTo(5), nav: tab('profile', ['MyPractice']) },
      { id: 'practice-review', label: 'In review', state: true, seed: AS({ ...SAMPLE_PRACTICE, status: 'review' }), nav: tab('profile', ['MyPractice']) },
      { id: 'practice-live', label: 'My Practice, live', seed: LIVE, nav: tab('profile', ['MyPractice']) },
      { id: 'practice-scrolled', label: 'My Practice, scrolled', state: true, seed: LIVE, nav: tab('profile', ['MyPractice', { scrollTo: 'this-month' }]) },
      { id: 'practice-preview', label: 'Your listing', seed: LIVE, nav: tab('profile', ['MyPractice'], ['ListingProfile', { id: 'quietmind' }]) },
      { id: 'practice-preview-website', label: 'Your listing, no booking link', state: true, seed: AS({ ...SAMPLE_PRACTICE, booking: '' }), nav: tab('profile', ['MyPractice'], ['ListingProfile', { id: 'quietmind' }]) },
      { id: 'practice-preview-phone', label: 'Your listing, phone only', state: true, seed: AS({ ...SAMPLE_PRACTICE, booking: '', website: '' }), nav: tab('profile', ['MyPractice'], ['ListingProfile', { id: 'quietmind' }]) },
      { id: 'edit-specialties', label: 'Editing Specialties', state: true, seed: LIVE, nav: tab('profile', ['MyPractice'], ['EditSpecialties', { picked: [...SAMPLE_PRACTICE.specialties, 'Mobility'] }]) },
      { id: 'edit-about', label: 'Editing About', state: true, seed: LIVE, nav: tab('profile', ['MyPractice'], ['EditAbout', { about: `${SAMPLE_PRACTICE.about} Free parking out back.` }]) },
      { id: 'get-featured', label: 'Get featured', seed: LIVE, nav: tab('profile', ['MyPractice'], ['GetFeatured', { length: '3 months' }]) },
      { id: 'feature-requested', label: 'Request sent', state: true, seed: REQUESTED, nav: tab('profile', ['MyPractice', { scrollTo: 'this-month' }]) },
      { id: 'featured', label: 'Featured', state: true, seed: FEATURED, nav: tab('profile', ['MyPractice', { scrollTo: 'this-month' }]) },
      { id: 'featured-home', label: 'Featured on Home', state: true, seed: FEATURED, nav: tab('home', ['Home']) },
      { id: 'practice-newpost', label: 'New post as a practitioner', seed: LIVE, nav: { ...tab('community', ['Community']), modal: mk('NewPost', { topic: 'Movement', text: PRACTICE_POST }) } },
      { id: 'promo-on', label: 'Promotion on', state: true, seed: LIVE, nav: { ...tab('community', ['Community']), modal: mk('NewPost', { topic: 'Movement', text: PROMO_POST, promo: true }) } },
      { id: 'promo-limit', label: '3 promotions this week', state: true, seed: AS({ ...SAMPLE_PRACTICE, promos: ['2026-09-30', '2026-10-01', '2026-10-03'] }), nav: { ...tab('community', ['Community']), modal: mk('NewPost', { topic: 'Movement', text: PROMO_POST }) } },
      { id: 'promo-posted', label: 'Promotion posted', state: true, seed: LIVE, nav: { ...tab('community', ['Community']), modal: mk('NewPost', { topic: 'Movement', text: PROMO_POST, promo: true, autoPost: true }) } },
    ],
  },
];

// Form control in the panel: what Empty, Half and Filled put in the fields of each form screen.
const PICKS = ['Herbs', 'Yoga', 'Gardening'];
export const FORM_PRESETS = {
  SignUp: { empty: {}, half: { email: JANE_EMAIL }, filled: { email: JANE_EMAIL, password: 'Sunrise2026', confirm: 'Sunrise2026' } },
  LogIn: { empty: {}, half: { email: JANE_EMAIL }, filled: { email: JANE_EMAIL, password: 'Sunrise2026' } },
  ForgotPassword: { empty: {}, half: { email: 'jane@exam' }, filled: { email: JANE_EMAIL } },
  AboutYou: { empty: {}, half: { name: 'Jane Miller', dob: 'March 14, 1958' }, filled: { ...ABOUT, location: 'Broad Ripple, Indianapolis' } },
  QuizGoals: { empty: { picked: [] }, half: { picked: ['Better sleep'] }, filled: { picked: GOALS } },
  Interests: { empty: { picked: [] }, half: { picked: ['Herbs'] }, filled: { picked: PICKS } },
  QuizCare: { empty: { picked: [] }, half: { picked: ['Myself'] }, filled: { picked: ['Myself', 'An aging parent'] } },
  AskQuestion: { empty: {}, half: { topic: 'Movement' }, filled: { topic: 'Movement', text: QUESTION } },
  NewPost: { empty: {}, half: { topic: 'Movement', text: DRAFT }, filled: { topic: 'Movement', text: DRAFT, photos: [P.friends, P.herbs, P.seedlings] } },
  EditInterests: { empty: { picked: [] }, half: { picked: ['Herbs'] }, filled: { picked: PICKS } },
  PracticeBasics: { empty: {}, half: { name: BASICS.name }, filled: BASICS },
  PracticePlace: { empty: {}, half: { address: PLACE.address }, filled: PLACE },
  FindListing: { empty: {}, half: { query: 'Qui' }, filled: { query: 'Quiet' } },
  ClaimReview: { empty: {}, half: { role: 'Owner' }, filled: { role: 'Owner', phone: SAMPLE_PRACTICE.phone } },
  Conversation: { empty: {}, half: { draft: 'Chamomile and' }, filled: { draft: REPLY_DRAFT } },
};
// Params that only trigger a one-off state. Changing the form clears them.
const ONE_OFF = ['showMismatch', 'emailError', 'autoSubmit', 'autoPost', 'autoSend', 'validate', 'showAlert', 'denied', 'showWaiver', 'waiverRead', 'waiverEarly', 'autoCheckIn', 'autoVisit'];

// Which form level a route shows right now, for the panel highlight.
export function formLevel(route) {
  const set = route && FORM_PRESETS[route.name];
  if (!set) return null;
  const p = route.params || {};
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  for (const level of ['filled', 'half', 'empty']) {
    const keys = Object.keys(set[level]);
    if (keys.length && keys.every((k) => same(p[k], set[level][k]))) return level;
  }
  return 'empty';
}

// The same screen again with the fields for that level. A new key remounts it.
export function withForm(route, level) {
  const set = FORM_PRESETS[route.name];
  const keys = new Set([...Object.keys(set.empty), ...Object.keys(set.half), ...Object.keys(set.filled), ...ONE_OFF]);
  const rest = Object.fromEntries(Object.entries(route.params || {}).filter(([k]) => !keys.has(k)));
  return mk(route.name, { ...rest, ...set[level] });
}

// True when the item needs specific Network or Content values.
export const isScenario = (item) => 'network' in item || 'content' in item;

// Build a full nav state from a scenario (fills the other tabs with their roots).
export function navFromScenario(item) {
  const base = {
    root: 'auth', auth: [mk('Welcome')], tab: 'home',
    tabs: tabRoots(item.seed && item.seed.me && item.seed.me.role),
    modal: null, viewer: null,
  };
  const n = item.nav;
  const rekey = (r) => (r ? mk(r.name, r.params) : r);
  const tabs = { ...base.tabs };
  for (const [t, rs] of Object.entries(n.tabs || {})) tabs[t] = rs.map(rekey);
  return { ...base, ...n, auth: n.auth ? n.auth.map(rekey) : base.auth, tabs, modal: rekey(n.modal) || null, viewer: n.viewer ? { ...n.viewer, key: mk('PhotoViewer').key } : null };
}
