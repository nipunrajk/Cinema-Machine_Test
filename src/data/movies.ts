// src/data/movies.ts
import type { Movie } from '../types';

export const movies: Movie[] = [
  {
    id: 'm1',
    title: 'The Midnight Voyager',
    posterUrl: '/posters/midnight-voyager.jpg',
    synopsis:
      'A small crew ventures into a mysterious nebula and finds strange new worlds.',
  },
  {
    id: 'm2',
    title: 'City of Echoes',
    posterUrl: '/posters/city-of-echoes.jpg',
    synopsis:
      'Two strangers meet in a city where memories are traded like currency.',
  },
  {
    id: 'm3',
    title: 'Last Train Home',
    posterUrl: '/posters/last-train-home.jpg',
    synopsis:
      'A bittersweet drama that follows one night on the last train into town.',
  },
  {
    id: 'm4',
    title: 'Neon Gardens',
    posterUrl: '/posters/neon-gardens.jpg',
    synopsis:
      'An energetic sci-fi heist that takes place inside a living, electric greenhouse.',
  },
];
