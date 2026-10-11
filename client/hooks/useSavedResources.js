import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getSavedResourceIds, saveResource, unsaveResource } from '../services/savedResources';

export function useSavedResources() {
  const [savedIds, setSavedIds] = useState([]);

  // Load the list whenever the screen comes into view, so pages stay in sync.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getSavedResourceIds().then((ids) => {
        if (active) setSavedIds(ids);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const toggleSaved = useCallback(
    async (resourceId) => {
      const wasSaved = savedIds.includes(resourceId);
      const previous = savedIds;
      // Update the screen right away, then store the change.
      setSavedIds(wasSaved ? savedIds.filter((id) => id !== resourceId) : [...savedIds, resourceId]);
      try {
        if (wasSaved) {
          await unsaveResource(resourceId);
        } else {
          await saveResource(resourceId);
        }
      } catch {
        setSavedIds(previous);
      }
    },
    [savedIds]
  );

  return { savedIds, toggleSaved };
}