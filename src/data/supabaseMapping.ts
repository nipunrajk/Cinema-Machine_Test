// Maps local IDs (m1, m2, abc, xyz) to Supabase UUIDs
import { supabase } from '../lib/supabase';

let movieIdMap: Record<string, string> = {};
let theatreIdMap: Record<string, string> = {};

export async function initializeIdMappings() {
  try {
    const { data: movies } = await supabase.from('movies').select('id, title');
    const { data: theatres } = await supabase
      .from('theatres')
      .select('id, name');

    if (movies) {
      movies.forEach((movie, index) => {
        movieIdMap[`m${index + 1}`] = movie.id;
      });
    }

    if (theatres) {
      theatres.forEach((theatre) => {
        const localId = theatre.name.includes('ABC') ? 'abc' : 'xyz';
        theatreIdMap[localId] = theatre.id;
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize ID mappings:', error);
    return false;
  }
}

export function getSupabaseMovieId(localId: string | null): string | null {
  if (!localId) return null;
  return movieIdMap[localId] || localId;
}

export function getSupabaseTheatreId(localId: string | null): string | null {
  if (!localId) return null;
  return theatreIdMap[localId] || localId;
}

export function areMappingsInitialized(): boolean {
  return Object.keys(theatreIdMap).length > 0;
}
