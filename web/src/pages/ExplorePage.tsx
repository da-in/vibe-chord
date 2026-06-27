import { Navigate } from 'react-router-dom';

/** @deprecated F-13 absorbed into studio ChordPickerPanel — redirect for bookmarks */
export default function ExplorePage() {
  return <Navigate to="/studio" replace />;
}
