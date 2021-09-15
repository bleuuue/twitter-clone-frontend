import React, { FC } from 'react';
import ProfileIcon from '../common/ProfileIcon';

interface FollowCardProps {
  nickname: string;
}

const FollowCard: FC<FollowCardProps> = ({ nickname }) => {
  return (
    <div className="w-80">
      <div className="flex px-4 py-2 hover:bg-gray-300">
        <ProfileIcon userId={1} />
        <div className="flex items-center justify-between w-full ml-2">
          <div>
            <div>{nickname}</div>
            <div>introduce</div>
          </div>
          <div>
            <button className="rounded-full px-4 py-2 font-black text-white bg-black text-sm">
              View profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
