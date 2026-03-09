import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Home: undefined;
    MosqueDetails: {
        placeId: string;
        name?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
    };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type MosqueDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'MosqueDetails'>;
