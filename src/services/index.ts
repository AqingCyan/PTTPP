import { request } from 'umi';

export const uploadImage = (data: any): Promise<{ data: TYPES.RemoveBgData }> =>
  request('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    data,
    headers: {
      'X-Api-Key': 'YSPqohNFh9jBCMXhKHiaB6oJ',
    },
  });
