import * as React from 'react'
import * as RN from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { database } from '../config/fb';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Product from '../components/Products';

export default function Home()  {
    const navigation = useNavigation();
    const [products, setProducts] = React.useState([]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <RN.Button title="Agregar" onPress={() => navigation.navigate("Add")} />
              ),
        })
    },[])
    React.useEffect(() => {
        const collectionRef = collection(database,'products')
        const q = query(collectionRef,orderBy('createdAt','desc'))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // onSnapshot is a listener that listens to changes in the database in realtime
            console.log("querySnapshot unsusbscribe");
            setProducts(
              querySnapshot.docs.map((doc) => ({
                id: doc.id,
                emoji: doc.data().emoji,
                name: doc.data().name,
                price: doc.data().price,
                isSold: doc.data().isSold,
                createdAt: doc.data().createdAt,
              }))
            );
          });

          return unsubscribe
        
    },[])
    return(
        <RN.View style={styles.container}>
        <RN.ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <RN.Text style={styles.title}>Products</RN.Text>
          {products.map((product) => (
            <Product key={product.id} {...product} />
          ))}
          
        </RN.ScrollView>
      </RN.View>
    )
}

const styles = RN.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F3F9",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      margin: 16,
    },
  });