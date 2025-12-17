import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MyModal({ modal, setModal, children }: { modal: any, setModal: any, children: any }) {
    return (
        <Modal
            visible={modal}
            transparent
            animationType="fade"
        // onRequestClose={() => setModal(false)}
        >
            <View style={styles.modalBox}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModal(false)}
                    style={styles.overlay}
                />
                <View style={styles.insideModal}>
                    {children}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000dc',
    },
    insideModal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
});