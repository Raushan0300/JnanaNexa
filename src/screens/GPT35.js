import { FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity, Button } from 'react-native';
import Modal from 'react-native-modal';
import React, { useState, useRef, useEffect } from 'react';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useCredit } from '../Components/CreditContext';

const rewardedAdUnit=process.env.EXPO_PUBLIC_REWARDED_AD_UNIT;

const MY_OPENAI_API_KEY=process.env.EXPO_PUBLIC_MY_OPENAI_API_KEY;

const GPT35 = () => {
  const scrollViewRef = useRef();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { credits, addCredits } = useCredit();

  const [rewardedAds, setRewardedAds]=useState(null);

  useEffect(()=>{
    initRewarded();
  },[])

  const sendMessage = async () => {
    if(credits>=0.1){
      setLoading(true);
    scrollViewRef.current.scrollToEnd({ animated: true });
    if (!input.trim()){
      setLoading(false);
      alert("Please input Your Message");
      return;
    }

    const newUserMessage = { text: input, user: true };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput('');
    try{
      const response = await fetch('https://api.openai.com/v1/chat/completions',
      {
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MY_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
          model: "gpt-3.5-turbo",
          n:1,
          temperature:0.3,
        }),
      });
      const data=await response.json();
      const chat=data.choices[0]?.message?.content;
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, { text: chat, user: false }]);
      addCredits(-0.1)
      scrollViewRef.current.scrollToEnd({ animated: true });

    } catch(e){
      console.log(e);
    } finally{
      setLoading(false);
    };
    } else{
      setModalVisibility(true)
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
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{fontSize:38, fontWeight:'bold', backgroundColor:'#d0d2ff',
    borderRadius:12, color:'#FFFDD0', paddingVertical:25, width:'100%', textAlign:'center', justifyContent:'center'}}>JnanaNexa</Text>
    <Text style={{fontSize:27, fontWeight:'bold', backgroundColor:'#d0d2ff',
    borderRadius:12, color:'#FFFDD0', paddingVertical:5, width:'100%', textAlign:'center', justifyContent:'center', marginTop:-30}}>(GPT-3.5 Turbo)</Text>
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
      <FlatList style={{marginTop:15}}
        ref={scrollViewRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ alignItems: item.user ? 'flex-end' : 'flex-start', marginVertical: 5, marginHorizontal:15}}>
            <View
              style={{
                padding: 10,
                backgroundColor: item.user ? '#DCF8C5' : '#E5E5E5',
                borderRadius: 10,
              }}
            >
              <Text>{item.text}</Text>
            </View>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, margin: 5, padding: 10, borderRadius:12 }}
          onChangeText={(text) => setInput(text)}
          value={input}
          placeholder="Type your message..."
        />
        {loading?(
          <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, margin: 5, borderRadius: 12 }}>
            <Text style={{color:'white'}}>Wait..</Text>
        </TouchableOpacity>
        ):<TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, margin: 5, borderRadius: 12 }}
        onPress={sendMessage}>
          <Text style={{color:'white'}}>Send</Text>
      </TouchableOpacity>}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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
})
export default GPT35

