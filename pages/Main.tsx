import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { Fontisto } from '@expo/vector-icons';

import { WEATHER_KEY } from '@env';
import axios from 'axios';

import { locationType, localTpe, weatherConditions } from '../types/main';

const Conditions: weatherConditions = {
  Clouds: {
    icon: 'cloudy',
    gradient: ['#bbb', 'white'],
  },
  Clear: {
    icon: 'day-sunny',
    gradient: ['#64b3f4', '#c2e59c'],
  },
  Atmosphere: {
    icon: 'cloudy-gusts',
    gradient: ['#4DA0B0', '#D39D38'],
  },
  Snow: {
    icon: 'snow',
    gradient: ['snow', 'white'],
  },
  Rain: {
    icon: 'rains',
    gradient: ['#bdc3c7', '#2c3e50'],
  },
  Drizzle: {
    icon: 'rain',
    gradient: ['gray', '#bbb'],
  },
  Thunderstorm: {
    icon: 'lightning',
    gradient: ['#0B0B61', 'gray'],
  },
};

const initialLocation = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

type Props = {};

function Main({}: Props) {
  const [location, setLocation] = useState<localTpe>(); // 위도, 경도
  const [cityInfo, setCityInfo] = useState<string>('collecting..'); // 길 이름, 도시 이름
  const [temp, setTemp] = useState<number>(0);
  const [minTemp, setMinTemp] = useState<number>(0);
  const [maxTemp, setMaxTemp] = useState<number>(0);
  const [desc, setDesc] = useState<string>('');
  const [weather, setWeather] = useState<string>('Clouds');
  const [coord, setCoord] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });

  // 위치, 날씨 조회

  useEffect(() => {
    const fetchData = async () => {
      await getLocation();
      if (location) {
        getWeather();
      }
    };
    fetchData();
  }, [location]);

  // 위치정보(위도, 경도)
  const locationInfo = {
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
  };

  // 위치 조회
  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      return;
    } else {
      // expo-location 라이브러리의 api 로 현재 위치 위도, 경도 값 가져오기
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      setLocation({ latitude, longitude });

      // 위도, 경도로 해당 위치 정보 가져오기()
      const [locationInfo]: locationType[] = await Location.reverseGeocodeAsync({ latitude, longitude });

      console.log(locationInfo);

      // 위치정보 상태 업데이트
      const updatedCityInfo = `${locationInfo.street}, ${locationInfo.region}`;
      setCityInfo(updatedCityInfo);
    }
  };

  // 날씨 조회

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${locationInfo.latitude}&lon=${locationInfo.longitude}&cnt=1&units=metric&appid=${WEATHER_KEY}`
      );
      console.log(response);
      setTemp(response.data.list[0].main.temp.toFixed(0));
      setMinTemp(response.data.list[0].main.temp_min.toFixed(0));
      setMaxTemp(response.data.list[0].main.temp_max.toFixed(0));
      setCoord(response.data.city.coord);
      setDesc(response.data.list[0].weather[0].description);
      setWeather(response.data.list[0].weather[0].main);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <LinearGradient colors={Conditions[weather].gradient} style={{ flex: 1 }}>
      <View style={styles.cityWrap}>
        <View style={styles.refr}>
          <Text style={styles.city}>{cityInfo}</Text>
        </View>
        <Text style={styles.coords}>
          {coord.lat} * {coord.lon}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.temp}>{temp}°</Text>

          <View style={{ alignItems: 'center', marginLeft: 20, alignSelf: 'center' }}>
            <Text style={{ fontSize: 35 }}>{minTemp}°</Text>
            <Text style={{ fontSize: 35 }}>{maxTemp}°</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', alignSelf: 'center', marginTop: 20 }}>
          <View style={{ gap: 3, justifyContent: 'center' }}>
            <Text style={styles.weather}>{weather}</Text>
            <Text style={styles.desc}>{desc}</Text>
          </View>
          <Fontisto name={Conditions[weather]?.icon} size={30} style={{ marginTop: 8 }} />
        </View>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={initialLocation}
          region={{
            latitude: coord.lat,
            longitude: coord.lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType='mutedStandard'
        ></MapView>
      </View>
      <StatusBar style='auto' />
    </LinearGradient>
  );
}

export default Main;

const styles = StyleSheet.create({
  cityWrap: {
    flex: 1.2,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },
  refr: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  city: {
    fontSize: 30,
    fontWeight: '700',
    color: '#202020',
  },
  body: {
    marginTop: -30,
    flex: 6,
    alignItems: 'center',
  },
  coords: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202020',
  },
  temp: {
    fontSize: 85,
    fontWeight: '700',
    color: '#202020',
  },
  weather: {
    fontSize: 22,
    fontWeight: '500',
    color: '#202020',
  },
  desc: {
    fontSize: 18,
    fontWeight: '500',
    color: '#202020',
  },

  subWrap: {
    marginTop: 20,
    backgroundColor: '#202020',
    borderRadius: 40,
    marginBottom: 10,
  },
  subtitles: {
    fontSize: 16,
    fontWeight: '700',
    color: '#eeeeee',
    padding: 8,
    paddingHorizontal: 16,
  },
  map: {
    borderRadius: 40,
    marginTop: 30,
    width: '80%',
    height: '60%',
  },
});
