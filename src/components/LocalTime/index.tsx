import moment from 'moment';
import React, { useEffect, useState } from 'react';

export type LocalTimeProps = {
  currentTime: string;
};

const LocalTime: React.FC<LocalTimeProps> = (props) => {
  const { currentTime } = props;

  const intervalSeconds = 1;
  const localSeconds = moment().unix();
  const startTime = moment(currentTime, 'YYYY-MM-DD HH:mm:ss');
  const [pastSeconds, setPastSeconds] = useState<number>(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPastSeconds(moment().unix() - localSeconds + 1);
    }, intervalSeconds * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ color: 'white' }}>
      当地时间：{startTime.add(pastSeconds, 'seconds').format('MM/DD HH:mm:ss')}
    </div>
  );
};

export default LocalTime;
