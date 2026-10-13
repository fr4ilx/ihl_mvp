// Figma: Empty state. Tone Neutral or Error. A 180pt illustration or a 112pt icon circle, H3 title, one line, one action.
import React from 'react';
import { View, Text, Image } from '../rn';
import { useTheme, type } from '../theme';
import Icon from './Icon';
import Button from './Button';

export default function EmptyState({ illustration, icon, tone = 'neutral', title, message, action, onAction, testID }) {
  const { c } = useTheme();
  return (
    <View testID={testID} className="fx-fade-up" style={{ alignItems: 'center', paddingVertical: 24, gap: 24 }}>
      {illustration ? (
        <Image source={illustration} resizeMode="contain" style={{ width: 180, height: 180 }} />
      ) : (
        <View style={{ width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: tone === 'error' ? c('bg/color-error-subtle') : c('bg/color-brand-subtle') }}>
          <Icon name={icon} size={48} color={tone === 'error' ? c('icon/color-error') : c('icon/color-brand')} />
        </View>
      )}
      <View style={{ alignItems: 'center', gap: 8, paddingHorizontal: 8 }}>
        <Text style={[type('H3', 'bold'), { color: c('text/color-primary'), textAlign: 'center' }]}>{title}</Text>
        {!!message && <Text style={[type('BodyM'), { color: c('text/color-secondary'), textAlign: 'center' }]}>{message}</Text>}
      </View>
      {!!action && <Button hierarchy="secondary" size="medium" label={action} onPress={onAction} style={{ alignSelf: 'center' }} />}
    </View>
  );
}
