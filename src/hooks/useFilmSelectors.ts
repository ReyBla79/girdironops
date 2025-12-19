import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  SEED_FILM_ASSETS,
  SEED_PLAYS,
  SEED_PLAY_TAGS,
  SEED_POSTERS,
  SEED_TRACKING_BY_PLAY,
  SEED_ASSIGNMENT_INFERENCE_BY_PLAY,
  SEED_AI_NOTES_BY_PLAY,
  SEED_RECOMMENDED_ACTIONS_BY_PLAY,
  PLAY_TYPE_OPTIONS,
} from '@/demo/filmData';

// Helper functions
const helpers = {
  toUpper: (s: unknown) => (s || '').toString().toUpperCase(),
  safeArr: <T,>(v: T[] | undefined | null): T[] => Array.isArray(v) ? v : [],
  safeObj: <T extends object>(v: T | undefined | null): T => (v && typeof v === 'object' ? v : {} as T),
};

// Film timeline filters type
export interface FilmTimelineFilters {
  quarter: string;
  down: string;
  playType: string;
  concept: string;
}

// Default filters
export const DEFAULT_FILM_FILTERS: FilmTimelineFilters = {
  quarter: 'ALL',
  down: 'ALL',
  playType: 'ALL',
  concept: '',
};

/**
 * Hook to get route-based film ID
 */
export const useFilmId = () => {
  const { filmId } = useParams<{ filmId: string }>();
  return filmId || null;
};

/**
 * Hook to get route-based play ID
 */
export const usePlayId = () => {
  const { playId } = useParams<{ playId: string }>();
  return playId || null;
};

/**
 * Hook to get selected film based on route
 */
export const useSelectedFilm = () => {
  const filmId = useFilmId();
  
  return useMemo(() => {
    if (!filmId) return null;
    const assets = helpers.safeArr(SEED_FILM_ASSETS);
    return assets.find(x => x.filmId === filmId) || null;
  }, [filmId]);
};

/**
 * Hook to get available quarters for selected film
 */
export const useSelectedFilmQuarters = () => {
  const filmId = useFilmId();
  
  return useMemo(() => {
    const plays = helpers.safeArr(SEED_PLAYS).filter(p => p.filmId === filmId);
    const qset = new Set(['ALL']);
    plays.forEach(p => qset.add(String(p.quarter)));
    return Array.from(qset);
  }, [filmId]);
};

/**
 * Hook to get play type options
 */
export const usePlayTypeOptions = () => {
  return useMemo(() => {
    return helpers.safeArr(PLAY_TYPE_OPTIONS).length 
      ? PLAY_TYPE_OPTIONS 
      : ['ALL', 'RUN', 'PASS', 'RPO', 'PA', 'SCREEN', 'ST'];
  }, []);
};

/**
 * Hook to get filtered plays for selected film
 */
export const useFilteredPlaysForFilm = (filters: FilmTimelineFilters = DEFAULT_FILM_FILTERS) => {
  const filmId = useFilmId();
  
  return useMemo(() => {
    const playsAll = helpers.safeArr(SEED_PLAYS);
    const f = helpers.safeObj(filters);
    const q = helpers.toUpper(f.concept || '').trim();
    const quarter = (f.quarter || 'ALL').toString();
    const down = (f.down || 'ALL').toString();
    const playType = helpers.toUpper(f.playType || 'ALL');
    
    let plays = playsAll.filter(p => p.filmId === filmId);
    
    if (quarter !== 'ALL') {
      plays = plays.filter(p => String(p.quarter) === quarter);
    }
    if (down !== 'ALL') {
      plays = plays.filter(p => String(p.down) === down);
    }
    if (playType !== 'ALL') {
      plays = plays.filter(p => helpers.toUpper(p.aiPlayType) === playType);
    }
    if (q) {
      plays = plays.filter(p => {
        const hay = [p.aiConcept, p.aiPlayType, p.formation, p.motion, p.defShell].join(' ').toUpperCase();
        return hay.includes(q);
      });
    }
    
    // Sort by quarter asc then clock desc (mm:ss)
    plays.sort((a, b) => {
      if ((a.quarter || 0) !== (b.quarter || 0)) {
        return (a.quarter || 0) - (b.quarter || 0);
      }
      const pa = (a.clock || '00:00').split(':').map(Number);
      const pb = (b.clock || '00:00').split(':').map(Number);
      const sa = pa[0] * 60 + pa[1];
      const sb = pb[0] * 60 + pb[1];
      return sb - sa;
    });
    
    return plays;
  }, [filmId, filters]);
};

/**
 * Hook to get enriched selected play with all joined data
 */
export const useSelectedPlay = () => {
  const playId = usePlayId();
  
  return useMemo(() => {
    if (!playId) return null;
    
    const plays = helpers.safeArr(SEED_PLAYS);
    const p = plays.find(play => play.playId === playId);
    
    if (!p) return null;
    
    const pid = p.playId;
    const tagsMap = helpers.safeObj(SEED_PLAY_TAGS);
    const posters = helpers.safeObj(SEED_POSTERS);
    const tracking = helpers.safeObj(SEED_TRACKING_BY_PLAY);
    const assign = helpers.safeObj(SEED_ASSIGNMENT_INFERENCE_BY_PLAY);
    const notes = helpers.safeObj(SEED_AI_NOTES_BY_PLAY);
    const actions = helpers.safeObj(SEED_RECOMMENDED_ACTIONS_BY_PLAY);
    
    const trackingData = tracking[pid as keyof typeof tracking];
    const assignData = assign[pid as keyof typeof assign];
    
    const stitched = {
      ...p,
      // Convenience strings for cards
      downDistance: `${p.down}&${p.distance}`,
      yardlineLabel: `YL ${p.yardline}`,
      downDistanceLabel: `${p.down} & ${p.distance}`,
      // Joins
      poster: posters[pid as keyof typeof posters] || 'https://placehold.co/1200x675/png?text=Play+Demo',
      tags: helpers.safeArr(tagsMap[pid as keyof typeof tagsMap]),
      trackingSummary: trackingData?.summary || { 
        confidence: 0, 
        note: 'No tracking in demo for this play.' 
      },
      trackingConfidence: typeof trackingData?.confidence === 'number' ? trackingData.confidence : 0,
      trackingPlayers: Array.isArray(trackingData?.players) ? trackingData.players : [],
      trackingHeatmaps: trackingData?.heatmaps || {},
      assignmentInference: assignData || { 
        confidence: 0, 
        notes: ['Assignment inference not available in CORE/PRO demo for this play.'], 
        flags: [] 
      },
      aiNotes: helpers.safeArr(notes[pid as keyof typeof notes]),
      recommendedActions: helpers.safeArr(actions[pid as keyof typeof actions]),
    };
    
    return stitched;
  }, [playId]);
};

/**
 * Type for the enriched play returned by useSelectedPlay
 */
export type EnrichedPlay = NonNullable<ReturnType<typeof useSelectedPlay>>;
