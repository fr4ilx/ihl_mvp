// Everything on a listing under its photos, 40pt apart: the intro (kind and area, the name, distance and hours, the
// the star rating), the Member offer, About, Specialties, Approach, Services, Location and the
// Detail rows. Listing profile shows it, and Check your listing shows the same thing before a practice is sent for
// review. preview: nothing in it reacts to a tap (Check your listing), and About shows in full.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type } from '../theme';
import Button from './Button';
import Icon from './Icon';
import OfferCard from './OfferCard';
import PromoCard from './PromoCard';
import ShowMoreText from './ShowMoreText';
import TagChip from './TagChip';
import { ServiceList } from './ServiceTag';
import MapBox from './MapBox';
import { DetailRow } from './Rows';
import { FOCUS_AREAS } from '../data';
import StarRating from './StarRating';

const noop = () => {};

export default function ListingSections({ item, reviewable, review, onReview, offerLocked, onUnlock, aboutOpen, onTag = noop, onMap = noop, onLink = noop, preview, style }) {
  const { c } = useTheme();
  const address = `${item.address}, ${item.city}`;
  const tags = item.specialties || [];
  return (
    <View pointerEvents={preview ? 'none' : undefined} style={[{ gap: 40 }, style]}>
      <View style={{ gap: 16 }}>
        <View style={{ gap: 4 }}>
          <Text style={[type('BodyS', 'bold'), { color: c('text/color-brand') }]}>{item.kind}  ·  {item.area}</Text>
          <Text style={[type('H3', 'bold'), { color: c('text/color-primary') }]}>{item.name}</Text>
        </View>
        <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{item.distance}  ·  {item.hours}</Text>
        {/* Figma: Review, where the Verified Local Business badge was, for a seeker on someone else's listing. Empty: Add a
            review (Secondary, Medium, star). Done: their stars at 28pt. Either opens the Review sheet. */}
        {reviewable && (review ? (
          <Pressable testID="your-review" onPress={onReview} accessibilityRole="button" accessibilityLabel={`Your review, ${review.rating} of 5 stars. Change it`} className="fx-fade-up" style={({ pressed }) => [{ alignSelf: 'flex-start', minHeight: 48, justifyContent: 'center' }, pressed && { opacity: 0.6 }]}>
            <StarRating value={review.rating} size={28} />
          </Pressable>
        ) : (
          <Button testID="add-review" label="Add a review" hierarchy="secondary" size="medium" leadingIcon="star" onPress={onReview} />
        ))}
      </View>
      {!!item.promo && (
      <View testID="listing-promo" style={{ gap: 12 }}>
        <Text style={[type('H6', 'bold'), { color: c('text/color-secondary') }]}>Promotion</Text>
        <PromoCard promo={item.promo} />
      </View>
      )}
      {!!item.offer && (
      <View testID="listing-offer" style={{ gap: 12 }}>
        <Text style={[type('H6', 'bold'), { color: c('text/color-secondary') }]}>Member offer</Text>
        <OfferCard offer={item.offer} locked={offerLocked} onUnlock={onUnlock} />
      </View>
      )}
      {/* A practitioner's draft preview skips the sections they have not filled in yet. */}
      {!!item.about && (
      <View testID="listing-about-section" style={{ gap: 8 }}>
        <Text style={[type('H6', 'bold'), { color: c('text/color-secondary') }]}>About</Text>
        {preview
          ? <Text testID="listing-about" style={[type('BodyM'), { color: c('text/color-primary') }]}>{item.about}</Text>
          : <ShowMoreText testID="listing-about" text={item.about} initiallyOpen={!!aboutOpen} />}
      </View>
      )}
      {/* Specialties (what the place offers) and Approach (focus areas): Tag chips, 8 apart. Each opens every place
          with that tag. */}
      {[
        ['listing-specialties', 'Specialties', tags.filter((t) => !FOCUS_AREAS.includes(t)), 'sage'],
        ['listing-approach', 'Approach', tags.filter((t) => FOCUS_AREAS.includes(t)), 'brand'],
      ].map(([id, title, list, tone]) => list.length > 0 && (
      <View key={id} testID={id} style={{ gap: 12 }}>
        <Text style={[type('H6', 'bold'), { color: c('text/color-secondary') }]}>{title}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {list.map((t) => <TagChip key={t} testID={`tag-${t}`} label={t} tone={tone} onPress={() => onTag(t)} />)}
        </View>
      </View>
      ))}
      {item.services.length > 0 && (
      <View testID="listing-services" style={{ gap: 12 }}>
        <Text style={[type('H6', 'bold'), { color: c('text/color-secondary') }]}>Services</Text>
        {/* Figma: one card with a Service tag row per service, divided like Settings. Names only, no prices. */}
        <ServiceList services={item.services} />
      </View>
      )}
      {/* Location: the title, a 200pt map, then the address under it. Both open Get directions. */}
      {!!item.address && (
      <View testID="listing-location" style={{ gap: 12 }}>
        <Text style={[type('H6', 'bold'), { color: c('text/color-secondary') }]}>Location</Text>
        <MapBox testID="listing-map" address={address} onPress={onMap} />
        <Pressable testID="listing-address" onPress={onMap} accessibilityRole="button" accessibilityLabel={`Get directions to ${address}`} style={({ pressed }) => [{ gap: 4 }, pressed && { opacity: 0.7 }]}>
          <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{item.address}</Text>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{item.city}</Text>
        </Pressable>
      </View>
      )}
      {(item.time || item.phone) ? (
      <View style={{ gap: 16 }}>
        {item.time ? <DetailRow icon="clock" title={item.days} meta={item.time} /> : null}
        {item.phone ? <DetailRow icon="phone" title={item.phone} meta="Call or text" /> : null}
        {/* With a booking link, Book takes the Website button's place and the website moves here. */}
        {item.booking && item.website ? <DetailRow icon="globe" title={item.website} meta="Website" onPress={() => onLink(item.website)} /> : null}
      </View>
      ) : null}
    </View>
  );
}

// The buttons at the bottom of a listing, two at most. A booking link makes Book the primary action with Call beside
// it. Without one: Website and Call, or Call alone when there is no website.
export function ListingActions({ item, onCall = noop, onLink = noop }) {
  return item.booking ? (
    <>
      <Button testID="listing-call" label="Call" hierarchy="secondary" leadingIcon="phone" style={{ flex: 1 }} onPress={onCall} />
      <Button testID="listing-book" label="Book" leadingIcon="calendar-check" style={{ flex: 1 }} onPress={() => onLink(item.booking)} />
    </>
  ) : (
    <>
      {!!item.website && <Button testID="listing-website" label="Website" hierarchy="secondary" leadingIcon="globe" style={{ flex: 1 }} onPress={() => onLink(item.website)} />}
      <Button testID="listing-call" label="Call" leadingIcon="phone" style={{ flex: 1 }} onPress={onCall} />
    </>
  );
}
