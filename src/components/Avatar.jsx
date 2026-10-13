// Round photo avatar with initials as the fallback (Figma: Photo avatar property on Post card and Reply).
// raised: the initials sit on bg/color-surface-raised, for an avatar placed straight on the canvas (Edit profile).
import React from 'react';
import { View, Text, Image } from '../rn';
import { useTheme, type } from '../theme';

export default function Avatar({ person, size = 40, raised }) {
  const { c } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: c(raised && !person.photo ? 'bg/color-surface-raised' : 'bg/color-secondary-subtle'), alignItems: 'center', justifyContent: 'center' }}>
      {person.photo ? (
        <Image source={person.photo} style={{ width: size, height: size }} />
      ) : (
        <Text style={[type(size >= 80 ? 'H2' : size >= 56 ? 'H5' : size > 36 ? 'BodyS' : 'Caption', 'bold'), { color: c('text/color-secondary') }]}>{person.initials}</Text>
      )}
    </View>
  );
}
