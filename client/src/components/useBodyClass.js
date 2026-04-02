import { useEffect } from 'react';

export default function useBodyClass(cls) {
    useEffect(() => {
        document.body.className = cls;
        return () => { document.body.className = ''; };
    }, [cls]);
}
