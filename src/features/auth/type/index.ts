export type SigninInputType = {
  [key: string]: string;
  email: string;
  password: string;
  captcha: string;
};

export type SignUpType = {
  [key: string]: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  captcha: string;
  type: string;
};

export type resetPasswordType = {
  [key: string]: string;
  password: string;
  token: string;
};

export type changePassword = {
  [key: string]: string;
  password: string;
};

export type forgotPasswordType = {
  [key: string]: string;
  email: string;
};

export type googleSignInType = {
  [key: string]: string;
  credential: string;
  captcha: string;
};
