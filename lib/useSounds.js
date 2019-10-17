import { Audio } from 'expo-av';
import { Sounds } from './theme';

const useSounds = () => {
  Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

  const playInquisitiveNotification = async () => {
    try {
      const { sound: soundObject, status } = await Audio.Sound.createAsync(
        // require('../../assets/sounds/birdroid.mp3'),
        Sounds.Inquisitive,
        { shouldPlay: true }
      );
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  const playInboxNotification = async () => {
    try {
      const { sound: soundObject, status } = await Audio.Sound.createAsync(
        // require('../../assets/sounds/birdroid.mp3'),
        Sounds.Inbox,
        { shouldPlay: true }
      );
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  const playFallingInPlaceNotification = async () => {
    try {
      const { sound: soundObject, status } = await Audio.Sound.createAsync(
        // require('../../assets/sounds/birdroid.mp3'),
        Sounds.FallingInPlace,
        { shouldPlay: true }
      );
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  return {
    playInquisitiveNotification,
    playInboxNotification,
    playFallingInPlaceNotification,
  };
};

export default useSounds;
