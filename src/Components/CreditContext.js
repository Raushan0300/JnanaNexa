import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreditContext = createContext();

export const CreditProvider = ({ children }) => {
  const [credits, setCredits] = useState(0);
  useEffect(() => {
    const loadCredits = async () => {
      try {
        const storedCredits = await AsyncStorage.getItem('credits');
        setCredits(storedCredits ? parseInt(storedCredits) : 0);
      } catch (error) {
        console.error('Error loading credits from AsyncStorage:', error);
      }
    };

    loadCredits();
  }, []);

  const addCredits = async (amount) => {
    try {
      setCredits((prevCredits) => prevCredits + amount);
      await AsyncStorage.setItem('credits', (credits + amount).toString());
    } catch (error) {
      console.error('Error updating credits and saving to AsyncStorage:', error);
    }
  };

  const contextValue = {
    credits,
    addCredits,
  };

  return (
    <CreditContext.Provider value={contextValue}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredit = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredit must be used within a CreditProvider');
  }
  return context;
};
