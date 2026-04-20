import { useState, useEffect, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

export const useContacts = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadContacts = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts to display them.',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLoading(false);
          return;
        }
      }

      const contacts = await Contacts.getAll();
      const sorted = contacts.sort((a, b) => 
        (a.displayName || '').localeCompare(b.displayName || '')
      );
      setAllContacts(sorted);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    loadContacts();
  }, []);

  return { allContacts, loading, refreshing, refresh };
};