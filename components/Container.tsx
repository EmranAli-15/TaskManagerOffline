import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Container({ children }: { children: any }) {
    return (
        <SafeAreaView>
            <View style={{ height: "100%", backgroundColor: "#FFFFFF" }}>
                <View style={{ height: "100%" }}>

                    {
                        children
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}