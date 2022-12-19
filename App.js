import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Fontisto } from "@expo/vector-icons";
import { SelectList } from 'react-native-dropdown-select-list'

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "db7b98102951eda39f1e61e9c3cd0bf7";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snowflake",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync()
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
    const json = await response.json();
    setDays(json.list)
  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.main}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color='white' style={{ marginTop: 10 }} />
          </View>
        )
          :
          days.map((day, index) =>
            <View key={index} style={styles.day}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.temp}>{parseFloat(day.main.temp - 273.15).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={50} color="white" />
              </View>
              <View style={styles.extraWeather} >
                <Text style={{ color: 'white', fontSize: 25 }}>최저기온 : {parseFloat(day.main.temp_min - 273.15).toFixed(1)}</Text>
                <Text style={{ color: 'white', fontSize: 25 }}>최고기온 : {parseFloat(day.main.temp_max - 273.15).toFixed(1)}</Text>
              </View>
              <Text style={{ color: 'white', fontSize: 30, marginTop: 100 }}>{day.dt_txt}</Text>
            </View>
          )
        }
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CE8467',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 48,
    fontWeight: '500',
    color: 'white'
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    fontSize: 120,
    marginTop: 50,
    marginRight: 10,
    padding: 10,
    color: 'white',
  },
  desc: {
    marginTop: 40,
    fontSize: 30,
    color: 'white',
  },
  extraWeather: {
    flexDirection: 'row',
    width: '100%',
    paddingRight: 20,
    paddingLeft: 20,
    justifyContent: 'space-between',
    color: 'white',
    alignItems: 'center',
    marginTop: 20
  }
})