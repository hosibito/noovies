import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Linking, TouchableOpacity, Share, Platform } from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Movie, MovieDetails, MovieResponse, moviesApi, TV, tvApi, TVDetails, TVResponse } from "../api";
import Poster from "../components/Poster";
import { makeImgPath } from "../utils";
import { BLACK_COLOR } from "../colors";
import { useQuery } from "react-query";
import Loader from "../components/Loader";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Header = styled.View`
  height: ${SCREEN_HEIGHT / 4}px;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const Background = styled.Image``;

const Column = styled.View`
  flex-direction: row;
  width: 80%;
`;
const Title = styled.Text`
  color: white;
  font-size: 36px;
  align-self: flex-end;
  margin-left: 15px;
  font-weight: 500;
`;

const Data = styled.View`
  padding: 0px 20px;
`;

const Overview = styled.Text`
  color: ${(props) => props.theme.textColor};
  margin: 20px 0px;
`;

const VideoBtn = styled.TouchableOpacity`
  flex-direction: row;
`;
const BtnText = styled.Text`
  color: #c5c5c5;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 24px;
  margin-left: 10px;
`;

type RootStackParamList = {
  Detail: Movie | TV;
};

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, "Detail">;

const Detail: React.FC<DetailScreenProps> = ({
  navigation: { setOptions },
  route: { params },
}) => {
  const isMovie = "original_title" in params;

  const { isLoading, data } = useQuery<MovieResponse | TVResponse>(
    [isMovie ? "movies" : "tv", params.id],
    isMovie ? moviesApi.detail: tvApi.detail 
  );
  
  let unknowdata = data as unknown
  const getData = isMovie ? unknowdata as MovieDetails : unknowdata as TVDetails

  const shareMedia = async() => {
    const isAndroid = Platform.OS === "android"
    const homepage = isMovie ? `https://www.imdb.com/title/${ (getData as MovieDetails).imdb_id }/` : getData.homepage
    if (isAndroid) {
      await Share.share({
        message: `${params.overview}\nCheck it out: ${homepage}`,
        title:
          "original_title" in params
            ? params.original_title
            : params.original_name,
      });
    } else {
      await Share.share({
        url: homepage,
        title:
          "original_title" in params
            ? params.original_title
            : params.original_name,
      });
    }
  }
  const ShareButton = () => (
    <TouchableOpacity onPress={shareMedia}>
      <Ionicons name="share-outline" color="white" size={24} />
    </TouchableOpacity>
  );
  console.log("isMovie: ", isMovie)
  // const { isLoading: moviesLoading, data: moviesData } = useQuery(
  //   ["movies", params.id],
  //   moviesApi.detail,
  //   {
  //     enabled: "original_title" in params,
  //   }
  // );
  // const { isLoading: tvLoading, data: tvData } = useQuery(
  //   ["tv", params.id],
  //   tvApi.detail,
  //   {
  //     enabled: "original_name" in params,
  //   }
  // );
  useEffect(() => {
    setOptions({
      title: "original_title" in params ? "Movie" : "TV Show",
    });
  }, []);
  useEffect(() => {
    if (data) {
      setOptions({
        headerRight: () => <ShareButton />,
      });
    }
  }, [data]);
  
  // console.log("aaaa", data )
  // let getData 
  // if (!isLoading){
  //   let unknowdata = data as unknown
  //   getData = isMovie ? unknowdata as MovieDetails : unknowdata as TVDetails
  // }
  
  // const allLoding = moviesLoading && tvLoading;
  // const allData = isMovie ?  (moviesData as unknown) as MovieDetails:(tvData as unknown) as TVDetails;
  // console.log(allData.videos)
  const openYTLink = async (videoID: string) => {
      const baseUrl = `https://m.youtube.com/watch?v=${videoID}`;
      console.log(baseUrl)
    await Linking.openURL(baseUrl);
    //await WebBrowser.openBrowserAsync(baseUrl);
  };
  return (
    <Container>
      <Header>
        <Background
          style={StyleSheet.absoluteFill}
          source={{ uri: makeImgPath(params.backdrop_path || "") }}
        />
        <LinearGradient
          colors={["transparent", BLACK_COLOR]}
          style={StyleSheet.absoluteFill}
        />
        <Column>
          <Poster path={params.poster_path || ""} />
          <Title>
            {"original_title" in params
              ? params.original_title
              : params.original_name}
          </Title>
        </Column>
      </Header>
      <Data>
        <Overview>{params.overview}</Overview>
        {isLoading ? <Loader /> : null}
        {getData?.videos.results.map((video) =>
          video.site === "YouTube" ? (
            <VideoBtn key={video.key} onPress={() => openYTLink(video.key)}>
              <Ionicons name="logo-youtube" color="white" size={24} />
              <BtnText>{video.name}</BtnText>
            </VideoBtn>
          ) : null
        )}
      </Data>
    </Container>
  );
};
export default Detail;