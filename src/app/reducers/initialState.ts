export interface IAppState {
  loading: boolean;
  redirects: any;
  users: any;
  usersall: any;
  errors: any;
  images: any;
  comments: any;
  counters: {
    images: number,
    users: number,
    comments: number
  };
}

export const INITIAL_STATE: IAppState = {
  loading: false,
  redirects: [],
  users: [],
  usersall: [],
  errors: [],
  images: [],
  comments: [],
  counters: {
    images: 0,
    users: 0,
    comments: 0
  },
};
