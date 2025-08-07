export type FormData = {
  floor: number;
  maxFloor: number;
  ageOfBuilding: string;
  distSea: string;
  title: string;
  minPrice: number;
  maxPrice: number;
  baths: number;
  maxBaths: number;
  beds: number;
  maxBeds: number;
  sqt: number;
  maxSqt: number;
  distShop: number;
  distAirport: number;
  distHospital: number;
  // brochureLink: string;
  buyPropertyLink: string;
  availablePropertyLink: string;
  mapLink: string;
  shopType: "m" | "km";
  airportType: "m" | "km";
  hospitalType: "m" | "km";
  seaType: "m" | "km";
};
export type HeatType = { id: number; name: string; heating_type_key: string };
export type LandType = { id: number; name: string; landscape_key: string };
export type AddPropertyDataType = {
  locs: {
    id: number;
    location_name: string;
    location_key: string;
  }[];
  types: { id: number; name: string }[];
  tags: { id: number; name: string; tag_key: string }[];
  features: { id: number; name: string }[];
  landscapesData: LandType[];
  heating: HeatType[];
  typeHouses: { id: number; name: string }[];
  propertyDetails: {
    id: number;
    title: string;
    location: string;
    area: string;
    price: number;
    price_min: number;
    price_max: number;
    money_type: "euro" | "ruble" | "dollar";
    bathroom: number;
    bed_room: string;
    metrage: number;
    type: null;
    is_multi: boolean;
    max_bath: number;
    max_bed: number;
    max_sqt: number;
    max_floor: number;
    details: string;
    buy_media: string;
    available_media: string;
    dist_shopping: number;
    dist_airport: number;
    dist_hospital: number;
    download: string;
    location_map: string;
    building_floor: number;
    age_of_the_building: number;
    furnished_sale: boolean;
    dist_sea: number;
    dist_shopping_type: "m" | "km";
    dist_airport_type: "m" | "km";
    dist_hospital_type: "m" | "km";
    dist_sea_type: "m" | "km";
    images: {
      id: number;
      file_name: string;
      image_order: number;
    }[];
    dowloads: {
      id: number;
      name: string;
      file_order: number;
    }[];
    tags: {
      id: number;
      name: string;
      tag_key: string;
    }[];
    features: {
      id: number;
      name: string;
    }[];
    landscapes: {
      id: number;
      name: string;
      landscape_key: string;
    }[];
    heatingTypes: {
      id: 3;
      name: string;
      heating_type_key: string;
    }[];
    houseTypes: {
      id: number;
      name: string;
    }[];
    types: {
      id: number;
      name: string;
    }[];
  };
};

export type ImgsPropType = {
  id: number;
  file_name: string;
  image_order: number;
};
export type TypeItemType = {
  id: number;
  name: string;
  type_id: number;
};
export type PropItemType = {
  area: string;
  bathroom: number;
  bed_room: string;
  id: number;
  images: ImgsPropType[];
  location: string;
  metrage: number;
  price: number;
  title: string;
  type: string | null;
  money_type: "euro" | "ruble" | "dollar";
  is_multi: 0 | 1;
  types: TypeItemType[];
};
export type GetRealEstatesType = {
  properties: PropItemType[];
  count:number;
};
