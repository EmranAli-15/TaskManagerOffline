import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Container({ children }: { children: any }) {
    return (
        <SafeAreaView>
            <View style={{ marginHorizontal: 10, height: "100%" }}>
                {
                    children
                }
            </View>
        </SafeAreaView>
    )
}