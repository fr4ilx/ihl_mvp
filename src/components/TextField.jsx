// Figma: Text field. Label above, underline in border/color-strong (3:1), error with icon and message.
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from '../rn';
import { useTheme, type } from '../theme';
import Icon from './Icon';

export default function TextField({
  label, value, onChangeText, placeholder, helper, error, trailingIcon, onTrailingPress, trailingLabel,
  secureTextEntry, keyboardType, autoCapitalize, onBlur, testID, multiline, onPress,
}) {
  // onPress turns the field into a picker: tapping anywhere opens a sheet (Date of birth, Location).
  // The label and the line form one tap area of 60pt or more, so a tap on the label focuses the field too.
  const { c } = useTheme();
  const input = useRef(null);
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);
  // A multiline field (Short bio) grows with its text, one 26pt line at a time, up to 4 lines, then scrolls.
  const [lines, setLines] = useState(1);
  const isPassword = secureTextEntry;
  const line = error ? c('border/color-error') : focused ? c('border/color-brand') : c('border/color-strong');
  return (
    <View style={{ alignSelf: 'stretch' }}>
      {onPress ? (
        <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={`${label}${value ? ', ' + value : ''}`} onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
          <Text style={[type('BodyS', 'bold'), { color: error ? c('text/color-error') : c('text/color-secondary') }]}>{label}</Text>
          <View style={styles.input}>
            <Text style={[type('BodyM'), { flex: 1, color: value ? c('text/color-primary') : c('text/color-tertiary') }]} numberOfLines={1}>{value || placeholder}</Text>
            {trailingIcon && <View style={styles.trail}><Icon name={trailingIcon} size={24} color={c('icon/color-secondary')} /></View>}
          </View>
        </Pressable>
      ) : (
      <Pressable accessible={false} onPress={() => input.current && input.current.focus()}>
      <Text style={[type('BodyS', 'bold'), { color: error ? c('text/color-error') : c('text/color-secondary') }]}>{label}</Text>
      <View style={[styles.input, multiline && { alignItems: 'flex-start' }]}>
        <TextInput
          ref={input}
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c('text/color-tertiary')}
          secureTextEntry={isPassword && !reveal}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          onContentSizeChange={multiline ? (e) => setLines(Math.min(4, Math.max(1, Math.round(e.nativeEvent.contentSize.height / 26)))) : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur && onBlur(); }}
          style={[type('BodyM'), { flex: 1, color: c('text/color-primary'), height: 26 * lines, letterSpacing: isPassword && !reveal && value ? 2 : 0 }]}
        />
        {isPassword && (
          <Pressable accessibilityLabel={reveal ? 'Hide password' : 'Show password'} onPress={() => setReveal(!reveal)} hitSlop={12} style={styles.trail}>
            <Icon name={reveal ? 'eye-closed' : 'eye'} size={24} color={c('icon/color-secondary')} />
          </Pressable>
        )}
        {trailingIcon && (
          <Pressable testID={testID ? testID + '-trailing' : undefined} accessibilityLabel={trailingLabel} onPress={onTrailingPress} hitSlop={12} style={styles.trail}>
            <Icon name={trailingIcon} size={24} color={onTrailingPress ? c('icon/color-brand') : c('icon/color-secondary')} />
          </Pressable>
        )}
      </View>
      </Pressable>
      )}
      <View style={{ height: focused || error ? 2 : 1, backgroundColor: line, marginTop: focused || error ? -1 : 0 }} />
      {!!error && (
        <View style={styles.msg} data-field-error role="alert">
          <Icon name="warning-circle" solid size={16} color={c('icon/color-error')} />
          <Text style={[type('BodyS'), { color: c('text/color-error'), flex: 1 }]}>{error}</Text>
        </View>
      )}
      {!error && !!helper && (
        <View style={styles.msg}>
          <Text style={[type('BodyS'), { color: c('text/color-secondary') }]}>{helper}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma: label 22 + input row 38 (4 top, 26 text, 8 bottom) + underline 1 = 61pt. Messages add 8 + 22.
  input: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4, paddingBottom: 8 },
  trail: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  msg: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 8 },
});
