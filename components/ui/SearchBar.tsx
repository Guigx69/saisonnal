import { Theme } from "@/constants/theme";
import {
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";

export type SearchBarProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function SearchBar({
  containerStyle,
  inputStyle,
  placeholderTextColor = Theme.muted,
  accessibilityLabel,
  ...rest
}: SearchBarProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        accessibilityLabel={accessibilityLabel ?? rest.placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, inputStyle]}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.card,
    borderRadius: Theme.r.l,
    borderWidth: 1,
    borderColor: Theme.line,
    padding: Theme.space[14],
    ...Theme.shadows.soft,
  },
  input: {
    minHeight: 48,
    borderRadius: Theme.r.m,
    paddingHorizontal: Theme.space[14],
    borderWidth: 1,
    borderColor: Theme.line,
    backgroundColor: Theme.softBg,
    color: Theme.text,
    fontSize: Theme.typography.sizes.body,
    lineHeight: Theme.typography.lineHeights.body,
    fontWeight: Theme.typography.weights.bold,
  },
});
