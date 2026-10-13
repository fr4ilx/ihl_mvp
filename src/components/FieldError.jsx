// Figma: Field error. What a field or group still needs, under it: a 16pt Solid warning-circle in icon/color-error and
// the message in Body S text/color-error, 4pt apart. The same message line as the Text field's Error state, for the
// groups that are not text fields (chips, cards, tiles, photos, days). See src/app/form.jsx for when it shows.
import React from 'react';
import { View, Text } from '../rn';
import { useTheme, type } from '../theme';
import Icon from './Icon';

export default function FieldError({ message, testID, style }) {
  const { c } = useTheme();
  if (!message) return null;
  return (
    <View testID={testID} data-field-error role="alert" style={[{ flexDirection: 'row', alignItems: 'center', gap: 4 }, style]}>
      <Icon name="warning-circle" solid size={16} color={c('icon/color-error')} />
      <Text style={[type('BodyS'), { color: c('text/color-error'), flex: 1 }]}>{message}</Text>
    </View>
  );
}
