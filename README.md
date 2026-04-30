# Block Master: 8-Bit Edition

**Block Master: 8-Bit Edition** is a fast-paced, retro-styled endless runner game built with React Native and Reanimated. Dodge the falling blocks, survive as long as you can, and enjoy the nostalgic 8-bit aesthetics, complete with pixelated graphics, haptic feedback, and dynamic shatter effects!

## 🚀 Features

- **Endless Mechanics**: Survive an endless barrage of falling obstacles. The game speeds up as you play, testing your reflexes!
- **Retro 8-Bit Aesthetics**: 
  - Pixelated corners and authentic retro design language.
  - "Death Shatter" screen effects when you hit an obstacle.
  - Custom pixel-art style components.
- **High-Performance Physics & Animations**: 
  - Built completely on the UI thread using **React Native Reanimated** `useFrameCallback` for a buttery-smooth 60FPS experience.
  - Custom Object Pooling system to keep memory usage low and performance high.
- **Dynamic Feedback**:
  - Haptic feedback on interactions and collisions powered by `expo-haptics`.
  - Screen shake and flash effects for maximum impact.

## 🛠️ Technology Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Runtime**: [Expo](https://expo.dev/)
- **Animations & Game Loop**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Gestures**: [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **Haptics**: [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

## 📥 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nicatbayram/Block-Master-8-bit.git
   cd Block-Master-8-bit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on a device/emulator**:
   - Use the **Expo Go** app on iOS/Android to scan the QR code.
   - Press `a` for Android emulator or `i` for iOS simulator.

## 🎮 How to Play

1. Drag your finger horizontally across the screen to move the player block.
2. Dodge the falling obstacles.
3. Your score increases the longer you survive!
4. Hit an obstacle, and it's game over—but you can always try again to beat your high score.
