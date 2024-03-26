import React, { forwardRef } from 'react';
import { StyleSheet, View, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const SearchBar = forwardRef<TextInput, TextInputProps>((props, ref) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.search,
      {
        backgroundColor: isDarkMode ? Colors.dark.lightBackground : Colors.light.lightBackground
      }
      ]}>
        <Ionicons name="search" size={24} color="gray" style={styles.leftIcon} />
        <TextInput
          ref={ref}
          {...props}
          style={[styles.input, props.style]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
    borderRadius: 12,
    paddingVertical: 5,
    borderWidth: 0,
  },
  leftIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
});

export default SearchBar;