export type LoginReqBodyType = {
    email : string,
    password : string,
};

export type LogoutReqBodyType = {
    userId: number;
    email: string;
};

export type SignupReqBodyType = {
    name: string;
    email: string;
    password: string;
  };

