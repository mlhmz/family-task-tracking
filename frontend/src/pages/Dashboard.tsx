import { useKeycloak } from '@react-keycloak/web';
import { KeycloakProfile } from 'keycloak-js';
import { useCallback, useState } from 'react';

import { useAxios } from '../hooks/use-axios';

export const Dashboard = () => {
  const { keycloak } = useKeycloak();
  const [userProfile, setUserProfile] = useState<KeycloakProfile | null>(null);

  const axiosInstance = useAxios('https://localhost:8081');
  const callApi = useCallback(() => {
    keycloak.loadUserProfile().then((profile) => setUserProfile(profile));
    !!axiosInstance.current &&
      axiosInstance.current.get('/hello').then((res) => console.log(res));
  }, [axiosInstance, keycloak]);

  return (
    <div className='container m-8 mx-auto text-center'>
      <h1 className='p-2 text-4xl font-bold'>FTT</h1>
      <p className='p-4 text-xl leading-relaxed'>
        For me, it's the McChicken. The best fast food sandwich. I even ask for
        extra McChicken sauce packets and the staff is so friendly and more than
        willing to oblige. One time I asked for McChicken sauce packets and they
        gave me three. I said, "Wow, three for free!" and the nice friendly
        McDonald's worker laughed and said, "I'm going to call you 3-for-free!".
        Now the staff greets me with "hey it's 3-for-free!" and ALWAYS give me
        three packets. It's such a fun and cool atmosphere at my local
        McDonald's restaurant, I go there at least 3 times a week for lunch and
        a large iced coffee with milk instead of cream, 1-2 times for breakfast
        on the weekend, and maybe once for dinner when I'm in a rush but want a
        great meal that is affordable, fast, and can match my daily nutritional
        needs. I even dip my fries in McChicken sauce, it's delicious! What a
        great restaurant.
      </p>

      <div>
        <div className='my-6 text-xl text-purple-400'>
          User is {!keycloak?.authenticated ? 'NOT ' : ''} authenticated
        </div>

        <button
          type='button'
          onClick={callApi}
          className='rounded border border-purple-400 bg-transparent py-2 px-4 font-semibold text-purple-400 hover:border-transparent hover:bg-purple-400 hover:text-white'
        >
          Call APIs
        </button>
        <div>
          <div className='flex flex-col '>
            <span className='font-semibold'>
              Username: {userProfile && userProfile.username}
            </span>
            <span className='font-semibold'>
              Email: {userProfile && userProfile.email}
            </span>
            <span className='font-semibold'>
              ID: {userProfile && userProfile.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
