// Figma: Detail row, Setting row, Task row, and the inset grouped card that holds them.
// Detail row: 48pt icon circle in bg/color-surface-raised so it reads on the canvas in Light and Dark.
import React from 'react';
import { View, Text, Pressable } from '../rn';
import { useTheme, type, elevation } from '../theme';
import Icon from './Icon';

export function DetailRow({ icon, title, meta, onPress }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 52 }, pressed && { opacity: 0.7 }]}>
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c('bg/color-surface-raised'), alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={24} color={c('icon/color-brand')} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[type('BodyM', 'bold'), { color: c('text/color-primary') }]}>{title}</Text>
        {!!meta && <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{meta}</Text>}
      </View>
    </Pressable>
  );
}

// trailing: a control in place of the chevron, like a Toggle (Figma: Setting row, Trailing Toggle).
// valueTone 'link': the value reads as an action in text/color-link Bold, like Add on a day that has no hours yet.
// tone 'destructive': the label and icon in the error color and no chevron, like Delete account (Figma: Setting row,
// Trailing None, an override on the label and icon colors).
export function SettingRow({ icon, label, value, onPress, divider, testID, trailing, valueTone, tone }) {
  const { c } = useTheme();
  const danger = tone === 'destructive';
  const inner = (
    <>
      {icon && <Icon name={icon} size={24} color={c(danger ? 'icon/color-error' : 'icon/color-primary')} />}
      {/* The label never wraps. A long value gets cut short instead, like the Task row. */}
      <Text numberOfLines={1} style={[type('BodyM', danger ? 'bold' : 'medium'), { color: c(danger ? 'text/color-error' : 'text/color-primary') }, value ? { flexShrink: 0 } : { flex: 1 }]}>{label}</Text>
      {!!value && <Text numberOfLines={1} style={[type('BodyM', valueTone === 'link' ? 'bold' : 'medium'), { color: c(valueTone === 'link' ? 'text/color-link' : 'text/color-secondary'), flex: 1, textAlign: 'right' }]}>{value}</Text>}
      {danger ? null : trailing || <Icon name="nav-arrow-right" size={24} color={c('icon/color-secondary')} />}
      {divider && <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: c('border/color-subtle') }} />}
    </>
  );
  // With a control on the right and no action of its own, the row is a plain View so the control takes the tap.
  if (trailing && !onPress) return <View testID={testID} style={{ height: 56, flexDirection: 'row', alignItems: 'center', gap: 16 }}>{inner}</View>;
  return (
    <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [{ height: 56, flexDirection: 'row', alignItems: 'center', gap: 16 }, pressed && { opacity: 0.6 }]}>
      {inner}
    </Pressable>
  );
}

// Figma: Task row (Done No, Yes). A checklist row on My Practice: a status icon, the label, what is there and a chevron.
// Done shows a Solid check-circle in icon/color-success, to do shows an empty circle and Add in the link color.
// The divider starts under the label, like the Radio row.
export function TaskRow({ label, value, done, optional, onPress, divider, testID }) {
  const { c } = useTheme();
  const shown = done ? value : optional ? 'Optional' : 'Add';
  return (
    <Pressable testID={testID} onPress={onPress} accessibilityLabel={`${label}, ${done ? 'done' : optional ? 'optional' : 'to do'}`} style={({ pressed }) => [{ height: 56, flexDirection: 'row', alignItems: 'center', gap: 16 }, pressed && { opacity: 0.6 }]}>
      {done
        ? <View className="fx-check-in"><Icon name="check-circle" solid size={24} color={c('icon/color-success')} /></View>
        : <Icon name="circle" size={24} color={c('icon/color-secondary')} />}
      {/* The label never wraps. A long value gets cut short instead. */}
      <Text numberOfLines={1} style={[type('BodyM'), { color: c('text/color-primary'), flexShrink: 0 }]}>{label}</Text>
      <Text numberOfLines={1} style={[type('BodyM', !done && !optional ? 'bold' : 'medium'), { color: c(!done && !optional ? 'text/color-link' : 'text/color-secondary'), flex: 1, textAlign: 'right' }]}>{shown || ''}</Text>
      <Icon name="nav-arrow-right" size={24} color={c('icon/color-secondary')} />
      {divider && <View style={{ position: 'absolute', left: 40, right: 0, bottom: 0, height: 1, backgroundColor: c('border/color-subtle') }} />}
    </Pressable>
  );
}

export function Group({ label, children }) {
  const { c } = useTheme();
  const rows = React.Children.toArray(children);
  return (
    <View style={{ gap: 8 }}>
      {!!label && <Text style={[type('BodyS', 'bold'), { color: c('text/color-secondary') }]}>{label}</Text>}
      <View style={{ backgroundColor: c('bg/color-surface-raised'), boxShadow: elevation.card, borderRadius: 16, paddingHorizontal: 16 }}>
        {rows.map((r, i) => React.cloneElement(r, { divider: i < rows.length - 1 }))}
      </View>
    </View>
  );
}

// error: the group under it still needs something (FieldError), so the label turns text/color-error like a Text field's.
export function SectionLabel({ children, style, error }) {
  const { c } = useTheme();
  return <Text style={[type('BodyS', 'bold'), { color: c(error ? 'text/color-error' : 'text/color-secondary') }, style]}>{children}</Text>;
}
