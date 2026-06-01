const awsExports = {
  Auth: {
    Cognito: {
      // Replace these with your Terraform outputs after deploying
      userPoolId: 'REPLACE_WITH_USER_POOL_ID',
      userPoolClientId: 'REPLACE_WITH_USER_POOL_CLIENT_ID',
      loginWith: {
        email: true,
      },
    },
  },
};

// Replace with your API Gateway URL after deploying
export const API_URL = 'REPLACE_WITH_API_GATEWAY_URL';

export default awsExports;
