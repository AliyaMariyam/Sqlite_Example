import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage'

let db = openDatabase({name:'UserDatabase.db'})



const Home = () => {

    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [userList, setUserList] = useState([]);

    const getData = () =>{
        db.transaction(txn => {
            txn.executeSql("SELECT * FROM table_user",[],
             (tx,res) =>{
                let temp = [];
                for( i = 0; i < res.rows.length; ++i){
                    console.log(res.rows.item(i));
                    temp.push(res.rows.item(i))
                }
                setUserList(temp)
            })
         })
    }

    useEffect(()=>{
        getData()
    },[isFocused ])
 

    const deleteUser = id =>{
        db.transaction(txn =>{
            txn.executeSql(
                'DELETE FROM table_user where user_id=?',
                [id],
                (tx,res) =>{
                    getData();
                }
            )
        })
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={userList}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{marginTop:30}}>
                        <TouchableOpacity style={styles.userItem }>
                            <Text style={{color:'black'}}>{'Name: '+item.user_name}</Text>
                            <Text style={{color:'black'}}>{'Email: '+item.user_email}</Text>
                            <Text style={{color:'black'}}>{'Address: '+item.user_address}</Text>

                            <View style={styles.belowView}>
                               <TouchableOpacity 
                               onPress={()=>navigation.navigate('EditUser',{
                                data:{
                                   name:item.user_name,
                                   email:item.user_email,
                                   address:item.user_address,
                                   id:item.user_id
                                },
                               })}
                               
                               >
                                <Image 
                                source={require('../images/edit.png')} 
                                style={styles.icons}
                                />
                               </TouchableOpacity>
                              
                               <TouchableOpacity onPress={()=>{
                                deleteUser(item.user_id)
                               }}>
                                <Image 
                                source={require('../images/delete.png')} 
                                style={styles.icons}
                                />
                               </TouchableOpacity>

                            </View>

                        </TouchableOpacity>
                        </View>
                    );
                }}
            />
            <TouchableOpacity
                style={styles.addNewBtn}
                onPress={() => {
                    navigation.navigate('AddUser');
                }}>
                <Text style={styles.btnText}>Add New User</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    addNewBtn: {
        backgroundColor: 'purple',
        width: 150,
        height: 50,
        borderRadius: 20,
        position: 'absolute',
        bottom: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
    },
    userItem: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 10,
        marginHorizontal:20
    },
    itemText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    belowView: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 20,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        height: 50,
    },
    icons: {
        width: 24,
        height: 24,
    },
});
