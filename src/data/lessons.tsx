import React from 'react';
import { 
  Dog, Bird, Apple, Fish, Smile, Car, Heart, Sun, Cloud, Star, 
  Ghost, Moon, Flower, Pizza, Coffee, Zap, Anchor, Bell, Bike, Camera,
  Cpu, Radio, Battery, Lightbulb, ToggleLeft, Activity, Wifi, Bluetooth
} from 'lucide-react';

export interface Lesson {
  id: string;
  target: string;
  displayHint?: string;
  icon?: React.ReactNode;
}

export type LevelType = 1 | 2 | 3;

export const WORD_MODULE: Record<LevelType, Lesson[]> = {
  1: [
    { id: 'w1-1', target: 'CAT' },
    { id: 'w1-2', target: 'DOG' },
    { id: 'w1-3', target: 'FISH' },
    { id: 'w1-4', target: 'BIRD' },
    { id: 'w1-5', target: 'SUN' },
    { id: 'w1-6', target: 'STAR' },
    { id: 'w1-7', target: 'MILK' },
    { id: 'w1-8', target: 'BOOK' },
    { id: 'w1-9', target: 'BALL' },
    { id: 'w1-10', target: 'CAKE' },
    { id: 'w1-11', target: 'TREE' },
    { id: 'w1-12', target: 'FROG' },
    { id: 'w1-13', target: 'DUCK' },
    { id: 'w1-14', target: 'SHIP' },
    { id: 'w1-15', target: 'FIRE' },
  ],
  2: [
    { id: 'w2-1', target: 'HELLO' },
    { id: 'w2-2', target: 'HAPPY' },
    { id: 'w2-3', target: 'APPLE' },
    { id: 'w2-4', target: 'SMILE' },
    { id: 'w2-5', target: 'GREEN' },
    { id: 'w2-6', target: 'HOUSE' },
    { id: 'w2-7', target: 'WATER' },
    { id: 'w2-8', target: 'BREAD' },
    { id: 'w2-9', target: 'FRUIT' },
    { id: 'w2-10', target: 'CANDY' },
    { id: 'w2-11', target: 'TABLE' },
    { id: 'w2-12', target: 'CHAIR' },
    { id: 'w2-13', target: 'SHIRT' },
    { id: 'w2-14', target: 'PIZZA' },
    { id: 'w2-15', target: 'CLOUD' },
  ],
  3: [
    { id: 'w3-1', target: 'RAINBOW' },
    { id: 'w3-2', target: 'CHICKEN' },
    { id: 'w3-3', target: 'BANANA' },
    { id: 'w3-4', target: 'ELEPHANT' },
    { id: 'w3-5', target: 'COMPUTER' },
    { id: 'w3-6', target: 'MOUNTAIN' },
    { id: 'w3-7', target: 'GARDEN' },
    { id: 'w3-8', target: 'FRIENDS' },
    { id: 'w3-9', target: 'BIRTHDAY' },
    { id: 'w3-10', target: 'SUNFLOWER' },
    { id: 'w3-11', target: 'DINOSAUR' },
    { id: 'w3-12', target: 'BUTTERFLY' },
    { id: 'w3-13', target: 'ASTRONAUT' },
    { id: 'w3-14', target: 'LIBRARY' },
    { id: 'w3-15', target: 'ADVENTURE' },
  ],
};

export const MATH_MODULE: Record<LevelType, Lesson[]> = {
  1: [
    { id: 'm1-1', target: '5', displayHint: '2 + 3 = ?' },
    { id: 'm1-2', target: '9', displayHint: '5 + 4 = ?' },
    { id: 'm1-3', target: '2', displayHint: '1 + 1 = ?' },
    { id: 'm1-4', target: '7', displayHint: '3 + 4 = ?' },
    { id: 'm1-5', target: '10', displayHint: '5 + 5 = ?' },
    { id: 'm1-6', target: '4', displayHint: '2 + 2 = ?' },
    { id: 'm1-7', target: '7', displayHint: '6 + 1 = ?' },
    { id: 'm1-8', target: '8', displayHint: '4 + 4 = ?' },
    { id: 'm1-9', target: '9', displayHint: '7 + 2 = ?' },
    { id: 'm1-10', target: '6', displayHint: '3 + 3 = ?' },
  ],
  2: [
    { id: 'm2-1', target: '4', displayHint: '10 - 6 = ?' },
    { id: 'm2-2', target: '6', displayHint: '12 - 6 = ?' },
    { id: 'm2-3', target: '3', displayHint: '7 - 4 = ?' },
    { id: 'm2-4', target: '1', displayHint: '5 - 4 = ?' },
    { id: 'm2-5', target: '4', displayHint: '9 - 5 = ?' },
    { id: 'm2-6', target: '5', displayHint: '8 - 3 = ?' },
    { id: 'm2-7', target: '4', displayHint: '6 - 2 = ?' },
    { id: 'm2-8', target: '8', displayHint: '10 - 2 = ?' },
    { id: 'm2-9', target: '3', displayHint: '4 - 1 = ?' },
    { id: 'm2-10', target: '7', displayHint: '10 - 3 = ?' },
  ],
  3: [
    { id: 'm3-1', target: '8', displayHint: '15 - 7 = ?' },
    { id: 'm3-2', target: '15', displayHint: '8 + 7 = ?' },
    { id: 'm3-3', target: '10', displayHint: '20 - 10 = ?' },
    { id: 'm3-4', target: '15', displayHint: '9 + 6 = ?' },
    { id: 'm3-5', target: '8', displayHint: '14 - 6 = ?' },
    { id: 'm3-6', target: '20', displayHint: '12 + 8 = ?' },
    { id: 'm3-7', target: '9', displayHint: '18 - 9 = ?' },
    { id: 'm3-8', target: '16', displayHint: '7 + 9 = ?' },
    { id: 'm3-9', target: '7', displayHint: '11 - 4 = ?' },
    { id: 'm3-10', target: '18', displayHint: '13 + 5 = ?' },
  ],
};

export const VISUAL_MODULE: Record<LevelType, Lesson[]> = {
  1: [
    { id: 'v1-1', target: 'DOG', icon: <Dog size={60} /> },
    { id: 'v1-2', target: 'BIRD', icon: <Bird size={60} /> },
    { id: 'v1-3', target: 'APPLE', icon: <Apple size={60} /> },
    { id: 'v1-4', target: 'FISH', icon: <Fish size={60} /> },
    { id: 'v1-5', target: 'SMILE', icon: <Smile size={60} /> },
    { id: 'v1-6', target: 'SUN', icon: <Sun size={60} /> },
    { id: 'v1-7', target: 'STAR', icon: <Star size={60} /> },
    { id: 'v1-8', target: 'HEART', icon: <Heart size={60} /> },
    { id: 'v1-9', target: 'CLOUD', icon: <Cloud size={60} /> },
    { id: 'v1-10', target: 'MOON', icon: <Moon size={60} /> },
  ],
  2: [
    { id: 'v2-1', target: 'CAR', icon: <Car size={60} /> },
    { id: 'v2-2', target: 'GHOST', icon: <Ghost size={60} /> },
    { id: 'v2-3', target: 'FLOWER', icon: <Flower size={60} /> },
    { id: 'v2-4', target: 'PIZZA', icon: <Pizza size={60} /> },
    { id: 'v2-5', target: 'COFFEE', icon: <Coffee size={60} /> },
    { id: 'v2-6', target: 'BOLT', icon: <Zap size={60} /> },
    { id: 'v2-7', target: 'ANCHOR', icon: <Anchor size={60} /> },
    { id: 'v2-8', target: 'BELL', icon: <Bell size={60} /> },
    { id: 'v2-9', target: 'BIKE', icon: <Bike size={60} /> },
    { id: 'v2-10', target: 'CAMERA', icon: <Camera size={60} /> },
  ],
  3: [
    // Mixed hard words with icons
    { id: 'v3-1', target: 'PUPPY', icon: <Dog size={60} /> },
    { id: 'v3-2', target: 'RAINBOW', icon: <Cloud size={60} /> },
    { id: 'v3-3', target: 'KITTEN', icon: <Star size={60} /> },
    { id: 'v3-4', target: 'ROCKET', icon: <Zap size={60} /> },
    { id: 'v3-5', target: 'FOREST', icon: <Flower size={60} /> },
    { id: 'v3-6', target: 'OCEAN', icon: <Anchor size={60} /> },
    { id: 'v3-7', target: 'MOUNTAIN', icon: <Cloud size={60} /> },
    { id: 'v3-8', target: 'BICYCLE', icon: <Bike size={60} /> },
    { id: 'v3-9', target: 'DESSERT', icon: <Pizza size={60} /> },
    { id: 'v3-10', target: 'MORNING', icon: <Sun size={60} /> },
  ],
};

export const ELECTRONICS_MODULE: Record<LevelType, Lesson[]> = {
  1: [
    { id: 'e1-1', target: 'LED', icon: <Lightbulb size={60} /> },
    { id: 'e1-2', target: 'WIRE', icon: <Activity size={60} /> },
    { id: 'e1-3', target: 'BATTERY', icon: <Battery size={60} /> },
    { id: 'e1-4', target: 'SWITCH', icon: <ToggleLeft size={60} /> },
    { id: 'e1-5', target: 'RESISTOR', icon: <Activity size={60} /> },
    { id: 'e1-6', target: 'SENSOR', icon: <Radio size={60} /> },
    { id: 'e1-7', target: 'MOTOR', icon: <Cpu size={60} /> },
    { id: 'e1-8', target: 'DIODE', icon: <Zap size={60} /> },
    { id: 'e1-9', target: 'CHIP', icon: <Cpu size={60} /> },
    { id: 'e1-10', target: 'GROUND', icon: <Activity size={60} /> },
  ],
  2: [
    { id: 'e2-1', target: 'ESP32', icon: <Cpu size={60} /> },
    { id: 'e2-2', target: 'WIFI', icon: <Wifi size={60} /> },
    { id: 'e2-3', target: 'BLE', icon: <Bluetooth size={60} /> },
    { id: 'e2-4', target: 'UART', icon: <Activity size={60} /> },
    { id: 'e2-5', target: 'I2C', icon: <Cpu size={60} /> },
    { id: 'e2-6', target: 'OLED', icon: <Camera size={60} /> },
    { id: 'e2-7', target: 'RELAY', icon: <ToggleLeft size={60} /> },
    { id: 'e2-8', target: 'SERIAL', icon: <Activity size={60} /> },
    { id: 'e2-9', target: 'MODULE', icon: <Cpu size={60} /> },
    { id: 'e2-10', target: 'ANTENNA', icon: <Radio size={60} /> },
  ],
  3: [
    { id: 'e3-1', target: 'GPIO2', displayHint: 'ESP32 Internal LED Pin?' },
    { id: 'e3-2', target: 'VCC', displayHint: '3.3V or 5V Power Pin?' },
    { id: 'e3-3', target: 'GND', displayHint: 'Common Return Path?' },
    { id: 'e3-4', target: 'PWM', displayHint: 'Dimming LEDs Technique?' },
    { id: 'e3-5', target: 'BLINK', displayHint: 'The "Hello World" of Hardware?' },
    { id: 'e3-6', target: 'ADC', displayHint: 'Reading Analog Sensors?' },
    { id: 'e3-7', target: 'DAC', displayHint: 'Digital to Analog Converter?' },
    { id: 'e3-8', target: 'INPUT', displayHint: 'Button Pin Mode?' },
    { id: 'e3-9', target: 'OUTPUT', displayHint: 'LED Pin Mode?' },
    { id: 'e3-10', target: 'HIGH', displayHint: 'Setting Pin to 3.3V?' },
  ],
};

export const SEARCH_MODULE: Record<LevelType, Lesson[]> = {
  1: [
    { id: 's1-1', target: 'RED,BLUE,PINK', displayHint: 'COLORS' },
    { id: 's1-2', target: 'CAT,DOG,FISH', displayHint: 'PETS' },
    { id: 's1-3', target: 'SUN,MOON,STAR', displayHint: 'SKY' },
  ],
  2: [
    { id: 's2-1', target: 'APPLE,BANANA,GRAPE,PEAR', displayHint: 'FRUITS' },
    { id: 's2-2', target: 'LION,TIGER,ZEBRA,BEAR', displayHint: 'WILD ANIMALS' },
    { id: 's2-3', target: 'BEE,ANT,FLY,WASP', displayHint: 'INSECTS' },
  ],
  3: [
    { id: 's3-1', target: 'MARS,VENUS,EARTH,SATURN,PLUTO', displayHint: 'PLANETS' },
    { id: 's3-2', target: 'CAR,BIKE,SHIP,PLANE,TRAIN', displayHint: 'TRANSPORT' },
    { id: 's3-3', target: 'SPRING,SUMMER,WINTER,AUTUMN', displayHint: 'SEASONS' },
  ],
};

