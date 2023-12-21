import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, Button, Linking } from 'react-native';
import Modal from 'react-native-modal';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useCredit } from '../Components/CreditContext';

const rewardedAdUnit=process.env.EXPO_PUBLIC_REWARDED_AD_UNIT;

const MY_OPENAI_API_KEY=process.env.EXPO_PUBLIC_MY_OPENAI_API_KEY;

const ImageS = () => {

  const { credits, addCredits } = useCredit();

  const [textValue, setTextValue]=useState("");
  const [image, setImage]=useState(null);
  const [loading, setLoading]=useState(false);

  const [rewardedAds, setRewardedAds]=useState(null);


  async function downloadImage(){
    await Linking.openURL(image);
  }

  useEffect(()=>{
    initRewarded();
  },[])

  async function fetchData(){
    if(credits>=5){
      try{
        setLoading(true);
        setImage(null);
        const response = await fetch('https://api.openai.com/v1/images/generations',
        {
          method:'POST',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MY_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "dall-e-2",
            prompt: textValue,
            n: 1,
            size: "512x512",
          }),
        });
  
        const data=await response.json();
        console.log(data);
        setImage(data.data[0].url);
        addCredits(-5)
  
      } catch(e){
        console.log(e);
      } finally{
        setLoading(false);
      };
    } else{
      setModalVisibility(true);
    }
  };

  const [modalVisibility, setModalVisibility]=useState(false);

  const handleOpenModal = () => {
    setModalVisibility(true);
  };

  const handleCloseModal = () => {
    setModalVisibility(false);
  };

  const initRewarded=async()=>{
    try {
      const rewardedAd = RewardedAd.createForAdRequest(rewardedAdUnit);
      rewardedAd.addAdEventListener(RewardedAdEventType.LOADED,()=>{
        setRewardedAds(rewardedAd)
        console.log("Rewarded Ad Loaded");
      });
      rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD,()=>{
        console.log("Rewarded ad earned");
        setRewardedAds(null);
        initRewarded();
      });
      rewardedAd.load();
    } catch (error) {
      console.log(error);
    }
  }

  const showRewardedAd=()=>{
    if(rewardedAds){
      rewardedAds.show();
      addCredits(1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize:38, fontWeight:'bold', backgroundColor:'#d0d2ff',
    borderRadius:12, color:'#FFFDD0', paddingVertical:25, width:'100%', textAlign:'center', justifyContent:'center'}}>JnanaNexa</Text>
    <Text style={{fontSize:27, fontWeight:'bold', backgroundColor:'#d0d2ff',
    borderRadius:12, color:'#FFFDD0', paddingVertical:5, width:'100%', textAlign:'center', justifyContent:'center', marginTop:-30}}>(DALL-E-2)</Text>
      <TouchableOpacity onPress={handleOpenModal} style={styles.creditButton}>
        <Text style={styles.creditButtonText}>Credits: {credits}</Text>
      </TouchableOpacity>

      <Modal animationIn={"bounceIn"} animationOut={"bounceOut"} backdropOpacity={0.5} isVisible={modalVisibility} onBackdropPress={handleCloseModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Credit Usage Rates</Text>
            <Text style={styles.modalsubText}>GPT-3.5 : 1 cr/10 chats</Text>
            <Text style={styles.modalsubText}>GPT-4 : 1 cr/2 chats</Text>
            <Text style={styles.modalsubText}>DALL-E-2 : 5 cr/1 image</Text>
            <Text style={styles.modalsubText}>DALL-E-3 : 8 cr/1 image</Text>
            <View style={{marginVertical:15}}>
            <Button title='close' onPress={handleCloseModal}></Button>
            </View>
            <View>
              {rewardedAds?(
                <Button title='Add Credit' onPress={showRewardedAd}></Button>
              ):<Text>Ad Loading...</Text>}
            </View>
          </View>
        </View>
      </Modal>
      <TextInput placeholder='Enter Your Imagination'
      value={textValue}
      onChangeText={(text)=>setTextValue(text)} style={styles.search}></TextInput>
      <TouchableOpacity style={styles.button} onPress={fetchData}>
        <Text style={{ fontSize:20, marginVertical:5,}}>Generate</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {image ? (
        <Image style={{width:256, height:256, contentFit:'cover', marginTop:20}}
        source={image} placeholder={'Loading...'}/>
      ):null}
      
      {image ? (
        <TouchableOpacity style={styles.downloadButton} onPress={downloadImage}>
          <Text style={styles.buttonText}>Download Image</Text>
        </TouchableOpacity>
      ):null}

      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex:1,
      alignItems:'center',
    },
    search: {
      marginTop:20,
      borderRadius:10,
      borderWidth:1.8,
      fontSize:18,
      paddingHorizontal:10,
    },
    button:{
      color:'#007bf',
      backgroundColor: '#ff0000',
      borderWidth:1.4,
      marginTop: 10,
      paddingHorizontal:5,
      borderRadius:7,
    },
    downloadButton: {
      marginTop: 20,
      backgroundColor: '#4CAF50',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    buttonText: {
      fontSize: 20,
      color: '#fff',
    },
    creditButton:{
      backgroundColor:'#a1f6e1',
      width:120,
      alignSelf:'flex-end',
      marginHorizontal:10,
      marginTop:25,
      flexDirection:'row',
      borderRadius:5
    },
    creditButtonText:{
      textAlign:'center',
      marginHorizontal:5,
      fontSize:18,
      fontWeight:'bold',
    },
    modalsubText:{
      fontSize:17,
      textAlign:'center',
    },
    centeredView:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      marginTop:22,
    },
    modalView:{
      margin:20,
      backgroundColor:'white',
      borderRadius:20,
      padding:35,
      alignItems:'center',
      shadowColor:'#000',
      shadowOffset:{
        width:0,
        height:2,
      },
      shadowOpacity:0.25,
      shadowRadius:4,
      elevation:5,
    },
    modalText:{
      fontSize:24,
      marginBottom:20,
      textAlign:'center',
    },
  });


export default ImageS;

