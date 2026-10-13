// Figma: Topics sheet. Opens from the menu button next to Search on Community. A Filter sheet with one Sheet row per
// topic: All topics (community), Herbs (leaf), Food (apple-fruit), Movement (walking), Mind (brain).
// Picking a topic filters the feed and closes the sheet. All topics clears the filter.
// The heart on a row makes it a favorite topic, which stays on top.
import React from 'react';
import FilterSheet from './FilterSheet';

export const topicLabel = (t) => (t === 'All' ? 'All topics' : t);
const ICONS = { All: 'community', Herbs: 'leaf', Food: 'apple-fruit', Movement: 'walking', Mind: 'brain' };
const OPTIONS = Object.keys(ICONS).map((t) => ({ value: t, label: topicLabel(t), icon: ICONS[t] }));

export default function TopicsSheet({ visible, value, onPick, onClose }) {
  return <FilterSheet visible={visible} title="Topics" options={OPTIONS} value={value} onPick={onPick} onClose={onClose} testPrefix="topic" favoriteKind="topic" />;
}
