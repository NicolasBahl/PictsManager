import React, { useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ScrollView, Animated, Modal } from 'react-native';
import { Text } from "@/components/Themed";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface AlbumSelectorProps {
	albums: string[];
	selectedAlbum: string;
	onAlbumSelect: (album: string) => void;

}

export const AlbumSelector: React.FC<AlbumSelectorProps> = ({ albums, selectedAlbum, onAlbumSelect }) => {
	const albumRef = useRef<TouchableOpacity>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === 'dark';

	return (
		<>
			<TouchableOpacity
				ref={albumRef}
				onPress={() => {
					if (albumRef.current) {
						albumRef.current.measure((x, y, width, height, pageX, pageY) => {
							setModalPosition({
								x: pageX,
								y: (albums.length > 3) ? pageY - (270 - height) : pageY - (height * (albums.length - 1))
							});
							setIsMenuOpen(true);
						});
					}
				}}
				style={[styles.albumContainer, styles.oneAlbum,
				{
					backgroundColor: isDarkMode ? Colors.dark.lightBackground : Colors.light.lightBackground
				}
				]}
			>
				<Image
					source={require("@/assets/images/placeholder.jpg")}
					style={styles.albumIcon}
				/>
				<Text style={styles.albumName}>{selectedAlbum}</Text>
			</TouchableOpacity>
			<Modal
				visible={isMenuOpen}
				transparent
				onRequestClose={() => setIsMenuOpen(false)}
			>
				<Animated.View style={[styles.modalContainer, { top: modalPosition.y, left: modalPosition.x }]}>
					<ScrollView>
						{albums.map((album, index) => (
							<TouchableOpacity
								activeOpacity={1}
								key={album}
								onPress={() => {
									onAlbumSelect(album);
									setIsMenuOpen(false);
								}}
								style={[
									styles.albumContainer,
									index === 0 ? styles.firstAlbum : {},
									index === albums.length - 1 ? styles.lastAlbum : {},
									{
										backgroundColor: isDarkMode ? Colors.dark.lightBackground : Colors.light.lightBackground
									}
								]}
							>
								<Image
									source={require("@/assets/images/placeholder.jpg")}
									style={styles.albumIcon}
								/>
								<Text style={styles.albumName}>{album}</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</Animated.View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	albumContainer: {
		alignContent: "center",
		alignItems: "center",
		flexDirection: "row",
		height: 80,
		width: "80%",
	},
	firstAlbum: {
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	lastAlbum: {
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	oneAlbum: {
		borderRadius: 8,
	},
	albumIcon: {
		width: 72,
		height: 72,
		borderRadius: 4,
		margin: 4,
		resizeMode: "cover",
	},
	albumName: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 8
	},
	modalContainer: {
		position: "absolute",
		display: "flex",
		flexDirection: "column",
		width: "100%",
		maxHeight: 270,
	},
});