import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import type { CategoryIcon as CategoryIconKey } from '../types';

// Android vector drawables (ADR-0013). This map must stay in a component: Jest cannot load .xml.
const SOURCES: Record<CategoryIconKey, ImageSourcePropType> = {
  astronomy: require('../assets/category-icons/astronomy.xml'),
  biology: require('../assets/category-icons/biology.xml'),
  botany: require('../assets/category-icons/botany.xml'),
  chemistry: require('../assets/category-icons/chemistry.xml'),
  cinema: require('../assets/category-icons/cinema.xml'),
  computer_science: require('../assets/category-icons/computer_science.xml'),
  economics: require('../assets/category-icons/economics.xml'),
  gastronomy: require('../assets/category-icons/gastronomy.xml'),
  geography: require('../assets/category-icons/geography.xml'),
  history: require('../assets/category-icons/history.xml'),
  languages: require('../assets/category-icons/languages.xml'),
  law: require('../assets/category-icons/law.xml'),
  literature: require('../assets/category-icons/literature.xml'),
  mathematics: require('../assets/category-icons/mathematics.xml'),
  medicine: require('../assets/category-icons/medicine.xml'),
  music: require('../assets/category-icons/music.xml'),
  philosophy: require('../assets/category-icons/philosophy.xml'),
  physics: require('../assets/category-icons/physics.xml'),
  religion: require('../assets/category-icons/religion.xml'),
  sport: require('../assets/category-icons/sport.xml'),
  zoology: require('../assets/category-icons/zoology.xml'),
  plane_contrails: require('../assets/category-icons/plane_contrails.xml'),
  anchor: require('../assets/category-icons/anchor.xml'),
  nutrition: require('../assets/category-icons/nutrition.xml'),
  emergency: require('../assets/category-icons/emergency.xml'),
  microbiology: require('../assets/category-icons/microbiology.xml'),
  finance: require('../assets/category-icons/finance.xml'),
  sports_basketball: require('../assets/category-icons/sports_basketball.xml'),
  neurology: require('../assets/category-icons/neurology.xml'),
  bug_report: require('../assets/category-icons/bug_report.xml'),
  calendar_month: require('../assets/category-icons/calendar_month.xml'),
  photo_camera: require('../assets/category-icons/photo_camera.xml'),
  camera: require('../assets/category-icons/camera.xml'),
  cannabis: require('../assets/category-icons/cannabis.xml'),
  directions_car: require('../assets/category-icons/directions_car.xml'),
  chess_pawn: require('../assets/category-icons/chess_pawn.xml'),
  language_chinese_dayi: require('../assets/category-icons/language_chinese_dayi.xml'),
  location_city: require('../assets/category-icons/location_city.xml'),
  circle_circle: require('../assets/category-icons/circle_circle.xml'),
  restaurant: require('../assets/category-icons/restaurant.xml'),
  database: require('../assets/category-icons/database.xml'),
  nest_heat_link_e: require('../assets/category-icons/nest_heat_link_e.xml'),
  engineering: require('../assets/category-icons/engineering.xml'),
  face: require('../assets/category-icons/face.xml'),
  face_3: require('../assets/category-icons/face_3.xml'),
  theaters: require('../assets/category-icons/theaters.xml'),
  flag_2: require('../assets/category-icons/flag_2.xml'),
  science: require('../assets/category-icons/science.xml'),
  save: require('../assets/category-icons/save.xml'),
  sports_and_outdoors: require('../assets/category-icons/sports_and_outdoors.xml'),
  skillet: require('../assets/category-icons/skillet.xml'),
  sports_esports: require('../assets/category-icons/sports_esports.xml'),
  language: require('../assets/category-icons/language.xml'),
  diversity_3: require('../assets/category-icons/diversity_3.xml'),
  psychology: require('../assets/category-icons/psychology.xml'),
  headphones: require('../assets/category-icons/headphones.xml'),
  health_and_safety: require('../assets/category-icons/health_and_safety.xml'),
  landscape_2: require('../assets/category-icons/landscape_2.xml'),
  hive: require('../assets/category-icons/hive.xml'),
  hourglass_empty: require('../assets/category-icons/hourglass_empty.xml'),
  house: require('../assets/category-icons/house.xml'),
  icecream: require('../assets/category-icons/icecream.xml'),
  temp_preferences_eco: require('../assets/category-icons/temp_preferences_eco.xml'),
  electric_bolt: require('../assets/category-icons/electric_bolt.xml'),
  wand_stars: require('../assets/category-icons/wand_stars.xml'),
  biotech: require('../assets/category-icons/biotech.xml'),
  mindfulness: require('../assets/category-icons/mindfulness.xml'),
  motorcycle: require('../assets/category-icons/motorcycle.xml'),
  music_note_2: require('../assets/category-icons/music_note_2.xml'),
  network_node: require('../assets/category-icons/network_node.xml'),
  import_contacts: require('../assets/category-icons/import_contacts.xml'),
  pan_tool: require('../assets/category-icons/pan_tool.xml'),
  pets: require('../assets/category-icons/pets.xml'),
  stylus: require('../assets/category-icons/stylus.xml'),
  person: require('../assets/category-icons/person.xml'),
  history_edu: require('../assets/category-icons/history_edu.xml'),
  radio: require('../assets/category-icons/radio.xml'),
  raven: require('../assets/category-icons/raven.xml'),
  rib_cage: require('../assets/category-icons/rib_cage.xml'),
  rocket_launch: require('../assets/category-icons/rocket_launch.xml'),
  scatter_plot: require('../assets/category-icons/scatter_plot.xml'),
  category: require('../assets/category-icons/category.xml'),
  interests: require('../assets/category-icons/interests.xml'),
  shopping_cart: require('../assets/category-icons/shopping_cart.xml'),
  functions: require('../assets/category-icons/functions.xml'),
  skull: require('../assets/category-icons/skull.xml'),
  emoji_language: require('../assets/category-icons/emoji_language.xml'),
  snowflake: require('../assets/category-icons/snowflake.xml'),
  hotel_class: require('../assets/category-icons/hotel_class.xml'),
  mountain_flag: require('../assets/category-icons/mountain_flag.xml'),
  sunny: require('../assets/category-icons/sunny.xml'),
  mixture_med: require('../assets/category-icons/mixture_med.xml'),
  temple_buddhist: require('../assets/category-icons/temple_buddhist.xml'),
  text_snippet: require('../assets/category-icons/text_snippet.xml'),
  theater_comedy: require('../assets/category-icons/theater_comedy.xml'),
  nest_thermostat_gen_3: require('../assets/category-icons/nest_thermostat_gen_3.xml'),
  translate: require('../assets/category-icons/translate.xml'),
  nature: require('../assets/category-icons/nature.xml'),
  fertile: require('../assets/category-icons/fertile.xml'),
  videocam: require('../assets/category-icons/videocam.xml'),
  coronavirus: require('../assets/category-icons/coronavirus.xml'),
  volcano: require('../assets/category-icons/volcano.xml'),
  warning: require('../assets/category-icons/warning.xml'),
  water: require('../assets/category-icons/water.xml'),
  air: require('../assets/category-icons/air.xml'),
  build: require('../assets/category-icons/build.xml'),
};

type Props = {
  name: CategoryIconKey;
  color: string;
  size?: number;
};

export default function CategoryIcon({ name, color, size = 24 }: Props) {
  return (
    <Image
      source={SOURCES[name]}
      resizeMode="contain"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      // A vector drawable has no intrinsic size, so width and height are required.
      style={{ width: size, height: size, tintColor: color }}
    />
  );
}
