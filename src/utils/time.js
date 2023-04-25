function calculateExceededTime(createDate, waitingTime) {
    const [min, max] = waitingTime.split('-').map(time => parseInt(time));
    const waitingTimeInMs = Math.floor((max + min) / 2) * 60 * 1000;
    const createDateInMs = new Date(createDate).getTime();
    const currentTimeInMs = new Date().getTime();
    const elapsedTimeInMs = currentTimeInMs - createDateInMs;
    const exceededTimeInMs = elapsedTimeInMs - waitingTimeInMs;
    let result = '';
    if (exceededTimeInMs > 0) {
        const exceededTimeInMin = Math.floor(exceededTimeInMs / (60 * 1000));
        if (exceededTimeInMin >= 1440) {
          const exceededTimeInDays = Math.floor(exceededTimeInMin / 1440);
          result =  `${exceededTimeInDays} d`;
        } else if (exceededTimeInMin >= 60) {
          const exceededTimeInHours = Math.floor(exceededTimeInMin / 60);
          result =  `${exceededTimeInHours} h`;
        } else {
          result =  `${exceededTimeInMin} min`;
        }
    }

    return result;
  }

  
export default calculateExceededTime;