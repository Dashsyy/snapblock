import React from 'react';
import { Dog, Bird, Apple, Fish, Smile, Car, Heart, Sun, Cloud, Star } from 'lucide-react';

export interface Lesson {
  id: string;
  target: string;
  displayHint?: string;
  icon?: React.ReactNode;
}

export const WORD_MODULE: Lesson[] = [
  { id: '1', target: 'HELLO' },
  { id: '2', target: 'CAT' },
  { id: '3', target: 'DOG' },
  { id: '4', target: 'HAPPY' },
  { id: '5', target: 'APPLE' },
  { id: '6', target: 'BIRD' },
  { id: '7', target: 'FISH' },
  { id: '8', target: 'SMILE' },
  { id: '9', target: 'BLUE' },
  { id: '10', target: 'GREEN' },
];

export const MATH_MODULE: Lesson[] = [
  { id: 'm1', target: '5', displayHint: '2 + 3 = ?' },
  { id: 'm2', target: '9', displayHint: '5 + 4 = ?' },
  { id: 'm3', target: '4', displayHint: '10 - 6 = ?' },
  { id: 'm4', target: '8', displayHint: '4 + 4 = ?' },
  { id: 'm5', target: '2', displayHint: '1 + 1 = ?' },
  { id: 'm6', target: '7', displayHint: '3 + 4 = ?' },
  { id: 'm7', target: '6', displayHint: '12 - 6 = ?' },
  { id: 'm8', target: '10', displayHint: '5 + 5 = ?' },
  { id: 'm9', target: '3', displayHint: '7 - 4 = ?' },
  { id: 'm10', target: '1', displayHint: '5 - 4 = ?' },
];

export const VISUAL_MODULE: Lesson[] = [
  { id: 'v1', target: 'DOG', icon: <Dog size={60} /> },
  { id: 'v2', target: 'BIRD', icon: <Bird size={60} /> },
  { id: 'v3', target: 'APPLE', icon: <Apple size={60} /> },
  { id: 'v4', target: 'FISH', icon: <Fish size={60} /> },
  { id: 'v5', target: 'SMILE', icon: <Smile size={60} /> },
  { id: 'v6', target: 'CAR', icon: <Car size={60} /> },
  { id: 'v7', target: 'HEART', icon: <Heart size={60} /> },
  { id: 'v8', target: 'SUN', icon: <Sun size={60} /> },
  { id: 'v9', target: 'CLOUD', icon: <Cloud size={60} /> },
  { id: 'v10', target: 'CAT', icon: <Star size={60} /> },
];
