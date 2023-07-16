import { MutableRefObject, useRef } from 'react';

const useLatest = <T>(obj: T): MutableRefObject<T> => {
  const ref = useRef<T>();
  ref.current = obj;
  return ref as MutableRefObject<T>;
};

export default useLatest;
