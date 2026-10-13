// Motion and haptics for Indy Holistic Living.
// Every animation in the prototype reads its numbers from here.
// "native" says what to use in React Native so the app matches the prototype.
// Curves follow iOS: calm, no bounce on navigation, a little spring on small feedback.

export const easing = {
  ios: 'cubic-bezier(0.32, 0.72, 0, 1)', // iOS push, modal and sheet curve
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  spring: 'cubic-bezier(0.34, 1.4, 0.64, 1)', // small overshoot for feedback
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
};

export const motion = {
  push: {
    label: 'Push a screen',
    duration: 480,
    easing: easing.ios,
    parallax: -0.3, // the screen underneath moves 30% left and dims
    dim: 0.08,
    native: "React Navigation native stack (default iOS push). Nothing to build.",
  },
  pop: {
    label: 'Back',
    duration: 420,
    easing: easing.ios,
    native: 'Native stack back gesture and button. Swipe from the left edge works for free.',
  },
  navFill: {
    label: 'Nav bar fill on scroll',
    duration: 220,
    easing: easing.out,
    native: 'Header stays put. A BlurView (expo-blur) tinted with bg/color-canvas fades in once content scrolls under it. Drive opacity from useAnimatedScrollHandler.',
  },
  expand: {
    label: 'Show more and Show less',
    duration: 280,
    easing: easing.inOut,
    lines: 3,
    native: 'About shows 3 lines (numberOfLines={3}). Show more removes the limit and the block grows with layout={LinearTransition.duration(280)} from Reanimated. Show less goes back.',
  },
  parallax: {
    label: 'Photo parallax',
    duration: 0,
    factor: 0.4,
    easing: 'linear',
    native: 'Listing photo translateY = scrollY × 0.4 with Reanimated interpolate. Add a scale on overscroll for the iOS stretch.',
  },
  tab: {
    label: 'Switch tab',
    duration: 160,
    easing: easing.out,
    native: 'Bottom tabs with animation: "fade" (React Navigation 7) or no animation, the iOS default.',
  },
  modal: {
    label: 'Open New post',
    duration: 520,
    easing: easing.ios,
    native: "presentation: 'fullScreenModal' on the native stack.",
  },
  sheet: {
    label: 'Bottom sheet',
    duration: 520,
    easing: easing.ios,
    backdrop: 0.4,
    native: "@gorhom/bottom-sheet BottomSheetModal with snapPoints ['75%'], edge to edge. The native formSheet floats on iOS 26.",
  },
  actionSheet: {
    label: 'iOS action sheet',
    duration: 520,
    easing: easing.ios,
    native: 'The real action sheet from ActionSheetIOS.showActionSheetWithOptions (Get directions, More on a post). Do not draw it.',
  },
  shareSheet: {
    label: 'iOS share sheet',
    duration: 520,
    easing: easing.ios,
    native: 'The real share sheet from Share.share (Share on a listing or a post). Do not draw it.',
  },
  reel: {
    label: 'Reel snap',
    duration: 0,
    easing: easing.out,
    native: 'FlatList horizontal with snapToInterval={350} and decelerationRate="fast". The dots follow onMomentumScrollEnd and the current one grows to 20pt over 180 ms.',
  },
  alert: {
    label: 'iOS system alert',
    duration: 260,
    fromScale: 1.08,
    easing: easing.out,
    native: 'The real alert: requestForegroundPermissionsAsync() from expo-location for location, Alert.alert for Delete account, Leave a group, Block and Delete post. Do not draw it.',
  },
  viewer: {
    label: 'Photo viewer',
    duration: 360,
    fromScale: 0.92,
    easing: easing.ios,
    native: "presentation: 'transparentModal' plus Reanimated FadeIn/ZoomIn. Pinch with react-native-gesture-handler.",
  },
  snackbar: {
    label: 'Snackbar',
    inDuration: 420,
    outDuration: 240,
    visibleFor: 2600,
    fromY: 16,
    easingIn: easing.spring,
    easingOut: easing.out,
    native: 'Reanimated entering={FadeInDown.springify().damping(18)} exiting={FadeOutDown.duration(240)}. Auto hide after 2.6 s.',
  },
  press: {
    label: 'Press',
    scale: 0.97,
    duration: 120,
    native: 'Pressable with a Reanimated scale to 0.97, 120 ms.',
  },
  like: {
    label: 'Like',
    peakScale: 1.28,
    duration: 360,
    easing: easing.spring,
    native: 'withSequence(withTiming(1.28, {duration: 120}), withSpring(1, {damping: 10})).',
  },
  save: {
    label: 'Save',
    peakScale: 1.22,
    duration: 320,
    easing: easing.spring,
    native: 'Same as like, on the bookmark icon.',
  },
  slide: {
    label: 'Slide to confirm',
    threshold: 0.85, // how far the knob has to go before letting go runs the action
    back: 280, // the knob running to the end, or back when let go too early
    hold: 360, // how long the check shows before the action runs
    easing: easing.ios,
    native: 'Gesture.Pan (react-native-gesture-handler) moves a Reanimated translateX clamped to the track. Past 85% withTiming to the end, else withSpring(0, { damping: 18 }). runOnJS(onConfirm) 360 ms later.',
  },
  select: {
    label: 'Select chip or card',
    duration: 180,
    easing: easing.out,
    native: 'Reanimated interpolateColor over 180 ms, or just swap styles.',
  },
  listEnter: {
    label: 'List items appear',
    duration: 360,
    stagger: 40,
    fromY: 8,
    easing: easing.out,
    native: 'entering={FadeInDown.delay(index * 40).duration(360)}',
  },
  listRemove: {
    label: 'Remove from a list',
    duration: 300,
    easing: easing.inOut,
    native: 'exiting={FadeOut.duration(200)} and layout={LinearTransition.duration(300)} on the list items.',
  },
  skeleton: {
    label: 'Loading pulse',
    duration: 1400,
    native: 'withRepeat(withTiming(0.55, {duration: 700}), -1, true) on opacity.',
  },
  breathe: {
    label: 'Preparing breath',
    cycle: 4000,
    total: 2600, // how long Preparing stays before Home
    native: 'withRepeat on scale 0.92 to 1.04 over 2 s each way, then router.replace to Home after 2.6 s.',
  },
  fadeThrough: {
    label: 'Switch between sign in and the app',
    duration: 420,
    easing: easing.out,
    native: "Root stack with animation: 'fade' between the auth group and the tabs group.",
  },
};

// Haptics map straight onto expo-haptics.
export const haptics = {
  light: { label: 'Light impact', native: 'Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)' },
  soft: { label: 'Soft impact', native: 'Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)' },
  selection: { label: 'Selection', native: 'Haptics.selectionAsync()' },
  success: { label: 'Success', native: 'Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)' },
  error: { label: 'Error', native: 'Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)' },
};

// Reduce Motion: the prototype and the app both drop movement and keep fades.
export const reduceMotion = {
  native: 'AccessibilityInfo.isReduceMotionEnabled() or useReducedMotion() from Reanimated. Swap slides for 200 ms fades.',
};
