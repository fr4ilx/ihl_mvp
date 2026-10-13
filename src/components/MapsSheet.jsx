// Get directions: the native iOS action sheet, drawn for the prototype only. Opens from the Map box or the
// address on a listing. A small title and the address, then Open in Apple Maps and Open in Google Maps,
// then Cancel in its own group. Picking one leaves the app.
// React Native: iOS draws the real one.
//   ActionSheetIOS.showActionSheetWithOptions({ title: 'Get directions', message: address,
//     options: ['Open in Apple Maps', 'Open in Google Maps', 'Cancel'], cancelButtonIndex: 2 }, (i) => ...)
// Then Linking.openURL. Apple Maps: maps://?daddr=<address>. Google Maps: comgooglemaps://?daddr=<address> when
// Linking.canOpenURL says it is installed (add comgooglemaps to LSApplicationQueriesSchemes), otherwise
// https://www.google.com/maps/dir/?api=1&destination=<address>.
import React from 'react';
import ActionSheet from './ActionSheet';

export const MAP_APPS = ['Apple Maps', 'Google Maps'];

export default function MapsSheet({ visible, address, onPick, onClose }) {
  return (
    <ActionSheet
      visible={visible}
      testID="maps-sheet"
      cancelTestID="maps-cancel"
      title="Get directions"
      message={address}
      options={MAP_APPS.map((app) => ({ label: `Open in ${app}`, app, testID: `maps-${app.split(' ')[0].toLowerCase()}` }))}
      onPick={(o) => onPick(o.app)}
      onClose={onClose}
    />
  );
}
