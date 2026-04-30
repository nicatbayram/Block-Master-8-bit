import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import CornerMask from '../components/CornerMask';

const RetroSwitch = ({ value, onValueChange, COLORS }) => {
  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={() => onValueChange(!value)}
      style={{
        width: 60,
        height: 28,
        backgroundColor: COLORS.background,
        borderWidth: 2,
        borderColor: COLORS.textPrimary,
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: value ? 'flex-end' : 'flex-start'
      }}
    >
      {/* Switch Track Shadow/Depth */}
      <View style={{
        ...StyleSheet.absoluteFillObject,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderColor: 'rgba(0,0,0,0.3)',
      }} />
      
      {/* Switch Thumb */}
      <View style={{
        width: 24,
        height: 20,
        backgroundColor: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.background,
      }}>
         {/* Thumb Ridges */}
         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <View style={{ width: 2, height: 12, backgroundColor: COLORS.background, opacity: 0.5 }} />
            <View style={{ width: 2, height: 12, backgroundColor: COLORS.background, opacity: 0.5 }} />
            <View style={{ width: 2, height: 12, backgroundColor: COLORS.background, opacity: 0.5 }} />
         </View>
      </View>
    </TouchableOpacity>
  );
};

const SettingsScreen = ({ navigation }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  
  const { isDarkMode, toggleTheme, colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <CornerMask top left />
          <CornerMask top right />
          <CornerMask bottom left />
          <CornerMask bottom right />
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>OPTIONS</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <View style={styles.section}>
          <CornerMask top left />
          <CornerMask top right />
          <CornerMask bottom left />
          <CornerMask bottom right />
          
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>THEME</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.settingText, { fontSize: 10, marginRight: 8 }]}>LIGHT</Text>
            <RetroSwitch 
               value={isDarkMode} 
               onValueChange={toggleTheme} 
               COLORS={COLORS}
            />
            <Text style={[styles.settingText, { fontSize: 10, marginLeft: 8 }]}>DARK</Text>
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>SOUND</Text>
          <RetroSwitch 
             value={soundEnabled} 
             onValueChange={setSoundEnabled} 
             COLORS={COLORS}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.settingText}>HAPTICS</Text>
          <RetroSwitch 
             value={vibrationEnabled} 
             onValueChange={setVibrationEnabled} 
             COLORS={COLORS}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 40,
  },
  backButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    position: 'relative',
  },
  backButtonText: {
    fontFamily: 'PressStart2P',
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  title: {
    fontFamily: 'PressStart2P',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  section: {
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    position: 'relative',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.textPrimary,
  },
  settingText: {
    fontFamily: 'PressStart2P',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});

export default SettingsScreen;
