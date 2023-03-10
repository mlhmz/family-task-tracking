import { useKeycloak } from '@react-keycloak/web';
import { useCallback } from 'react';

import { useAxios } from '../hooks/use-axios';

export const Dashboard = () => {
  const { keycloak } = useKeycloak();

  const axiosInstance = useAxios('https://localhost:8081');
  const callApi = useCallback(() => {
    const userProfile = keycloak.loadUserProfile();
    console.log(userProfile);
    !!axiosInstance.current && axiosInstance.current.get('/hello').then((res) => console.log(res));
  }, [axiosInstance]);

  return (
    <div className="m-8 text-center">
      <h1 className="font-semibold text-4xl p-2">FTT</h1>
      <p className="p-4 mb-20 text-xl leading-relaxed text-gray-100">
        For me, it's the McChicken. The best fast food sandwich. I even ask for extra McChicken
        sauce packets and the staff is so friendly and more than willing to oblige. One time I asked
        for McChicken sauce packets and they gave me three. I said, "Wow, three for free!" and the
        nice friendly McDonald's worker laughed and said, "I'm going to call you 3-for-free!". Now
        the staff greets me with "hey it's 3-for-free!" and ALWAYS give me three packets. It's such
        a fun and cool atmosphere at my local McDonald's restaurant, I go there at least 3 times a
        week for lunch and a large iced coffee with milk instead of cream, 1-2 times for breakfast
        on the weekend, and maybe once for dinner when I'm in a rush but want a great meal that is
        affordable, fast, and can match my daily nutritional needs. I even dip my fries in McChicken
        sauce, it's delicious! What a great restaurant.
      </p>

      <div>
        <div>User is {!keycloak?.authenticated ? 'NOT ' : ''} authenticated</div>

        <button type="button" onClick={callApi}>
          Call APIs
        </button>
      </div>
    </div>
  );
};
