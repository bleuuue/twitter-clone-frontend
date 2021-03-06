import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  FC,
  useContext,
  useState,
  useEffect,
  MutableRefObject,
} from 'react';
import {
  faEllipsisH,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTrashAlt as farTrashAlt,
  faClone as farClone,
} from '@fortawesome/free-regular-svg-icons';
import { MeContext } from '../../../contexts';
import axios from 'axios';
import { ITweet } from '../../../interfaces';
import { MutatorCallback } from 'swr/dist/types';

interface EllipsisProps {
  tweet: ITweet;
  ellipsisEl: MutableRefObject<HTMLDivElement | null>;
  mutate: (
    data?:
      | ITweet[][]
      | Promise<ITweet[][]>
      | MutatorCallback<ITweet[][]>
      | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<ITweet[][] | undefined>;
}

const Ellipsis: FC<EllipsisProps> = ({ tweet, mutate, ellipsisEl }) => {
  const { me } = useContext(MeContext);

  const [ellipsisToggle, setEllipsisToggle] = useState<boolean>(false);

  const onClickEllipsisToggle = () => {
    setEllipsisToggle(!ellipsisToggle);
  };

  const onClickDeleteTweet = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/tweets/${tweet.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.statusText === 'OK') {
        mutate();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ellipsisToggleHandler = (e: any) => {
    if (
      ellipsisToggle &&
      (!ellipsisEl.current || !ellipsisEl.current.contains(e.target))
    ) {
      setEllipsisToggle(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', ellipsisToggleHandler);

    return () => window.removeEventListener('click', ellipsisToggleHandler);
  });

  return (
    <div className="w-full relative ">
      <div>
        <button onClick={onClickEllipsisToggle}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>
      </div>
      {ellipsisToggle && (
        <div className="absolute bg-white shadow-md">
          {me === tweet.users.id && (
            <button
              className="px-2 py-1 hover:bg-gray-200"
              onClick={onClickDeleteTweet}
            >
              <FontAwesomeIcon icon={farTrashAlt} />
              <span className="ml-4">Delete Tweet</span>
            </button>
          )}
          <button className="px-2 py-1 hover:bg-gray-200">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span className="ml-4">Report Tweet</span>
          </button>
          <button className="px-2 py-1 hover:bg-gray-200">
            <FontAwesomeIcon icon={farClone} />
            <span className="ml-4">Copy Tweet</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Ellipsis;
