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
