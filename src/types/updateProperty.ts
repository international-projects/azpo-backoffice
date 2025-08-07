type n = number;
type s = string;
export type DetailsPropType = {
  id: n;
  title_ru: n | null;
  location_ru: s | null;
  area_ru: s | null;
  price: n;
  price_min: n;
  price_max: n | null;
  money_type: "euro" | "dollar" | "ruble";
  bathroom: number;
  bed_room: s;
  metrage: n;
  tag_ru: null;
  type_ru: null;
  is_multi: boolean;
  max_bath: n;
  max_bed: n;
  max_sqt: n;
  max_floor: n | null;
  details_des_ru: s | null;
  buy_media_ru: "azpo.com";
  available_media_ru: "azpo.com";
  dist_shopping: 10;
  dist_airport: 40;
  dist_hospital: 1;
  download_ru: "";
  location_map: "https://maps.app.goo.gl/EZjNPQEuwtqjFrKP9";
  building_floor: 1;
  age_of_the_building: 2025;
  furnished_sale: 0;
  dist_sea: 450;
  dist_shopping_type: "m";
  dist_airport_type: "km";
  dist_hospital_type: "km";
  dist_sea_type: "m";
  images: {
    id: n;
    file_name: s;
    image_order: n;
  }[];
  dowloads: [
    {
      id: n;
      name_ru:s;
      file_order: 1;
    }
  ];
  tags: [
    {
      id: 10;
      name_ru: "Новостройка";
      tag_key: "new_building";
    },
    {
      id: 11;
      name_ru: "От застройщика";
      tag_key: "from_the_developer";
    },
    {
      id: 15;
      name_ru: "Под Гражданство";
      tag_key: "under_citizenship";
    },
    {
      id: 16;
      name_ru: "Элитное";
      tag_key: "elite";
    },
    {
      id: 18;
      name_ru: "Премиум класс";
      tag_key: "premium_class";
    },
    {
      id: 19;
      name_ru: "Вид на море";
      tag_key: "sea_view";
    },
    {
      id: 20;
      name_ru: "Инвестиции";
      tag_key: "investments";
    }
  ];
  features: [
    {
      id: 14;
      name_ru: "Закрытая парковка";
    },
    {
      id: 17;
      name_ru: "Зона отдыха";
    },
    {
      id: 32;
      name_ru: "Фитнес";
    }
  ];
  landscapes: [
    {
      id: 1;
      name_ru: "Город";
      landscape_key: "landscape";
    },
    {
      id: 5;
      name_ru: "Море";
      landscape_key: "sea";
    },
    {
      id: 6;
      name_ru: "Природа";
      landscape_key: "nature";
    }
  ];
  heatingTypes: [
    {
      id: 3;
      name_ru: "Кондиционер";
      heating_type_key: "air_conditioning";
    }
  ];
  houseTypes: [
    {
      id: 8;
      name: "1+1";
    }
  ];
  types: [
    {
      id: 1;
      name_ru: "Квартиры";
    }
  ];
};
