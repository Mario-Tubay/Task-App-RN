import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { FlatList, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, Dimensions, StyleSheet } from "react-native"
import uuid from 'react-native-uuid';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from "native-base";

export default function ScreenPrinciapl() {
    const [form, setForm] = useState({
        input: ""
    })
    const [data, setData] = useState([])
    const handleChange = (e: any) => {
        setForm({
            input: e
        })
    }
    const saveTarea = async () => {
        if (!form) return alert("No se puede guardar una tarea vacia")
        if (form.input.length < 3) return alert("La tarea debe tener al menos 3 caracteres")
        try {
            let arrItems: any = []
            await AsyncStorage.getItem('tarea').then((res: any) => {
                arrItems = JSON.parse(res)
                if (!arrItems) arrItems = []
                arrItems.push({
                    label: form.input,
                    state: "wait",
                    id: uuid.v4()
                })
            })
            await AsyncStorage.setItem('tarea', JSON.stringify(arrItems))
            getItem()
            setForm({
                input: ""
            })
        } catch (error) {
            console.log(error)
            return alert("error")
        }
    }

    const getItem = () => {
        AsyncStorage.getItem('tarea').then((res: any) => {
            setData(JSON.parse(res))
        })
    }

    const changeStateTask = async (id: any, state: string) => {
        try {
            await AsyncStorage.getItem("tarea").then((res: any) => {
                let item = JSON.parse(res).find((val: any) => val.id === id)
                item.state = state
                let rest = JSON.parse(res).filter((val: any) => val.id !== id)
                rest.push(item)
                AsyncStorage.setItem("tarea", JSON.stringify(rest))
            })
        } catch (error) {
            console.log(error)
        }

        getItem()
    }



    useEffect(() => {
        getItem()
    }, [])
    return (
        <>
            <SafeAreaView>
                <View className="h-screen">

                <StatusBar />
                <View className="max-w-[90%] my-0 mx-auto">
                    <Text className="text-lg font-semibold mt-5 text-center mb-5">Agregar tarea</Text>
                    <View className="items-center justify-center">
                        <View className="flex-row items-center gap-3 ">
                            <TextInput value={form.input} onChangeText={handleChange} className="w-[75%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <TouchableOpacity className="bg-blue-400 p-2 text-center rounded-lg">
                                <Text onPress={saveTarea} className="font-semibold text-center text-blue-100">Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text className="text-lg font-semibold mt-5">Lista de tareas</Text>
                    {!data && <Text className="text-center mt-5">No hay tareas</Text>}
            <SafeAreaView>

                    <FlatList
                        data={data}
                        renderItem={({ item }: any) => {
                            return (
                                <View key={item.id} className="shadow-lg rounded-lg border-gray-100 border p-3 justify-between flex-row items-center mb-4">
                                    <View className="gap-2">
                                        <Text className={`font-semibold ${item.state === "cancel" ? "line-through" : ""}`}>{item.label}</Text>
                                        {
                                            item.state == "wait" &&
                                            <Text className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">En espera...</Text>
                                        }
                                        {
                                            item.state == "done" &&
                                            <Text className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Completada</Text>
                                        }
                                        {
                                            item.state == "cancel" &&
                                            <Text className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">Cancelada</Text>
                                        }
                                    </View>
                                    {
                                        item.state == "wait" && (
                                            <View className="flex-row gap-2">
                                                <TouchableOpacity onPress={() => changeStateTask(item.id, "done")} className="bg-green-500 p-1 rounded-lg">
                                                    <Text>
                                                        <AntDesign name="check" size={20} color="white" />
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => changeStateTask(item.id, "cancel")} className="bg-red-500 p-1 rounded-lg">
                                                    <Text>
                                                        <AntDesign name="close" size={20} color="white" />
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }

                                </View>
                            )
                        }}
                    />
            </SafeAreaView>

                </View>
                </View>

            </SafeAreaView>
        </>
    )
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    scrollViewContent: {
        height: height,
    },
})