import React from 'react';
import {Text, TextStyle, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface GradientTextProps {
  children: React.ReactNode;
  colors?: string[];
  style?: TextStyle;
  boldText?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors = ['#FF78C4', '#FF9A5A'],
  style = {},
  boldText = '',
}) => {
  const textArray =
    typeof children === 'string' ? children.split(boldText) : [children];

  return (
    <MaskedView
      maskElement={
        <Text style={[style]}>
          {textArray[0]}
          {boldText && (
            <Text style={[style, styles.boldTexts]}>{boldText}</Text>
          )}
          {textArray[1]}
        </Text>
      }>
      <LinearGradient colors={colors} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
        <Text style={[style, styles.hiddenText]}>
          {textArray[0]}
          {boldText && (
            <Text style={[style, {fontWeight: 'bold', opacity: 0}]}>
              {boldText}
            </Text>
          )}
          {textArray[1]}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  boldTexts: {
    fontWeight: 'bold',
  },
  hiddenText: {
    opacity: 0,
  },
});

export default GradientText;
