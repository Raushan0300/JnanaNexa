import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const Menu=()=>{
    const navigation=useNavigation();

    return(
        <View style={styles.Menu}>
            <View style={styles.cardRow}>
                <TouchableOpacity onPress={()=>navigation.navigate('GPT35')} style={styles.card}>
                    <Text style={styles.cardTitle}>GPT-3.5</Text>
                    <Text style={styles.cardSubtitle}>Access to ChatGPT 3.5 Turbo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('GPT4')} style={styles.card}>
                    <Text style={styles.cardTitle}>GPT-4</Text>
                    <Text style={styles.cardSubtitle}>Access to ChatGPT 4</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.cardRow}>
                <TouchableOpacity onPress={()=>navigation.navigate('ImageS')} style={styles.card}>
                    <Text style={styles.cardTitle}>DALL-E-2</Text>
                    <Text style={styles.cardSubtitle}>AI Image Generator (Low Quality)</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('ImageH')} style={styles.card}>
                    <Text style={styles.cardTitle}>DALL-E-3</Text>
                    <Text style={styles.cardSubtitle}>AI Image Generator (High Quality)</Text>
                </TouchableOpacity>
            </View>

            
        </View>
    );
};
const styles = StyleSheet.create({
    Menu:{
        padding:16,
    },
    cardRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:16,
    },
    card:{
        flex:1,
        backgroundColor:'white',
        borderRadius:8,
        padding:16,
        marginHorizontal:8,
    },
    cardTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      cardSubtitle: {
        marginTop:30,
        fontSize: 12,
        textAlign: 'center',
        // Adjust as needed
      },
})
export default Menu;