// Iconoir icons. Same names in iconoir-react-native, so this file ports by changing the two imports.
import React from 'react';
import {
  HomeSimple, Community, UserCircle, Bookmark, Search, NavArrowLeft, NavArrowRight, Xmark, XmarkCircle, Plus,
  ShareIos, MoreHoriz, Heart, ChatBubble, Send, Camera, EditPencil, Globe, Phone, MapPin, Clock, NavigatorAlt,
  Calendar, HalfMoon, Lock, HelpCircle, LogOut, CheckCircle, WarningCircle, InfoCircle, Check, Eye, EyeClosed,
  Mail, WifiOff, MediaImage, NavArrowDown, ArrowRight, Map as MapIcon, Menu, OpenNewWindow, MapsArrowDiagonal,
  Shop, Circle, Sparks, MinusCircle, MediaImagePlus, Copy, Trash, Page,
  BadgeCheck, Gift, CalendarCheck, ChatBubbleQuestion, Megaphone, MailOpen, ArrowDown, ShieldCheck,
  Group, Apple as AppleFruit, SoilAlt, Leaf, Flower, Tree, PineTree, AfricanTree, Crown, Compass, Farm, UserLove, SunLight,
  EmojiTalkingHappy, Emoji, EmojiQuite, EmojiSad, Yoga, Walking, Flash, Medal, User, HomeUser, Brain,
  FilterList,
} from 'iconoir-react/regular';
import {
  Bookmark as BookmarkSolid, Heart as HeartSolid, CheckCircle as CheckCircleSolid, WarningCircle as WarningCircleSolid,
  InfoCircle as InfoCircleSolid, XmarkCircle as XmarkCircleSolid, Sparks as SparksSolid,
} from 'iconoir-react/solid';

// The Apple logo from Apple's Sign in with Apple artwork (Apple Design Resources), fitted to the 24pt icon grid.
// Figma: the "apple" component in the System doc. Never swap it for a drawn apple.
// In the app: react-native-svg with the same path, or the logo file from Apple Design Resources.
const APPLE_LOGO = 'M15.7099491,14.8846154 C16.5675461,14.8846154 17.642562,14.3048315 18.28274,13.5317864 C18.8625238,12.8312142 19.2852829,11.852829 19.2852829,10.8744437 C19.2852829,10.7415766 19.2732041,10.6087095 19.2490464,10.5 C18.2948188,10.5362365 17.1473299,11.140178 16.4588366,11.9494596 C15.9152893,12.56548 15.4200572,13.5317864 15.4200572,14.5222505 C15.4200572,14.6671964 15.4442149,14.8121424 15.4562937,14.8604577 C15.5166879,14.8725366 15.6133185,14.8846154 15.7099491,14.8846154 Z M12.6902416,29.5 C13.8618881,29.5 14.3812778,28.714876 15.8428163,28.714876 C17.3285124,28.714876 17.6546408,29.4758423 18.9591545,29.4758423 C20.2395105,29.4758423 21.0971074,28.292117 21.9063891,27.1325493 C22.8123013,25.8038779 23.1867451,24.4993643 23.2109027,24.4389701 C23.1263509,24.4148125 20.6743484,23.4122695 20.6743484,20.5979021 C20.6743484,18.1579784 22.6069612,17.0588048 22.7156707,16.974253 C21.4353147,15.1382708 19.490623,15.0899555 18.9591545,15.0899555 C17.5217737,15.0899555 16.3501271,15.9596313 15.6133185,15.9596313 C14.8161157,15.9596313 13.7652575,15.1382708 12.521138,15.1382708 C10.1536872,15.1382708 7.75,17.0950413 7.75,20.7911634 C7.75,23.0861411 8.64383344,25.513986 9.74300699,27.0842339 C10.6851558,28.4129053 11.5065162,29.5 12.6902416,29.5 Z';
const AppleLogo = ({ width, height, color, style }) => (
  <svg width={width} height={height} viewBox="4.08 8.6 22.8 22.8" style={style} aria-hidden="true"><path d={APPLE_LOGO} fill={color || 'currentColor'} /></svg>
);

// Filter sliders: two tracks with a knob each, drawn on Iconoir's 24pt grid with its 1.5 stroke and round caps, since
// Iconoir has no sliders glyph. In the app: react-native-svg with the same paths.
const Sliders = ({ width, height, color, strokeWidth = 1.5, style }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round" style={style} aria-hidden="true">
    <path d="M3 7h9M18 7h3M3 17h3M12 17h9" />
    <circle cx="15" cy="7" r="2.5" />
    <circle cx="9" cy="17" r="2.5" />
  </svg>
);

const REGULAR = {
  'home-simple': HomeSimple, community: Community, 'user-circle': UserCircle, bookmark: Bookmark, search: Search,
  'nav-arrow-left': NavArrowLeft, 'nav-arrow-right': NavArrowRight, xmark: Xmark, 'xmark-circle': XmarkCircle, plus: Plus,
  'share-ios': ShareIos, 'more-horiz': MoreHoriz, heart: Heart, 'chat-bubble': ChatBubble, send: Send, camera: Camera,
  'edit-pencil': EditPencil, globe: Globe, phone: Phone, 'map-pin': MapPin, clock: Clock, 'navigator-alt': NavigatorAlt,
  calendar: Calendar, 'half-moon': HalfMoon, lock: Lock, 'help-circle': HelpCircle, 'log-out': LogOut,
  'check-circle': CheckCircle, 'warning-circle': WarningCircle, 'info-circle': InfoCircle, check: Check, eye: Eye,
  'eye-closed': EyeClosed, mail: Mail, 'wifi-off': WifiOff, 'media-image': MediaImage, apple: AppleLogo, 'nav-arrow-down': NavArrowDown,
  map: MapIcon, menu: Menu, 'open-new-window': OpenNewWindow, 'maps-arrow-diagonal': MapsArrowDiagonal,
  shop: Shop, circle: Circle, sparks: Sparks, 'minus-circle': MinusCircle, 'media-image-plus': MediaImagePlus,
  copy: Copy, trash: Trash, page: Page,
  'badge-check': BadgeCheck, gift: Gift, 'calendar-check': CalendarCheck, 'chat-bubble-question': ChatBubbleQuestion,
  megaphone: Megaphone, 'mail-open': MailOpen, 'arrow-down': ArrowDown, 'arrow-right': ArrowRight, 'shield-check': ShieldCheck,
  // Iconoir's apple is apple-fruit here, because apple is Apple's logo above.
  group: Group, 'apple-fruit': AppleFruit, 'soil-alt': SoilAlt, leaf: Leaf, flower: Flower, tree: Tree, 'pine-tree': PineTree,
  'african-tree': AfricanTree, crown: Crown, compass: Compass, farm: Farm, 'user-love': UserLove, 'sun-light': SunLight,
  'emoji-talking-happy': EmojiTalkingHappy, emoji: Emoji, 'emoji-quite': EmojiQuite, 'emoji-sad': EmojiSad,
  yoga: Yoga, walking: Walking, flash: Flash, medal: Medal, user: User, 'home-user': HomeUser, brain: Brain,
  'filter-list': FilterList, sliders: Sliders,
};
const SOLID = {
  bookmark: BookmarkSolid, heart: HeartSolid, 'check-circle': CheckCircleSolid, 'warning-circle': WarningCircleSolid,
  'info-circle': InfoCircleSolid, 'xmark-circle': XmarkCircleSolid, sparks: SparksSolid,
};

export default function Icon({ name, size = 24, color, solid = false, strokeWidth = 1.5, style }) {
  const Comp = (solid && SOLID[name]) || REGULAR[name];
  if (!Comp) return null;
  return <Comp width={size} height={size} color={color} strokeWidth={strokeWidth} style={{ display: 'block', flexShrink: 0, ...(style || {}) }} />;
}
