// Grove membership: JoinGrove (the paywall, a full screen modal) and Membership (a Grove member's plan, from My Profile).
// Seedling is free: up to 3 groups. Grove is $89.00 a year or $11.11 a month: every group, Ask the Experts, member
// offers and seasonal quests. In the app StoreKit sells it (RevenueCat or react-native-iap) and the App Store draws the
// purchase sheet. App Review 3.1.2 asks for the price, the length, what it unlocks, Restore purchases, and links to
// the Terms of Use and Privacy Policy on this screen.
import React, { useState } from 'react';
import { View, Text } from '../rn';
import { useTheme, type, elevation } from '../theme';
import { useNav, useRoute } from '../app/nav';
import { useApp } from '../app/store';
import { useFeedback, SNACK } from '../app/feedback';
import { PLANS, GROVE_PERKS } from '../data';
import Screen, { BottomBar } from '../components/Screen';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import TextLink from '../components/TextLink';
import Medallion from '../components/Medallion';
import { PerkList, PlanCard } from '../components/Grove';
import { SectionLabel } from '../components/Rows';
import AppStoreSheet from '../components/AppStoreSheet';

// Why the paywall opened, in one line under the title.
const REASONS = {
  groups: 'Seedling members join up to 3 groups.',
  experts: 'Ask the Experts is part of Grove.',
  offers: 'Member offers are part of Grove.',
  quests: 'Seasonal quests are part of Grove.',
};
export const renewsOn = (plan) => (plan === 'monthly' ? 'November 4, 2026' : 'October 4, 2027');
const finePrint = (p) => `Charged to your Apple Account. Renews every ${p.per} at ${p.price} until you cancel. Cancel anytime in Settings, at least a day before it renews.`;

export function JoinGrove() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const p = useRoute().route.params || {};
  const [plan, setPlan] = useState(p.plan || 'yearly');
  const [store, setStore] = useState(!!p.showStore);
  const [welcome, setWelcome] = useState(!!p.welcome);
  const chosen = PLANS.find((x) => x.id === plan);
  // The perk the person came for leads the list.
  const perks = [...GROVE_PERKS].sort((a, b) => (b.id === p.reason) - (a.id === p.reason));
  // In the app: WebBrowser.openBrowserAsync to the pages on IHL's site, so the paywall stays open.
  const openLink = (name) => fb.snack({ message: `Opening ${name}`, tone: 'info', bottom: SNACK.bottomBar, hapticKind: 'light' });
  const subscribed = () => { setStore(false); app.subscribe(plan); setWelcome(true); fb.haptic('success'); };

  if (welcome) {
    return (
      <Screen testID="screen-grove-welcome" nav={<NavBar kind="back" backIcon="xmark" onBack={nav.closeModal} />} center bottom={<BottomBar plain><Button testID="grove-start" label="Start exploring" fill onPress={nav.closeModal} /></BottomBar>}>
        <View className="fx-fade-up" style={{ alignItems: 'center', gap: 8 }}>
          <Medallion icon="tree" size={96} halo />
          <Text style={[type('H2', 'bold'), { color: c('text/color-primary'), textAlign: 'center', marginTop: 8 }]}>Welcome to Grove</Text>
          <Text style={[type('BodyM'), { color: c('text/color-secondary'), textAlign: 'center' }]}>Thank you for supporting local wellness. Every group, Ask the Experts, member offers and the Fall Harvest Quest are open to you.</Text>
        </View>
      </Screen>
    );
  }
  return (
    <>
      <Screen
        testID="screen-joingrove"
        nav={<NavBar kind="back" backIcon="xmark" onBack={nav.closeModal} />}
        bodyGap={24}
        bottomSpace={150}
        bottom={<BottomBar><Button testID="grove-join" label={`Join for ${chosen.price} a ${chosen.per}`} fill onPress={() => { fb.haptic('light'); setStore(true); }} /></BottomBar>}
      >
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Medallion icon="tree" size={80} halo />
          <Text style={[type('H2', 'bold'), { color: c('text/color-primary'), textAlign: 'center' }]}>Grow with Grove</Text>
          <Text testID="grove-reason" style={[type('BodyM'), { color: c('text/color-secondary'), textAlign: 'center' }]}>{REASONS[p.reason] || 'Support local wellness and get more from the community.'}</Text>
        </View>
        {/* The plans come first, so both prices sit in view with the Join button. What you get follows. */}
        <View accessibilityRole="radiogroup" style={{ gap: 12 }}>
          {PLANS.map((pl) => <PlanCard key={pl.id} plan={pl} selected={plan === pl.id} onPress={() => { setPlan(pl.id); fb.haptic('selection'); }} />)}
        </View>
        <View style={{ gap: 8 }}>
          <SectionLabel>What you get</SectionLabel>
          <PerkList perks={perks} />
        </View>
        <Text testID="grove-fine-print" style={[type('BodyS'), { color: c('text/color-secondary'), textAlign: 'center' }]}>{finePrint(chosen)}</Text>
        <View style={{ alignItems: 'center', gap: 16 }}>
          <TextLink testID="grove-restore" label="Restore purchases" onPress={() => fb.snack({ message: 'No purchases to restore', tone: 'info', bottom: SNACK.bottomBar })} style={{ alignSelf: 'center' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 32 }}>
            <TextLink label="Terms of Use" onPress={() => openLink('Terms of Use')} />
            <TextLink label="Privacy Policy" onPress={() => openLink('Privacy Policy')} />
          </View>
        </View>
      </Screen>
      <AppStoreSheet visible={store} plan={chosen} email={app.me.email} renews={renewsOn(plan)} onDone={subscribed} onClose={() => setStore(false)} />
    </>
  );
}

// A Grove member's plan. Changing or canceling happens in the App Store (StoreKit showManageSubscriptions in the app).
export function Membership() {
  const { c } = useTheme();
  const nav = useNav();
  const app = useApp();
  const fb = useFeedback();
  const plan = PLANS.find((x) => x.id === app.me.plan) || PLANS[0];
  return (
    <Screen testID="screen-membership" nav={<NavBar kind="back" title="Membership" onBack={nav.goBack} />} bodyGap={24}>
      <View style={{ alignItems: 'center', gap: 4, padding: 24, borderRadius: 20, backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card }}>
        <Medallion icon="tree" size={64} />
        <Text style={[type('H3', 'bold'), { color: c('text/color-primary'), marginTop: 12 }]}>Grove</Text>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{plan.price} a {plan.per}</Text>
        <Text testID="membership-renews" style={[type('BodyS'), { color: c('text/color-secondary') }]}>Renews {app.me.renews}</Text>
      </View>
      <View style={{ gap: 8 }}>
        <SectionLabel>What you get</SectionLabel>
        <PerkList perks={GROVE_PERKS} />
      </View>
      <View style={{ gap: 12 }}>
        <Button testID="manage-subscription" label="Manage subscription" hierarchy="secondary" fill onPress={() => fb.snack({ message: 'Opening App Store', tone: 'info', bottom: SNACK.none, hapticKind: 'light' })} />
        <Text style={[type('BodyS'), { color: c('text/color-secondary'), textAlign: 'center' }]}>Change or cancel your plan in the App Store.</Text>
      </View>
    </Screen>
  );
}
