import { View, Text, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

const Card = ({id, label, status}: any ) => {
    return (
        <View key={id} className="shadow-lg rounded-lg border-gray-100 border p-3 justify-between flex-row items-center">
            <View>
                <Text className="font-semibold">{label}</Text>
            </View>
            <View className="flex-row gap-2">
                <TouchableOpacity className="bg-green-500 p-1 rounded-lg">
                    <Text>
                        <AntDesign name="check" size={20} color="white" />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-500 p-1 rounded-lg">
                    <Text>
                        <AntDesign name="close" size={20} color="white" />
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Card