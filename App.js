import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreditProvider } from './src/Components/CreditContext';
import React, {useEffect, useState} from 'react';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

import Home from './src/screens/Home';
import ImageH from './src/screens/ImageH';
import ImageS from './src/screens/ImageS';
import GPT35 from './src/screens/GPT35';
import GPT4 from './src/screens/GPT4';


const intersitialAdUnit=process.env.EXPO_PUBLIC_INTERSTITIAL_AD_UNIT;

export default function App() {
  const Stack = createNativeStackNavigator();
  const [intersitialAds, setIntersitialAds]=useState(null);

  useEffect(()=>{
    initIntersitial();
  },[])

  const initIntersitial=async()=>{
    const intersitialAd = InterstitialAd.createForAdRequest(intersitialAdUnit);
    intersitialAd.addAdEventListener(AdEventType.LOADED,()=>{
      setIntersitialAds(intersitialAd)
      console.log("Intersitial Ad Loaded");
    });

    intersitialAd.addAdEventListener(AdEventType.CLOSED,()=>{
      console.log("Intersitial Ad Closed");
    });
    intersitialAd.load();
  }

  const showIntersitialAd=async ()=>{
    if(intersitialAds){
      intersitialAds.show();
    }
  }

  showIntersitialAd();
  return (
    <CreditProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} options={{headerShown:false}}/>

        <Stack.Screen name='ImageH' component={ImageH} options={{headerShown:false}}/>

        <Stack.Screen name='ImageS' component={ImageS} options={{headerShown:false}}/>

        <Stack.Screen name='GPT35' component={GPT35} options={{headerShown:false}}/>

        <Stack.Screen name='GPT4' component={GPT4} options={{headerShown:false}}/>
        
        </Stack.Navigator> 
    </NavigationContainer>
    </CreditProvider>
  );
}