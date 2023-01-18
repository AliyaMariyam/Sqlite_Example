import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {useNavigation, useRoute} from '@react-navigation/native';
  import {openDatabase} from 'react-native-sqlite-storage'

   let db = openDatabase({name:'UserDatabase.db'});

  const EditUser = () => {
    
    const route = useRoute()
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    
    useEffect(()=>{
       setName(route.params.data.name )
       setEmail(route.params.data.email )
       setAddress(route.params.data.address )
    },[])

    const updateData = () =>{
       db.transaction(txn =>{
        txn.executeSql('UPDATE table_user set user_name=? ,user_email=?, user_address=? where user_id=?',
        [name, email, address, route.params.data.id],
        (tx,res)=>{
           navigation.goBack();
        } 
        )
       })
    }
     
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter User Name"
          placeholderTextColor={'black'}
          style={styles.input}
          value={name}
          onChangeText={txt => setName(txt)}
        />
        <TextInput
          placeholder="Enter User Email"
          placeholderTextColor={'black'}
          value={email}
          onChangeText={txt => setEmail(txt)}
          style={[styles.input, {marginTop: 20}]}
        />
        <TextInput
          placeholder="Enter User Address"
          placeholderTextColor={'black'}
          value={address}
          onChangeText={txt => setAddress(txt)}
          style={[styles.input, {marginTop: 20}]}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={()=>{
            updateData();
          }}
          >
          <Text style={styles.btnText}>Save User</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default EditUser;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    input: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      borderWidth: 1,
      alignSelf: 'center',
      paddingLeft: 20,
      marginTop: 100,
      borderColor:'black',
      color:'black'
    },
    addBtn: {
      backgroundColor: 'purple',
      width: '80%',
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      alignSelf: 'center',
    },
    btnText: {
      color: '#fff',
      fontSize: 18,
    },
  });