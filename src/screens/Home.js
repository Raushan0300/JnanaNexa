import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import Modal from 'react-native-modal';
import Menu from '../Components/Menu';
import { BannerAd, BannerAdSize, RewardedAd, AdEventType, RewardedAdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { useCredit } from '../Components/CreditContext';

const bannerAdUnit=process.env.EXPO_PUBLIC_BANNER_AD_UNIT;
const rewardedAdUnit=process.env.EXPO_PUBLIC_REWARDED_AD_UNIT;

const Home = () => {

  const [rewardedAds, setRewardedAds]=useState(null);

  const { credits, addCredits } = useCredit();

  useEffect(()=>{
    initRewarded();
  },[])

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
  }

  const [modalVisibility, setModalVisibility]=useState(false);

  const handleOpenModal = () => {
    setModalVisibility(true);
  };

  const handleCloseModal = () => {
    setModalVisibility(false);
  };

  return (
    <View>

      <Text style={styles.statuscontainer}>JnanaNexa</Text>
      <View style={{marginTop:10}}>
        <BannerAd unitId={bannerAdUnit} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}></BannerAd>
      </View>

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
                <Button title='Watch Ad (+1 cr)' onPress={showRewardedAd}></Button>
              ):<Text>Ad Loading...</Text>}
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />

      <View>
        <Menu/>
      </View>

      <View style={{marginTop:120, alignItems:'center', justifyContent:'center'}}>
        <BannerAd unitId={bannerAdUnit} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}></BannerAd>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
    statuscontainer:{
      fontSize:38,
      fontWeight:'bold',
      backgroundColor:'#d0d2ff',
      borderRadius:12,
      color:'#FFFDD0',
      paddingVertical:25,
      width:'100%',
      textAlign:'center',
      justifyContent:'center',
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
    }
  });


export default Home

