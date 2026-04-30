import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const CRTOverlay = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Scanlines */}
      <View style={styles.scanlines}>
        {Array.from({ length: Math.floor(height / 4) }).map((_, i) => (
          <View key={i} style={styles.scanline} />
        ))}
      </View>
      {/* Vignette */}
      <View style={styles.vignette} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // On top of everything
    opacity: 0.07, // Reduced significantly so it doesn't look gray on white background
  },
  scanlines: {
    flex: 1,
    flexDirection: 'column',
  },
  scanline: {
    height: 2,
    backgroundColor: '#000',
    marginBottom: 2,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 50,
    borderColor: 'rgba(0,0,0,0.4)',
    opacity: 0.8,
  }
});

export default React.memo(CRTOverlay);
