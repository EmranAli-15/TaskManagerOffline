import Container from '@/components/Container';
import React, { useCallback, useState } from 'react';
import { Button, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

type TNote = {
    id: number,
    head: string,
    body: string;
}

export default function Index() {
    const [data, setData] = useState([
        { id: 1, head: "#77BEF0", body: "#CBDCEB" },
        { id: 2, head: "#ffdc75", body: "#fff2cc" },
        { id: 3, head: "#eca3a3", body: "#f6d6d6" },
        { id: 4, head: "#a5d732", body: "#ddf0b2" },
        { id: 5, head: "#d94c9f", body: "#f4cce3" },
        { id: 6, head: "#875ab2", body: "#d2c1e2" },
        { id: 8, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
    ])

    const [numColumns, setNumColumns] = useState(1);

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setData(data);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    return (
        <Container>
            <Button
                title={numColumns === 1 ? "Grid View" : "List View"}
                onPress={() => setNumColumns(numColumns === 1 ? 2 : 1)}
            />

            <View>
                <FlatList
                    data={data}
                    numColumns={numColumns}
                    key={numColumns} // important
                    keyExtractor={(item: TNote, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.box}>

                            <View style={{ height: 10, backgroundColor: item.head }}></View>
                            <View style={{ height: 100, backgroundColor: item.body }}>
                                <Text style={styles.item}>
                                    Bolna amay tui bolna.
                                </Text>
                            </View>

                        </View>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    item: {
        margin: 10,
        fontSize: 18,
        color: "black",
    },
    box: {
        borderRadius: 10,
        overflow: "hidden",
        flex: 1,
        margin: 5,
    }
});