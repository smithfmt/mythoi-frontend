import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = <T>(event: string, initialState: T | null = null): [T | null, React.Dispatch<React.SetStateAction<T | null>>] => {
  const [data, setData] = useState<T | null>(initialState);

  useEffect(() => {
    const socket: Socket = io(process.env.EXPRESS_API_URL || 'http://localhost:5000');

    socket.on(event, (receivedData: T) => {
      console.log(`${event} received:`, receivedData);
      setData(receivedData);
    });

    return () => {
      socket.off(event);
    };
  }, [event]);

  return [data, setData];
};

export default useSocket;