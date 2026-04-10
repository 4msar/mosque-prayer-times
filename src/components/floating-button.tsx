import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const FloatingButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
            <Text
                style={{
                    color: "#fff",
                    fontSize: 32,
                    transform: "rotate(-45deg)",
                }}
            >
                ➤
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#22ad65ff",
        justifyContent: "center",
        alignItems: "center",
    },
});
