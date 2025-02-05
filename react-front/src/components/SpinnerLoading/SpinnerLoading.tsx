// SpinnerLoading.tsx
import Spinner from 'react-bootstrap/Spinner';
import './SpinerLoading.css';
import { useSpinner } from '../../context/SpinnerContext';

function SpinnerLoading() {
  const { active } = useSpinner();

  if (!active) return null;

  return (
    <div className="spinner-overlay">
      <Spinner animation="border"/>
    </div>
  );
}

export default SpinnerLoading;

