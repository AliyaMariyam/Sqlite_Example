import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {useNavigation} from '@react-navigation/native';
  import {openDatabase} from 'react-native-sqlite-storage'

   let db = openDatabase({name:'UserDatabase.db'});

  const AddUser = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    //create table

    useEffect(()=>{
      db.transaction((txn)=>{
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user' ",
          [],
          (tx,res) => {
            console.log('item:',res.rows.length);
            if(res.rows.length == 0){
              txn.executeSql('DROP TABLE IF EXISTS table_user',[]);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT,user_name VARCHAR(20),user_email VARCHAR(50),user_address VARCHAR(255) )',
                [],
              )
            }
            else{
              console.log("already created table")
            }
          }
          )
      })
    },[])

    const saveData = () =>{
      db.transaction(txn =>{
        txn.executeSql(
          'INSERT INTO table_user( user_name,user_email,user_address) VALUES (?,?,?)',
          [name,email,address],
          (tex,res) => {
             if(res.rowsAffected == 1){
              navigation.goBack();
             }else{
              console.log(res)
             } 
          },
          error =>{
            console.log(error)
          },  
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
          style={[styles.input, {marginTop: 30}]}
        />
        <TextInput
          placeholder="Enter User Address"
          placeholderTextColor={'black'}
          value={address}
          onChangeText={txt => setAddress(txt)}
          style={[styles.input, {marginTop: 30}]}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            saveData();
          }}>
          <Text style={styles.btnText}>Save User</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default AddUser;
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