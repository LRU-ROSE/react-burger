import { useRef } from 'react';

const useLatest = (obj) => {
  const ref = useRef(obj);
  ref.current = obj;
  return ref;
};

export default useLatest;
