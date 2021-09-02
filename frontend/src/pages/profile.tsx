import axios from 'axios';
import React, { createRef, FC, useEffect, useRef } from 'react';
import { useSWRInfinite } from 'swr';
import Cards from '../components/card/Cards';
import Header from '../components/Header';
import CreateTweet from '../components/main/CreateTweet';
import UserInfo from '../components/profile/UserInfo';
import { ITweet } from '../interfaces';

const getKey = (pageIndex: number, previusPageData: any) => {
  if (previusPageData && !previusPageData.length) return null;
  return `${process.env.REACT_APP_BACK_URL}/tweets?page=${pageIndex}`;
};

const Profile: FC = () => {
  const lastEl = createRef<HTMLDivElement>();
  const intersectionObserver = useRef<IntersectionObserver>();
  const sizeRef = useRef<number>(1);

  const fetcher = async (url: string) => {
    try {
      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate, size, setSize } = useSWRInfinite<ITweet[]>(
    getKey,
    fetcher,
  );

  const onClickMore = () => {
    setSize(size + 1);
  };

  useEffect(() => {
    if (data && !data[size - 1]) return;

    if (!intersectionObserver.current && lastEl.current) {
      intersectionObserver.current = new IntersectionObserver(
        async (entries) => {
          if (!entries[0].isIntersecting) return;

          sizeRef.current += 1;

          await setSize(sizeRef.current);
        },
      );

      intersectionObserver.current.observe(lastEl.current);
    }
  }, [lastEl]);

  useEffect(() => console.log(data), [data]);

  if (!data) return <div>loading...</div>;
  if (error) return <div>error</div>;

  return (
    <>
      <Header title="Profile" />
      <UserInfo />
      {data.map((tweets, i) => {
        return <Cards key={i} tweets={tweets} mutate={mutate} />;
      })}
      <div ref={lastEl} className="text-white">
        Twitter-clone
      </div>
      {/* <button className="text-2xl" onClick={onClickMore}>
        More
      </button> */}
    </>
  );
};

export default Profile;